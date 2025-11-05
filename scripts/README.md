# 🛠️ Scripts Directory

## Performance Optimization Scripts

### 1. `apply-performance-indexes.sh`

**Purpose**: Apply database performance indexes to Supabase/Postgres

**Usage**:
```bash
chmod +x scripts/apply-performance-indexes.sh
./scripts/apply-performance-indexes.sh
```

**Prerequisites**:
- `DATABASE_URL` environment variable set
- `psql` command-line tool installed
- Database connection access

**What it does**:
1. Validates DATABASE_URL
2. Backs up current indexes to `backup_indexes_YYYYMMDD_HHMMSS.txt`
3. Applies performance indexes from `/prisma/migrations/performance_indexes.sql`
4. Verifies indexes were created
5. Displays summary

**Output**:
```
🚀 Applying Performance Indexes...
==================================
✅ DATABASE_URL found

📋 Backing up current indexes...
✅ Backup saved to backup_indexes_20250104_120000.txt

🔧 Applying performance indexes...
✅ Performance indexes applied successfully!

🔍 Verifying indexes...
[Table of indexes]

✅ All done! Your database is now optimized.
```

---

### 2. `test-dashboard-performance.js`

**Purpose**: Test dashboard endpoint performance

**Usage**:
```bash
# Test local development
node scripts/test-dashboard-performance.js

# Test specific URL
TEST_URL=https://your-app.vercel.app node scripts/test-dashboard-performance.js
```

**Prerequisites**:
- Node.js installed
- Server running (local or production)

**What it does**:
1. Makes 5 requests to `/api/pm/dashboard`
2. Measures TTFB (Time to First Byte)
3. Measures total response time
4. Validates response structure
5. Calculates statistics (avg, min, max)
6. Provides performance verdict

**Output**:
```
🧪 Dashboard Performance Test
==============================

📍 Target: http://localhost:3000/api/pm/dashboard
🔢 Requests: 5

Request 1/5... ✅ 200 | TTFB: 245ms | Total: 312ms

📦 Response Structure:
  ✅ stats: { ... }
  ✅ recentProjects: 5 items
  ✅ notifications: 10 items
  ✅ timestamp: 2025-01-04T...

💾 Cache Headers:
  Cache-Control: public, s-maxage=60, stale-while-revalidate=120

Request 2/5... ✅ 200 | TTFB: 180ms | Total: 245ms
Request 3/5... ✅ 200 | TTFB: 165ms | Total: 230ms
Request 4/5... ✅ 200 | TTFB: 170ms | Total: 235ms
Request 5/5... ✅ 200 | TTFB: 175ms | Total: 240ms

📊 Performance Statistics
=========================

TTFB (Time to First Byte):
  Average: 187ms
  Min: 165ms
  Max: 245ms

Total Time:
  Average: 252ms
  Min: 230ms
  Max: 312ms

🎯 Performance Verdict
=====================

✅ TTFB < 500ms
   Target: < 500ms | Actual: 187ms

✅ Total Time < 2s
   Target: < 2000ms | Actual: 252ms

✅ Success Rate 100%
   Target: 100% | Actual: 100%

🎉 All performance targets met!
```

**Success Criteria**:
- ✅ TTFB < 500ms
- ✅ Total Time < 2000ms
- ✅ Success Rate 100%

---

## Other Scripts

### `security-check.ts`
Security validation script (existing)

---

## Environment Variables

### Required for Scripts

```env
# Database connection (for apply-performance-indexes.sh)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Optional: Test URL (for test-dashboard-performance.js)
TEST_URL=http://localhost:3000
```

---

## Troubleshooting

### `apply-performance-indexes.sh`

**Error: DATABASE_URL not set**
```bash
export DATABASE_URL='postgresql://...'
# Or add to .env file
```

**Error: psql command not found**
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows
# Download from https://www.postgresql.org/download/windows/
```

**Error: Permission denied**
```bash
chmod +x scripts/apply-performance-indexes.sh
```

### `test-dashboard-performance.js`

**Error: ECONNREFUSED**
- Server not running
- Wrong URL/port
```bash
# Start dev server
npm run dev

# Or check production URL
TEST_URL=https://your-app.vercel.app node scripts/test-dashboard-performance.js
```

**Error: Unauthorized (401)**
- Endpoint requires authentication
- Test with authenticated session (manual browser test)

---

## Best Practices

1. **Always backup before applying indexes**
   - Script does this automatically
   - Keep backups for rollback

2. **Test locally before production**
   ```bash
   # Test local first
   node scripts/test-dashboard-performance.js
   
   # Then test production
   TEST_URL=https://prod.app node scripts/test-dashboard-performance.js
   ```

3. **Monitor after deployment**
   - Check Vercel logs
   - Check Supabase query performance
   - Run performance test periodically

4. **Keep scripts updated**
   - Update as endpoints change
   - Add new tests as needed

---

## Contributing

When adding new scripts:
1. Add executable permission: `chmod +x scripts/your-script.sh`
2. Document in this README
3. Add error handling
4. Include usage examples
5. Test thoroughly

---

## Related Documentation

- `/docs/PERFORMANCE_OPTIMIZATION.md` - Technical details
- `/docs/DEPLOYMENT_PLAN.md` - Deployment guide
- `/PERFORMANCE_OPTIMIZATION_SUMMARY.md` - Implementation summary
