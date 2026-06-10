import { Mail, MapPin, Phone } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ContactUsForm from '@/app/contact-us/ContactUsForm';

const contactDetails = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'info@sublimetechnocorp.com',
    href: 'mailto:info@sublimetechnocorp.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+1 (415) 555-1234',
    href: 'tel:+14155551234',
  },
  {
    icon: MapPin,
    title: 'Our Office',
    value: 'San Francisco, CA, USA',
    href: 'https://maps.google.com/?q=535+Mission+Street,+14th+Floor,+San+Francisco,+CA+94105',
  },
];

function ContactDetail({ icon: Icon, title, value, href }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="group flex items-center gap-4 rounded-2xl border border-transparent px-1 py-1 transition-colors hover:border-white/10 hover:bg-white/[0.02]"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1A2942] text-[#00B4FF]">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-lg font-semibold text-white">{title}</p>
        <p className="mt-1 text-base text-[#A0AEC0] transition-colors group-hover:text-slate-300">
          {value}
        </p>
      </div>
    </a>
  );
}

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#04070B] text-white">
      <Header />

      <section className="relative overflow-hidden bg-[#04070B] py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-24 h-72 w-72 rounded-full bg-[#0088FF]/10 blur-3xl" />
          <div className="absolute bottom-0 right-[-5%] h-80 w-80 rounded-full bg-[#00B4FF]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
          <div className="flex flex-col gap-10 pt-2 lg:pr-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.7px] text-[#00B4FF]">
                  Contact Us
                </span>
                <span className="h-0.5 w-8 bg-[#00B4FF]" />
              </div>

              <div className="pt-5">
                <h1 className="font-manrope text-[56px] font-bold leading-[68px] text-[#E9EEF0]">
                  Let's Build
                </h1>
                <h2 className="font-manrope mt-2 text-[56px] font-bold leading-[68px] text-[#008DD2]">
                  Something Great
                </h2>
              </div>

              <p className="mt-6 max-w-[28rem] text-lg leading-[29px] text-[#A0AEC0]">
                Have a project in mind or want to learn more about our services? Fill out the
                form and our team will get back to you shortly.
              </p>
            </div>

            <div className="grid gap-6">
              {contactDetails.map((item) => (
                <ContactDetail key={item.title} {...item} />
              ))}
            </div>
          </div>

          <ContactUsForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}