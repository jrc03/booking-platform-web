// src/components/ui/Button.tsx
import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button = ({ children, isLoading, disabled, className, ...props }: ButtonProps) => {
  const isDisabled = isLoading || disabled;

  return (
    <button
      disabled={isDisabled}
      className={`w-full py-3 text-sm tracking-widest uppercase font-medium rounded-none transition-all duration-200 ${
        isDisabled
          ? "bg-stone-300 text-stone-400 cursor-not-allowed"
          : "bg-stone-900 text-stone-50 hover:bg-stone-700 active:scale-[0.99]"
      } ${className || ''}`}
      {...props}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
};

export default Button;