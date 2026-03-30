# Connect Hostinger Domain to Vercel

This guide shows you how to use your Hostinger domain (eastmymedia.my) with Vercel hosting.

---

## Part 1: Deploy Admin Panel to Vercel

### Step 1: Deploy the Admin Panel

Open Terminal and run:

```bash
cd /Users/mohamedamrin/Desktop/SBHOutdoormedia/admin-panel
vercel --prod
```

When prompted:
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account
- **Link to existing project?** → `N`
- **Project name?** → `admin-eastmymedia`
- **Directory?** → `./`
- **Override settings?** → `N`

Wait for deployment to complete. You'll get a URL like: `admin-eastmymedia.vercel.app`

### Step 2: Add Environment Variables

1. Go to https://vercel.com/dashboard
2. Click on `admin-eastmymedia` project
3. Go to **Settings** → **Environment Variables**
4. Add these one by one:

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

5. Click **Deployments** → **Redeploy** (latest deployment)

---

## Part 2: Connect Custom Domains

### For Main Website (eastmymedia.my)

#### In Vercel:
1. Go to your **main website project** in Vercel
2. Go to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `eastmymedia.my`
5. Click **Add**
6. Vercel will show you DNS records to add

#### In Hostinger:
1. Log in to Hostinger
2. Go to **Domains** → **eastmymedia.my** → **DNS / Name Servers**
3. **Delete** any existing A records pointing to Hostinger
4. **Add** the records Vercel gave you (usually):
   - Type: `A` | Name: `@` | Value: `76.76.21.21`
   - Type: `CNAME` | Name: `www` | Value: `cname.vercel-dns.com`

5. Click **Save**

### For Admin Panel (admin.eastmymedia.my)

#### In Vercel:
1. Go to your **admin-eastmymedia** project
2. Go to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `admin.eastmymedia.my`
5. Click **Add**
6. Vercel will show you a CNAME record

#### In Hostinger:
1. Go to **Domains** → **eastmymedia.my** → **DNS / Name Servers**
2. Click **Add Record**
3. Add:
   - Type: `CNAME`
   - Name: `admin`
   - Value: `cname.vercel-dns.com` (or whatever Vercel shows)
   - TTL: `3600`
4. Click **Save**

---

## Part 3: Wait for DNS Propagation

DNS changes take **5-30 minutes** to propagate.

**Check status:**
- Main site: https://eastmymedia.my
- Admin panel: https://admin.eastmymedia.my

If you see "Invalid Configuration" in Vercel, wait a bit longer.

---

## Summary

✅ **Hostinger** = Domain registration + Email + DNS management  
✅ **Vercel** = Actual website hosting (both main + admin)  
✅ **Your domain purchase is NOT wasted!**

You're using the best of both services! 🚀
