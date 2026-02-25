"use client";

import { useTravelPlan } from "@/src/application/useTravelPlan";
import { SearchForm } from "@/src/components/SearchForm";
import { ClimateCard } from "@/src/components/ClimateCard";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const { data, isLoading, error, generatePlan } = useTravelPlan();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-900">
      {/* Full-screen background with subtle gradient */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        aria-hidden
      />
      <div
        className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]"
        aria-hidden
      />

      <main className="relative flex min-h-screen flex-col items-center px-4 py-10 sm:px-6">
        <h1 className="mb-10 text-center text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
          Climate-Aware Travel Planner
        </h1>

        <div className="mb-8 w-full max-w-xl">
          <SearchForm onSubmit={generatePlan} isLoading={isLoading} />
        </div>

        {error && (
          <div
            className="mb-6 flex w-full max-w-xl items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200 backdrop-blur-sm"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {data && (
          <div className="w-full max-w-2xl">
            <ClimateCard plan={data} />
          </div>
        )}
      </main>
    </div>
  );
}
