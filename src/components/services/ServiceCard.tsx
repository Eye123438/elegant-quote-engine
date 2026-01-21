import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Service } from '@/data/services';
import { cn } from '@/lib/utils';

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

interface ServiceCardProps {
  service: Service;
  onViewDetails: (service: Service) => void;
  onGetQuotation: (service: Service) => void;
  index?: number;
}

export function ServiceCard({ service, onViewDetails, onGetQuotation, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageMap[service.image] || mockupCorporate}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          
          {/* Delivery Time Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground">
            <Clock className="h-3.5 w-3.5 text-accent" />
            {service.deliveryTime}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
            {service.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {service.shortDescription}
          </p>
          
          {/* Features preview */}
          <div className="flex flex-wrap gap-2 mb-6">
            {service.features.slice(0, 3).map((feature, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
              >
                {feature.name}
              </span>
            ))}
            {service.features.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent font-medium">
                +{service.features.length - 3} more
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails(service)}
            >
              View Features
            </Button>
            <Button
              variant="gold"
              size="sm"
              className="flex-1"
              onClick={() => onGetQuotation(service)}
            >
              Get Quote
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
