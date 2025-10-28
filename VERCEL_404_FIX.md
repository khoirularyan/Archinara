# Fix Vercel 404 NOT_FOUND Issue

## ✅ Status: Build Lokal Berhasil

```bash
$ npm run build

✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (10/10)

Route (app)
┌ ○ /                           ✅ ROOT EXISTS
├ ○ /_not-found
├ ○ /pm
├ ○ /pm/dashboard
├ ○ /pm/dashboard/schedule
├ ○ /pm/dashboard/team
├ ○ /pm/login
└ ○ /pm/signup
```

## 🔍 Root Cause Analysis

Jika build lokal berhasil tapi Vercel 404, kemungkinan penyebab:

### 1. **Vercel Root Directory Tidak Tersimpan**
Vercel kadang tidak menyimpan perubahan Root Directory.

**Solution:**
1. Go to Vercel Dashboard → Project Settings
2. General → Root Directory
3. Set to: `web/`
4. Click **Save**
5. **Redeploy** (jangan hanya save)

### 2. **Build Cache Lama**
Cache dari deployment sebelumnya (sebelum set Root Directory).

**Solution:**
```bash
# Via Vercel CLI
vercel --prod --force

# Via Dashboard:
# 1. Deployments tab
# 2. Click "..." on latest
# 3. "Redeploy"
# 4. Check "Use existing Build Cache" → UNCHECK
# 5. Click "Redeploy"
```

### 3. **Framework Detection Salah**
Vercel tidak mendeteksi Next.js dengan benar.

**Solution:**
1. Project Settings → General
2. Framework Preset: **Next.js** (bukan Other)
3. Build Command: `next build` (atau kosongkan untuk default)
4. Output Directory: `.next` (atau kosongkan)
5. Install Command: `npm install` (atau kosongkan)
6. Save & Redeploy

### 4. **Node Version Mismatch**
Vercel menggunakan Node version berbeda.

**Solution:**
Add to `web/package.json`:
```json
{
  "engines": {
    "node": ">=18.17.0"
  }
}
```

Or create `web/.nvmrc`:
```
20
```

### 5. **Missing Dependencies**
Dependencies tidak terinstall di Vercel.

**Solution:**
```bash
# Pastikan lock file ter-commit
cd /home/khoirul/dev/Archinara/web
npm install
git add package-lock.json
git commit -m "chore: update lock file"
git push
```

## 🚀 Step-by-Step Fix (Recommended Order)

### Step 1: Clear Everything & Redeploy
```bash
# 1. Via Vercel Dashboard
# - Go to Project Settings → General
# - Scroll to "Root Directory"
# - Confirm it says: web/
# - If not, set it and SAVE

# 2. Go to Deployments
# - Click "..." on latest deployment
# - Click "Redeploy"
# - UNCHECK "Use existing Build Cache"
# - Click "Redeploy"

# 3. Wait for build to complete
# - Watch build logs
# - Look for "Route (app)" section
# - Confirm "/" is listed
```

### Step 2: Verify Build Output
Check Vercel build logs for:
```
✓ Generating static pages (10/10)

Route (app)
┌ ○ /                    ← MUST BE HERE
├ ○ /pm
└ ...
```

If "/" is missing in Vercel logs but present locally:
- Root Directory is wrong
- Or build is using old cache

### Step 3: Test Production URL
```bash
# After deployment completes
curl -I https://archinara.tech

# Should return:
HTTP/2 200
# NOT 404
```

### Step 4: Check DNS (if still 404)
```bash
# Verify DNS points to Vercel
dig archinara.tech

# Should show Vercel IPs:
# 76.76.21.21 or cname.vercel-dns.com
```

## 🔧 Vercel Configuration Checklist

### Project Settings → General

```
✅ Root Directory: web/
✅ Framework Preset: Next.js
✅ Node.js Version: 20.x (or 18.x)
✅ Build Command: (empty or "next build")
✅ Output Directory: (empty or ".next")
✅ Install Command: (empty or "npm install")
```

### Project Settings → Domains

```
✅ archinara.tech → Primary
✅ www.archinara.tech → Redirect to archinara.tech (301)
✅ DNS configured (A/CNAME records)
```

### Project Settings → Git

```
✅ Production Branch: main
✅ Auto-deploy: Enabled
```

## 🐛 Debug Commands

### Local Build Test
```bash
cd /home/khoirul/dev/Archinara/web

# Clean build
rm -rf .next
npm run build

# Should show:
# ✓ Generating static pages (10/10)
# Route (app)
# ┌ ○ /
```

### Local Production Test
```bash
cd /home/khoirul/dev/Archinara/web

# Build
npm run build

# Start production server
npm start

# Test
curl http://localhost:3000
# Should return HTML, not 404
```

### Vercel CLI Debug
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd /home/khoirul/dev/Archinara/web
vercel link

# Deploy to preview
vercel

# Check preview URL
# If preview works but production doesn't:
# → DNS issue or domain configuration issue
```

## 📋 Verification Checklist

After redeployment, verify:

- [ ] Vercel build logs show `Route (app)` with `/`
- [ ] Build completes without errors
- [ ] `https://archinara.tech` returns 200 (not 404)
- [ ] `https://www.archinara.tech` redirects to archinara.tech
- [ ] Homepage loads correctly
- [ ] `/pm` route works
- [ ] `/pm/login` route works
- [ ] `/pm/dashboard` route works

## 🎯 Most Likely Solution

**90% of cases:** Root Directory not saved properly + old cache

**Fix:**
1. Vercel Dashboard → Project Settings → General
2. Root Directory: `web/`
3. Click **Save**
4. Go to Deployments tab
5. Latest deployment → "..." → **Redeploy**
6. **UNCHECK** "Use existing Build Cache"
7. Click **Redeploy**
8. Wait 1-2 minutes
9. Test: `https://archinara.tech`

## 📞 If Still 404 After All Steps

1. **Check Vercel Status**: https://www.vercel-status.com
2. **Check Build Logs**: Look for actual error messages
3. **Try Different Browser**: Clear cache / incognito
4. **Wait 5 minutes**: DNS propagation
5. **Contact Vercel Support**: With deployment URL

## 🔗 Useful Links

- Vercel Docs: https://vercel.com/docs/projects/overview
- Next.js Deployment: https://nextjs.org/docs/app/building-your-application/deploying
- Vercel Support: https://vercel.com/support

---

## 📝 Current Configuration (Verified)

```
✅ web/src/app/page.tsx exists
✅ web/next.config.ts clean (no basePath/assetPrefix)
✅ web/package.json has correct scripts
✅ Local build successful
✅ Route "/" generated in build output
✅ TypeScript errors fixed
✅ Sonner configured correctly
```

**Next Action:** Redeploy on Vercel with cache cleared.
