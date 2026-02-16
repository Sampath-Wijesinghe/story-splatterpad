
-- Create storage bucket for product and blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Allow anyone to view images
CREATE POLICY "Public image access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to update images
CREATE POLICY "Admins can update images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete images
CREATE POLICY "Admins can delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'));
