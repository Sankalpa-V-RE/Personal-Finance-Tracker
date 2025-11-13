pipeline {
    agent any
    environment {
        TEST_MODE = 'true'     // 👈 toggle this off later
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        DOCKERHUB_USER = "${DOCKERHUB_CREDENTIALS_USR}"
        DOCKERHUB_PASS = "${DOCKERHUB_CREDENTIALS_PSW}"
        FRONTEND_IMAGE = "vihangasankalpa/piggybank-frontend:latest"
        BACKEND_IMAGE = "vihangasankalpa/piggybank-backend:latest"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh """
                        export DOCKER_REGISTRY_USER='vihangasankalpa'
                        export DOCKER_REPO_NAME='piggybank'
                        export IMAGE_TAG='latest'
                        docker compose build
                    """
                }
            }
        }

        stage('Push Images') {
            when {
                expression { return TEST_MODE != 'true' } // 👈 skip when test mode is on
            }
            steps {
                script {
                    sh "echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin"
                    sh """
                        docker push vihangasankalpa/piggybank:frontend-latest
                        docker push vihangasankalpa/piggybank:backend-latest
                    """
                    sh "docker logout"
                }
            }
        }
    }
}
