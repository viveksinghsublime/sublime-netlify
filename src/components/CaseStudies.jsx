import Image from "next/image";
import Link from "next/link";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { fetchAllCaseStudies, getCaseStudyMediaUrl, getCaseStudyPath } from "@/lib/caseStudies";
import { CONTACT_PATH } from "@/lib/site";

const CaseStudies = async () => {
  const caseStudies = await fetchAllCaseStudies();
  const featuredStudies = caseStudies.slice(0, 4);

  return (
    <section className="bg-white px-4 py-12 text-black md:px-16">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2 text-xs font-semibold uppercase text-gray-500 font-ibmplex">
          Case Studies
        </p>
        <div className="flex flex-col justify-between md:flex-row">
          <h2 className="mb-4 max-w-2xl text-3xl font-semibold md:text-2xl md:font-normal">
            Discover how we helped businesses transform and embark on a new journey with innovative solutions.
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

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2">
          {featuredStudies.map((item, index) => {
            const bgColor = index % 2 === 0 ? "!bg-blue-600" : "!bg-yellow-400";

            return (
              <Link
                key={item.id}
                href={getCaseStudyPath(item)}
                className={`overflow-hidden rounded-xl bg-white shadow-md ${bgColor}`}
              >
                <div className="mb-4 flex justify-between p-4">
                  <div>
                    <p className="mb-1 text-base uppercase text-white font-ibmplex">
                      {item.category_name} {item.subcategory_name}
                    </p>
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  </div>
                  <BsArrowUpRightCircleFill className="cursor-pointer text-3xl text-white" aria-hidden />
                </div>
                <div className="relative aspect-[8/5] w-full">
                  <Image
                    src={getCaseStudyMediaUrl(item.image)}
                    alt={`${item.title} - ${item.category_name || 'Case study'} project showcase`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    className="object-contain"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
