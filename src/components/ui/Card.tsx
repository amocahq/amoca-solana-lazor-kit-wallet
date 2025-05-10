import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-md overflow-hidden';
  const hoverClasses = hoverEffect ? 'transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;