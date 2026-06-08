import React from "react";
import Link from "next/link";
import ServiceCard from "./serviceCard";
import { CONTACT_PATH } from "@/lib/site";

export default function Home() {
  return (
    <section className="bg-[#0D2642]">
      <div className="mx-auto max-w-7xl p-4 text-white sm:p-6 lg:p-8">
        <header className="mb-8 text-start sm:mb-12">
          <p className="mb-4 text-sm font-medium text-gray-300 sm:text-base font-ibmplex">
            Find the Perfect Solution for Your Project, Whether You Need a Fully
            Managed Team, Staff Augmentation, or a Fixed-Price Approach.
          </p>
          <h2 className="text-3xl font-bold leading-tight sm:text-3xl lg:text-[40px]">
            Flexible Engagement Models to Suit Your Needs
          </h2>
        </header>

        <ServiceCard />

        <section className="mt-12 text-start sm:mt-16 lg:mt-20">
          <header className="mb-8 sm:mb-12">
            <p className="mb-2 text-sm font-medium text-gray-300 sm:text-base font-ibmplex">
              Explore More Ways We Can Help.
            </p>
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-[40px]">
              Need a Different Approach?
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {[
              "Support My Requirements",
              "Help us all fill with!",
              "Existing Project Discover",
              "Explore Your Options",
              "Cart Help With a Tool",
            ].map((item) => (
              <Link
                key={item}
                href={CONTACT_PATH}
                className="rounded-lg border border-gray-500 px-4 py-2 text-sm transition-colors hover:bg-gray-700 sm:text-base"
              >
                {item}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
