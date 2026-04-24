#!/bin/bash

# ===========================================
# CURA Deployment Script (Template) - Active Stack
# app/ (Frontend) + backend-spring/ (Backend)
#
# Usage:
#   cp scripts/deploy_new.example.sh scripts/deploy_new.sh
#   # Edit defaults below OR pass as args:
#   ./scripts/deploy_new.sh <docker_username> <public_ip> <ssh_key_path>
# ===========================================

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 CURA Deployment Script (New Stack)                 ║${NC}"
echo -e "${BLUE}║     Frontend: app/ | Backend: backend-spring/             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"

# Navigate to project root
cd "$(dirname "$0")/.."

# ===== Configuration =====
# REPLACE defaults below, or pass as positional args.
DOCKER_USERNAME=${1:-"your_docker_username"}
PUBLIC_IP=${2:-"your_server_ip"}
SSH_KEY=${3:-"$HOME/.ssh/your_key.pem"}
REMOTE_USER="ubuntu"
REMOTE_DIR="/home/ubuntu/cura"

# Production API URL (update this for your domain)
VITE_API_BASE_URL=${VITE_API_BASE_URL:-"http://${PUBLIC_IP}:8001/api"}

echo -e "${BLUE}📝 Deployment Configuration${NC}"
echo "  - Docker User: ${DOCKER_USERNAME}"
echo "  - Server IP:   ${PUBLIC_IP}"
echo "  - SSH Key:     ${SSH_KEY}"
echo "  - API URL:     ${VITE_API_BASE_URL}"
echo ""

# ===== Validation =====
if [ ! -f "${SSH_KEY}" ]; then
    echo -e "${RED}❌ SSH Key not found at ${SSH_KEY}${NC}"
    exit 1
fi

# ===== Step 1: Build Docker Images =====
echo -e "${BLUE}🔨 Step 1: Building Docker Images...${NC}"

# Remove existing local images
echo "  - Removing existing local images..."
docker image rm ${DOCKER_USERNAME}/cura-app:latest ${DOCKER_USERNAME}/cura-backend-spring:latest 2>/dev/null || true

# Build Frontend (app/)
echo -e "${YELLOW}  - Building Frontend (app/)...${NC}"
docker build \
    --platform linux/amd64 \
    --no-cache \
    --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
    -t ${DOCKER_USERNAME}/cura-app:latest \
    ./app

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

# Build Backend (backend-spring/)
echo -e "${YELLOW}  - Building Backend (backend-spring/)...${NC}"
docker build \
    --platform linux/amd64 \
    --no-cache \
    -t ${DOCKER_USERNAME}/cura-backend-spring:latest \
    ./backend-spring

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build Complete!${NC}"

# ===== Step 2: Push to Docker Hub =====
echo -e "${BLUE}📤 Step 2: Pushing to Docker Hub...${NC}"

echo "  - Pushing Frontend..."
docker push ${DOCKER_USERNAME}/cura-app:latest

echo "  - Pushing Backend..."
docker push ${DOCKER_USERNAME}/cura-backend-spring:latest

echo -e "${GREEN}✅ Push Complete!${NC}"

# ===== Step 3: Prepare Server =====
echo -e "${BLUE}📂 Step 3: Preparing Server...${NC}"

# Create directories on server
echo "  - Creating directories..."
ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${REMOTE_USER}@${PUBLIC_IP} \
    "mkdir -p ${REMOTE_DIR}/backend-spring"

# Copy docker-compose.new.yml as docker-compose.yml on server
echo "  - Copying docker-compose.yml..."
scp -i ${SSH_KEY} docker-compose.new.yml ${REMOTE_USER}@${PUBLIC_IP}:${REMOTE_DIR}/docker-compose.yml

# Copy backend-spring/.env
echo "  - Copying backend-spring/.env..."
scp -i ${SSH_KEY} backend-spring/.env ${REMOTE_USER}@${PUBLIC_IP}:${REMOTE_DIR}/backend-spring/.env

echo -e "${GREEN}✅ Server Prepared!${NC}"

# ===== Step 4: Deploy on Server =====
echo -e "${BLUE}🚀 Step 4: Deploying on Server...${NC}"

ssh -i ${SSH_KEY} ${REMOTE_USER}@${PUBLIC_IP} <<EOF
    cd ${REMOTE_DIR}

    # Create .env for docker-compose variable substitution
    echo "DOCKER_USERNAME=${DOCKER_USERNAME}" > .env
    echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" >> .env

    # Stop and remove existing containers
    echo "  - Stopping existing containers..."
    sudo docker-compose down --remove-orphans

    # Remove old images
    echo "  - Removing old images..."
    sudo docker image rm ${DOCKER_USERNAME}/cura-app:latest ${DOCKER_USERNAME}/cura-backend-spring:latest 2>/dev/null || true

    # Pull latest images
    echo "  - Pulling latest images..."
    sudo docker-compose pull

    # Start services
    echo "  - Starting services..."
    sudo docker-compose up -d

    # Wait for services to start
    sleep 5

    # Check container status
    echo ""
    echo "  📊 Container Status:"
    sudo docker-compose ps

    # Prune unused images
    echo ""
    echo "  - Cleaning up unused images..."
    sudo docker image prune -f
EOF

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     🎉 Deployment Complete!                               ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  🌐 Frontend: http://${PUBLIC_IP}:3000"
echo "  🔌 Backend:  http://${PUBLIC_IP}:8001"
echo "  📚 Swagger:  http://${PUBLIC_IP}:8001/swagger-ui.html"
echo ""
echo "  📋 Useful Commands:"
echo "    - View logs:     ssh -i ${SSH_KEY} ${REMOTE_USER}@${PUBLIC_IP} 'cd ${REMOTE_DIR} && sudo docker-compose logs -f'"
echo "    - Backend logs:  ssh -i ${SSH_KEY} ${REMOTE_USER}@${PUBLIC_IP} 'sudo docker logs -f cura-backend'"
echo "    - Frontend logs: ssh -i ${SSH_KEY} ${REMOTE_USER}@${PUBLIC_IP} 'sudo docker logs -f cura-app'"
echo ""
