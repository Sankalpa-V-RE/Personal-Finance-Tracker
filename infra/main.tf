provider "aws" {
  region = "us-east-1"
}

# --- 1. SECURITY GROUP ---
resource "aws_security_group" "piggybank_sg" {
  name        = "piggybank-app-sg"
  description = "Allow Web Traffic for PiggyBank App"

  # SSH Access (For Jenkins to deploy)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  # Frontend (Standard Web)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend (Dev/Vite Port - Optional if you use Port 80 in Prod)
  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend API
  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound Traffic (To download Docker images)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- 2. SSH KEY PAIR ---
# Ensure 'my-key.pub' is in your git repo or Jenkins workspace!
resource "aws_key_pair" "deployer" {
  key_name   = "piggybank-app-key" 
  public_key = file("my-key.pub") 
}

# --- 3. THE APP SERVER ---
resource "aws_instance" "app_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04
  instance_type = "t3.small"
  
  key_name        = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.piggybank_sg.name]

  # User Data: INSTALL ONLY DOCKER & COMPOSE
  user_data = <<-EOF
    #!/bin/bash
    set -ex
    
    # 1. Install Docker
    sudo apt-get update
    sudo apt-get install -y docker.io curl
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ubuntu
    sudo chmod 666 /var/run/docker.sock

    # 2. Install Docker Compose (V2)
    mkdir -p /usr/local/lib/docker/cli-plugins/
    curl -SL https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
  EOF

  tags = {
    Name = "PiggyBank-App-Server"
  }
}

# --- 4. ELASTIC IP ---
resource "aws_eip" "lb" {
  instance = aws_instance.app_server.id
  domain   = "vpc"
}

# --- 5. OUTPUT ---
# We need this to tell Jenkins where to deploy!
output "server_public_ip" {
  value = aws_eip.lb.public_ip
}