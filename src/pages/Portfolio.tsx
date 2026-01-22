import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ExternalLink, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface PortfolioProject {
  id: string;
  name: string;
  category: string;
  description: string | null;
  technologies: string[] | null;
  image_url: string | null;
  is_featured: boolean;
}

const categories = ['All', 'Website', 'Software', 'E-commerce', 'POS'];

export default function Portfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 75% 25%, hsl(38 92% 50% / 0.3) 0%, transparent 50%)'
            }} />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6"
            >
              <Briefcase className="h-4 w-4" />
              <span className="text-sm font-medium">Our Work</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6"
            >
              Featured Projects &
              <span className="block gradient-text">Success Stories</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg text-primary-foreground/70"
            >
              Explore our portfolio of websites, software systems, and digital solutions delivered to businesses across Kenya.
            </motion.p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-sm z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'gold' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="flex-shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-muted" />
                    <div className="p-6">
                      <div className="h-6 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground">No projects match the selected category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary flex items-center justify-center">
                            <Briefcase className="h-12 w-12 text-primary-foreground/50" />
                          </div>
                        )}
                        {project.is_featured && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary">{project.category}</Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                          {project.name}
                        </h3>
                        
                        {project.description && (
                          <p className="text-muted-foreground text-sm mb-4 flex-1">
                            {project.description}
                          </p>
                        )}
                        
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {project.technologies.slice(0, 4).map((tech, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help bring your digital vision to life.
            </p>
            <Button variant="gold" size="lg" asChild>
              <a href="/services">
                Get Free Quotation
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
