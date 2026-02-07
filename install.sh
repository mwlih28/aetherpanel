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
sudo rm -rf /var/www/aetherpanel
sudo mkdir -p /var/www
sleep 1
sudo git clone https://github.com/mwlih28/aetherpanel.git /var/www/aetherpanel
cd /var/www/aetherpanel

# 6. Environment Configuration
echo "📝 Configuring environment..."
read -p "Enter your Domain (e.g., panel.example.com): " DOMAIN </dev/tty
read -p "Enter Admin Password: " PASSWORD </dev/tty

# Generate .env files
echo "⚙️ Generating environment files..."
cat <<EOF > /var/www/aetherpanel/api/.env
DATABASE_URL="file:./dev.db"
JWT_SECRET="aether-$(date +%s | sha256sum | head -c 16)"
EOF

cat <<EOF > /var/www/aetherpanel/panel/.env.local
NEXT_PUBLIC_API_URL=https://$DOMAIN/api
EOF

# 7. Nginx & Reverse Proxy
echo "🌐 Configuring Nginx..."
sudo rm -f /etc/nginx/sites-enabled/default
# Remove any other site that might be using this domain
for file in /etc/nginx/sites-enabled/*; do
    if grep -q "$DOMAIN" "$file"; then
        echo "🗑️ Removing conflicting Nginx config: $file"
        sudo rm -f "$file"
    fi
done
sudo rm -f /etc/nginx/sites-enabled/aetherpanel /etc/nginx/sites-available/aetherpanel
cat <<EOF | sudo tee /etc/nginx/sites-available/aetherpanel
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3300;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api {
        proxy_pass http://localhost:3301;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/aetherpanel /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# 8. SSL with Certbot
echo "🔒 Enabling SSL..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN || echo "⚠️ SSL failed, check domain propagation."

# 9. Initialize Database & Start Services
echo "🚀 Starting Services..."
sudo npm install -p pm2 -g

# API Setup
cd /var/www/aetherpanel/api
npm install
npx prisma db push --accept-data-loss
ADMIN_PASSWORD=$PASSWORD npx prisma db seed
npm run build
pm2 delete aether-api || true
PORT=3301 pm2 start dist/index.js --name aether-api

# Daemon Setup
cd /var/www/aetherpanel/daemon
npm install
npm run build
pm2 delete aether-daemon || true
PORT=3302 pm2 start dist/index.js --name aether-daemon

# Panel Setup
cd /var/www/aetherpanel/panel
npm install
npm run build
pm2 delete aether-panel || true
# Next.js production start on custom port
PORT=3300 pm2 start npm --name aether-panel -- start -- -p 3300

# 10. Finalizing
echo "✅ Installation complete! Aetherpanel is now accessible at https://$DOMAIN"
pm2 list
pm2 save && pm2 startup
