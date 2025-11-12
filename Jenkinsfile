pipeline {
    // 1. Agent Configuration
    agent any

    // 2. Environment Variables
    // THIS BLOCK HAS BEEN FIXED
    environment {
        
        // 1. This helper call will find your credential by its string ID.
        //    IMPORTANT: Replace 'your-dockerhub-credentials-id' with your actual ID.
        //    It will then create TWO new variables in the environment:
        //    - DOCKER_CREDS_USR (containing the username)
        //    - DOCKER_CREDS_PSW (containing the password)
        DOCKER_CREDS = credentials('docker-hub-credentials')

        // 2. Now, we create the DOCKER_REGISTRY_USER variable
        //    by copying the value from the username variable (DOCKER_CREDS_USR)
        //    that Jenkins just created for us.
        DOCKER_REGISTRY_USER = "${DOCKER_CREDS_USR}"
        
        // This is our variable for the shared repository name
        DOCKER_REPO_NAME = 'piggybank' // Change this to your project name, e.g., 'piggybank'
        
        // We create a unique tag for each build, e.g., "build-12"
        IMAGE_TAG = "build-${BUILD_NUMBER}"
    }

    // 3. Pipeline Stages
    stages {
        
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                // This command now uses the DOCKER_REGISTRY_USER we set above
                sh "DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER} DOCKER_REPO_NAME=${DOCKER_REPO_NAME} IMAGE_TAG=${IMAGE_TAG} docker-compose build"
            }
        }

        stage('Run Integration Test') {
            steps {
                sh "DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER} DOCKER_REPO_NAME=${DOCKER_REPO_NAME} IMAGE_TAG=${IMAGE_TAG} docker-compose up -d"
                
                sh 'echo "Waiting for services to boot up..."'
                sh 'sleep 20'
                
                sh 'echo "Testing backend service..."'
                // REMINDER: Make sure '/api/health' is a real endpoint!
                sh 'curl --fail http://localhost:3001/api/health || exit 1'
                
                sh 'echo "Testing frontend service..."'
                sh 'curl --fail http://localhost:5173/ || exit 1'
            }
        }

        /*stage('Push Images to Registry') {
            when {
                branch 'main'
            }
            steps {
                // We use the full DOCKER_CREDS variable here, which contains
                // both username and password for the login command.
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                }
                
                sh "DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER} DOCKER_REPO_NAME=${DOCKER_REPO_NAME} IMAGE_TAG=${IMAGE_TAG} docker-compose push"
            }
        }*/
    }

    // 4. Post-Build Actions
    post {
        always {
            sh 'echo "Tearing down containers..."'
            sh "DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER} DOCKER_REPO_NAME=${DOCKER_REPO_NAME} IMAGE_TAG=${IMAGE_TAG} docker-compose down"
        }
        
        success {
            sh 'echo "Cleaning up local build images..."'
            sh "docker rmi ${DOCKER_REGISTRY_USER}/${DOCKER_REPO_NAME}:backend-${IMAGE_TAG}"
            sh "docker rmi ${DOCKER_REGISTRY_USER}/${DOCKER_REPO_NAME}:frontend-${IMAGE_TAG}"
        }
        
        failure {
            sh 'echo "Pipeline failed. Dumping container logs..."'
            sh "DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER} DOCKER_REPO_NAME=${DOCKER_REPO_NAME} IMAGE_TAG=${IMAGE_TAG} docker-compose logs"
        }
    }
}