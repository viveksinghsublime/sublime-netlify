import React from "react";
import Link from "next/link";
import { CONTACT_PATH } from "@/lib/site";
const CompanyIntroSection = () => {
  const heroData = {
    companyName: "WE AT, SUBLIME TECHNOCORP PVT LTD",
    mainHeading: "Transforming Businesses with Technology",
    leftSection: {
      title: "DRIVING GROWTH THROUGH TECH & AUTOMATION",
      content:
        "We are a technology company focused on creating tomorrow’s solutions. Our mission is to simplify work for clients through automation, streamlining, and efficient tech. We aim to tackle challenges yet to be addressed and deliver timely, cost-effective solutions.",
    },
    rightSection: {
      title: "HOW DO WE DO IT?",
      content:
        "We develop global custom software development services for start-ups, SMEs, MSMEs, and Corporate businesses. We work on an agile system, an end-to-end product lifecycle management model that encompasses conceptualization, front-end and back-end coding, deployment, and QA.",
      buttonText: "Get a Quote",
    },
  };

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Company Name */}
        <div className="text-start mb-3 sm:mb-8 lg:mb-10">
          <p className="text-xs sm:text-sm text-gray-600 font-ibmplex font-medium tracking-wider uppercase">
            {heroData.companyName}
          </p>
        </div>

        {/* Main Heading */}
        <h2 className="text-[30px] sm:text-[40px] lg:text-[40px] xl:text-[42px] font-bold text-gray-900 leading-tight mb-6 sm:mb-8 lg:mb-10">
          {heroData.mainHeading}
        </h2>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-8 lg:gap-10 xl:gap-12">
          {/* Left Section */}
          <div className="space-y-4 sm:space-y-5">
            <div className="border-l-4 border-gray-400 pl-4 sm:pl-5">
              <h2 className="text-xs sm:text-sm font-semibold font-ibmplex text-gray-600 tracking-wider uppercase mb-8">
                {heroData.leftSection.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose">
                {heroData.leftSection.content}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-4 sm:space-y-5">
            <div className="border-l-4 border-gray-400 pl-4 sm:pl-5">
              <h2 className="text-xs sm:text-sm font-semibold font-ibmplex text-gray-600 tracking-wider uppercase mb-8">
                {heroData.rightSection.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed sm:leading-loose mb-4 sm:mb-6">
                {heroData.rightSection.content}
              </p>
              <div className="flex justify-start sm:justify-end">
                <Link
                  href={CONTACT_PATH}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#0093dd] px-5 py-2 font-medium text-white transition duration-300 hover:bg-[#007dc0]"
                >
                  {heroData.rightSection.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Background elements - Hidden on mobile */}
        <div className="hidden sm:block absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-3xl" />
        </div>
        <div className="hidden sm:block absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-gray-400 to-gray-600 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default CompanyIntroSection;
