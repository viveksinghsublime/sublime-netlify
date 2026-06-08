import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { CONTACT_PATH, WORKS_PATH } from '@/lib/site';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#0D1114] text-white">
      <Header />

      <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Thank You
          </p>
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">Your message has been received</h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-gray-300">
            We appreciate your interest in working with Sublime Technocorp. Our team will review your request and get back to you soon.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={WORKS_PATH}
              className="rounded-xl border border-white/20 px-6 py-3 font-medium transition hover:bg-white/10"
            >
              Explore our work
            </Link>
            <Link
              href={CONTACT_PATH}
              className="rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600"
            >
              Send another message
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
