# Deploy Admin Panel to Vercel

Since Hostinger shared hosting doesn't support Node.js, deploy the Admin Panel to Vercel instead.

## Step 1: Deploy to Vercel

Open your terminal and run:

```bash
cd /Users/mohamedamrin/Desktop/SBHOutdoormedia/admin-panel
vercel --prod
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `admin-eastmymedia` (or any name you prefer)
- **Directory?** → `./` (current directory)
- **Override settings?** → No

## Step 2: Add Environment Variables

After deployment, go to:
1. https://vercel.com/dashboard
2. Select your `admin-eastmymedia` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_SITE_MODE=admin
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAXvY2ea0fg8AYD-MU7HCQGBMl8sg2QpFo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eastmymedia-de3b5.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=eastmymedia-de3b5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=eastmymedia-de3b5.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=332812685286
NEXT_PUBLIC_FIREBASE_APP_ID=1:332812685286:web:07342a3d18c8ace7139027
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-09Y9XHPDXK
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=verification@eastmymedia.my
SMTP_PASS=Amrin123!!
SMTP_SECURE=false
SMTP_FROM=verification@eastmymedia.my
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiYW1yZW4yOSIsImEiOiJjbWk2NHo4eWMxZWI4MmxxdnFncXhrdm1zIn0.TvKStm8yw9VMPzgw_vC-EQ
```

## Step 3: Redeploy

After adding environment variables, trigger a new deployment:

```bash
vercel --prod
```

## Step 4: Custom Domain (Optional)

To use `admin.eastmymedia.my`:
1. In Vercel project settings → **Domains**
2. Add `admin.eastmymedia.my`
3. Vercel will give you DNS records
4. Add those DNS records in your Hostinger domain settings

Done! Your admin panel will be live on Vercel. 🚀
