# Deploy Archinara to Vercel

## Prerequisites
- Vercel account connected to GitHub
- Repository: `Archinara` (monorepo)
- Frontend code in `web/` directory

## Vercel Project Configuration

### 1. Root Directory
```
Root Directory: web/
```

### 2. Build Settings
```
Framework Preset: Next.js
Build Command: (leave default - next build)
Output Directory: (leave default - .next)
Install Command: pnpm install
```

### 3. Environment Variables
No environment variables required for initial deployment.

For production with database:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://archinara.tech
```

## Domain Configuration

### Primary Domain
```
Domain: archinara.tech
Type: Primary
```

### WWW Redirect
```
Domain: www.archinara.tech
Redirect to: archinara.tech
Status Code: 301 (Permanent)
```

## Production Branch
```
Branch: main
Auto-deploy: Enabled
```

## Deployment Steps

### Initial Deployment

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Select `Archinara` repository
   - Configure:
     - Root Directory: `web/`
     - Framework: Next.js
     - Click "Deploy"

3. **Configure Custom Domain**
   - Go to Project Settings → Domains
   - Add `archinara.tech`
   - Add `www.archinara.tech` with 301 redirect
   - Update DNS records as instructed by Vercel

### Redeploy

#### Option 1: Git Push (Automatic)
```bash
git add .
git commit -m "Update: description"
git push origin main
```

#### Option 2: Manual Redeploy
1. Go to Vercel Dashboard
2. Select project "Archinara"
3. Go to "Deployments" tab
4. Click "..." on latest deployment
5. Click "Redeploy"

#### Option 3: Clear Cache & Redeploy
```bash
# Via Vercel CLI
vercel --prod --force

# Or via Dashboard:
# 1. Go to Project Settings → General
# 2. Scroll to "Build & Development Settings"
# 3. Click "Clear Build Cache"
# 4. Redeploy
```

## Troubleshooting

### Build Fails with TypeScript Error
```bash
# Check locally first
cd web/
pnpm run build

# If passes locally but fails on Vercel:
# 1. Clear build cache
# 2. Check Node version (should be 20.x or 22.x)
# 3. Verify pnpm-lock.yaml is committed
```

### Module Not Found
```bash
# Ensure all dependencies are in package.json
cd web/
pnpm install
git add pnpm-lock.yaml
git commit -m "Update dependencies"
git push
```

### Tailwind CSS Not Working
```bash
# Verify postcss.config.js exists
# Verify @tailwindcss/postcss is in devDependencies
# Check globals.css has @import "tailwindcss"
```

## Performance Optimization

### Enable Vercel Speed Insights
```bash
pnpm add @vercel/speed-insights
```

Add to `layout.tsx`:
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Enable Vercel Analytics
```bash
pnpm add @vercel/analytics
```

Add to `layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Monitoring

### Check Deployment Status
```bash
# Via CLI
vercel ls

# Via Dashboard
https://vercel.com/[your-username]/archinara
```

### View Build Logs
1. Go to Vercel Dashboard
2. Select "Archinara" project
3. Click on deployment
4. View "Building" logs

### Check Runtime Logs
1. Go to Vercel Dashboard
2. Select "Archinara" project
3. Go to "Logs" tab
4. Filter by time/function

## CI/CD Workflow

```
┌─────────────┐
│  Git Push   │
│   to main   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Vercel    │
│  Detects    │
│   Changes   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Install   │
│ Dependencies│
│ (pnpm)      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Build    │
│ (next build)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Deploy    │
│  to Edge    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Live!    │
│ archinara   │
│   .tech     │
└─────────────┘
```

## Useful Commands

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login to Vercel
vercel login

# Link project
cd web/
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]
```

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support
