pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Nikhil-Repale/smart-hr-portal.git',
                        credentialsId: 'demo_cred'
                    ]]
                ])
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker_cred_1',
                    usernameVariable: 'DUSER',
                    passwordVariable: 'DPASS'
                )]) {
                    sh '''
                        echo "Logging into Docker Hub..."
                        echo "$DPASS" | docker login -u "$DUSER" --password-stdin
                    '''
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    echo "Building Backend Image..."
                    docker build -t nikhil2202/hr-backend:${BUILD_NUMBER} -f Dockerfile.backend .
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                    echo "Pushing Backend Image..."
                    docker push nikhil2202/hr-backend:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                    echo "Deploying Backend to Kubernetes..."
                    kubectl apply -f deployment/backend.yaml

                    kubectl -n smart-hr set image deployment/hr-backend \
                    hr-backend=nikhil2202/hr-backend:${BUILD_NUMBER}
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    echo "Building Frontend Image..."
                    docker build -t nikhil2202/hr-frontend:${BUILD_NUMBER} -f Dockerfile.frontend .
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                    echo "Pushing Frontend Image..."
                    docker push nikhil2202/hr-frontend:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                    echo "Deploying Frontend to Kubernetes..."
                    kubectl apply -f deployment/frontend.yaml

                    kubectl -n smart-hr set image deployment/hr-frontend \
                    hr-frontend=nikhil2202/hr-frontend:${BUILD_NUMBER}
                '''
            }
        }
    }

    post {
        always {
            sh "rm -f ~/.netrc || true"
            echo "Pipeline cleanup completed."
        }
        success {
            echo "Build & Deployment Successful."
        }
        failure {
            echo "Pipeline Failed. Check logs."
        }
    }
}
