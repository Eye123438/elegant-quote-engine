import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Monitor, ShoppingCart, Palette, Link as LinkIcon, CheckCircle, Users, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceModal } from '@/components/services/ServiceModal';
import { QuotationForm } from '@/components/quotation/QuotationForm';
import { services, serviceCategories, Service } from '@/data/services';

// Import hero image
import mockupCorporate from '@/assets/mockup-corporate-website.jpg';
import mockupEcommerce from '@/assets/mockup-ecommerce-website.jpg';
import mockupSchool from '@/assets/mockup-school-system.jpg';

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '5+', label: 'Years Experience' },
  { value: '24/7', label: 'Support Available' },
];

const whyChooseUs = [
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'We deliver quality projects on time, every time. No delays, no excuses.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every project is crafted with attention to detail and modern best practices.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Our team is always available to help you succeed with your digital goals.',
  },
  {
    icon: CheckCircle,
    title: 'Proven Results',
    description: 'Our solutions drive real business growth and measurable outcomes.',
  },
];

const categoryIcons: Record<string, typeof Globe> = {
  websites: Globe,
  software: Monitor,
  ecommerce: ShoppingCart,
  branding: Palette,
  api: LinkIcon,
};

const Index = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);

  const featuredServices = services.slice(0, 6);

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 right-[15%] w-64 h-64 rounded-2xl overflow-hidden shadow-2xl hidden lg:block"
          initial={{ opacity: 0, y: 50, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src={mockupCorporate} alt="Corporate Website" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 right-[25%] w-48 h-48 rounded-2xl overflow-hidden shadow-2xl hidden lg:block"
          initial={{ opacity: 0, y: 50, rotate: 5 }}
          animate={{ opacity: 1, y: 0, rotate: 5 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <img src={mockupEcommerce} alt="E-commerce" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-[10%] w-40 h-40 rounded-2xl overflow-hidden shadow-2xl hidden lg:block"
          initial={{ opacity: 0, y: 50, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: -8 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <img src={mockupSchool} alt="School System" className="w-full h-full object-cover" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-sm font-medium mb-8">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Trusted by 150+ Businesses in Kenya
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
          >
            We Design Websites,
            <br />
            <span className="text-accent">Build Software</span>
            <br />
            & Power Digital Businesses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-primary-foreground/80 mb-10"
          >
            From stunning websites to powerful management systems, we deliver digital solutions that transform businesses and drive growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/services">
              <Button variant="hero" size="xl">
                Get Quotation
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="heroOutline" size="xl">
                View Services
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background relative -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 text-center shadow-card border border-border"
              >
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-4 block">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Digital Services Marketplace
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive range of digital solutions designed to elevate your business
            </p>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {serviceCategories.map((category) => {
              const Icon = categoryIcons[category.id] || Globe;
              return (
                <Link
                  key={category.id}
                  to={`/services?category=${category.id}`}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border hover:border-accent hover:shadow-card-hover transition-all duration-300"
                >
                  <Icon className="h-5 w-5 text-accent" />
                  <span className="font-medium text-foreground">{category.name}</span>
                </Link>
              );
            })}
          </motion.div>

          {/* Featured Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onViewDetails={handleViewDetails}
                onGetQuotation={handleGetQuotation}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/services">
              <Button variant="outline" size="lg">
                View All Services
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-4 block">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Your Trusted Partner for
                <span className="text-accent"> Digital Excellence</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                We don't just build websites and software – we craft digital experiences that drive business growth. Our team combines creativity with technical expertise to deliver solutions that exceed expectations.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={mockupCorporate}
                  alt="Our Work"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-accent rounded-2xl p-6 shadow-gold">
                <div className="text-3xl font-bold text-accent-foreground">5+</div>
                <div className="text-sm text-accent-foreground/80">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Get a professional quotation for your project today. No commitment required – just tell us what you need and we'll provide a detailed proposal.
            </p>
            <Link to="/services">
              <Button variant="hero" size="xl">
                Get Your Free Quotation
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
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
};

export default Index;
