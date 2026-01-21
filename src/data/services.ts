export interface ServiceFeature {
  name: string;
  included: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  deliveryTime: string;
  features: ServiceFeature[];
  outcome: string;
  image: string;
}

export const serviceCategories = [
  { id: 'websites', name: 'Website Development', icon: 'Globe' },
  { id: 'software', name: 'Software Systems', icon: 'Monitor' },
  { id: 'ecommerce', name: 'E-commerce & POS', icon: 'ShoppingCart' },
  { id: 'branding', name: 'Branding & Design', icon: 'Palette' },
  { id: 'api', name: 'API Integrations', icon: 'Link' },
] as const;

export const services: Service[] = [
  // Website Development
  {
    id: 'corporate-website',
    name: 'Corporate Website',
    category: 'websites',
    shortDescription: 'Professional online presence for established businesses and institutions',
    fullDescription: 'A premium corporate website that builds trust and credibility with your target audience. Designed to convert visitors into qualified leads with strategic call-to-actions and professional aesthetics.',
    deliveryTime: '14-21 Days',
    features: [
      { name: 'Custom brand-aligned UI/UX', included: true },
      { name: 'Fully responsive design', included: true },
      { name: 'Company profile & vision pages', included: true },
      { name: 'Services & solutions showcase', included: true },
      { name: 'Team / leadership profiles', included: true },
      { name: 'Contact & inquiry forms', included: true },
      { name: 'Google Maps & WhatsApp chat', included: true },
      { name: 'SEO-ready structure', included: true },
      { name: 'High-speed optimization', included: true },
      { name: 'Admin dashboard (CMS)', included: true },
      { name: 'Social media integration', included: true },
      { name: 'Security best practices', included: true },
    ],
    outcome: 'Builds trust and credibility. Converts visitors into leads.',
    image: 'mockup-corporate-website',
  },
  {
    id: 'small-business-website',
    name: 'Small Business Website',
    category: 'websites',
    shortDescription: 'Clean and effective online presence for startups and SMEs',
    fullDescription: 'A modern, mobile-first website designed specifically for startups and small-to-medium enterprises. Get online visibility and a professional brand image without the enterprise price tag.',
    deliveryTime: '7-14 Days',
    features: [
      { name: 'Modern mobile-first design', included: true },
      { name: 'Business profile pages', included: true },
      { name: 'Services section', included: true },
      { name: 'Contact & inquiry forms', included: true },
      { name: 'Social media links', included: true },
      { name: 'Google Business integration', included: true },
      { name: 'Basic SEO setup', included: true },
      { name: 'Easy content updates', included: true },
    ],
    outcome: 'Online visibility. Professional brand image.',
    image: 'mockup-small-business',
  },
  {
    id: 'ecommerce-website',
    name: 'E-commerce Website',
    category: 'ecommerce',
    shortDescription: 'Sell products and services online with automation',
    fullDescription: 'A complete online store solution that enables 24/7 automated sales. Features product management, secure payments, inventory control, and comprehensive analytics to scale your business.',
    deliveryTime: '21-30 Days',
    features: [
      { name: 'Custom storefront design', included: true },
      { name: 'Product & category management', included: true },
      { name: 'Shopping cart & checkout', included: true },
      { name: 'Mpesa & payment integration', included: true },
      { name: 'Order & invoice management', included: true },
      { name: 'Inventory control', included: true },
      { name: 'Customer accounts', included: true },
      { name: 'Email & SMS notifications', included: true },
      { name: 'Sales analytics & reports', included: true },
      { name: 'Secure admin dashboard', included: true },
    ],
    outcome: '24/7 automated sales. Business scalability.',
    image: 'mockup-ecommerce-website',
  },
  // Software Systems
  {
    id: 'school-management-system',
    name: 'School Management System',
    category: 'software',
    shortDescription: 'Complete education institution management platform',
    fullDescription: 'An all-in-one school management solution that streamlines administrative tasks, improves communication, and enhances the learning experience for students, teachers, and parents.',
    deliveryTime: '14-21 Days',
    features: [
      { name: 'Student Management', included: true },
      { name: 'Fee Management', included: true },
      { name: 'Results & Reports', included: true },
      { name: 'Teacher Accounts', included: true },
      { name: 'Parent Portal', included: true },
      { name: 'SMS & Email Notifications', included: true },
      { name: 'Attendance Tracking', included: true },
      { name: 'Timetable Management', included: true },
    ],
    outcome: 'Streamlined operations. Better parent-school communication.',
    image: 'mockup-school-system',
  },
  {
    id: 'hospital-management-system',
    name: 'Hospital Management System',
    category: 'software',
    shortDescription: 'Healthcare facility management solution',
    fullDescription: 'A comprehensive hospital management system that handles patient records, appointments, billing, pharmacy, and reporting. Designed for clinics and hospitals of all sizes.',
    deliveryTime: '14-21 Days',
    features: [
      { name: 'Patient Records', included: true },
      { name: 'Appointment Scheduling', included: true },
      { name: 'Billing & Invoicing', included: true },
      { name: 'Pharmacy Management', included: true },
      { name: 'Reports & Analytics', included: true },
      { name: 'User Roles & Permissions', included: true },
      { name: 'Lab Results Management', included: true },
      { name: 'Insurance Integration', included: true },
    ],
    outcome: 'Efficient healthcare delivery. Reduced paperwork.',
    image: 'mockup-hospital-system',
  },
  {
    id: 'pos-system',
    name: 'POS System',
    category: 'ecommerce',
    shortDescription: 'Point of sale solution for retail businesses',
    fullDescription: 'A modern point of sale system designed for retail businesses. Features intuitive sales management, real-time inventory tracking, Mpesa integration, and detailed reporting.',
    deliveryTime: '5-7 Days',
    features: [
      { name: 'Sales Management', included: true },
      { name: 'Stock Control', included: true },
      { name: 'Mpesa Integration', included: true },
      { name: 'Receipt Printing', included: true },
      { name: 'Reports & Analytics', included: true },
      { name: 'Multi-user Support', included: true },
      { name: 'Customer Management', included: true },
      { name: 'Expense Tracking', included: true },
    ],
    outcome: 'Faster checkouts. Real-time inventory visibility.',
    image: 'mockup-pos-system',
  },
  // API Integrations
  {
    id: 'mpesa-integration',
    name: 'Mpesa API Integration',
    category: 'api',
    shortDescription: 'Seamless mobile money payment integration',
    fullDescription: 'Integrate Mpesa payments into your website or application. Support for STK Push, C2B, B2C, and transaction status queries.',
    deliveryTime: '3-5 Days',
    features: [
      { name: 'STK Push Integration', included: true },
      { name: 'C2B Payment Support', included: true },
      { name: 'B2C Disbursement', included: true },
      { name: 'Transaction Status Queries', included: true },
      { name: 'Callback Handling', included: true },
      { name: 'Documentation & Support', included: true },
    ],
    outcome: 'Accept mobile payments. Automated reconciliation.',
    image: 'mockup-ecommerce-website',
  },
  // Branding
  {
    id: 'logo-design',
    name: 'Logo Design',
    category: 'branding',
    shortDescription: 'Professional brand identity design',
    fullDescription: 'Get a unique, memorable logo that represents your brand. Includes multiple concepts, revisions, and final files in all formats.',
    deliveryTime: '3-5 Days',
    features: [
      { name: 'Multiple Design Concepts', included: true },
      { name: 'Unlimited Revisions', included: true },
      { name: 'High-Resolution Files', included: true },
      { name: 'Vector Source Files', included: true },
      { name: 'Brand Color Palette', included: true },
      { name: 'Social Media Kit', included: true },
    ],
    outcome: 'Memorable brand identity. Professional image.',
    image: 'mockup-corporate-website',
  },
  {
    id: 'company-profile',
    name: 'Company Profile Design',
    category: 'branding',
    shortDescription: 'Professional company profile document',
    fullDescription: 'A beautifully designed company profile that showcases your business, services, achievements, and team. Perfect for client presentations and tenders.',
    deliveryTime: '5-7 Days',
    features: [
      { name: 'Custom Layout Design', included: true },
      { name: 'Content Writing Assistance', included: true },
      { name: 'Professional Photography', included: true },
      { name: 'Print-Ready Files', included: true },
      { name: 'Digital PDF Version', included: true },
      { name: 'Unlimited Revisions', included: true },
    ],
    outcome: 'Win more clients. Professional presentations.',
    image: 'mockup-corporate-website',
  },
];

export const getServicesByCategory = (categoryId: string): Service[] => {
  return services.filter(service => service.category === categoryId);
};

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};
