export type ProductCategory = 'pond_pumps' | 'pond_aerators' | 'pond_filters' | 'accessories';

export interface Product {
  id: string;
  category: ProductCategory;
  title: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  featured: boolean;
  specifications: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  pond_pumps: 'Pond Pumps',
  pond_aerators: 'Pond Aerators',
  pond_filters: 'Pond Filters',
  accessories: 'Accessories',
};

export const CATEGORY_DESCRIPTIONS: Record<ProductCategory, string> = {
  pond_pumps: 'High-performance pumps for crystal-clear water circulation and waterfalls.',
  pond_aerators: 'Keep your pond oxygenated for healthier, happier koi fish.',
  pond_filters: 'Advanced filtration systems for pristine water quality year-round.',
  accessories: 'Essential tools, test kits, and accessories for complete pond care.',
};
