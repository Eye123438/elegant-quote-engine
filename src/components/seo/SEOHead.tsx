import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

const defaultSEO = {
  title: 'JL Software & Digital Systems | Web Design & Software Development Kenya',
  description: 'Leading web design company in Kenya. We build professional websites, custom software, POS systems, school management systems, and e-commerce solutions. Based in Nairobi & Kerugoya.',
  keywords: 'web design Kenya, software development Kenya, web design company Nairobi, POS system Kenya, school management system Kenya, e-commerce development Kenya, M-Pesa integration, hospital management system, custom software Kerugoya',
  ogImage: '/og-image.png',
  ogType: 'website',
};

export function SEOHead({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  ogImage = defaultSEO.ogImage,
  ogType = defaultSEO.ogType,
  canonicalUrl,
  structuredData,
}: SEOHeadProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    
    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:site_name', 'JL Software & Digital Systems', true);
    
    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);

    // Canonical URL
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }

    // Structured Data
    if (structuredData) {
      let script = document.querySelector('#structured-data');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('id', 'structured-data');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, ogImage, ogType, canonicalUrl, structuredData]);

  return null;
}

// Common structured data templates
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'JL Software & Digital Systems',
  url: 'https://jlsoftware.co.ke',
  logo: 'https://jlsoftware.co.ke/og-image.png',
  description: 'Leading web design and software development company in Kenya',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi',
    addressCountry: 'KE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+254-700-000-000',
    contactType: 'customer service',
    areaServed: 'KE',
    availableLanguage: ['English', 'Swahili'],
  },
  sameAs: [
    'https://facebook.com/jlsoftware',
    'https://twitter.com/jlsoftware',
    'https://linkedin.com/company/jlsoftware',
  ],
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'JL Software & Digital Systems',
  image: 'https://jlsoftware.co.ke/og-image.png',
  '@id': 'https://jlsoftware.co.ke',
  url: 'https://jlsoftware.co.ke',
  telephone: '+254-700-000-000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'CBD',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi',
    postalCode: '00100',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -1.2921,
    longitude: 36.8219,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '18:00',
  },
  priceRange: '$$',
};

export const serviceSchema = (serviceName: string, serviceDescription: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: serviceName,
  description: serviceDescription,
  provider: {
    '@type': 'Organization',
    name: 'JL Software & Digital Systems',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Kenya',
  },
});
