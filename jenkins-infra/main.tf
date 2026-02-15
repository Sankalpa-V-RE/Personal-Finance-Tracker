provider "aws" {
  region = "us-east-1"
}

# 1. Security Group
resource "aws_security_group" "jenkins_sg" {
  name        = "jenkins-manual-sg"
  description = "Allow SSH and Jenkins Port"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Jenkins UI"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. The EC2 Instance (No User Data)
resource "aws_instance" "jenkins_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 (us-east-1)
  instance_type = "t3.small"
  key_name      = "piggybank-key" # Ensure this key exists in your AWS Console
  
  # Attach the Security Group
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]

  tags = {
    Name = "Jenkins-Manual-Server"
  }
}

# 3. Elastic IP Association
resource "aws_eip" "jenkins_eip" {
  instance = aws_instance.jenkins_server.id
  domain   = "vpc"

  tags = {
    Name = "jenkins-elastic-ip"
  }
}

# 4. Output the Elastic IP
output "jenkins_public_ip" {
  value = aws_eip.jenkins_eip.public_ip
}