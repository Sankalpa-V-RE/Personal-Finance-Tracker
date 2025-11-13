pipeline {
    agent any
    environment {
        TEST_MODE = 'true' // 👈 toggle this off later
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

        stage('Push Images') {
            when {
                expression { return TEST_MODE != 'true' } // 👈 skip when test mode is on
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub', 
                    usernameVariable: 'DOCKERHUB_USER', 
                    passwordVariable: 'DOCKERHUB_PASS'
                )]) {
                    script {
                        sh '''
                            echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                            docker push vihangasankalpa/piggybank:frontend-latest
                            docker push vihangasankalpa/piggybank:backend-latest
                            docker logout
                        '''
                    }
                }
            }
        }
    }
}
