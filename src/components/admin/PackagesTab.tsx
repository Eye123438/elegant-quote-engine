import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ServicePackage {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number;
  price_suffix: string | null;
  features: string[];
  delivery_time: string | null;
  is_popular: boolean | null;
  is_featured: boolean | null;
  display_order: number | null;
}

export function PackagesTab() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [newPackage, setNewPackage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('service_packages')
      .select('*')
      .order('display_order');

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    // Convert JSONB features to string array
    const packagesWithFeatures = (data || []).map(pkg => ({
      ...pkg,
      features: Array.isArray(pkg.features) ? pkg.features as string[] : [],
    }));

    setPackages(packagesWithFeatures);
    setIsLoading(false);
  };

  const savePackage = async (pkg: Partial<ServicePackage>) => {
    if (!pkg.name || !pkg.price || !pkg.slug) {
      toast({ title: 'Error', description: 'Name, slug, and price are required', variant: 'destructive' });
      return;
    }

    const packageData = {
      name: pkg.name,
      slug: pkg.slug,
      category: pkg.category || 'website',
      description: pkg.description,
      price: pkg.price,
      price_suffix: pkg.price_suffix,
      features: pkg.features || [],
      delivery_time: pkg.delivery_time,
      is_popular: pkg.is_popular || false,
      is_featured: pkg.is_featured || false,
    };

    if (pkg.id) {
      const { error } = await supabase
        .from('service_packages')
        .update(packageData)
        .eq('id', pkg.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase
        .from('service_packages')
        .insert([{ ...packageData, display_order: packages.length + 1 }]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Success', description: 'Package saved!' });
    setEditingPackage(null);
    setNewPackage(false);
    fetchPackages();
  };

  const deletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    const { error } = await supabase.from('service_packages').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Deleted', description: 'Package removed.' });
    fetchPackages();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Service Packages</h2>
        <Button variant="gold" onClick={() => setNewPackage(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {(newPackage || editingPackage) && (
            <PackageForm
              pkg={editingPackage}
              onSave={savePackage}
              onCancel={() => { setEditingPackage(null); setNewPackage(false); }}
            />
          )}

          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl p-4 border border-border flex items-center gap-4"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-muted rounded">{pkg.category}</span>
                  {pkg.is_popular && <span className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded">Popular</span>}
                </div>
                <p className="text-lg font-bold text-accent">
                  Ksh {pkg.price.toLocaleString()}{pkg.price_suffix && <span className="text-sm font-normal text-muted-foreground">{pkg.price_suffix}</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setEditingPackage(pkg)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => deletePackage(pkg.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function PackageForm({
  pkg,
  onSave,
  onCancel,
}: {
  pkg: ServicePackage | null;
  onSave: (p: Partial<ServicePackage>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    slug: pkg?.slug || '',
    category: pkg?.category || 'website',
    description: pkg?.description || '',
    price: pkg?.price?.toString() || '',
    price_suffix: pkg?.price_suffix || '',
    features: pkg?.features?.join('\n') || '',
    delivery_time: pkg?.delivery_time || '',
    is_popular: pkg?.is_popular || false,
    is_featured: pkg?.is_featured || false,
  });

  return (
    <div className="bg-card rounded-xl p-6 border-2 border-accent">
      <h3 className="text-lg font-semibold mb-4">{pkg ? 'Edit' : 'Add'} Package</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Package Name</Label>
          <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Slug (URL-friendly)</Label>
          <Input value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} placeholder="starter-website" />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <select
            value={formData.category}
            onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="website">Website</option>
            <option value="software">Software</option>
            <option value="ecommerce">E-commerce</option>
            <option value="pos">POS</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Delivery Time</Label>
          <Input value={formData.delivery_time} onChange={e => setFormData(p => ({ ...p, delivery_time: e.target.value }))} placeholder="3-5 days" />
        </div>
        <div className="space-y-2">
          <Label>Price (Ksh)</Label>
          <Input type="number" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Price Suffix</Label>
          <Input value={formData.price_suffix} onChange={e => setFormData(p => ({ ...p, price_suffix: e.target.value }))} placeholder="/month or + hosting" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Features (one per line)</Label>
          <Textarea value={formData.features} onChange={e => setFormData(p => ({ ...p, features: e.target.value }))} rows={4} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_popular}
              onChange={e => setFormData(p => ({ ...p, is_popular: e.target.checked }))}
              className="h-4 w-4"
            />
            <span className="text-sm">Popular</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={e => setFormData(p => ({ ...p, is_featured: e.target.checked }))}
              className="h-4 w-4"
            />
            <span className="text-sm">Featured</span>
          </label>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="gold" onClick={() => onSave({
          ...pkg,
          ...formData,
          price: parseFloat(formData.price) || 0,
          features: formData.features.split('\n').filter(f => f.trim()),
        })}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
