-- Add missing property fields for the add/edit form
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS parking integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS year_built integer,
  ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT '{}';
