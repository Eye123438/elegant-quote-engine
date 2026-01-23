import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Plus, Pencil, Trash2, Save, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  display_order: number;
}

interface PortfolioProject {
  id: string;
  name: string;
  category: string;
  description: string | null;
  technologies: string[] | null;
  image_url: string | null;
  display_order: number;
  is_featured: boolean;
}

export default function AdminDashboard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [newTeamMember, setNewTeamMember] = useState(false);
  const [newProject, setNewProject] = useState(false);
  
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [teamRes, projectsRes] = await Promise.all([
      supabase.from('team_members').select('*').order('display_order'),
      supabase.from('portfolio_projects').select('*').order('display_order'),
    ]);

    if (teamRes.data) setTeamMembers(teamRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Team Member Functions
  const saveTeamMember = async (member: Partial<TeamMember>) => {
    if (!member.full_name || !member.role) {
      toast({ title: 'Error', description: 'Name and role are required', variant: 'destructive' });
      return;
    }
    
    if (member.id) {
      const { error } = await supabase
        .from('team_members')
        .update({ full_name: member.full_name, role: member.role, bio: member.bio, image_url: member.image_url })
        .eq('id', member.id);
      
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase
        .from('team_members')
        .insert([{ 
          full_name: member.full_name!, 
          role: member.role!, 
          bio: member.bio, 
          image_url: member.image_url, 
          display_order: teamMembers.length + 1 
        }]);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }
    
    toast({ title: 'Success', description: 'Team member saved!' });
    setEditingTeam(null);
    setNewTeamMember(false);
    fetchData();
  };

  const deleteTeamMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Deleted', description: 'Team member removed.' });
    fetchData();
  };

  // Project Functions
  const saveProject = async (project: Partial<PortfolioProject>) => {
    if (!project.name || !project.category) {
      toast({ title: 'Error', description: 'Name and category are required', variant: 'destructive' });
      return;
    }
    
    if (project.id) {
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ name: project.name, category: project.category, description: project.description, technologies: project.technologies, image_url: project.image_url, is_featured: project.is_featured })
        .eq('id', project.id);
      
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase
        .from('portfolio_projects')
        .insert([{ 
          name: project.name!, 
          category: project.category!, 
          description: project.description, 
          technologies: project.technologies, 
          image_url: project.image_url, 
          is_featured: project.is_featured, 
          display_order: projects.length + 1 
        }]);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
    }
    
    toast({ title: 'Success', description: 'Project saved!' });
    setEditingProject(null);
    setNewProject(false);
    fetchData();
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Deleted', description: 'Project removed.' });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <span className="text-lg font-bold text-accent-foreground">JL</span>
            </div>
            <span className="font-bold">Admin Dashboard</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary-foreground/70">{user?.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="team" className="space-y-8">
          <TabsList className="bg-muted">
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          {/* Team Members Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Team Members</h2>
              <Button variant="gold" onClick={() => setNewTeamMember(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <div className="grid gap-4">
                {(newTeamMember || editingTeam) && (
                  <TeamMemberForm
                    member={editingTeam}
                    onSave={saveTeamMember}
                    onCancel={() => { setEditingTeam(null); setNewTeamMember(false); }}
                  />
                )}
                
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card rounded-xl p-4 border border-border flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground font-bold">
                          {member.full_name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{member.full_name}</h3>
                      <p className="text-sm text-accent">{member.role}</p>
                      {member.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{member.bio}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => setEditingTeam(member)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => deleteTeamMember(member.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Portfolio Projects</h2>
              <Button variant="gold" onClick={() => setNewProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <div className="grid gap-4">
                {(newProject || editingProject) && (
                  <ProjectForm
                    project={editingProject}
                    onSave={saveProject}
                    onCancel={() => { setEditingProject(null); setNewProject(false); }}
                  />
                )}
                
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card rounded-xl p-4 border border-border flex items-center gap-4"
                  >
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded">{project.category}</span>
                        {project.is_featured && <span className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded">Featured</span>}
                      </div>
                      {project.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{project.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => setEditingProject(project)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => deleteProject(project.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Team Member Form Component
function TeamMemberForm({ 
  member, 
  onSave, 
  onCancel 
}: { 
  member: TeamMember | null; 
  onSave: (m: Partial<TeamMember>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    full_name: member?.full_name || '',
    role: member?.role || '',
    bio: member?.bio || '',
    image_url: member?.image_url || '',
  });

  return (
    <div className="bg-card rounded-xl p-6 border-2 border-accent">
      <h3 className="text-lg font-semibold mb-4">{member ? 'Edit' : 'Add'} Team Member</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input value={formData.full_name} onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Image URL</Label>
          <Input value={formData.image_url} onChange={e => setFormData(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Bio</Label>
          <Textarea value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} rows={3} />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="gold" onClick={() => onSave({ ...member, ...formData })}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Project Form Component
function ProjectForm({ 
  project, 
  onSave, 
  onCancel 
}: { 
  project: PortfolioProject | null; 
  onSave: (p: Partial<PortfolioProject>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    category: project?.category || 'Website',
    description: project?.description || '',
    technologies: project?.technologies?.join(', ') || '',
    image_url: project?.image_url || '',
    is_featured: project?.is_featured || false,
  });

  return (
    <div className="bg-card rounded-xl p-6 border-2 border-accent">
      <h3 className="text-lg font-semibold mb-4">{project ? 'Edit' : 'Add'} Project</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Project Name</Label>
          <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <select 
            value={formData.category} 
            onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="Website">Website</option>
            <option value="Software">Software</option>
            <option value="E-commerce">E-commerce</option>
            <option value="POS">POS</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Image URL</Label>
          <Input value={formData.image_url} onChange={e => setFormData(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Technologies (comma-separated)</Label>
          <Input value={formData.technologies} onChange={e => setFormData(p => ({ ...p, technologies: e.target.value }))} placeholder="React, Node.js, PostgreSQL" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} />
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="featured" 
            checked={formData.is_featured} 
            onChange={e => setFormData(p => ({ ...p, is_featured: e.target.checked }))}
            className="h-4 w-4"
          />
          <Label htmlFor="featured">Featured Project</Label>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="gold" onClick={() => onSave({ 
          ...project, 
          ...formData, 
          technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
        })}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
