-- Create clients table to track leads from quotations and contacts
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  source TEXT NOT NULL DEFAULT 'quotation', -- 'quotation', 'contact', 'manual'
  interested_services TEXT[], -- Array of service IDs/names they showed interest in
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX idx_clients_email ON public.clients(email);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage clients" 
ON public.clients 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert clients" 
ON public.clients 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create whatsapp_templates table for message templates
CREATE TABLE public.whatsapp_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general', -- 'quote_followup', 'demo_reminder', 'order_confirmation', 'general'
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage templates" 
ON public.whatsapp_templates 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view templates" 
ON public.whatsapp_templates 
FOR SELECT 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_whatsapp_templates_updated_at
BEFORE UPDATE ON public.whatsapp_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create business_settings table for admin configuration
CREATE TABLE public.business_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  category TEXT NOT NULL DEFAULT 'general', -- 'general', 'whatsapp', 'branding', 'pdf'
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage settings" 
ON public.business_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view settings" 
ON public.business_settings 
FOR SELECT 
USING (true);

-- Insert default business settings
INSERT INTO public.business_settings (key, value, category) VALUES
('business_name', 'JL Software & Digital Systems', 'general'),
('business_phone', '+254 700 000 000', 'general'),
('business_email', 'info@jlsoftware.co.ke', 'general'),
('whatsapp_number', '254700000000', 'whatsapp'),
('whatsapp_enabled', 'true', 'whatsapp');

-- Insert default WhatsApp templates
INSERT INTO public.whatsapp_templates (name, category, content, display_order) VALUES
('Quote Follow-up', 'quote_followup', 'Hi {{name}}! 👋 Thank you for requesting a quote for {{service}}. I wanted to follow up and see if you have any questions. Would you like to schedule a quick call to discuss your project?', 1),
('Demo Reminder', 'demo_reminder', 'Hi {{name}}! 👋 Just a reminder about your scheduled demo for {{service}}. Looking forward to showing you how it works!', 2),
('Order Confirmation', 'order_confirmation', 'Hi {{name}}! 🎉 Great news! Your order for {{service}} has been confirmed. Our team will start working on it right away. Expected delivery: {{delivery_time}}.', 3),
('Welcome Message', 'general', 'Hi {{name}}! 👋 Welcome to JL Software & Digital Systems. How can we help you today?', 4);

-- Add trigger for updated_at
CREATE TRIGGER update_business_settings_updated_at
BEFORE UPDATE ON public.business_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();