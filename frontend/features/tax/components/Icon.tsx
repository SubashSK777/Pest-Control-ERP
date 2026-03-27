import React from 'react';

interface IconProps {
  icon: React.ElementType;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, className = "" }) => {
  return (
    <div className="flex items-center justify-center w-[18px] h-[18px] shrink-0 overflow-hidden">
      <IconComponent className={`w-4 h-4 object-contain fill-current shrink-0 ${className}`} />
    </div>
  );
};

export default Icon;
