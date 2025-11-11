pipeline {
    // 1. Agent Configuration
    // This pipeline will run on any available Jenkins agent
    // The agent MUST have Docker and Docker Compose installed.
    agent any

    // 2. Environment Variables
    // We define variables that our pipeline will use.
    environment {
        // This 'credentials' ID must match the ID you create in Jenkins
        // for your Docker Hub username and password.
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        
        // This will be the 'my-docker-user' part of the image tag
        // Jenkins will provide DOCKER_REGISTRY_USER_USR from the credentials
        DOCKER_REGISTRY_USER = credentials(DOCKER_CREDENTIALS_ID_USR)

        // This is our new variable for the shared repository name
        DOCKER_REPO_NAME = 'piggybank' // Change this to your project name, e.g., 'piggybank'
        
        // We create a unique tag for each build, e.g., "build-12"
        IMAGE_TAG = "build-${BUILD_NUMBER}"
    }

    // 3. Pipeline Stages
    // These are the steps of your CI process.
    stages {
        
        stage('Checkout Code') {
            steps {
                // Get the code from your Git repository
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                // This command tells Docker Compose to build the images
                // and use the env vars we defined for the image names.
                sh "DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER} DOCKER_REPO_NAME=${DOCKER_REPO_NAME} IMAGE_TAG=${IMAGE_TAG} docker-compose build"
            }
        }

        stage('Run Integration Test') {
            steps {
                // Start all services in the background.
                // The 'post' block will handle shutting them down.
                sh "DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER} DOCKER_REPO_NAME=${DOCKER_REPO_NAME} IMAGE_TAG=${IMAGE_TAG} docker-compose up -d"
                
                sh 'echo "Waiting for services to boot up..."'
                // Give the services 20 seconds to start.
                // You can make this more robust later with a proper health check.
                sh 'sleep 20'
                
                // --- Simple Integration Tests ---
                // TODO: Replace these with better tests!
                
                sh 'echo "Testing backend service..."'
                // Check if the backend port is responding
                sh 'curl --fail http://localhost:3001/api/health || exit 1'
                
                sh 'echo "Testing frontend service..."'
                // Check if the frontend port is responding
                sh 'curl --fail http://localhost:5173/ || exit 1'
            }
        }

        /*stage('Push Images to Registry') {
            // This stage prepares your images for deployment.
            // It only runs if the build is on the 'main' branch.
            when {
                branch 'main'
            }
            steps {
                // Use the Docker credentials to log in
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                }
                
                // Tell Docker Compose to push the 'backend' and 'frontend' images
                sh "DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER} DOCKER_REPO_NAME=${DOCKER_REPO_NAME} IMAGE_TAG=${IMAGE_TAG} docker-compose push"
            }
        }*/
    }

    // 4. Post-Build Actions
    // This section runs after all stages are complete.
    post {
        // 'always' runs regardless of whether the pipeline succeeded or failed
        always {
            // This is CRITICAL. It tears down the containers from the
            // 'Run Integration Test' stage so they don't run forever.
            sh 'echo "Tearing down containers..."'
            sh "DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER} DOCKER_REPO_NAME=${DOCKER_REPO_NAME} IMAGE_TAG=${IMAGE_TAG} docker-compose down"
        }
        
        // 'success' only runs if the pipeline passed
        success {
            // Optional: Clean up the images we just pushed to save disk space
            sh 'echo "Cleaning up local build images..."'
            sh "docker rmi ${DOCKER_REGISTRY_USER}/${DOCKER_REPO_NAME}:backend-${IMAGE_TAG}"
            sh "docker rmi ${DOCKER_REGISTRY_USER}/${DOCKER_REPO_NAME}:frontend-${IMAGE_TAG}"
        }
        
        // 'failure' only runs if the pipeline failed
        failure {
            // If anything went wrong, dump the logs from all containers
            // to help with debugging.
            sh 'echo "Pipeline failed. Dumping container logs..."'
            sh "DOCKER_REGISTRY_USER=${DOCKER_REGISTRY_USER} DOCKER_REPO_NAME=${DOCKER_REPO_NAME} IMAGE_TAG=${IMAGE_TAG} docker-compose logs"
        }
    }
}