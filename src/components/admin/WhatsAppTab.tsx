import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  FileText, 
  Zap,
  Send,
  Phone,
  Clock,
  ChevronRight,
  Copy,
  Check,
  Plus,
  Pencil,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Client {
  id: string;
  full_name: string;
  phone: string | null;
  email: string;
  created_at: string;
}

interface WhatsAppTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  is_active: boolean;
  display_order: number;
}

export function WhatsAppTab() {
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [clientsRes, templatesRes] = await Promise.all([
      supabase.from('clients').select('*').not('phone', 'is', null).order('created_at', { ascending: false }),
      supabase.from('whatsapp_templates').select('*').order('display_order'),
    ]);

    if (clientsRes.data) setClients(clientsRes.data);
    if (templatesRes.data) setTemplates(templatesRes.data);
    setIsLoading(false);
  };

  const openWhatsApp = (phone: string, message: string = '') => {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = message 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/${cleanPhone}`;
    window.open(url, '_blank');
  };

  const useTemplate = (template: WhatsAppTemplate, client: Client | null) => {
    let content = template.content;
    if (client) {
      content = content.replace(/\{\{name\}\}/g, client.full_name.split(' ')[0]);
    }
    setMessageText(content);
  };

  const copyTemplate = (template: WhatsAppTemplate) => {
    navigator.clipboard.writeText(template.content);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: 'Copied!', description: 'Template copied to clipboard' });
  };

  const saveTemplate = async (template: Partial<WhatsAppTemplate>) => {
    if (!template.name || !template.content) {
      toast({ title: 'Error', description: 'Name and content are required', variant: 'destructive' });
      return;
    }

    const templateData = {
      name: template.name,
      category: template.category || 'general',
      content: template.content,
      is_active: template.is_active ?? true,
    };

    if (template.id) {
      const { error } = await supabase
        .from('whatsapp_templates')
        .update(templateData)
        .eq('id', template.id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase
        .from('whatsapp_templates')
        .insert([{ ...templateData, display_order: templates.length + 1 }]);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Saved!', description: 'Template saved successfully' });
    setEditingTemplate(null);
    setNewTemplate(false);
    fetchData();
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    
    const { error } = await supabase.from('whatsapp_templates').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Deleted', description: 'Template removed' });
    fetchData();
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading WhatsApp module...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">WhatsApp Business</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage client communications and templates
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Ready to Connect
        </div>
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="inbox" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="automation" className="gap-2">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
        </TabsList>

        {/* Inbox Tab */}
        <TabsContent value="inbox" className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Client List */}
            <div className="lg:col-span-1 bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Clients</h3>
                <p className="text-xs text-muted-foreground">{clients.length} with phone</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {clients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0 ${
                      selectedClient?.id === client.id ? 'bg-accent/10' : ''
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                      {client.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-foreground truncate text-sm">{client.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{client.phone}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Chat View */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
              {selectedClient ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {selectedClient.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{selectedClient.full_name}</p>
                      <p className="text-xs text-muted-foreground">{selectedClient.phone}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openWhatsApp(selectedClient.phone!, '')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Open WhatsApp
                    </Button>
                  </div>

                  {/* Message Area */}
                  <div className="flex-1 p-4 bg-muted/30 min-h-48 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">WhatsApp Business API integration</p>
                      <p className="text-xs mt-1">Messages will appear here once connected</p>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2 mb-3">
                      {templates.slice(0, 3).map(template => (
                        <Button
                          key={template.id}
                          variant="outline"
                          size="sm"
                          onClick={() => useTemplate(template, selectedClient)}
                        >
                          {template.name}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 min-h-10 resize-none"
                        rows={1}
                      />
                      <Button 
                        variant="gold"
                        onClick={() => {
                          if (messageText.trim()) {
                            openWhatsApp(selectedClient.phone!, messageText);
                          }
                        }}
                        disabled={!messageText.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>Select a client to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Quick message templates with placeholders</p>
            <Button variant="gold" onClick={() => setNewTemplate(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </div>

          {(newTemplate || editingTemplate) && (
            <TemplateForm
              template={editingTemplate}
              onSave={saveTemplate}
              onCancel={() => { setEditingTemplate(null); setNewTemplate(false); }}
            />
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {templates.map(template => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{template.name}</h4>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded">{template.category}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => copyTemplate(template)}>
                      {copiedId === template.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditingTemplate(template)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTemplate(template.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{template.content}</p>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Automation Rules</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Set up automatic WhatsApp messages based on triggers. Requires WhatsApp Business API connection.
                </p>
                
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">New Quote Request → Auto Reply</p>
                      <p className="text-sm text-muted-foreground">Send welcome message when someone requests a quote</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">
                      Coming Soon
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50 border border-border flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Demo Reminder</p>
                      <p className="text-sm text-muted-foreground">Send reminder 1 day before scheduled demo</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">
                      Coming Soon
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50 border border-border flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Follow-up on Pending Quotes</p>
                      <p className="text-sm text-muted-foreground">Auto follow-up after 3 days of no response</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">
                      Coming Soon
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TemplateForm({
  template,
  onSave,
  onCancel,
}: {
  template: WhatsAppTemplate | null;
  onSave: (t: Partial<WhatsAppTemplate>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    category: template?.category || 'general',
    content: template?.content || '',
    is_active: template?.is_active ?? true,
  });

  return (
    <div className="bg-card rounded-xl p-6 border-2 border-accent">
      <h3 className="text-lg font-semibold mb-4">{template ? 'Edit' : 'Add'} Template</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Template Name</Label>
          <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <select
            value={formData.category}
            onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="general">General</option>
            <option value="quote_followup">Quote Follow-up</option>
            <option value="demo_reminder">Demo Reminder</option>
            <option value="order_confirmation">Order Confirmation</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Message Content</Label>
          <Textarea 
            value={formData.content} 
            onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} 
            rows={4}
            placeholder="Use {{name}}, {{service}}, {{delivery_time}} as placeholders"
          />
          <p className="text-xs text-muted-foreground">Available: {'{{name}}'}, {'{{service}}'}, {'{{delivery_time}}'}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="gold" onClick={() => onSave({ ...template, ...formData })}>
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
