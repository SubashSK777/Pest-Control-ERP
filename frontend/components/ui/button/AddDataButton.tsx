import React from "react";
import { PlusIcon } from "@/icons";

interface AddDataButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

const AddDataButton: React.FC<AddDataButtonProps> = ({ 
  onClick, 
  label = "Add Data",
  className = ""
}) => {
  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white transition-all transform active:scale-95 bg-brand-500 rounded-xl hover:bg-brand-600 shadow-md hover:shadow-lg ${className}`}
    >
      <PlusIcon className="w-4 h-4 fill-current flex-shrink-0 translate-y-[2px]" />
      <span>{label}</span>
    </button>
  );
};

export default AddDataButton;
