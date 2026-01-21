import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Monitor, ShoppingCart, Palette, Link as LinkIcon, Search } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceModal } from '@/components/services/ServiceModal';
import { QuotationForm } from '@/components/quotation/QuotationForm';
import { Input } from '@/components/ui/input';
import { services, serviceCategories, getServicesByCategory, Service } from '@/data/services';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, typeof Globe> = {
  websites: Globe,
  software: Monitor,
  ecommerce: ShoppingCart,
  branding: Palette,
  api: LinkIcon,
};

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = searchParams.get('category') || 'all';

  const filteredServices = useMemo(() => {
    let result = activeCategory === 'all' ? services : getServicesByCategory(activeCategory);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        service =>
          service.name.toLowerCase().includes(query) ||
          service.shortDescription.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleGetQuotation = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(false);
    setIsQuotationOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Services Marketplace
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Browse our complete range of digital services. Select any service to view features and generate an instant quotation.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-card/90 backdrop-blur-sm border-0 text-foreground placeholder:text-muted-foreground rounded-xl shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-muted/30 border-b border-border sticky top-20 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => handleCategoryChange('all')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200",
                activeCategory === 'all'
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-foreground hover:border-accent"
              )}
            >
              All Services
            </button>
            {serviceCategories.map((category) => {
              const Icon = categoryIcons[category.id] || Globe;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200",
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card border border-border text-foreground hover:border-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                No services found matching your criteria.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  onViewDetails={handleViewDetails}
                  onGetQuotation={handleGetQuotation}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't see exactly what you need? We specialize in custom digital solutions tailored to your specific business requirements.
            </p>
            <a
              href="mailto:info@jlsoftware.co.ke?subject=Custom Project Inquiry"
              className="inline-flex items-center justify-center h-14 px-10 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg transition-all duration-200"
            >
              Contact Us for Custom Projects
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGetQuotation={handleGetQuotation}
      />

      <QuotationForm
        service={selectedService}
        isOpen={isQuotationOpen}
        onClose={() => setIsQuotationOpen(false)}
      />
    </div>
  );
}
