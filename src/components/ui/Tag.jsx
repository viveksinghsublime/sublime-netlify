'use client';

const Tag = ({
  children,
  color = 'blue',
  className = '',
}) => {
  const colorClasses = {
    blue: 'bg-[#5999ff]',
    amber: 'bg-[#fbba14]',
    green: 'bg-[#3cc065]',
    purple: 'bg-[#804b8b]',
  };

  return (
    <div className={`${colorClasses[color]} rounded-[26px] mt-1 ${className} w-fit min-h-fit p-[0.5px]`}>
      <div className="bg-[#0d2642] rounded-[24px] py-[5px] px-[25px] w-full">
        <span className="text-white text-lg font-semibold break-words lg:text-[26px] font-manrope">
          {children}
        </span>
      </div>
    </div>
  );
};

export default Tag;
