// src/components/ui/Input.tsx
import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; 
}

const Input = ({ label, id, error, ...props }: InputProps) => {
  return (
    <div className="space-y-1.5 pt-1">
      <label
        htmlFor={id}
        className="block text-[11px] tracking-widest uppercase text-stone-400 font-medium"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-0 py-2.5 bg-transparent border-b text-stone-800 text-sm font-light placeholder:text-stone-300 focus:outline-none transition-colors duration-200 ${
          error 
            ? "border-red-500 focus:border-red-700" 
            : "border-stone-300 focus:border-stone-700"
        } ${props.className || ''}`}
        {...props}
      />
      <div className="min-h-4">
        {error && <span className="text-xs text-red-500 block">{error}</span>}
      </div>
    </div>
  );
};

export default Input;