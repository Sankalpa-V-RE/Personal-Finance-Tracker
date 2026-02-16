pipeline {
    agent any
    
    environment {
        TEST_MODE = 'false'
        DOCKER_REGISTRY_USER = "vihangasankalpa"
        DOCKER_REPO_NAME = "piggybank"
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Provision Infrastructure') {
            steps {
                script {
                    
                    dir('infra') {
                        echo "Initializing Terraform in infra/ directory..."
                        sh 'terraform init'
                        sh 'terraform apply -auto-approve'
                        env.SERVER_IP = sh(script: "terraform output -raw server_public_ip", returnStdout: true).trim()
                    }
                    
                    echo "Infrastructure Ready. Deploying to: ${env.SERVER_IP}"
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                   sh 'docker compose build'
                }
            }
        }

        stage('Push Docker Images') {
            when { expression { return env.TEST_MODE != 'true' } }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
                    script {
                        sh '''
                            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                            
                            # Push Frontend & Backend
                            docker push ${DOCKER_REGISTRY_USER}/${DOCKER_REPO_NAME}:frontend-${IMAGE_TAG}
                            docker push ${DOCKER_REGISTRY_USER}/${DOCKER_REPO_NAME}:backend-${IMAGE_TAG}
                            
                            docker logout
                        '''
                    }
                }
            }
        }

        stage('Deploy to App Server') {
            steps {
                sshagent (credentials: ['piggybank-ssh-key']) {
                    script {
                        sh """
                            # 1. Add server to known hosts
                            mkdir -p ~/.ssh
                            ssh-keyscan -H ${env.SERVER_IP} >> ~/.ssh/known_hosts

                            # 2. Upload the PRODUCTION compose file (rename it to docker-compose.yml on destination)
                            scp docker-compose.prod.yml ubuntu@${env.SERVER_IP}:/home/ubuntu/docker-compose.yml

                            # 3. Deploy
                            ssh ubuntu@${env.SERVER_IP} '
                                # Export variables for Docker Compose
                                export DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER}
                                export DOCKER_REPO_NAME=${DOCKER_REPO_NAME}
                                export IMAGE_TAG=${IMAGE_TAG}
                                
                                # CRITICAL: Inject the dynamic Server IP for the frontend
                                export VITE_BACKEND_URL="http://${env.SERVER_IP}:3001"
                                
                                # Pull latest images and restart
                                docker compose pull
                                docker compose up -d
                            '
                        """
                    }
                }
            }
        }
    }
}