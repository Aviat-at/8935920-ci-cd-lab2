pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "your-dockerhub-username/newsapp:latest"
        KUBE_CONFIG_PATH = "/root/.kube/config"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Aviat-at/8935920-ci-cd-lab2', credentialsId: 'github-pat'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh "npm install"
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
