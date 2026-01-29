import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Mwangi',
    role: 'Managing Director',
    company: 'TechVentures Kenya',
    content: 'JL Software delivered our e-commerce platform ahead of schedule. Their attention to detail and understanding of the Kenyan market is exceptional. Sales increased by 40% within the first month!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Grace Wanjiku',
    role: 'School Administrator',
    company: 'Sunrise Academy',
    content: 'The school management system has transformed how we operate. Fee tracking, student records, and parent communication are now seamless. Highly recommend their services!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Peter Ochieng',
    role: 'Business Owner',
    company: 'Metro Supermarket',
    content: 'Their POS system with M-Pesa integration is a game-changer. Real-time inventory tracking and easy-to-use interface. Best investment for our retail business.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Sarah Kamau',
    role: 'CEO',
    company: 'Healthcare Solutions Ltd',
    content: 'Professional, responsive, and skilled. They built our hospital management system with great care for patient data security. The support team is always available.',
    rating: 5,
  },
  {
    id: '5',
    name: 'David Kimani',
    role: 'Operations Manager',
    company: 'Safari Tours Kenya',
    content: 'Our booking website looks stunning and works flawlessly. The team understood exactly what we needed and delivered beyond expectations. 100% satisfied!',
    rating: 5,
  },
  {
    id: '6',
    name: 'Mary Njeri',
    role: 'Finance Director',
    company: 'BuildRight Construction',
    content: 'The custom software they developed streamlined our project management and accounting. Professional team that delivers quality work on time.',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-4 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from businesses across Kenya who have transformed their operations with our solutions
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-accent/30" />
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-primary border-2 border-card flex items-center justify-center text-xs text-primary-foreground font-medium"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="ml-2 flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold text-foreground">4.9/5</span>
              <span className="text-muted-foreground">from 150+ clients</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
