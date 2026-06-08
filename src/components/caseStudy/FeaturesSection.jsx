'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getCaseStudyMediaUrl } from '@/lib/caseStudyShared';

export default function FeaturesSection({ features, featureTitle }) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeDetail, setActiveDetail] = useState(0);

  if (!features || features.length === 0) return null;

  const activeGroup = features[activeTab] || features[0];
  const details = activeGroup?.details || [];
  const currentDetail = details[activeDetail] || details[0];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-500">
          Core Features
        </p>
        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          {featureTitle || 'Features & Capabilities'}
        </h2>

        <div className="mb-8 flex flex-wrap gap-2">
          {features.map((group, i) => (
            <button
              key={i}
              onClick={() => { setActiveTab(i); setActiveDetail(0); }}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                i === activeTab
                  ? 'bg-blue-500 text-white shadow'
                  : 'border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-500'
              }`}
            >
              {group.feature}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md md:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="space-y-3">
              {details.map((detail, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDetail(i)}
                  className={`w-full text-left transition-all ${
                    i === activeDetail
                      ? 'rounded-lg bg-gray-50 p-4'
                      : 'border-l-4 border-blue-500 py-2 pl-4 hover:bg-gray-50'
                  }`}
                >
                  <h3 className={`font-semibold ${i === activeDetail ? 'text-xl text-gray-900' : 'text-base text-gray-700'}`}>
                    {detail.name}
                  </h3>
                  {i === activeDetail && detail.description && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                      {detail.description}
                    </p>
                  )}
                </button>
              ))}
            </div>

            {currentDetail?.image && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                <Image
                  src={getCaseStudyMediaUrl(currentDetail.image)}
                  alt={currentDetail.name || 'Feature screenshot'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
