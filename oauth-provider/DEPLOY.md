# Quick Deploy Guide

## Step 1: Push to GitHub

```bash
cd oauth-provider

# Create a new repository on GitHub named: nextonnect-oauth
# Then run:

git remote add origin https://github.com/YOUR-USERNAME/nextonnect-oauth.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your `nextonnect-oauth` repository
3. Click "Deploy" (don't configure anything yet)
4. **After deployment**, go to Settings → Environment Variables
5. Add these:

```
OAUTH_CLIENT_ID=Ov23liB3DvQ4O1OsSkCR
OAUTH_CLIENT_SECRET=040673894a82ba82373b33c1428c23e888d7f92a
```

6. Go to Deployments → Click "..." → "Redeploy"

## Step 3: Update GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click your OAuth App
3. Update **Authorization callback URL** to:
   ```
   https://YOUR-VERCEL-URL.vercel.app/api/callback
   ```
4. Save

## Step 4: Update Nextonnect CMS Config

Edit `/home/user/safety/nextonnect-website/public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: MaazHussaini99/safety
  branch: claude/nextonnect-website-build-011sZkmZv7nPGgZXruSF6gXc
  base_url: https://YOUR-VERCEL-URL.vercel.app  # Your actual Vercel URL
```

Uncomment the `base_url` line and update with your Vercel URL.

## Step 5: Test

1. Commit and push the config change
2. Wait for Amplify rebuild
3. Visit: https://claude-nextonnect-website-build-011szkmzv7npggzxrusf6gxc.d1nz4xwmcbtc3p.amplifyapp.com/admin/
4. Click "Login with GitHub"
5. Done! ✅

---

## Troubleshooting

If you get errors, check Vercel logs:
1. Go to your Vercel project
2. Click "Logs" tab
3. Look for errors in `/api/auth` endpoint

Common fixes:
- Make sure environment variables are set
- Redeploy after adding env vars
- Check GitHub callback URL matches Vercel URL + `/api/callback`
