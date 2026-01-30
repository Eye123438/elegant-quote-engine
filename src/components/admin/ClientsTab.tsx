import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Mail, 
  Phone, 
  Building, 
  MessageSquare,
  FileText,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Client {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  source: string;
  interested_services: string[] | null;
  notes: string | null;
  created_at: string;
}

interface QuotationHistory {
  id: string;
  service_name: string;
  status: string;
  created_at: string;
}

export function ClientsTab() {
  const [clients, setClients] = useState<Client[]>([]);
  const [quotations, setQuotations] = useState<Record<string, QuotationHistory[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    // Fetch clients
    const { data: clientsData } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch quotations grouped by email for history
    const { data: quotationsData } = await supabase
      .from('quotation_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (clientsData) {
      setClients(clientsData);
    }

    // Group quotations by email
    if (quotationsData) {
      const grouped: Record<string, QuotationHistory[]> = {};
      quotationsData.forEach(q => {
        if (!grouped[q.email]) {
          grouped[q.email] = [];
        }
        grouped[q.email].push({
          id: q.id,
          service_name: q.service_name,
          status: q.status || 'pending',
          created_at: q.created_at,
        });
      });
      setQuotations(grouped);
    }

    setIsLoading(false);
  };

  const openWhatsApp = (phone: string | null, name: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${name}! This is JL Software. How can we help you today?`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || client.source === sourceFilter;
    
    return matchesSearch && matchesSource;
  });

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'quotation':
        return <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded">Quote</span>;
      case 'contact':
        return <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded">Contact</span>;
      case 'manual':
        return <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded">Manual</span>;
      default:
        return <span className="text-xs px-2 py-0.5 bg-muted rounded">{source}</span>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading clients...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">Clients & Leads</h2>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">All Sources</option>
            <option value="quotation">Quotation</option>
            <option value="contact">Contact</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Client List */}
        <div className={`${selectedClient ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-3`}>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No clients found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Clients are auto-created from quotation requests
              </p>
            </div>
          ) : (
            filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedClient(client)}
                className={`bg-card rounded-xl p-4 border transition-all cursor-pointer ${
                  selectedClient?.id === client.id 
                    ? 'border-accent shadow-lg' 
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    {client.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{client.full_name}</h3>
                      {getSourceBadge(client.source)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </span>
                      {client.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </span>
                      )}
                      {client.company_name && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {client.company_name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {client.phone && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          openWhatsApp(client.phone, client.full_name);
                        }}
                        className="text-green-500 hover:text-green-600"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Client Detail Panel */}
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-xl border border-border p-6 h-fit sticky top-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Client Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedClient(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-border">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-3">
                  {selectedClient.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <h4 className="font-semibold text-foreground">{selectedClient.full_name}</h4>
                {selectedClient.company_name && (
                  <p className="text-sm text-muted-foreground">{selectedClient.company_name}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedClient.email}`} className="text-accent hover:underline">
                    {selectedClient.email}
                  </a>
                </div>
                
                {selectedClient.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedClient.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Source: {selectedClient.source}</span>
                </div>
              </div>

              {/* Quotation History */}
              <div className="pt-4 border-t border-border">
                <h5 className="font-medium text-foreground mb-3">Quote History</h5>
                {quotations[selectedClient.email]?.length > 0 ? (
                  <div className="space-y-2">
                    {quotations[selectedClient.email].map(q => (
                      <div key={q.id} className="p-3 rounded-lg bg-muted text-sm">
                        <p className="font-medium">{q.service_name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            q.status === 'converted' ? 'bg-green-500/10 text-green-500' :
                            q.status === 'contacted' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-muted-foreground/10 text-muted-foreground'
                          }`}>
                            {q.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(q.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No quotations yet</p>
                )}
              </div>

              {/* Actions */}
              {selectedClient.phone && (
                <Button
                  variant="gold"
                  className="w-full mt-4"
                  onClick={() => openWhatsApp(selectedClient.phone, selectedClient.full_name)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
