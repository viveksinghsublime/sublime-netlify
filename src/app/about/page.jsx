'use client';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import HeroSection from '@/components/common/HeroSection';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Image from 'next/image';
const breadcrumbItems = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
];
const AboutPage = () => {
  const handleStartProject = () => {
    alert('Starting a new project! Our team will contact you soon.');
  };
  const handleContactUs = () => {
    alert('Thank you for your interest! We will get back to you within 24 hours.');
  };
  const coreValues = [
    {
      id: 1,
      title: 'Innovation',
      description: 'We embrace new technologies and creative approaches to solve complex problems.',
      icon: '/images/img_background_indigo_a400.svg',
      color: 'bg-blue-600',
      features: ['Continuous learning', 'Embracing change', 'Creative problem-solving']
    },
    {
      id: 2,
      title: 'Speed',
      description: 'We deliver high-quality solutions quickly without compromising on excellence.',
      icon: '/images/img_svg_amber_500.svg',
      color: 'bg-yellow-500',
      features: ['Agile methodology', 'Efficient', 'Rapid iteration']
    },
    {
      id: 3,
      title: 'Ownership',
      description: 'We take responsibility for our work and stand behind every line of code we write.',
      icon: '/images/img_vector.svg',
      color: 'bg-green-500',
      features: ['Accountability', 'Quality assurance', 'Long-term commitment']
    },
    {
      id: 4,
      title: 'Empathy',
      description: 'We deliver high-quality solutions quickly without compromising on excellence.',
      icon: '/images/img_svg_indigo_a400.svg',
      color: 'bg-blue-600',
      features: ['User-centered design', 'Active listening', 'Collaborative approach']
    }
  ];
  const processSteps = [
    {
      id: 1,
      title: 'Problem Identification',
      description: 'We dive deep into your business challenges to understand the core issues that need solving.',
      icon: '/images/img_vector_white_a700.svg'
    },
    {
      id: 2,
      title: 'Strategic Planning',
      description: 'We create a roadmap that aligns technology solutions with your business objectives.',
      icon: '/images/img_vector_white_a700_16x16.svg'
    },
    {
      id: 3,
      title: 'Agile Development',
      description: 'We build solutions iteratively, ensuring flexibility and continuous improvement throughout the process.',
      icon: '/images/img_vector_white_a700_16x20.svg'
    },
    {
      id: 4,
      title: 'Continuous Support',
      description: 'We provide ongoing maintenance and updates to ensure your solution evolves with your business.',
      icon: '/images/img_vector_white_a700_17x18.svg'
    }
  ];
  const offices = [
    {
      id: 1,
      location: 'Nerul, India',
      address: 'Office No: F21, Plot No: 88, Sector 19A, Seawoods, Navi Mumbai, Maharashtra 400706',
      phone: '+91 86910 25926',
      email: 'info@sublimetechnocorp.com'
    },
    {
      id: 2,
      location: 'New York, USA',
      address: 'Office No: 42, 7th Avenue, Manhattan, NY 10011',
      phone: '+49 30 1234 5678',
      email: 'info@sublimetechnocorp.com'
    },
    {
      id: 3,
      location: 'San Francisco, USA',
      address: '535 Mission Street, 14th Floor\nSan Francisco, CA 94105',
      phone: '+1 (415) 555-1234',
      email: 'info@sublimetechnocorp.com'
    }
  ];
  const ratings = [
    {
      platform: 'Clutch',
      rating: '4.8',
      logo: '/images/img_clutch.svg',
      icon: '/images/img_tablericonstarfilled.svg'
    },
    {
      platform: 'G2',
      rating: '4.6',
      logo: '/images/img_image_861117562.png',
      icon: '/images/img_tablericonstarfilled.svg'
    },
    {
      platform: 'Google',
      rating: '4.6',
      logo: '/images/img_image_861117563.png',
      icon: '/images/img_tablericonstarfilled.svg'
    },
    {
      platform: 'Goodfirms',
      rating: '4.8',
      logo: '/images/img_image_861117564.png',
      icon: '/images/img_tablericonstarfilled.svg'
    }
  ];
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection
        breadcrumbItems={breadcrumbItems}
        title="Your Partner for Digital Engineering"
        subtitle="Sublime Technocorp empowers businesses like yours to drive growth, reduce costs, enhance efficiency, and thrive in the digital age."
        buttonText="Start a Project"
        buttonAction={handleStartProject}
        backgroundImage="/images/img_background_590x1440.png"
      />
      {/* Stats Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-16">
            <div className="flex items-center space-x-4">
              <div className="bg-black rounded-xl p-3">
                <Image src="/images/img_vector_blue_gray_600.svg" alt="Experts" width={24} height={18} />
              </div>
              <span className="text-white font-semibold text-base">50+ Tech Experts</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-black rounded-xl p-3">
                <Image src="/images/img_vector_blue_gray_600_19x19.svg" alt="Experience" width={19} height={19} />
              </div>
              <span className="text-white font-semibold text-base">10+ Years Experience</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-black rounded-xl p-3">
                <Image src="/images/img_vector_blue_gray_600_20x18.svg" alt="Projects" width={20} height={18} />
              </div>
              <span className="text-white font-semibold text-base">300+ Projects Delivered</span>
            </div>
          </div>
        </div>
      </section>
      {/* Ratings Section */}
      <section className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-16">
            {ratings.map((rating, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image src={rating.logo} alt={rating.platform} width={66} height={66} className="mb-4" />
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-white text-2xl font-medium">{rating.rating}</span>
                  <Image src={rating.icon} alt="Star" width={26} height={26} />
                </div>
                <span className="text-blue-500 font-bold text-base">{rating.platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Journey Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-25">
          <div className="mb-12">
            <p className="text-black/70 font-medium text-base uppercase tracking-wide mb-4">Our Journey</p>
            <h2 className="text-4xl font-bold text-black leading-tight mb-8">From Startup to Industry Leader</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="border-l-2 border-gray-400 pl-4">
                <p className="text-xs font-medium uppercase tracking-wide text-black/70 mb-6">OUR STORY</p>
                <p className="text-base font-medium text-gray-800 leading-relaxed">
                  Founded in 2012, Sublime Technocorp began as a boutique web development agency with a vision to
                  transform how businesses operate in the digital landscape. Our journey evolved from creating websites
                  to developing comprehensive ERP solutions, and now pioneering AI and IoT implementations that
                  revolutionize business operations. Today, our core mission remains unchanged: reforming business
                  operations through automation and innovative technology solutions that drive efficiency and growth.
                </p>
              </div>
            </div>
            <div>
              <div className="border-l-2 border-gray-400 pl-4">
                <p className="text-xs font-medium uppercase tracking-wide text-black/70 mb-6">OUR IMPACT</p>
                <p className="text-base font-medium text-gray-800 leading-relaxed">
                  Driven by People. Powered by Tech.<br />
                  50+ Tech Experts<br />
                  10+ Years of Experience<br />
                  300+ Projects Delivered<br />
                  Trusted by Enterprises Globally<br /><br />
                  We thrive on solving real-world challenges with custom, agile-based development models that include
                  UI/UX, front-end, back-end, QA, and ongoing deployment support. Every project is a step toward
                  making tech smarter, leaner, and more impactful for our clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Core Values Section */}
      <section className="bg-slate-800 py-20">
        <div className="container mx-auto px-25">
          <div className="mb-12">
            <p className="text-white/70 font-normal text-base mb-4">Core Values</p>
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">What Drives Our Team</h2>
            <p className="text-white font-medium text-base leading-relaxed max-w-2xl">
              Our values shape everything we do — from how we build products to how we work with clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value) => (
              <Card key={value.id} className="bg-white shadow-sm border-0 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-2 h-full ${value.color} rounded-r`}></div>
                <div className="p-6">
                  <div className="mb-4">
                    <Image src={value.icon} alt={value.title} width={48} height={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-center text-black mb-4">{value.title}</h3>
                  <p className="text-gray-600 font-semibold text-sm leading-6 mb-6">{value.description}</p>
                  <ul className="space-y-3">
                    {value.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Image
                          src="/images/img_svg_blue_900.svg"
                          alt="Check"
                          width={15}
                          height={15}
                        />
                        <span className="text-gray-600 font-semibold text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-25">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-black/70 font-normal text-base mb-4">Our Mission</p>
              <h2 className="text-4xl font-bold text-black leading-tight mb-6">
                Transforming Ideas Into Digital Reality
              </h2>
              <p className="text-black font-medium text-base leading-relaxed mb-12">
                We solve complex business challenges through innovative software solutions that drive growth and efficiency.
              </p>
              <div className="space-y-8">
                {processSteps.map((step) => (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className="bg-blue-500 rounded-lg p-3 flex-shrink-0">
                      <Image src={step.icon} alt={step.title} width={18} height={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600 font-normal text-sm leading-6">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/img_202860666207965_1.svg"
                alt="Digital Transformation"
                width={394}
                height={394}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section
        className="relative bg-slate-800 py-20"
        style={{
          backgroundImage: 'url(/images/img_background_590x1440.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-slate-800/80"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto">
            Let's build what's next — together.
          </h2>
          <p className="text-xl font-medium text-white leading-relaxed mb-12 max-w-2xl mx-auto">
            Ready to transform your business with innovative technology solutions? Our team of experts is here to help you succeed.
          </p>
          <Button
            variant="primary"
            className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-lg text-xl font-semibold mb-16"
            onClick={handleStartProject}
          >
            Start a Project
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/20 backdrop-blur-sm border-0 text-center p-8">
              <div className="mb-6">
                <Image
                  src="/images/img_icbaselinecall.svg"
                  alt="Call"
                  width={45}
                  height={45}
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Call Us</h3>
              <p className="text-white font-medium text-base mb-4">
                We're available Monday-Saturday, 10am-7pm
              </p>
              <p className="text-white font-medium text-lg">086910 25926</p>
            </Card>
            <Card className="bg-white/20 backdrop-blur-sm border-0 text-center p-8">
              <div className="mb-6">
                <Image
                  src="/images/img_icbaselineemail.svg"
                  alt="Email"
                  width={52}
                  height={52}
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Email Us</h3>
              <p className="text-white font-medium text-base mb-4">
                We'll respond within 24 hours
              </p>
              <p className="text-white font-medium text-lg">info@sublimetechnocorp.com</p>
            </Card>
          </div>
        </div>
      </section>
      {/* Office Locations */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-25">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-black mb-6">Our Office</h2>
            <p className="text-black font-medium text-base">
              We Work Across Borders to deliver exceptional technology solutions worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offices.map((office) => (
              <Card key={office.id} className="bg-white shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500 rounded-full p-2 mr-4">
                    <Image
                      src="/images/img_background.svg"
                      alt="Location"
                      width={40}
                      height={40}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{office.location}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Image src="/images/img_svg.svg" alt="Address" width={20} height={20} className="mt-1" />
                    <p className="text-gray-600 font-normal text-base leading-6">{office.address}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image src="/images/img_svg_gray_600.svg" alt="Phone" width={20} height={20} />
                    <p className="text-gray-600 font-normal text-base">{office.phone}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image src="/images/img_svg_gray_600_20x20.svg" alt="Email" width={20} height={20} />
                    <p className="text-gray-600 font-normal text-base">{office.email}</p>
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <span className="text-blue-600 font-medium text-sm">View On Google Maps</span>
                    <Image src="/images/img_majesticonsopen.svg" alt="External Link" width={20} height={20} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default AboutPage;