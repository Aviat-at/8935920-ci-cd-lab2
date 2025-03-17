pipeline {
    agent { label 'master' }  // Force pipeline to run on the master node

    environment {
        DOCKER_IMAGE = "your-dockerhub-username/newsapp:latest"
        KUBE_CONFIG_PATH = "/root/.kube/config"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/newsapp.git', credentialsId: 'github-pat'
            }
        }

        stage('Install Node.js & Dependencies') {
            steps {
                sh '''
                curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                apt-get install -y nodejs
                node -v
                npm -v
                npm install
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh "npm test -- --watchAll=false"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy to AKS') {
            steps {
                sh "kubectl apply -f k8s/deployment.yaml --kubeconfig=${KUBE_CONFIG_PATH}"
            }
        }
    }

    post {
        failure {
            echo "Build failed! Check logs for errors."
        }
        success {
            echo "Build and Deployment Successful!"
        }
    }
}
