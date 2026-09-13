import React from "react";

interface IconProps {
  name: string;
  className?: string;
  /** Material Symbols fill variation (0 = outlined, 1 = filled) */
  fill?: 0 | 1;
  size?: number;
}

/**
 * Renders a single Material Symbols Outlined icon.
 * Keeps icon usage declarative and avoids raw className repetition.
 */
export default function Icon({ name, className = "", fill = 0, size }: IconProps) {
  const sizeStyle = size ? { fontSize: `${size}px` } : undefined;
  const fillStyle =
    fill === 1
      ? { fontVariationSettings: "'FILL' 1" }
      : undefined;

  return (
    <span
      className={`material-symbols-outlined leading-none select-none ${className}`}
      style={{ ...sizeStyle, ...fillStyle }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
