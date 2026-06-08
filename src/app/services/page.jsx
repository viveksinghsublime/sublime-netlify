'use client';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import HeroSection from '@/components/common/HeroSection';
import Card from '@/components/ui/Card';

const services = [
  {
    id: 'web-development',
    title: 'Web Application Development',
    description: 'Custom web applications built with modern technologies.',
  },
  {
    id: 'mobile-development',
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications.',
  },
  {
    id: 'erp',
    title: 'ERP Solutions',
    description: 'Enterprise resource planning systems for business efficiency.',
  },
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    description: 'Tailored software solutions for your unique needs.',
  },
  {
    id: 'ai',
    title: 'AI Solutions',
    description: 'Artificial intelligence and machine learning implementations.',
  },
  {
    id: 'hire-developers',
    title: 'Hire Developers',
    description: 'Dedicated development teams for your projects.',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection
        title="Our Services"
        subtitle="Comprehensive software development services for enterprises and SMEs."
      />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} id={service.id} className="border border-gray-200 p-6 scroll-mt-24">
              <h2 className="mb-4 text-xl font-bold text-black">{service.title}</h2>
              <p className="text-gray-600">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
