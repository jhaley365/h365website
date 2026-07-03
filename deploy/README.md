## Nginx reverse proxy

Puts Nginx on port 80 in front of the Next.js app (which keeps running on
`localhost:3000` via `npm run start` / pm2). This lets visitors hit the
site without `:3000` in the URL and sets up the port needed for a future
TLS cert (Let's Encrypt / certbot).

```bash
sudo apt update && sudo apt install -y nginx
sudo cp deploy/nginx/haley365.conf /etc/nginx/sites-available/haley365
sudo ln -sf /etc/nginx/sites-available/haley365 /etc/nginx/sites-enabled/haley365
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Once this is running, only port 80 (and later 443) needs to be open in
the EC2 security group — port 3000 can be closed to the internet since
Nginx talks to the app over `127.0.0.1`.

When a domain is pointed at the instance, update `server_name` in
`deploy/nginx/haley365.conf` from `_` to the real domain(s), redeploy the
file with the steps above, then run:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d haley365.com -d www.haley365.com
```
