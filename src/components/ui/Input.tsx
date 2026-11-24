import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold tracking-wide text-[#3A3A3A] uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#646464] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'w-full min-h-[44px] rounded-full bg-white text-sm text-[#202020] placeholder-[#646464]/60 transition-all border outline-none px-4',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-[#202020]/15 focus:border-[#42A9D8] focus:ring-2 focus:ring-[#7CCBEE]/30',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#646464] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-500 pl-2">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#646464] pl-2">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
