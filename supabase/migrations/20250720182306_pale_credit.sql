/*
  # Find Your Buddy Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `pin_code` (text) 
      - `sports` (text array)
      - `skill_level` (text)
      - `availability` (jsonb)
      - `is_available` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `matches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `buddy_id` (uuid, foreign key)  
      - `sport` (text)
      - `match_score` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for viewing other users' profiles for matching
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  pin_code text NOT NULL,
  sports text[] NOT NULL DEFAULT '{}',
  skill_level text NOT NULL CHECK (skill_level IN ('Beginner', 'Intermediate', 'Pro')),
  availability jsonb DEFAULT '{}',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buddy_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sport text NOT NULL,
  match_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, buddy_id, sport)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read all profiles for matching"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies for matches
CREATE POLICY "Users can read their own matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = buddy_id);

CREATE POLICY "Users can create matches"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();