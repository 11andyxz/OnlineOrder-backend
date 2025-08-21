-- Add user_type column to users table
ALTER TABLE users ADD COLUMN user_type VARCHAR(20) NOT NULL DEFAULT 'REGULAR_USER';

-- Update existing users with @siliconinc.com emails to be SUPER_ADMIN
UPDATE users SET user_type = 'SUPER_ADMIN' WHERE email LIKE '%@siliconinc.com';
