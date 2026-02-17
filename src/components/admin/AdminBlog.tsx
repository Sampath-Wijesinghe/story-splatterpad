import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import RichTextEditor from './RichTextEditor';

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: false,
    meta_title: '',
    meta_description: '',
  });

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setForm({ title: '', slug: '', content: '', excerpt: '', image_url: '', published: false, meta_title: '', meta_description: '' });
    setEditing(null);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content || '',
      excerpt: post.excerpt || '',
      image_url: post.image_url || '',
      published: post.published,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `blog/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('images').upload(filePath, file);
    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } else {
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      setForm(f => ({ ...f, image_url: publicUrl }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      content: form.content || null,
      excerpt: form.excerpt || null,
      image_url: form.image_url || null,
      published: form.published,
      author_id: user?.id || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    };

    if (editing) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', editing.id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Post updated' });
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Post created' });
    }
    setDialogOpen(false);
    resetForm();
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Post deleted' });
    fetchPosts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Blog Posts</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Add Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Post' : 'New Blog Post'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => { setForm(f => ({ ...f, title: e.target.value, slug: editing ? f.slug : generateSlug(e.target.value) })); }} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} placeholder="Short description for listings..." />
              </div>

              <div className="space-y-2">
                <Label>Content (Rich Text)</Label>
                <RichTextEditor content={form.content} onChange={(html) => setForm(f => ({ ...f, content: html }))} placeholder="Write your blog post content..." />
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="flex gap-2">
                  <Input value={form.image_url} onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Image URL" className="flex-1" />
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <Button type="button" variant="outline" size="icon" disabled={uploading} asChild>
                      <span><Upload size={16} /></span>
                    </Button>
                  </label>
                </div>
                {form.image_url && <img src={form.image_url} alt="Preview" className="h-24 rounded-lg object-cover mt-2" />}
              </div>

              {/* SEO Meta Fields */}
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground mb-3">SEO Settings</p>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input value={form.meta_title} onChange={(e) => setForm(f => ({ ...f, meta_title: e.target.value }))} placeholder="SEO title (defaults to post title)" maxLength={60} />
                    <p className="text-xs text-muted-foreground">{form.meta_title.length}/60 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea value={form.meta_description} onChange={(e) => setForm(f => ({ ...f, meta_description: e.target.value }))} placeholder="SEO description for search engines..." rows={2} maxLength={160} />
                    <p className="text-xs text-muted-foreground">{form.meta_description.length}/160 characters</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={form.published} onCheckedChange={(v) => setForm(f => ({ ...f, published: v }))} />
                <Label>{form.published ? 'Published' : 'Draft'}</Label>
              </div>

              <Button onClick={handleSave} className="w-full">{editing ? 'Update' : 'Create'} Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No blog posts yet. Write your first post!</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
              {post.image_url ? (
                <img src={post.image_url} alt={post.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-muted-foreground">No img</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-foreground truncate">{post.title}</h3>
                  {post.published ? (
                    <Eye size={14} className="text-primary flex-shrink-0" />
                  ) : (
                    <EyeOff size={14} className="text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{format(new Date(post.created_at), 'MMM d, yyyy')}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(post)}><Pencil size={16} /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="text-destructive hover:text-destructive"><Trash2 size={16} /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
