import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Service } from '@/data/services';

// Import all mockup images
import mockupCorporate from '@/assets/mockup-corporate-website.jpg';
import mockupEcommerce from '@/assets/mockup-ecommerce-website.jpg';
import mockupSchool from '@/assets/mockup-school-system.jpg';
import mockupHospital from '@/assets/mockup-hospital-system.jpg';
import mockupPos from '@/assets/mockup-pos-system.jpg';
import mockupSmallBusiness from '@/assets/mockup-small-business.jpg';

const imageMap: Record<string, string> = {
  'mockup-corporate-website': mockupCorporate,
  'mockup-ecommerce-website': mockupEcommerce,
  'mockup-school-system': mockupSchool,
  'mockup-hospital-system': mockupHospital,
  'mockup-pos-system': mockupPos,
  'mockup-small-business': mockupSmallBusiness,
};

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onGetQuotation: (service: Service) => void;
}

export function ServiceModal({ service, isOpen, onClose, onGetQuotation }: ServiceModalProps) {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header with Image */}
            <div className="relative h-56 md:h-64 flex-shrink-0">
              <img
                src={imageMap[service.image] || mockupCorporate}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                    {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-card-foreground/80">
                    <Clock className="h-4 w-4" />
                    {service.deliveryTime}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{service.name}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-muted-foreground mb-8">{service.fullDescription}</p>

              {/* Features Grid */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  What's Included
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                    >
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-sm text-foreground">{feature.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Outcome */}
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <h4 className="text-sm font-semibold text-accent mb-1">Expected Outcome</h4>
                <p className="text-foreground">{service.outcome}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-6 border-t border-border bg-muted/30">
              <Button
                variant="gold"
                size="xl"
                className="w-full"
                onClick={() => onGetQuotation(service)}
              >
                Generate Quotation
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
