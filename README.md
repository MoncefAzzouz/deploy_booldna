# Blood Donation Production Deploy

This repository is prepared for deploying:

- `Blood-donation-admin-prod`: React/Vite admin web app
- `Blood-donation-server-prod`: Node.js/Express/Prisma backend

The Flutter mobile app folder is intentionally ignored for this VPS deploy flow.

## Git Branches

- `main`: shared source
- `admin-prod`: production branch for admin web
- `server-prod`: production branch for backend

## First Push To GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/MoncefAzzouz/deploy_booldna.git
git push -u origin main
git push -u origin admin-prod
git push -u origin server-prod
```

If the remote already exists:

```bash
git remote set-url origin https://github.com/MoncefAzzouz/deploy_booldna.git
```

## VPS Packages

Install these on Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y git curl nginx mysql-server ufw build-essential
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Pull Backend On VPS

```bash
cd /var/www
sudo git clone -b server-prod https://github.com/MoncefAzzouz/deploy_booldna.git blood-donation-server
sudo chown -R $USER:$USER /var/www/blood-donation-server
cd /var/www/blood-donation-server/Blood-donation-server-prod
npm ci
cp .env.example .env
nano .env
npm run build
npx prisma db push
pm2 start dist/app.js --name blood-donation-api --node-args="--experimental-specifier-resolution=node"
pm2 save
pm2 startup
```

To update backend after pushing new code:

```bash
cd /var/www/blood-donation-server
git pull origin server-prod
cd Blood-donation-server-prod
npm ci
npm run build
npx prisma db push
pm2 restart blood-donation-api
```

## Pull Admin Web On VPS

```bash
cd /var/www
sudo git clone -b admin-prod https://github.com/MoncefAzzouz/deploy_booldna.git blood-donation-admin
sudo chown -R $USER:$USER /var/www/blood-donation-admin
cd /var/www/blood-donation-admin/Blood-donation-admin-prod
npm ci
printf "VITE_API_URL=http://bloodna.com/api/v1\n" > .env.production
npm run build
sudo mkdir -p /var/www/blood-donation-admin-dist
sudo rsync -a --delete dist/ /var/www/blood-donation-admin-dist/
```

To update admin after pushing new code:

```bash
cd /var/www/blood-donation-admin
git pull origin admin-prod
cd Blood-donation-admin-prod
npm ci
npm run build
sudo rsync -a --delete dist/ /var/www/blood-donation-admin-dist/
sudo systemctl reload nginx
```

## Example Nginx Config

Replace `admin.your-domain.com` and `api.your-domain.com`.

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name admin.your-domain.com;
    root /var/www/blood-donation-admin-dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable it:

```bash
sudo nano /etc/nginx/sites-available/blood-donation
sudo ln -s /etc/nginx/sites-available/blood-donation /etc/nginx/sites-enabled/blood-donation
sudo nginx -t
sudo systemctl reload nginx
```

## HTTPS

After DNS points to the VPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com -d admin.your-domain.com
```

## Security Notes

Do not commit VPS passwords, `.env` files, JWT secrets, email passwords, or API keys.
Use SSH keys for the VPS when possible, and rotate any password that was pasted into chat or terminal history.
