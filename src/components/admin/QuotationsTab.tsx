import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Phone, 
  Mail, 
  Building,
  MessageSquare,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface QuotationRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  service_id: string;
  service_name: string;
  notes: string | null;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'New', icon: Clock, color: 'bg-yellow-500/10 text-yellow-500' },
  { value: 'contacted', label: 'Contacted', icon: Phone, color: 'bg-blue-500/10 text-blue-500' },
  { value: 'converted', label: 'Converted', icon: CheckCircle, color: 'bg-green-500/10 text-green-500' },
  { value: 'closed', label: 'Closed', icon: XCircle, color: 'bg-muted-foreground/10 text-muted-foreground' },
];

export function QuotationsTab() {
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    const { data, error } = await supabase
      .from('quotation_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setQuotations(data || []);
    setIsLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('quotation_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Updated', description: 'Status updated successfully' });
    fetchQuotations();
  };

  const openWhatsApp = (phone: string, name: string, service: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hi ${name}! 👋 Thank you for your interest in our ${service} package. I'd love to discuss your requirements in detail. Is now a good time to chat?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const filteredQuotations = quotations.filter(q => 
    statusFilter === 'all' || q.status === statusFilter
  );

  const getStatusInfo = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading quotations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Quotation Requests</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {quotations.length} total requests
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUS_OPTIONS.map(status => {
          const count = quotations.filter(q => q.status === status.value).length;
          return (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value === statusFilter ? 'all' : status.value)}
              className={`p-4 rounded-xl border transition-all ${
                statusFilter === status.value 
                  ? 'border-accent bg-accent/5' 
                  : 'border-border bg-card hover:border-accent/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-8 w-8 rounded-lg ${status.color} flex items-center justify-center`}>
                  <status.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground">{status.label}</p>
            </button>
          );
        })}
      </div>

      {/* Quotations List */}
      <div className="space-y-3">
        {filteredQuotations.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No quotation requests found</p>
          </div>
        ) : (
          filteredQuotations.map((quotation, index) => {
            const statusInfo = getStatusInfo(quotation.status);
            const isExpanded = expandedId === quotation.id;

            return (
              <motion.div
                key={quotation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                {/* Main Row */}
                <div 
                  className="p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : quotation.id)}
                >
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    {quotation.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{quotation.full_name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-accent truncate">{quotation.service_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(quotation.created_at), 'MMM d, yyyy • HH:mm')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openWhatsApp(quotation.phone, quotation.full_name, quotation.service_name);
                      }}
                      className="text-green-500 hover:text-green-600"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border"
                  >
                    <div className="p-4 bg-muted/30 space-y-4">
                      {/* Contact Info */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${quotation.email}`} className="text-accent hover:underline">
                            {quotation.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{quotation.phone}</span>
                        </div>
                        {quotation.company_name && (
                          <div className="flex items-center gap-2 text-sm sm:col-span-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{quotation.company_name}</span>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {quotation.notes && (
                        <div className="p-3 bg-card rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Project Notes:</p>
                          <p className="text-sm">{quotation.notes}</p>
                        </div>
                      )}

                      {/* Status Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-sm text-muted-foreground mr-2">Update Status:</span>
                        {STATUS_OPTIONS.map(status => (
                          <Button
                            key={status.value}
                            variant={quotation.status === status.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateStatus(quotation.id, status.value)}
                            className={quotation.status === status.value ? '' : 'hover:bg-muted'}
                          >
                            <status.icon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
