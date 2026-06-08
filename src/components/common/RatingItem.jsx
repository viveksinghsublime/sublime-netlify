import Image from "next/image";
import { FaStar } from "react-icons/fa";

const RatingItem = ({ logo, name, rating }) => (
  <div className="flex flex-col items-center justify-between space-y-1">
    <div className="flex items-center gap-2">
      <Image
        src={logo}
        alt={name}
        width={1000}
        height={1000}
        className=" sm:w-[75px] sm:h-[75px] w-[60px] h-[60px] object-cover"
      />
      <div className="flex items-center gap-1">
        <span className="text-white font-medium text-2xl">{rating}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-lg text-[#008DD2] font-bold">{name}</span>
      <FaStar className="text-yellow-400" size={20} />
    </div>
  </div>
);

export default RatingItem;
