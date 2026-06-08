"use client"


const RoundedButton = ({ text, onClick, icon: Icon, className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 px-5 py-2 bg-[#0093dd] text-white rounded-full font-medium hover:bg-[#007dc0] transition duration-300 ${className}`}
        >
            <span>{text}</span>
            {Icon && <Icon className="w-4 h-4" />}
        </button>
    );
};

export default RoundedButton;



// import RoundedButton from "@/components/core/common/RoundedButton";
// import { FiArrowRight } from "react-icons/fi"; // Optional icon

// const Example = () => {
//   const handleClick = () => {
//     alert("Button Clicked");
//   };

//   return (
//     <div className="space-y-4">
//       <RoundedButton text="Contact us" onClick={handleClick} />

//       <RoundedButton
//         text="Share Your Requirement"
//         onClick={handleClick}
//         icon={FiArrowRight}
//       />
//     </div>
//   );
// };

// export default Example;
