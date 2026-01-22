import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  display_order: number;
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching team members:', error);
      } else {
        setTeamMembers(data || []);
      }
      setIsLoading(false);
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(38 92% 50% / 0.3) 0%, transparent 50%)'
            }} />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6"
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Our Team</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6"
            >
              Meet the Experts Behind
              <span className="block gradient-text">Your Digital Success</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg text-primary-foreground/70"
            >
              Our talented team of developers, designers, and strategists work together to deliver exceptional digital solutions for businesses across Kenya.
            </motion.p>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
                    <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4" />
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
                  </div>
                ))}
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-20">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No team members yet</h3>
                <p className="text-muted-foreground">Team information will be added soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center border border-border">
                      <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full mx-auto overflow-hidden ring-4 ring-accent/20 group-hover:ring-accent/40 transition-all">
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary flex items-center justify-center">
                              <span className="text-3xl font-bold text-primary-foreground">
                                {member.full_name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {member.full_name}
                      </h3>
                      <p className="text-accent font-medium mb-4">{member.role}</p>
                      
                      {member.bio && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Work With Us?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team is ready to help you build your next digital solution. Get in touch today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@javalab.co.ke"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-colors"
              >
                <Mail className="h-5 w-5" />
                info@javalab.co.ke
              </a>
              <a
                href="tel:+254793923427"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                <Phone className="h-5 w-5" />
                0793 923 427
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
