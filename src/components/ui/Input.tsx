// src/components/ui/Input.tsx
import { type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; 
  icon?: ReactNode; // NEW: Accept an optional icon!
}

const Input = ({ label, id, error, icon, ...props }: InputProps) => {
  return (
    <div className="space-y-1.5 pt-1">
      <label
        htmlFor={id}
        className="block text-[11px] tracking-widest uppercase text-stone-400 font-medium"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`w-full ${icon ? "pl-8" : "px-0"} py-2.5 bg-transparent border-b text-stone-800 text-sm font-light placeholder:text-stone-300 focus:outline-none transition-colors duration-200 ${
            error 
              ? "border-red-500 focus:border-red-700" 
              : "border-stone-300 focus:border-stone-700"
          } ${props.className || ''}`}
          {...props}
        />
        {/* NEW: Render the icon absolutely positioned! */}
        {icon && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      <div className="min-h-4">
        {error && <span className="text-xs text-red-500 block">{error}</span>}
      </div>
    </div>
  );
};

export default Input;