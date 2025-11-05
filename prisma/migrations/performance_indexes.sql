-- ============================================
-- Performance Optimization Indexes
-- Dashboard XHR Bottleneck Fix
-- ============================================
-- Target: Reduce dashboard load time from 18s to <2s
-- Date: 2025-01-04
-- ============================================

-- 1. Projects table indexes
-- For filtering by status (active projects count)
CREATE INDEX IF NOT EXISTS idx_projects_status 
ON projects(status) 
WHERE status = 'IN_PROGRESS';

-- For ordering by creation date (recent projects)
CREATE INDEX IF NOT EXISTS idx_projects_created_at_desc 
ON projects(created_at DESC);

-- Composite index for status + created_at (common query pattern)
CREATE INDEX IF NOT EXISTS idx_projects_status_created_at 
ON projects(status, created_at DESC);

-- 2. Tasks table indexes
-- For filtering by assignee and status (pending tasks)
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to_status 
ON tasks(assigned_to_id, status) 
WHERE status IN ('TODO', 'IN_PROGRESS');

-- For filtering by assignee and completion (completed tasks this month)
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to_completed 
ON tasks(assigned_to_id, status, updated_at DESC) 
WHERE status = 'COMPLETED';

-- For filtering by creator
CREATE INDEX IF NOT EXISTS idx_tasks_created_by 
ON tasks(created_by_id);

-- For project tasks count
CREATE INDEX IF NOT EXISTS idx_tasks_project_id 
ON tasks(project_id);

-- 3. ProjectMember table indexes
-- For user's projects lookup
CREATE INDEX IF NOT EXISTS idx_project_members_user_id 
ON project_members(user_id);

-- For project members count
CREATE INDEX IF NOT EXISTS idx_project_members_project_id 
ON project_members(project_id);

-- Composite for user + project status filtering
CREATE INDEX IF NOT EXISTS idx_project_members_user_project 
ON project_members(user_id, project_id);

-- 4. Notifications table indexes (already exist in schema but verify)
-- For user notifications ordered by date
CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at 
ON notifications(user_id, created_at DESC);

-- For unread notifications count
CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
ON notifications(user_id, read) 
WHERE read = false;

-- 5. Users table index
-- For team count queries (if needed)
CREATE INDEX IF NOT EXISTS idx_users_role 
ON users(role);

-- ============================================
-- Analyze tables for query planner
-- ============================================
ANALYZE projects;
ANALYZE tasks;
ANALYZE project_members;
ANALYZE notifications;
ANALYZE users;

-- ============================================
-- Verify indexes
-- ============================================
-- Run this to check all indexes on critical tables:
-- SELECT tablename, indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename IN ('projects', 'tasks', 'project_members', 'notifications')
-- ORDER BY tablename, indexname;
