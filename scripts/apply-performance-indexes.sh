#!/bin/bash

# ============================================
# Apply Performance Indexes to Database
# ============================================
# This script applies the performance optimization indexes
# to your Supabase/Postgres database
# ============================================

set -e  # Exit on error

echo "🚀 Applying Performance Indexes..."
echo "=================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set it in your .env file or export it:"
    echo "  export DATABASE_URL='postgresql://...'"
    exit 1
fi

echo "✅ DATABASE_URL found"
echo ""

# Backup current indexes (optional)
echo "📋 Backing up current indexes..."
psql "$DATABASE_URL" -c "\
SELECT tablename, indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('projects', 'tasks', 'project_members', 'notifications', 'users')
ORDER BY tablename, indexname;" > backup_indexes_$(date +%Y%m%d_%H%M%S).txt

echo "✅ Backup saved to backup_indexes_*.txt"
echo ""

# Apply the performance indexes
echo "🔧 Applying performance indexes..."
psql "$DATABASE_URL" -f prisma/migrations/performance_indexes.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Performance indexes applied successfully!"
    echo ""
    
    # Verify indexes
    echo "🔍 Verifying indexes..."
    psql "$DATABASE_URL" -c "\
    SELECT 
        schemaname,
        tablename, 
        indexname,
        CASE 
            WHEN indexname LIKE 'idx_%' THEN '✅ Custom'
            ELSE '📌 System'
        END as type
    FROM pg_indexes 
    WHERE tablename IN ('projects', 'tasks', 'project_members', 'notifications', 'users')
    ORDER BY tablename, indexname;"
    
    echo ""
    echo "✅ All done! Your database is now optimized."
    echo ""
    echo "📊 Next steps:"
    echo "  1. Deploy your code changes (git push)"
    echo "  2. Test the dashboard performance"
    echo "  3. Monitor metrics in Vercel/Supabase dashboard"
    echo ""
else
    echo ""
    echo "❌ Error applying indexes. Check the error message above."
    exit 1
fi
