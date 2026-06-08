import HomeHeroSection from '@/components/common/HomeHeroSection';
//import HeroSection from "@/components/HeroSection";
// import Header from "@/core/common/header";
import Partners from "@/components/partners";
import ServiceDetails from "@/components/ServiceDetails";
import CompanyIntroSection from "@/components/CompanyIntroSection";
import TechServicesGrid from "@/components/TechServiceGrid";
import CloudSolutionsSection from "@/components/CloudSolutionsSection";
import ClientTestimonialsSection from "@/components/ClientTestimonialsSection";
import WhyUs from "@/components/WhyUs";
import CaseStudies from "@/components/CaseStudies";
import Footer from "@/components/common/Footer";
import { fetchPublishedReviews } from "@/lib/reviews";

export const revalidate = 600;

export default async function Home() {
  const reviews = await fetchPublishedReviews();
  const testimonials = reviews.length
    ? reviews.map((review) => ({
        message: review.message,
        name: review.name,
        position: review.position,
        image: review.image || '/images/img_avatar_user_pic.png',
      }))
    : undefined;

  return (
    <div className="min-h-screen bg-[#0D1114] text-white">
      {/* <Header /> */}
      <HomeHeroSection />
      <Partners />
      <ServiceDetails />
      <CompanyIntroSection />
      <TechServicesGrid />
      <CloudSolutionsSection />
      <ClientTestimonialsSection testimonials={testimonials} />
      <WhyUs />
      <CaseStudies />
      <Footer />
    </div>
  );
}
