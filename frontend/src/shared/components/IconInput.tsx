import type { InputHTMLAttributes } from 'react';

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: string;
  label: string;
}

export function IconInput({ icon, label, className = '', ...rest }: IconInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[15px] font-semibold text-[#A0A0A0]">{label}</label>
      <div className="flex items-center gap-3 rounded-[18px] border border-[#353535] bg-[#222222] px-4 py-3">
        <i className={`${icon} text-lg text-[#6B6B6B] shrink-0`} />
        <input
          className={`flex-1 bg-transparent text-[17px] font-medium text-white placeholder-[#6B6B6B] outline-none ${className}`}
          {...rest}
        />
      </div>
    </div>
  );
}
