#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🚀 CURA Deployment Script (Example)                ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
cd "$(dirname "$0")/.."

# Check arguments (allow overriding, but set defaults)
DOCKER_USERNAME=${1:-"your_docker_username"} # Default docker user if not provided
PUBLIC_IP=${2:-"your_server_ip"}
SSH_KEY=${3:-"/path/to/your/key.pem"}
REMOTE_USER="ubuntu"
REMOTE_DIR="/home/ubuntu/cura"

echo -e "${BLUE}📝 Deployment Info${NC}"
echo "  - Docker User: ${DOCKER_USERNAME}"
echo "  - Server IP:   ${PUBLIC_IP}"
echo "  - SSH Key:     ${SSH_KEY}"
echo ""

# Check if key exists
if [ ! -f "${SSH_KEY}" ]; then
    echo -e "${RED}❌ SSH Key not found at ${SSH_KEY}${NC}"
    exit 1
fi

# 1. Build and Push Images
echo -e "${BLUE}🔨 Building and Pushing Docker Images...${NC}"

# Frontend
echo "  - Building Frontend..."
docker build --platform linux/amd64 -t ${DOCKER_USERNAME}/cura-frontend:latest ./frontend
echo "  - Pushing Frontend..."
docker push ${DOCKER_USERNAME}/cura-frontend:latest

# Backend
echo "  - Building Backend..."
docker build --platform linux/amd64 -t ${DOCKER_USERNAME}/cura-backend:latest ./backend
echo "  - Pushing Backend..."
docker push ${DOCKER_USERNAME}/cura-backend:latest

echo -e "${GREEN}✅ Build and Push Complete!${NC}"

# 2. Prepare Server
echo -e "${BLUE}📂 Preparing Server...${NC}"

# Create directory on server
ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${REMOTE_USER}@${PUBLIC_IP} "mkdir -p ${REMOTE_DIR}/backend"

# Copy files
echo "  - Copying docker-compose.yml..."
scp -i ${SSH_KEY} docker-compose.yml ${REMOTE_USER}@${PUBLIC_IP}:${REMOTE_DIR}/

echo "  - Copying backend/.env.production..."
scp -i ${SSH_KEY} backend/.env.production ${REMOTE_USER}@${PUBLIC_IP}:${REMOTE_DIR}/backend/

echo "  - Copying frontend/.env.production (optional, built into image but good for reference)..."
# Note: Frontend env is baked into image at build time, but we copy it just in case
scp -i ${SSH_KEY} frontend/.env.production ${REMOTE_USER}@${PUBLIC_IP}:${REMOTE_DIR}/frontend.env.production

# 3. Deploy on Server
echo -e "${BLUE}🚀 Deploying on Server...${NC}"

ssh -i ${SSH_KEY} ${REMOTE_USER}@${PUBLIC_IP} << EOF
    cd ${REMOTE_DIR}
    
    # Export Docker Username for docker-compose
    export DOCKER_USERNAME=${DOCKER_USERNAME}
    
    # Pull latest images
    echo "  - Pulling images..."
    sudo docker-compose pull
    
    # Restart services
    echo "  - Restarting services..."
    sudo docker-compose up -d
    
    # Prune old images
    sudo docker image prune -f
EOF

echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "  Access your app at: http://${PUBLIC_IP}"
