"use client";

import * as icons from 'lucide-react';
import { MapPin } from 'lucide-react';

/** Converts kebab-case or snake_case to PascalCase (e.g. 'sun' -> 'Sun', 'map-pin' -> 'MapPin'). */
function toPascalCase(name: string): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

interface DynamicIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a Lucide icon by string name. Falls back to MapPin if the icon is not found.
 */
export function DynamicIcon({ name, className, style }: DynamicIconProps) {
  const pascalName = toPascalCase(name.trim());
  const iconRecord = icons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;
  const IconComponent = pascalName ? iconRecord[pascalName] : null;
  const Icon = (typeof IconComponent === 'function' ? IconComponent : MapPin) as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

  return <Icon className={className} style={style} aria-hidden />;
}
