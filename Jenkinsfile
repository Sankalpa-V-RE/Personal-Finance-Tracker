pipeline {
    agent any
    environment {
        TEST_MODE = 'false' // enable test mode (skip pushing images)
        FRONTEND_IMAGE = "vihangasankalpa/piggybank-frontend:latest"
        BACKEND_IMAGE = "vihangasankalpa/piggybank-backend:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy (Local)') {
            steps {
                script {
                    sh '''
                        echo "Deploying Locally on All-in-One Server..."
                        # Since Jenkins is on the same server, we just use docker compose
                        # We use --build to ensure we run the latest code
                        # DOCKER_REGISTRY_USER and DOCKER_REPO_NAME are environment variables or defaults
                        export DOCKER_REGISTRY_USER="vihangasankalpa"
                        export DOCKER_REPO_NAME="piggybank"
                        export IMAGE_TAG="latest"
                        
                        docker compose up -d --build
                    '''
                }
            }
        }
    }
}
