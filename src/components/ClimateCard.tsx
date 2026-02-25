"use client";

import type { ClimatePlan } from '../domain/models';
import { DynamicIcon } from './DynamicIcon';
import { Thermometer, Cloud, ListChecks } from 'lucide-react';

interface ClimateCardProps {
  plan: ClimatePlan;
}

/** Returns a valid CSS color or a safe default so invalid hex does not break styling. */
function safeHex(hex: string | undefined): string {
  if (!hex || typeof hex !== 'string') return 'rgb(148 163 184)';
  const trimmed = hex.trim();
  if (/^#[0-9A-Fa-f]{3,8}$/.test(trimmed)) return trimmed;
  if (/^[0-9A-Fa-f]{3,8}$/.test(trimmed)) return `#${trimmed}`;
  return 'rgb(148 163 184)';
}

export function ClimateCard({ plan }: ClimateCardProps) {
  const accentColor = safeHex(plan.hex_code);

  return (
    <article
      className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md"
      style={{
        borderColor: accentColor,
        boxShadow: `0 0 0 1px ${accentColor}20, 0 25px 50px -12px rgba(0,0,0,0.4)`,
      }}
    >
      <header className="flex flex-wrap items-center gap-3 border-b border-white/10 p-5">
        <DynamicIcon
          name={plan.icon_name}
          className="h-8 w-8 shrink-0"
          style={{ color: accentColor }}
        />
        <div>
          <h2 className="text-xl font-semibold text-white">
            {plan.city}
            <span className="font-normal text-white/80"> — {plan.month}</span>
          </h2>
        </div>
      </header>

      <section className="border-b border-white/10 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-white/80">
          <Thermometer className="h-4 w-4" />
          Weather
        </h3>
        <div className="flex flex-wrap gap-4 text-white">
          <span>
            <strong>{plan.weather.temperature}°C</strong>
            <span className="text-white/70"> temp</span>
          </span>
          <span>
            <strong>{plan.weather.real_feel}°C</strong>
            <span className="text-white/70"> real feel</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Cloud className="h-4 w-4 text-white/70" />
            {plan.weather.condition}
          </span>
        </div>
      </section>

      <section className="border-b border-white/10 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-white/80">
          <ListChecks className="h-4 w-4" />
          Packing list
        </h3>
        <ul className="space-y-2">
          {plan.packing_list.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <span className="font-medium text-white">{item.name}</span>
              <p className="mt-0.5 text-sm text-white/70">{item.justification}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="p-4">
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white/90"
          style={{ backgroundColor: `${accentColor}30` }}
        >
          Confidence: {Math.round(plan.confidence_score * 100)}%
        </span>
      </footer>
    </article>
  );
}
