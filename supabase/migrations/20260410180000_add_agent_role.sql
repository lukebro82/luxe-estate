-- Add support for 'agent' role in user_roles table
-- This migration extends the role constraint to include 'agent' as a valid role

-- Update the check constraint on user_roles table to include 'agent'
-- First, we need to drop the existing constraint (if it exists) and add the new one

-- Note: Depending on your Postgres version and how the constraint was originally created,
-- you may need to adjust this. If using a domain type or enum, update that instead.

-- For VARCHAR columns with CHECK constraints:
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;

ALTER TABLE user_roles
ADD CONSTRAINT user_roles_role_check 
CHECK (role IN ('admin', 'user', 'agent'));

-- Create index on role for better query performance
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Add comment to document the role field
COMMENT ON COLUMN user_roles.role IS 'User role: admin (full access), user (basic access), or agent (property management access)';
