'use client';

import Button from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = ({
  title,
  subtitle,
  buttonText,
  buttonAction,
  buttonHref,
  backgroundImage,
  showButton = true,
  breadcrumbItems,
}) => {
  return (
    <section className="relative flex min-h-[657px] flex-col bg-[#0D1114] text-white">
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image src={backgroundImage} alt="" fill className="object-cover opacity-30" aria-hidden />
        </div>
      )}

      <div className="absolute left-0 top-[297px] pointer-events-none">
        <Image
          src="/images/img_image.png"
          alt=""
          width={280}
          height={360}
          className="object-cover"
          aria-hidden
        />
      </div>

      <div className="absolute right-0 top-0 pointer-events-none">
        <Image
          src="/images/img_image_721x288.png"
          alt=""
          width={288}
          height={721}
          className="object-cover"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4">
        {breadcrumbItems?.length > 0 && (
          <div className="w-full pt-6 pb-2 md:pt-8">
            <Breadcrumbs items={breadcrumbItems} variant="hero" />
          </div>
        )}

        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center md:py-14">
          <h1 className="mb-6 max-w-[638px] text-5xl font-bold leading-[68px] text-gray-100">{title}</h1>

          {subtitle && (
            <p className="mb-12 max-w-[699px] text-xl font-medium leading-[30px] text-white">{subtitle}</p>
          )}

          {showButton && buttonText && (
            buttonHref ? (
              <Link
                href={buttonHref}
                className="mx-auto inline-flex items-center gap-3 rounded-lg bg-blue-500 px-10 py-4 text-xl font-semibold text-white transition-colors hover:bg-blue-600"
              >
                {buttonText}
                <Image src="/images/img_epright.svg" alt="" width={24} height={24} aria-hidden />
              </Link>
            ) : (
              <Button
                variant="primary"
                className="mx-auto flex items-center gap-3 rounded-lg bg-blue-500 px-10 py-4 text-xl font-semibold text-white hover:bg-blue-600"
                onClick={buttonAction}
              >
                {buttonText}
                <Image src="/images/img_epright.svg" alt="" width={24} height={24} aria-hidden />
              </Button>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
