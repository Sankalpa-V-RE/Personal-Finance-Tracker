pipeline {
    agent any
    environment {
        TEST_MODE = 'false' // Set to 'true' to skip pushing images
        FRONTEND_IMAGE = "vihangasankalpa/piggybank-frontend:latest"
        BACKEND_IMAGE = "vihangasankalpa/piggybank-backend:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh '''
                        export DOCKER_REGISTRY_USER="vihangasankalpa"
                        export DOCKER_REPO_NAME="piggybank"
                        export IMAGE_TAG="latest"
                        
                        docker compose build
                    '''
                }
            }
        }

        stage('Push Docker Images') {
            when {
                expression { return env.TEST_MODE != 'true' }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    script {
                        sh '''
                            echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                            
                            export DOCKER_REGISTRY_USER="vihangasankalpa"
                            export DOCKER_REPO_NAME="piggybank"
                            export IMAGE_TAG="latest"

                            # Push images using the tags defined in docker-compose or explicit names
                            # Since docker-compose build tags them as per the var, we push them.
                            # The variables above ensure the names match what was built.
                            
                            docker push ${DOCKER_REGISTRY_USER}/${DOCKER_REPO_NAME}:frontend-${IMAGE_TAG}
                            docker push ${DOCKER_REGISTRY_USER}/${DOCKER_REPO_NAME}:backend-${IMAGE_TAG}
                            
                            docker logout
                        '''
                    }
                }
            }
        }

        stage('Deploy (Local)') {
            steps {
                script {
                    sh '''
                        echo "Deploying Locally on All-in-One Server..."
                        export DOCKER_REGISTRY_USER="vihangasankalpa"
                        export DOCKER_REPO_NAME="piggybank"
                        export IMAGE_TAG="latest"
                        
                        # We use up -d which will recreate containers if configuration/image changed
                        docker compose up -d
                    '''
                }
            }
        }
    }
}
