import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Package, FileText } from 'lucide-react';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminBlog from '@/components/admin/AdminBlog';
import logo from '@/assets/logo.png';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Koi Majesty" className="h-10 object-contain" />
            <span className="font-display font-bold text-foreground">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">View Site</a>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut size={16} className="mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products" className="gap-2">
              <Package size={16} /> Products
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2">
              <FileText size={16} /> Blog Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>
          <TabsContent value="blog">
            <AdminBlog />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
