import Image from "next/image";
import { partnersData } from "@/data/json/partnersData";

const Partners = () => {
  return (
    <section className="bg-gray-100 text-black w-full py-8 sm:py-10">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-medium text-[#333333] px-4">
          Enterprises, SMEs & Tech Companies Worldwide Trust Us
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid  grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-0.5 px-4 sm:px-6 ">
        {partnersData.map((partner) => (
          <div
            key={partner.key}
            className="w-full h-24 p-0.5 relative flex items-center justify-center" // Reduced padding and fixed height
          >
            <Image
              src={partner.logo}
              alt={`${partner.name} logo`}
              fill
              className="object-contain p-0.5" // Reduced internal padding
              sizes="(max-width: 640px) 80px, (max-width: 1024px) 120px, 160px"
              quality={100}
              style={{ maxWidth: "90%", maxHeight: "90%" }} // Add bounding limits
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partners;
