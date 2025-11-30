# Nextonnect OAuth Provider

Simple OAuth provider for Decap CMS on Vercel.

## Deploy to Vercel

1. Push this folder to a GitHub repository
2. Import to Vercel
3. Add environment variables:
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`
4. Deploy!

## Environment Variables

Set these in Vercel dashboard:

```
OAUTH_CLIENT_ID=Ov23liB3DvQ4O1OsSkCR
OAUTH_CLIENT_SECRET=040673894a82ba82373b33c1428c23e888d7f92a
```

## Usage

After deployment, your OAuth provider will be at:
```
https://your-project.vercel.app/api/auth
```

Update your Decap CMS config with:
```yaml
base_url: https://your-project.vercel.app
```
