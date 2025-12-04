pipeline {
    agent any

    environment {
        // Disable BuildKit to prevent caching issues ONLY FOR THIS PIPELINE
        DOCKER_BUILDKIT = "0"

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
                        echo "Building frontend image WITHOUT CACHE..."
                        docker build --no-cache --pull \
                            -t ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG} \
                            -f Dockerfile.frontend .

                        echo "Building backend image..."
                        docker build --pull \
                            -t ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG} \
                            -f Dockerfile.backend .
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

                            kubectl apply -n ${K8S_NAMESPACE} -f backend.yaml
                            kubectl apply -n ${K8S_NAMESPACE} -f frontend.yaml

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
