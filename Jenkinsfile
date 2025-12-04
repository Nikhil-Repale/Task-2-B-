pipeline {
    agent any

    environment {
        GIT_CRED          = 'demo_cred'
        DOCKER_CRED       = 'docker_cred_1'
        KUBECONFIG_CRED   = 'kubeconfig-cred'

        REPO_URL          = 'https://github.com/Nikhil-Repale/smart-hr-portal.git'
        BRANCH            = 'main'

        DOCKER_USER       = 'nikhil2202'

        FRONTEND_IMAGE    = 'hr-frontend'
        BACKEND_IMAGE     = 'hr-backend'
        IMAGE_TAG         = "${BUILD_NUMBER}"

        K8S_NAMESPACE     = 'smart-hr'
    }

    stages {

        stage('Cleanup') {
            steps {
                sh '''
                    echo "Cleaning workspace..."
                    rm -rf hr_repo

                    echo "Removing old Docker images..."
                    docker images | grep hr-frontend | awk '{print $3}' | xargs -r docker rmi -f || true
                    docker images | grep hr-backend | awk '{print $3}' | xargs -r docker rmi -f || true
                '''
            }
        }

        stage('Clone Repository') {
            steps {
                dir('hr_repo') {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "*/${BRANCH}"]],
                        userRemoteConfigs: [[
                            url: "${REPO_URL}",
                            credentialsId: GIT_CRED
                        ]]
                    ])
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKER_CRED,
                    usernameVariable: 'DUSER',
                    passwordVariable: 'DPASS'
                )]) {
                    sh '''
                        echo "Docker Login..."
                        echo "$DPASS" | docker login -u "$DUSER" --password-stdin
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                dir('hr_repo') {
                    sh '''
                        echo "Building frontend image..."
                        docker build -t ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG} -f frontend/Dockerfile.frontend .

                        echo "Building backend image..."
                        docker build -t ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG} -f backend/Dockerfile.backend .
                    '''
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    echo "Pushing images to Docker Hub..."
                    docker push ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([string(
                    credentialsId: KUBECONFIG_CRED,
                    variable: 'KUBECONFIG_BASE64'
                )]) {

                    dir('hr_repo/deployment') {
                        sh '''
                            echo "Deploying to Kubernetes..."

                            echo "$KUBECONFIG_BASE64" | base64 -d > kubeconfig.yaml
                            export KUBECONFIG=kubeconfig.yaml

                            # Apply manifests
                            kubectl apply -n ${K8S_NAMESPACE} -f backend.yaml
                            kubectl apply -n ${K8S_NAMESPACE} -f frontend.yaml

                            # Update images in running deployments
                            kubectl -n ${K8S_NAMESPACE} set image deployment/hr-backend \
                                hr-backend=${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG} --record

                            kubectl -n ${K8S_NAMESPACE} set image deployment/hr-frontend \
                                hr-frontend=${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG} --record
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful."
        }
        failure {
            echo "Pipeline failed. Check logs."
        }
        always {
            sh "rm -f ~/.netrc || true"
        }
    }
}
