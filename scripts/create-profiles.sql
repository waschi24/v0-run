-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  avatar_color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial profiles
INSERT INTO profiles (name, avatar_color) VALUES
  ('Florian', '#3B82F6'),
  ('Mama', '#EC4899'),
  ('Adel', '#10B981'),
  ('Fiona', '#F59E0B')
ON CONFLICT (name) DO NOTHING;

-- Update runs table to add profile_id if it doesn't exist
ALTER TABLE runs ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
