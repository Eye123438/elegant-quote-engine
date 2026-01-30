import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Building, 
  Phone, 
  Mail, 
  MessageSquare,
  Palette,
  FileText,
  Save,
  RefreshCw,
  Check,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BusinessSettings {
  [key: string]: string;
}

export function SettingsTab() {
  const [settings, setSettings] = useState<BusinessSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('business_settings')
      .select('*');

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    const settingsMap: BusinessSettings = {};
    data?.forEach(s => {
      settingsMap[s.key] = s.value || '';
    });
    setSettings(settingsMap);
    setIsLoading(false);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      category: key.startsWith('whatsapp') ? 'whatsapp' : 
                key.startsWith('pdf') ? 'pdf' : 
                key.startsWith('brand') ? 'branding' : 'general',
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('business_settings')
        .upsert(update, { onConflict: 'key' });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        setIsSaving(false);
        return;
      }
    }

    toast({ title: 'Saved!', description: 'Settings updated successfully' });
    setIsSaving(false);
    setHasChanges(false);
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your business profile and integrations
          </p>
        </div>
        {hasChanges && (
          <Button variant="gold" onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>

      {/* Business Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Business Information</h3>
            <p className="text-sm text-muted-foreground">Your company details</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              Business Name
            </Label>
            <Input
              value={settings.business_name || ''}
              onChange={e => updateSetting('business_name', e.target.value)}
              placeholder="JL Software & Digital Systems"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Business Phone
            </Label>
            <Input
              value={settings.business_phone || ''}
              onChange={e => updateSetting('business_phone', e.target.value)}
              placeholder="+254 700 000 000"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Business Email
            </Label>
            <Input
              value={settings.business_email || ''}
              onChange={e => updateSetting('business_email', e.target.value)}
              placeholder="info@jlsoftware.co.ke"
            />
          </div>
        </div>
      </motion.div>

      {/* WhatsApp Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">WhatsApp Configuration</h3>
            <p className="text-sm text-muted-foreground">WhatsApp Business settings</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm">
            <Check className="h-4 w-4" />
            Enabled
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>WhatsApp Number (with country code)</Label>
            <Input
              value={settings.whatsapp_number || ''}
              onChange={e => updateSetting('whatsapp_number', e.target.value)}
              placeholder="254700000000"
            />
            <p className="text-xs text-muted-foreground">Format: Country code + number, no spaces or symbols</p>
          </div>

          <div className="space-y-2">
            <Label>WhatsApp Status</Label>
            <select
              value={settings.whatsapp_enabled || 'true'}
              onChange={e => updateSetting('whatsapp_enabled', e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>WhatsApp Business API:</strong> For advanced automation features, connect your WhatsApp Business API.
          </p>
          <Button variant="outline" size="sm" disabled>
            <ExternalLink className="h-4 w-4 mr-2" />
            Connect API (Coming Soon)
          </Button>
        </div>
      </motion.div>

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Palette className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Branding</h3>
            <p className="text-sm text-muted-foreground">Visual identity settings (read-only)</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <div className="h-16 w-16 mx-auto rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-2">
              JL
            </div>
            <p className="text-sm font-medium">Logo</p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Primary Color</p>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary"></div>
              <span className="text-sm font-mono">--primary</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Accent Color</p>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-accent"></div>
              <span className="text-sm font-mono">--accent</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PDF Quotation Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">PDF Quotation Branding</h3>
            <p className="text-sm text-muted-foreground">Customize generated quotation PDFs</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Tagline</Label>
            <Input
              value={settings.pdf_tagline || ''}
              onChange={e => updateSetting('pdf_tagline', e.target.value)}
              placeholder="Your trusted software partner"
            />
          </div>

          <div className="space-y-2">
            <Label>Footer Text</Label>
            <Input
              value={settings.pdf_footer || ''}
              onChange={e => updateSetting('pdf_footer', e.target.value)}
              placeholder="Thank you for your business!"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Terms & Conditions</Label>
            <Input
              value={settings.pdf_terms || ''}
              onChange={e => updateSetting('pdf_terms', e.target.value)}
              placeholder="Prices valid for 30 days. 50% deposit required."
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
