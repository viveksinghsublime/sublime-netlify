// import { verticalDiver } from '@/assets/index';
import RatingItem from "./RatingItem";


import { features, ratings, services } from "@/data/json/homePageData";
import Image from "next/image";
import { backgroundImage } from "@/assets";
import Header from "./Header";
import Tag from '@/components/ui/Tag';

const HomeHeroSection = () => {
  return (
    <section
      className="text-white bg-[#0D1114] w-full bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />
      <div className="max-w-6xl mx-auto pt-8 md:pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-6">
          {/* LEFT SECTION - Increased width */}
          <div className="flex-1 lg:w-[55%] xl:w-[58%] 2xl:w-[60%] text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-bold leading-snug sm:leading-tight lg:leading-tight mb-4 sm:mb-6 text-center lg:text-left">
              Your <span className="text-blue-400 ">“On-Demand”</span> <br />
              Team for Custom <br /> Software Development
            </h1>
            <hr className="border-2 border-gray-600 mb-6 lg:mb-8 w-full max-w-[265px] lg:mx-0 m-auto" />
            <p className="text-base lg:text-xl font-medium text-gray-400 mb-6 lg:mb-8">
              Your Allies in Leading Technological Forays
            </p>
            <div className="flex gap-4 sm:gap-6 flex-wrap mb-8 lg:mb-12 text-center lg:justify-start justify-center">
              {ratings.map((rating, idx) => (
                <RatingItem key={idx} {...rating} />
              ))}
            </div>
          </div>

          {/* VERTICAL DIVIDER - Slimmer */}
          <div className="hidden lg:block relative h-[500px] w-px mx-2 bg-blue-500/20 border-dotted border-blue-500 border-2 justify-center" />

          {/* RIGHT SECTION - Adjusted width */}
          <div className="lg:w-[45%] xl:w-[42%] 2xl:w-[40%] lg:pl-6 lg:mx-0 m-auto">
            <div className="flex flex-col gap-y-3 w-full md:w-fit items-center justify-center">
              {/* {services.map((service, idx) => (
                <button
                  key={idx}
                  className={`text-white bg-[#0D2642] rounded-full px-6 py-3 border ${service.borderColor} hover:bg-white hover:text-black transition text-xl lg:text-[26px] font-semibold w-fit max-w-max`}
                  onClick={() => alert(`Clicked: ${service.title}`)}
                  type="button"
                >
                  {service.title}
                </button>
              ))} */}
              <div className="space-y-4">
                  <Tag color="blue" className="">Web Application Development</Tag>
                  <Tag color="amber" className="">Mobile App Development</Tag>
                  <Tag color="amber" className="">ERP Solutions</Tag>
                  <Tag color="blue" className="">Custom software development</Tag>
                  <Tag color="green" className="">AI Solutions</Tag>
                  <Tag color="purple" className="">Hire Developers</Tag>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="mx-auto">
      <div className="flex flex-wrap flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-sm sm:text-base lg:text-md text-white mt-8 sm:mt-12 lg:mt-16 pb-8 sm:pb-12 ">
        {features.map(({ icon: Icon, text }, i) => (
          <div
            key={i}
            className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto px-4 sm:px-0 min-w-0 justify-center "
          >
            <Image
              src={Icon}
              alt={`${text} — feature highlight icon`}
              width={44}
              height={44}
              className="w-[44px] h-[44px] object-cover sm:w-10 sm:h-10 lg:w-11 lg:h-11"
            />
            <span className="whitespace-nowrap font-semibold overflow-ellipsis overflow-hidden">
              {text}
            </span>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
