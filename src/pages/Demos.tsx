import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Monitor, GraduationCap, Stethoscope, ShoppingCart, Building2, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
  is_active: boolean;
}

const categoryIcons: Record<string, typeof Monitor> = {
  school: GraduationCap,
  hospital: Stethoscope,
  pos: ShoppingCart,
  hotel: Building2,
  restaurant: Utensils,
  software: Monitor,
};

// Fallback demo systems if database is empty
const fallbackDemos: DemoSystem[] = [
  {
    id: '1',
    name: 'School Management System',
    slug: 'school-management',
    category: 'school',
    description: 'Complete school administration with student management, fee tracking, results, attendance, and parent portal.',
    demo_url: '#',
    image_url: null,
    features: ['Student Records', 'Fee Management', 'Results & Reports', 'Parent Portal', 'SMS Notifications'],
    is_active: true,
  },
  {
    id: '2',
    name: 'Hospital Management System',
    slug: 'hospital-management',
    category: 'hospital',
    description: 'Healthcare facility management with patient records, appointments, billing, pharmacy, and lab integration.',
    demo_url: '#',
    image_url: null,
    features: ['Patient Records', 'Appointments', 'Billing & Invoicing', 'Pharmacy', 'Lab Results'],
    is_active: true,
  },
  {
    id: '3',
    name: 'POS System',
    slug: 'pos-system',
    category: 'pos',
    description: 'Modern point of sale with inventory management, M-Pesa integration, sales tracking, and reporting.',
    demo_url: '#',
    image_url: null,
    features: ['Sales Management', 'Inventory Control', 'M-Pesa Integration', 'Receipt Printing', 'Reports'],
    is_active: true,
  },
  {
    id: '4',
    name: 'Hotel Management System',
    slug: 'hotel-management',
    category: 'hotel',
    description: 'Hotel operations management with room booking, guest management, billing, and housekeeping.',
    demo_url: '#',
    image_url: null,
    features: ['Room Booking', 'Guest Management', 'Billing', 'Housekeeping', 'Reports'],
    is_active: true,
  },
  {
    id: '5',
    name: 'Restaurant POS',
    slug: 'restaurant-pos',
    category: 'restaurant',
    description: 'Restaurant-specific POS with table management, kitchen display, order tracking, and inventory.',
    demo_url: '#',
    image_url: null,
    features: ['Table Management', 'Kitchen Display', 'Order Tracking', 'Inventory', 'M-Pesa'],
    is_active: true,
  },
];

export default function Demos() {
  const [demos, setDemos] = useState<DemoSystem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    const { data, error } = await supabase
      .from('demo_systems')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error || !data || data.length === 0) {
      // Use fallback demos if none in database
      setDemos(fallbackDemos);
    } else {
      setDemos(data.map(d => ({
        ...d,
        features: Array.isArray(d.features) ? d.features as string[] : []
      })));
    }
    setIsLoading(false);
  };

  const categories = ['all', ...new Set(demos.map(d => d.category))];
  const filteredDemos = selectedCategory === 'all' 
    ? demos 
    : demos.filter(d => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6">
              <Monitor className="h-4 w-4" />
              Live System Demos
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Try Our Software Systems
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Explore live demos of our management systems. Experience the features before you buy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat] || Monitor;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card border border-border hover:border-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="capitalize">{cat === 'all' ? 'All Systems' : cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demos Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">Loading demos...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDemos.map((demo, index) => {
                const Icon = categoryIcons[demo.category] || Monitor;
                return (
                  <motion.div
                    key={demo.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all group"
                  >
                    {/* Demo Preview */}
                    <div className="h-48 bg-gradient-to-br from-primary to-primary/80 relative flex items-center justify-center">
                      <Icon className="h-16 w-16 text-primary-foreground/30" />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium">
                          View Demo
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent capitalize">
                          {demo.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{demo.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {demo.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {demo.features.slice(0, 3).map((feature, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                          >
                            {feature}
                          </span>
                        ))}
                        {demo.features.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded bg-muted text-accent">
                            +{demo.features.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          variant="gold"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <a href={demo.demo_url || '#'} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Try Demo
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/contact">Get Quote</Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Need a Custom System?
          </h2>
          <p className="text-muted-foreground mb-8">
            Don't see what you need? We build custom software solutions tailored to your business requirements.
          </p>
          <Link to="/contact">
            <Button variant="gold" size="lg">
              Request Custom Solution
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
