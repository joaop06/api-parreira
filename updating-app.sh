echo "Updating repository..."

git pull

pm2 reload backend
