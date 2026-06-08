import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-black mb-8">Privacy Policy</h1>
        <div className="prose max-w-3xl text-gray-700">
          <p className="mb-4">
            At Sublime Technocorp, we respect your privacy and are committed to protecting your personal
            data.
          </p>
          <p>
            This privacy policy explains how our organization uses the personal data we collect from you when
            you use our website.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
