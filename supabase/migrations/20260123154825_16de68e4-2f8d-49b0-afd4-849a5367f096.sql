-- Create service packages table for admin-controlled pricing
CREATE TABLE public.service_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'website',
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  price_suffix TEXT DEFAULT '',
  delivery_time TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demo systems table for software demos
CREATE TABLE public.demo_systems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'software',
  description TEXT,
  demo_url TEXT,
  image_url TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create add-ons table
CREATE TABLE public.service_addons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  price_suffix TEXT DEFAULT '',
  icon TEXT DEFAULT 'star',
  is_ai_feature BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotation requests table
CREATE TABLE public.quotation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_requests ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view packages" ON public.service_packages FOR SELECT USING (true);
CREATE POLICY "Anyone can view demos" ON public.demo_systems FOR SELECT USING (true);
CREATE POLICY "Anyone can view addons" ON public.service_addons FOR SELECT USING (true);

-- Admin management policies
CREATE POLICY "Admins can manage packages" ON public.service_packages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage demos" ON public.demo_systems FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage addons" ON public.service_addons FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage quotations" ON public.quotation_requests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit quotation requests
CREATE POLICY "Anyone can submit quotation requests" ON public.quotation_requests FOR INSERT WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_service_packages_updated_at BEFORE UPDATE ON public.service_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demo_systems_updated_at BEFORE UPDATE ON public.demo_systems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_addons_updated_at BEFORE UPDATE ON public.service_addons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();