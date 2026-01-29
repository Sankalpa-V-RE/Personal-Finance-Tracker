provider "aws" {
  region = "us-east-1"  # Make sure this matches your 'aws configure'
}

# --- 1. SECURITY GROUP (THE FIREWALL) ---
resource "aws_security_group" "piggybank_sg" {
  name        = "piggybank-security-group"
  description = "Security settings for Piggy Bank App"

  # Rule 1: Allow SSH (So Jenkins & You can log in)
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Rule 2: Allow HTTP/Frontend (For users to see the website)
  # Assuming your React Frontend will run on Port 80 (Standard Web Port)
  ingress {
    description = "Frontend-HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Rule 3: Allow Backend API Access
  # The Node.js Backend listens on Port 3001
  ingress {
    description = "Backend-API"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Rule 4: Allow Frontend Access
  # The React Frontend listens on Port 5173
  ingress {
    description = "Frontend-UI"
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Rule 5: Allow Jenkins Access
  # Jenkins defaults to Port 8080
  ingress {
    description = "Jenkins-UI"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # NOTE: We DO NOT open Port 27017 (MongoDB) to the public.
  # MongoDB will talk to the Backend internally via Docker Network. 
  # Opening it to "0.0.0.0/0" is a huge security risk!

  # Rule 4: Allow Outgoing Traffic (So server can download Docker/Updates)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- 2. SSH KEY PAIR ---
resource "aws_key_pair" "deployer" {
  key_name   = "piggybank-key"
  public_key = file("my-key.pub")
}

# --- 3. THE SERVER (EC2 INSTANCE) ---
resource "aws_instance" "app_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 (US-East-1)
  instance_type = "t3.small"              # Upgraded for Jenkins + App
  
  key_name      = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.piggybank_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              # 1. Update and install dependencies
              sudo apt-get update
              sudo apt-get install -y docker.io git curl

              # 2. Start and enable Docker
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu

              # 3. Fix Docker Socket Permissions (Critical for Jenkins)
              sudo chmod 666 /var/run/docker.sock

              # 4. Install Docker Compose
              sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              sudo chmod +x /usr/local/bin/docker-compose

              # 5. Run Jenkins Container
              # - Port 8080: Web UI
              # - Port 50000: Agent communication
              # - Volume /var/run/docker.sock: Allow Jenkins to use host Docker
              # - Env JAVA_OPTS: Limit memory to 512MB
              docker run -d \
                -p 8080:8080 -p 50000:50000 \
                --name jenkins \
                --restart always \
                -v jenkins_home:/var/jenkins_home \
                -v /var/run/docker.sock:/var/run/docker.sock \
                -e JAVA_OPTS="-Xmx512m" \
                jenkins/jenkins:lts
              EOF

  tags = {
    Name = "PiggyBank-Server"
    Project = "PiggyBank"
  }
}

# --- 4. ELASTIC IP (FIXED PUBLIC IP) ---
resource "aws_eip" "lb" {
  instance = aws_instance.app_server.id
  domain   = "vpc"
}

output "server_public_ip" {
  value = aws_eip.lb.public_ip
  description = "The public Elastic IP address of the Piggy Bank server"
}
