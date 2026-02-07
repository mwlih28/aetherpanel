#!/bin/bash

# Aetherpanel Automated Installer
# Supported OS: Ubuntu 22.04

set -e

echo "🚀 Starting Aetherpanel Installation..."

# 1. Update and install dependencies
export DEBIAN_FRONTEND=noninteractive
sudo -E apt update && sudo -E apt upgrade -y
sudo -E apt install -y curl wget git gnupg2 software-properties-common lsb-release ca-certificates

# 2. Install Docker
echo "🐳 Installing Docker..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Install Node.js (v20)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Install Nginx & Certbot
echo "🌐 Installing Nginx & Certbot..."
sudo apt install -y nginx certbot python3-certbot-nginx

# 5. Setup Project
echo "📂 Setting up Aetherpanel..."
mkdir -p /var/www/aetherpanel
cd /var/www/aetherpanel
git clone https://github.com/mwlih28/aetherpanel.git .

# 6. Environment Configuration
echo "📝 Configuring environment..."
read -p "Enter your Domain (e.g., panel.example.com): " DOMAIN </dev/tty
read -p "Enter Admin Password: " PASSWORD </dev/tty

# 7. Nginx & Reverse Proxy
echo "🌐 Configuring Nginx..."
cat <<EOF | sudo tee /etc/nginx/sites-available/aetherpanel
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF
sudo ln -s /etc/nginx/sites-available/aetherpanel /etc/nginx/sites-enabled/ || true
sudo nginx -t && sudo systemctl restart nginx

# 8. SSL with Certbot
echo "🔒 Enabling SSL..."
# sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

# 9. Finalizing
echo "✅ Installation complete! Aetherpanel is now accessible at http://$DOMAIN"
