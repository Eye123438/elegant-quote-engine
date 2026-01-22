import { motion } from 'framer-motion';
import { Building2, Target, Lightbulb, Users, Award, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Projects Delivered', value: '150+' },
  { label: 'Happy Clients', value: '100+' },
  { label: 'Years Experience', value: '10+' },
  { label: 'Team Members', value: '15+' },
];

const values = [
  {
    icon: Target,
    title: 'Client-Focused',
    description: 'Your success is our priority. We listen, understand, and deliver solutions tailored to your needs.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We stay ahead of technology trends to bring you cutting-edge solutions that drive growth.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'Every line of code and every design element is crafted with precision and attention to detail.',
  },
  {
    icon: Clock,
    title: 'Reliability',
    description: 'We deliver on time, every time. Our commitment to deadlines is unwavering.',
  },
];

const process = [
  { step: 1, title: 'Discovery', description: 'We learn about your business, goals, and challenges.' },
  { step: 2, title: 'Planning', description: 'We create a detailed roadmap and technical specifications.' },
  { step: 3, title: 'Design', description: 'Our designers craft beautiful, user-friendly interfaces.' },
  { step: 4, title: 'Development', description: 'Our developers build robust, scalable solutions.' },
  { step: 5, title: 'Testing', description: 'Rigorous testing ensures quality and reliability.' },
  { step: 6, title: 'Launch', description: 'We deploy and provide ongoing support.' },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 25% 75%, hsl(38 92% 50% / 0.3) 0%, transparent 50%)'
            }} />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">About Us</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                  Powering Digital
                  <span className="block gradient-text">Transformation in Kenya</span>
                </h1>
                
                <p className="text-lg text-primary-foreground/70 mb-8">
                  JL Software & Digital Systems is a leading software development company based in Kerugoya, Kenya. We specialize in creating custom websites, management systems, and digital solutions that help businesses thrive in the modern digital economy.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button variant="gold" size="lg" asChild>
                    <Link to="/team">
                      Meet Our Team
                      <Users className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                    <div className="text-primary-foreground/70 text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary mb-6">
                  <Target className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower businesses across Kenya and East Africa with innovative digital solutions that drive growth, efficiency, and success. We are committed to delivering exceptional software products and services that exceed client expectations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent mb-6">
                  <Lightbulb className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the leading digital transformation partner in East Africa, recognized for innovation, quality, and the positive impact we create for businesses and communities through technology.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at JL Software & Digital Systems.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-card border border-border text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A proven methodology that ensures successful project delivery every time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {process.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-card rounded-2xl p-6 shadow-card border border-border h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve your digital goals.
            </p>
            <Button variant="gold" size="lg" asChild>
              <Link to="/services">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
