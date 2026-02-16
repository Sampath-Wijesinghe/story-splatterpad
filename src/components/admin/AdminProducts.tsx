import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory, CATEGORY_LABELS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';

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
    featured: false,
    specifications: '',
  });

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ title: '', category: 'pond_pumps', description: '', price: '', image_url: '', featured: false, specifications: '' });
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
      featured: product.featured,
      specifications: product.specifications ? JSON.stringify(product.specifications, null, 2) : '',
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `products/${Date.now()}.${fileExt}`;
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
      featured: form.featured,
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
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
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
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Price (Rs.)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
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
                <h3 className="font-display font-semibold text-foreground truncate">{product.title}</h3>
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
