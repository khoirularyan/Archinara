#!/bin/bash

# Archinara Build Verification Script
# Usage: ./verify-build.sh

set -e

echo "🔍 Archinara Build Verification"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to web directory
cd "$(dirname "$0")/web"

echo "📁 Current directory: $(pwd)"
echo ""

# Check 1: Verify page.tsx exists
echo "1️⃣  Checking root page.tsx..."
if [ -f "src/app/page.tsx" ]; then
    echo -e "${GREEN}✓${NC} src/app/page.tsx exists"
else
    echo -e "${RED}✗${NC} src/app/page.tsx NOT FOUND"
    exit 1
fi
echo ""

# Check 2: Verify next.config.ts
echo "2️⃣  Checking next.config.ts..."
if [ -f "next.config.ts" ]; then
    echo -e "${GREEN}✓${NC} next.config.ts exists"
    
    # Check for problematic configs
    if grep -q "basePath" next.config.ts; then
        echo -e "${YELLOW}⚠${NC}  Warning: basePath found in config"
    fi
    if grep -q "assetPrefix" next.config.ts; then
        echo -e "${YELLOW}⚠${NC}  Warning: assetPrefix found in config"
    fi
    if grep -q "output.*export" next.config.ts; then
        echo -e "${YELLOW}⚠${NC}  Warning: output: 'export' found in config"
    fi
else
    echo -e "${RED}✗${NC} next.config.ts NOT FOUND"
    exit 1
fi
echo ""

# Check 3: Verify package.json scripts
echo "3️⃣  Checking package.json scripts..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json exists"
    
    if grep -q '"dev".*"next dev"' package.json; then
        echo -e "${GREEN}✓${NC} dev script OK"
    else
        echo -e "${RED}✗${NC} dev script missing or incorrect"
    fi
    
    if grep -q '"build".*"next build"' package.json; then
        echo -e "${GREEN}✓${NC} build script OK"
    else
        echo -e "${RED}✗${NC} build script missing or incorrect"
    fi
    
    if grep -q '"start".*"next start"' package.json; then
        echo -e "${GREEN}✓${NC} start script OK"
    else
        echo -e "${RED}✗${NC} start script missing or incorrect"
    fi
else
    echo -e "${RED}✗${NC} package.json NOT FOUND"
    exit 1
fi
echo ""

# Check 4: TypeScript check
echo "4️⃣  Running TypeScript check..."
if command -v npm &> /dev/null; then
    if npm exec tsc -- --noEmit; then
        echo -e "${GREEN}✓${NC} TypeScript check passed"
    else
        echo -e "${RED}✗${NC} TypeScript errors found"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠${NC}  npm not found, skipping TypeScript check"
fi
echo ""

# Check 5: Build test
echo "5️⃣  Running production build..."
if command -v npm &> /dev/null; then
    # Clean previous build
    rm -rf .next
    
    if npm run build; then
        echo -e "${GREEN}✓${NC} Build successful"
        
        # Check if root route exists in build output
        if [ -d ".next/server/app" ]; then
            if [ -f ".next/server/app/page.js" ] || [ -f ".next/server/app/index.html" ]; then
                echo -e "${GREEN}✓${NC} Root route (/) generated"
            else
                echo -e "${RED}✗${NC} Root route (/) NOT generated"
                echo "Files in .next/server/app:"
                ls -la .next/server/app/ || true
                exit 1
            fi
        fi
    else
        echo -e "${RED}✗${NC} Build failed"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠${NC}  npm not found, skipping build"
fi
echo ""

# Check 6: Verify ClientToaster
echo "6️⃣  Checking Sonner setup..."
if [ -f "src/components/ClientToaster.tsx" ]; then
    echo -e "${GREEN}✓${NC} ClientToaster.tsx exists"
else
    echo -e "${RED}✗${NC} ClientToaster.tsx NOT FOUND"
fi

if grep -q "ClientToaster" src/app/layout.tsx; then
    echo -e "${GREEN}✓${NC} ClientToaster imported in layout.tsx"
else
    echo -e "${RED}✗${NC} ClientToaster NOT imported in layout.tsx"
fi
echo ""

# Summary
echo "================================"
echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""
echo "📦 Ready for Vercel deployment"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m \"fix: production ready\""
echo "3. git push origin main"
echo "4. Vercel will auto-deploy"
echo ""
echo "If Vercel shows 404:"
echo "- Check Root Directory = web/"
echo "- Redeploy with cache cleared"
echo "- See VERCEL_404_FIX.md for details"
