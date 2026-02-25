"use client";

import { useState } from 'react';
import type { Month, SupportedLanguage } from '../domain/constants';
import { MONTHS, SUPPORTED_LANGUAGES } from '../domain/constants';
import { Search } from 'lucide-react';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'En',
  es: 'Es',
};

interface SearchFormProps {
  onSubmit: (city: string, month: Month, language: SupportedLanguage) => void;
  isLoading: boolean;
}

export function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [city, setCity] = useState('');
  const [month, setMonth] = useState<Month>('January');
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    onSubmit(city.trim(), month, language);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
        <div className="flex-1">
          <label htmlFor="city" className="mb-1 block text-sm font-medium text-white/90">
            City
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. London"
            disabled={isLoading}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
          />
        </div>
        <div className="min-w-[140px]">
          <label htmlFor="month" className="mb-1 block text-sm font-medium text-white/90">
            Month
          </label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value as Month)}
            disabled={isLoading}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m} className="bg-zinc-900 text-white">
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[100px]">
          <label htmlFor="language" className="mb-1 block text-sm font-medium text-white/90">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            disabled={isLoading}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-zinc-900 text-white">
                {LANGUAGE_LABELS[lang]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          className="flex h-[42px] min-w-[120px] items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/15 px-5 font-medium text-white shadow-lg transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Loading…
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Search
            </>
          )}
        </button>
      </div>
    </form>
  );
}
