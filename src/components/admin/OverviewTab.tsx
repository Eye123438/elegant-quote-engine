import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Monitor, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, isAfter } from 'date-fns';

interface DashboardStats {
  totalQuotations: number;
  newLeads: number;
  activeDemos: number;
  totalClients: number;
}

interface RecentActivity {
  id: string;
  type: 'quotation' | 'client' | 'demo';
  title: string;
  subtitle: string;
  timestamp: string;
}

export function OverviewTab() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuotations: 0,
    newLeads: 0,
    activeDemos: 0,
    totalClients: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const sevenDaysAgo = subDays(new Date(), 7).toISOString();

    const [quotationsRes, clientsRes, demosRes] = await Promise.all([
      supabase.from('quotation_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
      supabase.from('demo_systems').select('*').eq('is_active', true),
    ]);

    const quotations = quotationsRes.data || [];
    const clients = clientsRes.data || [];
    const demos = demosRes.data || [];

    // Calculate new leads (last 7 days)
    const newLeads = quotations.filter(q => 
      isAfter(new Date(q.created_at), new Date(sevenDaysAgo))
    ).length;

    setStats({
      totalQuotations: quotations.length,
      newLeads,
      activeDemos: demos.length,
      totalClients: clients.length,
    });

    // Build recent activity feed
    const activities: RecentActivity[] = [];
    
    quotations.slice(0, 5).forEach(q => {
      activities.push({
        id: q.id,
        type: 'quotation',
        title: `New quote request from ${q.full_name}`,
        subtitle: q.service_name,
        timestamp: q.created_at,
      });
    });

    clients.slice(0, 3).forEach(c => {
      activities.push({
        id: c.id,
        type: 'client',
        title: `New client: ${c.full_name}`,
        subtitle: c.company_name || c.email,
        timestamp: c.created_at,
      });
    });

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setRecentActivity(activities.slice(0, 8));
    setIsLoading(false);
  };

  const statCards = [
    {
      label: 'Total Quotations',
      value: stats.totalQuotations,
      icon: FileText,
      color: 'bg-blue-500/10 text-blue-500',
      trend: '+12%',
    },
    {
      label: 'New Leads (7 days)',
      value: stats.newLeads,
      icon: TrendingUp,
      color: 'bg-green-500/10 text-green-500',
      trend: '+8%',
    },
    {
      label: 'Active Demos',
      value: stats.activeDemos,
      icon: Monitor,
      color: 'bg-purple-500/10 text-purple-500',
      trend: null,
    },
    {
      label: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-accent/10 text-accent',
      trend: '+5%',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quotation': return FileText;
      case 'client': return Users;
      case 'demo': return Monitor;
      default: return MessageSquare;
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
              {stat.trend && (
                <span className="flex items-center text-sm text-green-500 font-medium">
                  <ArrowUpRight className="h-4 w-4" />
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed and Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'quotation' ? 'bg-blue-500/10 text-blue-500' :
                      activity.type === 'client' ? 'bg-green-500/10 text-green-500' :
                      'bg-purple-500/10 text-purple-500'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock className="h-3 w-3" />
                      {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Quick Summary</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-accent mt-1">
                {stats.totalQuotations > 0 
                  ? Math.round((stats.totalClients / stats.totalQuotations) * 100) 
                  : 0}%
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Avg. Response Time</p>
              <p className="text-2xl font-bold text-foreground mt-1">2.4h</p>
            </div>
            
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.newLeads} leads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
