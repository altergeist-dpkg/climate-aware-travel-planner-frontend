"use client";

import { DynamicIcon as LucideDynamicIcon } from 'lucide-react/dynamic';
import type { IconName } from 'lucide-react/dynamic';
import { MapPin } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a Lucide icon by kebab-case name (e.g. 'sun', 'cloud-rain').
 * Uses Lucide's dynamic import for smaller bundle size.
 * Falls back to MapPin while loading or if the icon is not found.
 */
export function DynamicIcon({ name, className, style }: DynamicIconProps) {
  const iconName = (name?.trim() || 'map-pin') as IconName;
  return (
    <LucideDynamicIcon
      name={iconName}
      className={className}
      style={style}
      aria-hidden
      fallback={() => <MapPin className={className} style={style} aria-hidden />}
    />
  );
}
