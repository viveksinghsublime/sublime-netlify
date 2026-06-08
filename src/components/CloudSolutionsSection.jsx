import React from "react";
import Image from "next/image";
import { Aws, Azure, GoogleCloud } from "@/assets";

const CloudSolutionsSection = () => {
  // console.log(Aws);
  const cloudData = {
    subtitle: "We Drive Your Business With Leading Cloud Solutions",
    title: "Cloud Solution and Services",
    buttons: [
      {
        text: "Share Your Requirements",
        variant: "primary",
        bgColor: "bg-[#008dcc]",
        hoverColor: "hover:bg-[#007dc0]",
      },
      {
        text: "Explore More",
        variant: "secondary",
        bgColor: "bg-white border-2 border-[#008dcc] text-[#008dcc]",
        hoverColor: "hover:bg-[#008dcc] hover:text-white",
      },
    ],
    cloudProviders: [
      {
        id: 1,
        name: "AWS",
        logo: Aws,
        alt: "Amazon Web Services",
      },
      {
        id: 2,
        name: "Azure",
        logo: Azure,
        alt: "Microsoft Azure",
      },
      {
        id: 3,
        name: "Google Cloud",
        logo: GoogleCloud,
        alt: "Google Cloud Platform",
      },
    ],
  };

  return (
    <div className="bg-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <p className="text-xs sm:text-sm font-ibmplex text-gray-600 font-medium mb-2 sm:mb-3">
            {cloudData.subtitle}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-5">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-gray-900 leading-tight">
              {cloudData.title}
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {cloudData.buttons.map((button, index) => (
                <button
                  key={index}
                  className={`${button.bgColor} ${button.hoverColor}  px-5 sm:px-6 py-2 rounded-full font-medium transition-colors duration-200 text-sm sm:text-base`}
                >
                  {button.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cloud Providers Grid */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {cloudData.cloudProviders.map((provider) => (
            <div
              key={provider.id}
              className="flex items-center bg-white border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-center flex-shrink-0 mr-3 sm:mr-4">
                <Image
                  src={provider.logo}
                  alt={provider.alt}
                  width={1000}
                  height={1000}
                  className="object-contain h-12 w-24 sm:h-14 sm:w-20"
                  sizes="(max-width: 640px) 64px, 80px"
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {provider.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CloudSolutionsSection;
