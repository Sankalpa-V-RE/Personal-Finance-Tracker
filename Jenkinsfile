pipeline {
    agent any

    environment {
        IMAGE_NAME = "vihangasankalpa/piggybank"
        DOCKER_CREDENTIALS_ID = "docker-hub-credentials"
    }
    stages {

        stage('1. Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('2. Build Docker Image') {
            steps {
                script {
                    // Build the image and tag it with the build number
                    // The 'latest' tag is also added for docker-compose
                    sh "docker build -t ${env.DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                    sh "docker tag ${env.DOCKER_IMAGE}:${env.BUILD_NUMBER} ${env.DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('3. Push Docker Image (CI)') {
            steps {
                // Log in to Docker Hub using the stored credentials
                // This block automatically handles login and logout
                docker.withRegistry('https://registry.hub.docker.com', DOCKER_CREDENTIALS_ID) {

                    // Push the build-number-tagged image (e.g., "my-cool-app:27")
                    echo "Pushing ${IMAGE_NAME}:${env.BUILD_NUMBER}"
                    docker.image("${IMAGE_NAME}:${env.BUILD_NUMBER}").push()

                    // (Optional) Also tag this build as 'latest' and push it
                    echo "Tagging as 'latest'"
                    docker.image("${IMAGE_NAME}:${env.BUILD_NUMBER}").push('latest')
                }
            }
        }

        stage('4. Deploy (CD)') {
            steps {
                // This is the Continuous Deployment part
                // It's highly specific to your environment (e.g., a single server, Kubernetes)
                echo "Deploying the new image..."

                //
                // ** THIS IS JUST AN EXAMPLE **
                //
                // To deploy to a simple server, you'd use SSH:
                // 1. Store your server's SSH key in Jenkins Credentials
                // 2. Use the 'sshagent' plugin to connect
                //
                // sshagent(['your-server-ssh-creds-id']) {
                //   sh 'ssh user@your-server.com "docker pull ${IMAGE_NAME}:latest && docker stop my-app-container || true && docker run -d --rm --name my-app-container -p 80:8080 ${IMAGE_NAME}:latest"'
                // }
                //
                // The command above tells the server to:
                // 1. Pull the 'latest' image
                // 2. Stop the old container (if it exists)
                // 3. Run a new, detached container with the new image
                //
            }
        }
    }

    // (Optional) Actions to run after the pipeline finishes
    post {
        always {
            // Cleans up the workspace after the build
            cleanWs()
        }
        success {
            // (Optional) Send a Slack notification, email, etc.
            echo 'Pipeline succeeded!'
        }
        failure {
            // (Optional) Notify on failure
            echo 'Pipeline failed!'
        }
    }
}