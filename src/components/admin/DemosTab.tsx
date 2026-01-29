import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, X, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DemoSystem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  demo_url: string | null;
  image_url: string | null;
  features: string[];
  is_active: boolean | null;
  display_order: number | null;
}

export function DemosTab() {
  const [demos, setDemos] = useState<DemoSystem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDemo, setEditingDemo] = useState<DemoSystem | null>(null);
  const [newDemo, setNewDemo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    const { data, error } = await supabase
      .from('demo_systems')
      .select('*')
      .order('display_order');

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    const demosWithFeatures = (data || []).map(demo => ({
      ...demo,
      features: Array.isArray(demo.features) ? demo.features as string[] : [],
    }));

    setDemos(demosWithFeatures);
    setIsLoading(false);
  };

  const saveDemo = async (demo: Partial<DemoSystem>) => {
    if (!demo.name || !demo.slug) {
      toast({ title: 'Error', description: 'Name and slug are required', variant: 'destructive' });
      return;
    }

    const demoData = {
      name: demo.name,
      slug: demo.slug,
      category: demo.category || 'software',
      description: demo.description,
      demo_url: demo.demo_url,
      image_url: demo.image_url,
      features: demo.features || [],
      is_active: demo.is_active ?? true,
    };

    if (demo.id) {
      const { error } = await supabase
        .from('demo_systems')
        .update(demoData)
        .eq('id', demo.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase
        .from('demo_systems')
        .insert([{ ...demoData, display_order: demos.length + 1 }]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Success', description: 'Demo saved!' });
    setEditingDemo(null);
    setNewDemo(false);
    fetchDemos();
  };

  const deleteDemo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this demo?')) return;

    const { error } = await supabase.from('demo_systems').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Deleted', description: 'Demo removed.' });
    fetchDemos();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Demo Systems</h2>
        <Button variant="gold" onClick={() => setNewDemo(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Demo
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {(newDemo || editingDemo) && (
            <DemoForm
              demo={editingDemo}
              onSave={saveDemo}
              onCancel={() => { setEditingDemo(null); setNewDemo(false); }}
            />
          )}

          {demos.map((demo) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl p-4 border border-border flex items-center gap-4"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{demo.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-muted rounded">{demo.category}</span>
                  {!demo.is_active && <span className="text-xs px-2 py-0.5 bg-destructive/10 text-destructive rounded">Inactive</span>}
                </div>
                <p className="text-sm text-muted-foreground">{demo.demo_url || 'No URL set'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setEditingDemo(demo)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => deleteDemo(demo.id)}>
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

function DemoForm({
  demo,
  onSave,
  onCancel,
}: {
  demo: DemoSystem | null;
  onSave: (d: Partial<DemoSystem>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: demo?.name || '',
    slug: demo?.slug || '',
    category: demo?.category || 'software',
    description: demo?.description || '',
    demo_url: demo?.demo_url || '',
    image_url: demo?.image_url || '',
    features: demo?.features?.join('\n') || '',
    is_active: demo?.is_active ?? true,
  });

  return (
    <div className="bg-card rounded-xl p-6 border-2 border-accent">
      <h3 className="text-lg font-semibold mb-4">{demo ? 'Edit' : 'Add'} Demo System</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>System Name</Label>
          <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Slug (URL-friendly)</Label>
          <Input value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} placeholder="school-management" />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <select
            value={formData.category}
            onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="school">School</option>
            <option value="hospital">Hospital</option>
            <option value="pos">POS</option>
            <option value="hotel">Hotel</option>
            <option value="restaurant">Restaurant</option>
            <option value="software">Other Software</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Demo URL</Label>
          <Input value={formData.demo_url} onChange={e => setFormData(p => ({ ...p, demo_url: e.target.value }))} placeholder="https://demo.example.com" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Image URL</Label>
          <Input value={formData.image_url} onChange={e => setFormData(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Features (one per line)</Label>
          <Textarea value={formData.features} onChange={e => setFormData(p => ({ ...p, features: e.target.value }))} rows={4} placeholder="Student Records&#10;Fee Management&#10;Reports" />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={e => setFormData(p => ({ ...p, is_active: e.target.checked }))}
            className="h-4 w-4"
          />
          <Label htmlFor="is_active">Active (visible on website)</Label>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="gold" onClick={() => onSave({
          ...demo,
          ...formData,
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
