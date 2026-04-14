import type { ReactNode, TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

const TextArea = ({ label, id, error, icon, ...props }: TextAreaProps) => {
  return (
    <div className="space-y-1.5 pt-1">
      <label
        htmlFor={id}
        className="block text-[11px] tracking-widest uppercase text-stone-400 font-medium"
      >
        {label}
      </label>
      <div className="relative">
        <textarea
          id={id}
          className={`w-full ${icon ? "pl-8" : "px-4"} py-3 bg-stone-50 border rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors placeholder:text-stone-400 font-light text-stone-800 resize-none ${
            error
              ? "border-red-500 focus:border-red-700"
              : "border-stone-200"
          } ${props.className || ""}`}
          {...props}
        />
        {icon && (
          <div className="absolute left-2 top-3.5 text-stone-400 pointer-events-none">
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

export default TextArea;
