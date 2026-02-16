import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost as BlogPostType } from '@/lib/types';
import { format } from 'date-fns';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      setPost(data as BlogPostType | null);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4"><div className="h-96 animate-pulse bg-card rounded-2xl" /></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {post.image_url && (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar size={14} />
          <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">{post.title}</h1>

        <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
