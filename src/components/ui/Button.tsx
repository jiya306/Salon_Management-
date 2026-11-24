import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantStyles = {
    primary:
      'bg-[#7CCBEE] text-[#143644] hover:bg-[#42A9D8] hover:text-white shadow-soft focus:ring-2 focus:ring-[#7CCBEE]/50',
    secondary:
      'bg-[#202020] text-white hover:bg-[#000000] focus:ring-2 focus:ring-[#202020]/40',
    outline:
      'border border-[#202020]/20 bg-transparent text-[#202020] hover:bg-[#F3F0E8] hover:border-[#202020]/40 focus:ring-2 focus:ring-[#7CCBEE]/30',
    ghost:
      'bg-transparent text-[#202020] hover:bg-[#F3F0E8] focus:ring-2 focus:ring-[#7CCBEE]/20',
    danger:
      'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:ring-2 focus:ring-red-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-sm px-5 py-2.5 min-h-[44px] gap-2',
    lg: 'text-base px-7 py-3 min-h-[48px] gap-2.5',
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
};
