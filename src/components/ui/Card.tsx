import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'bone' | 'dark';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  className,
  ...props
}) => {
  const variantStyles = {
    white: 'bg-white border-[#202020]/10 text-[#202020]',
    bone: 'bg-[#F3F0E8] border-[#202020]/10 text-[#202020]',
    dark: 'bg-[#202020] border-[#202020] text-white',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl border p-6 transition-all duration-200 shadow-soft',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
