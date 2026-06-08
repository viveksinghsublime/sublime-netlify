'use client';

import Image from 'next/image';

const Card = ({
  title,
  description,
  icon,
  color = 'white',
  children,
  className = '',
}) => {
  const colorClasses = {
    'blue': 'bg-[#008dd2] text-white',
    'white': 'bg-[#e9eaed] text-[#11181c]',
    'dark-blue': 'bg-[#1e40af] text-white',
    'green': 'bg-[#3cc065] text-white',
  };

  const descriptionColorClasses = {
    'blue': 'text-[#ffffffb2]',
    'white': 'text-[#5a5b5fb2]',
    'dark-blue': 'text-[#ffffffb2]',
    'green': 'text-[#ffffffb2]',
  };

  return (
    <div className={`rounded-2xl ${colorClasses[color]} p-8 ${className}`}>
      {icon && (
        <div className="flex justify-end mb-6">
          <Image
            src={icon}
            alt={title}
            width={60}
            height={60}
          />
        </div>
      )}

      <h3 className="text-2xl font-medium uppercase tracking-wider font-['IBM_Plex_Mono'] mb-4">
        {title}
      </h3>

      <p className={`text-base font-medium ${descriptionColorClasses[color]}`}>
        {description}
      </p>

      {children}
    </div>
  );
};

export default Card;