import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory, CATEGORY_LABELS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: '',
    category: 'pond_pumps' as ProductCategory,
    description: '',
    price: '',
    image_url: '',
    images: [] as string[],
    featured: false,
    status: 'active',
    specifications: '',
  });

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ title: '', category: 'pond_pumps', description: '', price: '', image_url: '', images: [], featured: false, status: 'active', specifications: '' });
    setEditing(null);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      title: product.title,
      category: product.category,
      description: product.description || '',
      price: product.price?.toString() || '',
      image_url: product.image_url || '',
      images: product.images || [],
      featured: product.featured,
      status: product.status || 'active',
      specifications: product.specifications ? JSON.stringify(product.specifications, null, 2) : '',
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMultiple = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const filePath = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error } = await supabase.storage.from('images').upload(filePath, file);
      if (error) {
        toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      if (isMultiple) {
        setForm(f => ({ ...f, images: [...f.images, publicUrl] }));
      } else {
        setForm(f => ({ ...f, image_url: publicUrl }));
      }
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    let specs = {};
    if (form.specifications.trim()) {
      try { specs = JSON.parse(form.specifications); } catch {
        toast({ title: 'Invalid JSON', description: 'Specifications must be valid JSON.', variant: 'destructive' });
        return;
      }
    }
    const payload = {
      title: form.title,
      category: form.category,
      description: form.description || null,
      price: form.price ? parseFloat(form.price) : null,
      image_url: form.image_url || null,
      images: form.images,
      featured: form.featured,
      status: form.status,
      specifications: specs,
    };

    if (editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Product updated' });
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Product created' });
    }
    setDialogOpen(false);
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Product deleted' });
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Products</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v as ProductCategory }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description (Rich Text)</Label>
                <RichTextEditor content={form.description} onChange={(html) => setForm(f => ({ ...f, description: html }))} placeholder="Write product description..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (Rs.)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Main image */}
              <div className="space-y-2">
                <Label>Main Image</Label>
                <div className="flex gap-2">
                  <Input value={form.image_url} onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="Image URL" className="flex-1" />
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, false)} />
                    <Button type="button" variant="outline" size="icon" disabled={uploading} asChild>
                      <span><Upload size={16} /></span>
                    </Button>
                  </label>
                </div>
                {form.image_url && <img src={form.image_url} alt="Preview" className="h-24 rounded-lg object-cover mt-2" />}
              </div>

              {/* Additional images */}
              <div className="space-y-2">
                <Label>Additional Images</Label>
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e, true)} />
                  <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                    <span><Upload size={14} className="mr-2" /> Upload Images</span>
                  </Button>
                </label>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.images.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`Image ${i + 1}`} className="h-20 w-20 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm(f => ({ ...f, featured: v }))} />
                <Label>Featured</Label>
              </div>

              <div className="space-y-2">
                <Label>Specifications (JSON)</Label>
                <Textarea value={form.specifications} onChange={(e) => setForm(f => ({ ...f, specifications: e.target.value }))} rows={4} placeholder='{"Flow Rate": "5000 L/h", "Power": "50W"}' />
              </div>

              <Button onClick={handleSave} className="w-full">{editing ? 'Update' : 'Create'} Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No products yet. Add your first product!</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-muted-foreground">No img</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-foreground truncate">{product.title}</h3>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {product.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[product.category]} {product.price ? `• Rs. ${Number(product.price).toLocaleString()}` : ''}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(product)}><Pencil size={16} /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive hover:text-destructive"><Trash2 size={16} /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
