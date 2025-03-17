# React NewsApp CI/CD Pipeline

## Overview
This project automates the deployment of a React NewsApp using:
- **Jenkins** for CI/CD
- **GitHub** for version control
- **Docker Hub** for container storage
- **Azure Kubernetes Service (AKS)** for deployment

## Workflow
1. Code is pushed to **GitHub** → Jenkins starts the build.
2. Jenkins pulls the code, installs dependencies, and runs tests.
3. If tests pass, Jenkins builds and pushes a Docker image to **Docker Hub**.
4. Jenkins deploys the app to **AKS**.
5. The app is accessible via **LoadBalancer**.

## Setup
### 1. Configure Jenkins
- Install Jenkins and required plugins.
- Add **GitHub PAT** and **Docker Hub Credentials** to Jenkins.
- Enable **master node** for builds.

### 2. Create `Jenkinsfile`
```groovy
pipeline {
    agent { label 'master' }
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
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }
        stage('Build & Push Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE} .'
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                    sh 'docker push ${DOCKER_IMAGE}'
                }
            }
        }
        stage('Deploy to AKS') {
            steps {
                sh 'kubectl apply -f k8s/deployment.yaml --kubeconfig=${KUBE_CONFIG_PATH}'
            }
        }
    }
}
```

### 3. Create `k8s/deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: newsapp-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: newsapp
  template:
    metadata:
      labels:
        app: newsapp
    spec:
      containers:
      - name: newsapp
        image: your-dockerhub-username/newsapp:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: newsapp-service
spec:
  selector:
    app: newsapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

### 4. Deploy to Kubernetes
Run:
```sh
kubectl apply -f k8s/deployment.yaml
kubectl get svc newsapp-service
```

### 5. Verify CI/CD Pipeline
- Push changes to GitHub.
- Jenkins should automatically build, test, push, and deploy the app.
- Check deployment using:
  ```sh
  kubectl get pods
  kubectl get svc
  ```

## Summary
Fully automated CI/CD pipeline with Jenkins, GitHub, Docker, and AKS.
Auto-build, test, and deployment on every Git push.
Scalable React app running in AKS.
Project is now fully automated!**
