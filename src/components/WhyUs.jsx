import Link from "next/link";
import { FaCode, FaLightbulb, FaSyncAlt, FaStopwatch } from "react-icons/fa";
import { CONTACT_PATH } from "@/lib/site";

const WhyUs = () => {
  const features = [
    {
      icon: <FaCode size={24} />,
      text: "We have developed pioneering solutions for clients across their unique needs",
    },
    {
      icon: <FaLightbulb size={24} />,
      text: "We are at the forefront of technology and adapt the latest",
    },
    {
      icon: <FaSyncAlt size={24} />,
      text: "We are the trusted technology and resource partners for number of companies",
    },
    {
      icon: <FaStopwatch size={24} />,
      text: "We consistently deliver projects on time and within budget.",
    },
  ];

  return (
    <section className="bg-white px-4 py-12 text-black md:px-16">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2 text-xs font-semibold uppercase text-gray-500 font-ibmplex">
          Why Us?
        </p>
        <div className="flex flex-col justify-between md:flex-row">
          <h2 className="mb-4 text-3xl font-semibold md:text-2xl md:font-normal">
            We deliver dynamic, end-to-end software solutions tailored to industry expertise.
          </h2>
          <div className="mb-6 flex justify-start md:justify-end">
            <Link
              href={CONTACT_PATH}
              className="flex items-center justify-center gap-2 rounded-full bg-[#0093dd] px-5 py-2 font-medium text-white transition duration-300 hover:bg-[#007dc0]"
            >
              Contact us
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-8 rounded-xl bg-gray-100 p-6"
            >
              <div className="mb-24 text-gray-700">{item.icon}</div>
              <p className="text-gray-800">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
