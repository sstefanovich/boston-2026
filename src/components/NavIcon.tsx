interface NavIconProps {
  name: string;
  className?: string;
  size?: number;
}

/** Uses symbols from the inlined IconSprite (#icon-{name}). */
export function NavIcon({ name, className = '', size = 24 }: NavIconProps) {
  return (
    <svg
      className={`nav-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <use href={`#icon-${name}`} />
    </svg>
  );
}
