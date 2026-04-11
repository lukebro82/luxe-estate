-- Create public storage bucket for property images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read files from the bucket (public listing)
CREATE POLICY "Public read property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-images');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images');
