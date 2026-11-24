import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'neutral' | 'success' | 'warning' | 'danger' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    blue: 'bg-[#B8E7FA]/60 text-[#0E4A66] border border-[#7CCBEE]/40',
    neutral: 'bg-[#F3F0E8] text-[#3A3A3A] border border-[#202020]/10',
    success: 'bg-[#2B9A66]/10 text-[#2B9A66] border border-[#2B9A66]/20',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-600 border border-red-200',
    purple: 'bg-slate-100 text-slate-800 border border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full tracking-wide',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
