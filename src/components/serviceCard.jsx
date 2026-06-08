import { servicesCardData } from "@/data/json/servicesCardData";
import Image from "next/image";
import Link from "next/link";
import { CONTACT_PATH } from "@/lib/site";

// ServiceCard.tsx
const ServiceCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
      {servicesCardData.map((service, idx) => (
        <div
          key={idx}
          className={`bg-white w-full h-full min-h-[280px] sm:min-h-[320px]
            flex flex-col items-center text-center rounded-lg shadow-lg
            hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-t-8
            ${service.borderColor} p-4 sm:p-6`}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 relative mb-4 sm:mb-6">
            <Image
              src={service.icon}
              alt={service.title}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 56px, 64px"
              priority={idx < 3} // Only load first 3 images eagerly
            />
          </div>

          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">
            {service.title}
          </h3>

          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 flex-1">
            {service.description}
          </p>

          <Link
            href={CONTACT_PATH}
            className="flex items-center justify-center gap-2 rounded-full bg-[#0093dd] px-5 py-2 font-medium text-white transition duration-300 hover:bg-[#007dc0]"
          >
            {service.buttonText}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ServiceCard;
