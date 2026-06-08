import Image from 'next/image';
import Header from '@/components/common/Header';
import HeroSection from '@/components/common/HeroSection';
import Footer from '@/components/common/Footer';
import Card from '@/components/ui/Card';
import { JobPostingSchema } from '@/components/JobPostingSchema';
import CareersOpeningsSection from '@/components/careers/CareersOpeningsSection';
import { fetchJobFilterMasters, fetchPublishedJobs, JOBS_REVALIDATE_SECONDS } from '@/lib/jobs';

const breadcrumbItems = [
  { name: 'Home', href: '/' },
  { name: 'Careers', href: '/careers' },
];

const companyValues = [
  {
    icon: '/images/img_passion.svg',
    title: 'Passion',
    description:
      'We are driven by a deep enthusiasm for technology and its potential to transform lives and businesses. Our passion fuels innovation and excellence in everything we do.',
  },
  {
    icon: '/images/img_integrity.svg',
    title: 'Integrity',
    description:
      'We uphold the highest ethical standards in all our interactions. Honesty, transparency, and accountability form the foundation of our relationships with clients and colleagues.',
  },
  {
    icon: '/images/img_arrow_up.svg',
    title: 'Impact',
    description:
      'We measure our success by the positive difference we make. Every line of code, every solution, and every interaction is an opportunity to create meaningful impact for our clients.',
  },
  {
    icon: '/images/img_puzzleicon_1.svg',
    title: 'Value-Driven Collaboration',
    description:
      'We believe in the power of diverse perspectives. By working together across disciplines and backgrounds, we create solutions that are innovative, inclusive, and truly transformative.',
  },
];

const officeLocations = [
  {
    city: 'Nerul, India',
    address:
      'Office No: F21, Plot No: 88, Sector 19A, Seawoods, Navi Mumbai, Maharashtra 400706',
    phone: '+91 86910 25926',
    email: 'info@sublimetechnocorp.com',
  },
  {
    city: 'New York, USA',
    address: 'Office No: 42, 7th Avenue, Manhattan, NY 10011',
    phone: '+49 30 1234 5678',
    email: 'info@sublimetechnocorp.com',
  },
  {
    city: 'San Francisco, USA',
    address: '535 Mission Street, 14th Floor\nSan Francisco, CA 94105',
    phone: '+1 (415) 555-1234',
    email: 'info@sublimetechnocorp.com',
  },
];

export const revalidate = JOBS_REVALIDATE_SECONDS;

export default async function CareersPage() {
  const [jobs, masters] = await Promise.all([fetchPublishedJobs(), fetchJobFilterMasters()]);

  return (
    <>
      <JobPostingSchema jobs={jobs} />
      <div className="min-h-screen bg-white">
        <Header />
        <HeroSection
          breadcrumbItems={breadcrumbItems}
          title="Careers at Sublime Technocorp"
          subtitle="Advance Your Career in Software Development with Sublime Technocorp. Shape how enterprises evolve through the future of technology."
          buttonText="Open Positions"
          buttonHref="#job-openings"
        />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <p className="text-base font-medium uppercase tracking-wide text-black/70 mb-2">
                Our Journey
              </p>
              <h2 className="text-4xl font-bold text-black leading-tight">
                From Startup to Industry Leader
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
              <div>
                <div className="border-b-2 border-gray-400 pb-4 mb-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-black/70">
                    Why Work with Us?
                  </p>
                </div>
                <p className="text-base font-medium leading-relaxed text-gray-700">
                  At Sublime Technocorp we offer you the chance to drive innovation in the software
                  industry. Working with us means being part of a dynamic team that creates
                  cutting-edge software solutions for various industries.
                  <br />
                  <br />
                  You will have the opportunity to develop your skills and grow your career in an
                  environment that values creativity, collaboration, and continuous learning.
                  <br />
                  <br />
                  Grow with a team that believes in curiosity, collaboration, and continuous
                  innovation.
                </p>
              </div>
              <div>
                <div className="border-b-2 border-gray-400 pb-4 mb-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-black/70">
                    How We Work
                  </p>
                </div>
                <p className="text-base font-medium leading-relaxed text-gray-700">
                  We believe in fostering a work culture that prioritizes innovation, teamwork, and
                  continuous improvement. Our agile methodologies and open communication channels
                  ensure that every team member can contribute their ideas and see them come to
                  life.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-800">
          <div className="container mx-auto px-25">
            <div className="mb-12">
              <p className="text-base font-normal text-white/70 mb-4">Our Values</p>
              <h2 className="text-xl font-medium text-white leading-relaxed max-w-lg">
                Our core values define who we are and guide how we work together to achieve
                excellence.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyValues.map((value) => (
                <Card key={value.title} className="bg-white border border-gray-300 p-7">
                  <Image
                    src={value.icon}
                    alt={value.title}
                    width={54}
                    height={54}
                    className="mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-base font-semibold text-gray-600 leading-6">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CareersOpeningsSection
          jobs={jobs}
          roles={masters.roles}
          locations={masters.locations}
          employmentTypes={masters.employmentTypes}
        />

        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-25">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-black mb-4">Our Office</h2>
              <p className="text-base font-medium text-black">
                We Work Across Borders to deliver exceptional technology solutions worldwide.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {officeLocations.map((office) => (
                <Card key={office.city} className="bg-white border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                      <Image
                        src="/images/img_background.svg"
                        alt="Location"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{office.city}</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Image
                        src="/images/img_svg.svg"
                        alt="Address"
                        width={20}
                        height={20}
                        className="mr-4 mt-1"
                      />
                      <p className="whitespace-pre-line text-sm font-medium leading-6 text-gray-700">
                        {office.address}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <Image
                        src="/images/img_icbaselinecall.svg"
                        alt="Phone"
                        width={20}
                        height={20}
                        className="mr-4 mt-1"
                      />
                      <p className="text-sm font-medium leading-6 text-gray-700">{office.phone}</p>
                    </div>
                    <div className="flex items-start">
                      <Image
                        src="/images/img_icbaselineemail.svg"
                        alt="Email"
                        width={20}
                        height={20}
                        className="mr-4 mt-1"
                      />
                      <p className="text-sm font-medium leading-6 text-gray-700">{office.email}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
