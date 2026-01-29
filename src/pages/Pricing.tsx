import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { supabase } from '@/integrations/supabase/client';

interface ServicePackage {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number;
  price_suffix: string | null;
  delivery_time: string | null;
  features: string[];
  is_featured: boolean;
  is_popular: boolean;
}

interface ServiceAddon {
  id: string;
  name: string;
  description: string | null;
  price: number;
  price_suffix: string | null;
  icon: string | null;
  is_ai_feature: boolean;
}

// Fallback packages inspired by Tanzia
const fallbackPackages: ServicePackage[] = [
  {
    id: '1',
    name: 'Starter',
    slug: 'starter',
    category: 'website',
    description: '1 Page • Mobile Responsive • Delivery: 3 Days',
    price: 7499,
    price_suffix: '',
    delivery_time: '3 Days',
    features: ['Landing Page Design', 'Contact Form', 'Basic SEO Setup', 'WhatsApp Button', 'Mobile Responsive'],
    is_featured: false,
    is_popular: false,
  },
  {
    id: '2',
    name: 'Pro',
    slug: 'pro',
    category: 'website',
    description: 'Up to 8 Pages • WhatsApp Chat • SEO Enhanced',
    price: 13950,
    price_suffix: '',
    delivery_time: '7 Days',
    features: ['Custom Multi-Page Website', 'Homepage Hero Animation', 'WhatsApp Integration', 'Advanced On-Page SEO', 'AI-optimized meta descriptions', 'Google Analytics Setup'],
    is_featured: true,
    is_popular: true,
  },
  {
    id: '3',
    name: 'Enterprise',
    slug: 'enterprise',
    category: 'website',
    description: 'Custom Business Solutions • E-Commerce • M-Pesa',
    price: 29999,
    price_suffix: '+',
    delivery_time: '14-21 Days',
    features: ['Fully Custom Design & Branding', 'WhatsApp & M-Pesa Integration', 'Online Payments + Inventory', 'Enterprise-Level Performance', 'Priority Support & Maintenance', 'Admin Dashboard'],
    is_featured: false,
    is_popular: false,
  },
];

const fallbackAddons: ServiceAddon[] = [
  {
    id: '1',
    name: 'Logo Design',
    description: 'Professional business logo delivered in SVG + PNG formats.',
    price: 3000,
    price_suffix: '',
    icon: 'palette',
    is_ai_feature: false,
  },
  {
    id: '2',
    name: 'Digital Marketing Starter',
    description: 'Social media management, Meta & Google Ads setup, engaging posts.',
    price: 7500,
    price_suffix: '',
    icon: 'megaphone',
    is_ai_feature: false,
  },
  {
    id: '3',
    name: 'Extra Pages',
    description: 'Add additional pages to grow your business online.',
    price: 2250,
    price_suffix: '/page',
    icon: 'file-plus',
    is_ai_feature: false,
  },
  {
    id: '4',
    name: 'AI Chatbot Integration',
    description: '24/7 AI support, instant lead qualification, automated follow-up.',
    price: 5250,
    price_suffix: '/month',
    icon: 'bot',
    is_ai_feature: true,
  },
  {
    id: '5',
    name: 'M-Pesa Integration',
    description: 'STK Push, Till & Paybill integration for seamless payments.',
    price: 5000,
    price_suffix: '',
    icon: 'credit-card',
    is_ai_feature: false,
  },
];

export default function Pricing() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [addons, setAddons] = useState<ServiceAddon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [packagesRes, addonsRes] = await Promise.all([
      supabase.from('service_packages').select('*').order('display_order'),
      supabase.from('service_addons').select('*').order('display_order'),
    ]);

    if (packagesRes.data && packagesRes.data.length > 0) {
      setPackages(packagesRes.data.map(p => ({
        ...p,
        features: Array.isArray(p.features) ? p.features as string[] : []
      })));
    } else {
      setPackages(fallbackPackages);
    }

    if (addonsRes.data && addonsRes.data.length > 0) {
      setAddons(addonsRes.data);
    } else {
      setAddons(fallbackAddons);
    }

    setIsLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE').format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Website Pricing Kenya | Affordable Web Design Packages - JL Software"
        description="Affordable website packages starting from Ksh 7,499. Professional web design for Kenyan businesses with M-Pesa integration, SEO, and more."
        keywords="website pricing Kenya, affordable web design, website packages Nairobi, cheap website Kenya, M-Pesa website integration"
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Our Website Packages
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Professional websites designed for Kenyan businesses — fast, clean and affordable
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">Loading packages...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-card rounded-2xl border ${
                    pkg.is_popular ? 'border-accent shadow-gold' : 'border-border shadow-card'
                  } overflow-hidden`}
                >
                  {pkg.is_popular && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                        <Star className="h-3 w-3" />
                        BEST VALUE
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                    
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-sm text-muted-foreground">Ksh</span>
                      <span className="text-4xl font-bold text-accent">{formatPrice(pkg.price)}</span>
                      {pkg.price_suffix && (
                        <span className="text-lg text-accent">{pkg.price_suffix}</span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={pkg.is_popular ? 'gold' : 'outline'}
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <Link to={`/contact?package=${pkg.slug}`}>
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-4 block">
              ✨ Premium Add-ons
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upgrade Your Website Package
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enhance your website with powerful add-ons designed for small businesses in Kenya
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addons.map((addon, index) => (
              <motion.div
                key={addon.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border p-6 hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    {addon.is_ai_feature ? (
                      <Zap className="h-5 w-5 text-accent" />
                    ) : (
                      <Star className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  {addon.is_ai_feature && (
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      AI POWER-UP
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-semibold text-foreground mb-2">{addon.name}</h4>
                
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-sm text-muted-foreground">Ksh</span>
                  <span className="text-xl font-bold text-accent">{formatPrice(addon.price)}</span>
                  {addon.price_suffix && (
                    <span className="text-sm text-muted-foreground">{addon.price_suffix}</span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4">{addon.description}</p>

                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/contact?addon=${addon.name}`}>Request Add-on</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Not Sure What You Need?
          </h2>
          <p className="text-muted-foreground mb-8">
            Chat with our team and we'll guide you on the best package for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg" asChild>
              <a 
                href="https://wa.me/254793923427?text=Hi!%20I%20need%20help%20choosing%20a%20website%20package" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                💬 Talk to Us on WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
