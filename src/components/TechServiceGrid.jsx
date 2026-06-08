import React from "react";
import Image from "next/image";
import {
  TechService1,
  TechService2,
  TechService3,
  TechService4,
  TechService5,
  TechService6,
} from "@/assets";

const TechServicesGrid = () => {
  const servicesData = {
    sectionTitle: "OUR SERVICES",
    mainHeading: "Innovative Tech Services Crafted for Your Unique Needs",
    services: [
      {
        id: 1,
        title: "CLOUD TRANSFORMATION",
        description:
          "Unlock seamless scalability, efficiency, and agility with our tailored cloud transformation services.",
        iconSrc: TechService1, // Replace with your image path
        iconAlt: "Cloud Transformation",
        bgColor: "bg-[#1C1D22]",
        textColor: "text-white",
      },
      {
        id: 2,
        title: "DEDICATED DEVELOPERS",
        description:
          "Build powerful solutions with top-tier developers who integrate seamlessly into your team.",
        iconSrc: TechService2, // Replace with your image path
        iconAlt: "Dedicated Developers",
        bgColor: "bg-[#E9EAED]",
        textColor: "text-gray-800",
      },
      {
        id: 3,
        title: "CUSTOM SOFTWARE SOLUTIONS",
        description:
          "Develop innovative, scalable software built specifically to meet your unique business needs.",
        iconSrc: TechService3, // Replace with your image path
        iconAlt: "Custom Software Solutions",
        bgColor: "bg-[#E9EAED]",
        textColor: "text-gray-800",
      },
      {
        id: 4,
        title: "PRODUCT DEVELOPMENT SERVICES",
        description:
          "From MVP to scalable product launches, we bring your ideas to life with expertise and precision.",
        iconSrc: TechService4, // Replace with your image path
        iconAlt: "Product Development Services",
        bgColor: "bg-[#1E40AF]",
        textColor: "text-white",
      },
      {
        id: 5,
        title: "INSIGHTS",
        description:
          "Harness the power of your data with advanced analytics and treasure that drive growth.",
        iconSrc: TechService5, // Replace with your image path
        iconAlt: "Insights",
        bgColor: "bg-[#008DD2]",
        textColor: "text-white",
      },
      {
        id: 6,
        title: "MOBILE APP DEVELOPMENT",
        description:
          "Develop intuitive and engaging mobile apps for iOS and Android that deliver exceptional user experience.",
        iconSrc: TechService6, // Replace with your image path
        iconAlt: "Mobile App Development",
        bgColor: "bg-gray-200",
        textColor: "text-gray-800",
      },
    ],
  };

  return (
    <div className="bg-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-start mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm text-gray-600 font-medium font-ibmplex uppercase tracking-wider mb-4">
            {servicesData.sectionTitle}
          </p>
          <h2 className="text-[32px] sm:text-[40px] lg:text-[40px] font-bold text-gray-900 leading-tight max-w-3xl ">
            {servicesData.mainHeading}
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {servicesData.services.map((service) => (
            <div
              key={service.id}
              className={`${service.bgColor} ${service.textColor} rounded-xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2 ease-in-out duration-300`}
            >
              <div className="flex flex-col h-full">
                {/* Icon Container */}
                <div className="mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full">
                    <Image
                      src={service.iconSrc}
                      alt={service.iconAlt}
                      width={64}
                      height={64}
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className="text-base font-ibmplex sm:text-xl lg:text-2xl font-bold tracking-wide mb-3 sm:mb-4"
                    style={{ letterSpacing: "1px" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg opacity-90 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechServicesGrid;
