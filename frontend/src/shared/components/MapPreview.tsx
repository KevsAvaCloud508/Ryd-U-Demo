import type { ReactNode } from 'react';

interface MapPreviewProps {
  className?: string;
  children?: ReactNode;
}

// Placeholder visual de mapa con cuadrícula y ruta punteada y acomodo de puntos
export function MapPreview({ className = '', children }: MapPreviewProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[#141416] ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(#2a2a2e 1px, transparent 1px), linear-gradient(90deg, #2a2a2e 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div
        className="absolute left-[90px] top-20 h-[150px] w-[300px] rounded-tr-[60px] border-r-[3px] border-t-[3px] border-dashed border-white opacity-85"
      />
      <div
        className="absolute h-[22px] w-[22px] rounded-full border-[5px] border-black bg-white shadow-[0_0_0_2px_#fff]"
        style={{ left: 378, top: 210 }}
      />
      <div
        className="absolute h-[22px] w-[22px] rounded-full border-[5px] border-black bg-muted shadow-[0_0_0_2px_#fff]"
        style={{ left: 90, top: 70 }}
      />
      {children}
    </div>
  );
}
