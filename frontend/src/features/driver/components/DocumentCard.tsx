import { useRef, useState, type ChangeEvent } from 'react';

interface DocumentCardProps {
  icon: string;
  title: string;
  subtitle: string;
  completed?: boolean;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
}

export function DocumentCard({ icon, title, subtitle, completed = false, onUpload, onRemove }: DocumentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hoveringRemove, setHoveringRemove] = useState(false);

  const handleClick = () => {
    if (completed) {
      onRemove?.();
    } else {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    e.target.value = '';
  };

  return (
    <div className="flex items-center justify-between rounded-[18px] border border-[#353535] bg-[#222222] p-5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#343434]">
          <i className={`${icon} text-xl text-white`} />
        </div>
        <div>
          <p className="text-lg font-bold text-white">{title}</p>
          <p className="text-sm font-medium text-[#8d8d8d]">{subtitle}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setHoveringRemove(completed)} // true solo si está completado
        onMouseLeave={() => setHoveringRemove(false)}
        className={`flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border transition-colors ${
          completed
            ? 'border-white bg-white/10 hover:border-red-400 hover:bg-red-900/30'
            : 'border-[#8d8d8d] hover:border-white hover:bg-white/10'
        }`}
      >
        {completed && hoveringRemove ? (
          <i className="bi bi-x text-sm text-red-400" />
        ) : completed ? (
          <i className="bi bi-check-lg text-sm text-white" />
        ) : (
          <i className="bi bi-plus-lg text-sm text-[#8d8d8d]" />
        )}
      </button>
    </div>
  );
}
