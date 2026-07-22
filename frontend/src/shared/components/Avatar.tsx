interface AvatarProps {
  initial: string;
  size?: number;
  light?: boolean;
  className?: string;
  photoUrl?: string | null;
  onClick?: () => void;
}

// Circulo de iniciales usado como foto de perfil.
// Si se proporciona photoUrl, muestra la imagen real, si no el inicial.
export function Avatar({ initial, size = 38, light = false, className = '', photoUrl, onClick }: AvatarProps) {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`grid flex-none place-items-center rounded-full border border-line font-extrabold overflow-hidden ${
        light ? 'bg-[#e5e5ea] text-black' : 'bg-gradient-to-br from-surface3 to-surface text-white'
      } ${isClickable ? 'cursor-pointer hover:ring-2 hover:ring-white/20 transition-all' : ''} ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.37) }}
    >
      {photoUrl ? (
        <img src={photoUrl} alt="Perfil" className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}
