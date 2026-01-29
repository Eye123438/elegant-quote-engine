import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ServiceAddon {
  id: string;
  name: string;
  description: string | null;
  price: number;
  price_suffix: string | null;
  icon: string | null;
  is_ai_feature: boolean | null;
  display_order: number | null;
}

export function AddonsTab() {
  const [addons, setAddons] = useState<ServiceAddon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAddon, setEditingAddon] = useState<ServiceAddon | null>(null);
  const [newAddon, setNewAddon] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    const { data, error } = await supabase
      .from('service_addons')
      .select('*')
      .order('display_order');

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setAddons(data || []);
    setIsLoading(false);
  };

  const saveAddon = async (addon: Partial<ServiceAddon>) => {
    if (!addon.name || addon.price === undefined) {
      toast({ title: 'Error', description: 'Name and price are required', variant: 'destructive' });
      return;
    }

    const addonData = {
      name: addon.name,
      description: addon.description,
      price: addon.price,
      price_suffix: addon.price_suffix,
      icon: addon.icon || 'star',
      is_ai_feature: addon.is_ai_feature || false,
    };

    if (addon.id) {
      const { error } = await supabase
        .from('service_addons')
        .update(addonData)
        .eq('id', addon.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase
        .from('service_addons')
        .insert([{ ...addonData, display_order: addons.length + 1 }]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Success', description: 'Add-on saved!' });
    setEditingAddon(null);
    setNewAddon(false);
    fetchAddons();
  };

  const deleteAddon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this add-on?')) return;

    const { error } = await supabase.from('service_addons').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Deleted', description: 'Add-on removed.' });
    fetchAddons();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Service Add-ons</h2>
        <Button variant="gold" onClick={() => setNewAddon(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Add-on
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {(newAddon || editingAddon) && (
            <AddonForm
              addon={editingAddon}
              onSave={saveAddon}
              onCancel={() => { setEditingAddon(null); setNewAddon(false); }}
            />
          )}

          {addons.map((addon) => (
            <motion.div
              key={addon.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl p-4 border border-border flex items-center gap-4"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{addon.name}</h3>
                  {addon.is_ai_feature && <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded">AI Feature</span>}
                </div>
                <p className="text-lg font-bold text-accent">
                  Ksh {addon.price.toLocaleString()}{addon.price_suffix && <span className="text-sm font-normal text-muted-foreground">{addon.price_suffix}</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setEditingAddon(addon)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => deleteAddon(addon.id)}>
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

function AddonForm({
  addon,
  onSave,
  onCancel,
}: {
  addon: ServiceAddon | null;
  onSave: (a: Partial<ServiceAddon>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: addon?.name || '',
    description: addon?.description || '',
    price: addon?.price?.toString() || '',
    price_suffix: addon?.price_suffix || '',
    icon: addon?.icon || 'star',
    is_ai_feature: addon?.is_ai_feature || false,
  });

  return (
    <div className="bg-card rounded-xl p-6 border-2 border-accent">
      <h3 className="text-lg font-semibold mb-4">{addon ? 'Edit' : 'Add'} Add-on</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Add-on Name</Label>
          <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Icon Name (Lucide)</Label>
          <Input value={formData.icon} onChange={e => setFormData(p => ({ ...p, icon: e.target.value }))} placeholder="star, sparkles, zap" />
        </div>
        <div className="space-y-2">
          <Label>Price (Ksh)</Label>
          <Input type="number" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Price Suffix</Label>
          <Input value={formData.price_suffix} onChange={e => setFormData(p => ({ ...p, price_suffix: e.target.value }))} placeholder="/month or one-time" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_ai"
            checked={formData.is_ai_feature}
            onChange={e => setFormData(p => ({ ...p, is_ai_feature: e.target.checked }))}
            className="h-4 w-4"
          />
          <Label htmlFor="is_ai">AI-Powered Feature</Label>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="gold" onClick={() => onSave({
          ...addon,
          ...formData,
          price: parseFloat(formData.price) || 0,
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
