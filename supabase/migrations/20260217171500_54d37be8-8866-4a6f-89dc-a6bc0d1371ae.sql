
-- Add status column to products (active/inactive)
ALTER TABLE public.products ADD COLUMN status text NOT NULL DEFAULT 'active';

-- Add multiple images support to products
ALTER TABLE public.products ADD COLUMN images text[] DEFAULT '{}';

-- Add meta fields to blog_posts
ALTER TABLE public.blog_posts ADD COLUMN meta_title text;
ALTER TABLE public.blog_posts ADD COLUMN meta_description text;
