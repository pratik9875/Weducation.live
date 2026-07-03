"use client";

import { useTransition, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, RefreshCw, Search } from "lucide-react";

interface FilterConfig {
  param: string;
  label: string;
  options: { value: string; label: string }[];
}

interface SortOption {
  value: string;
  label: string;
}

export function TableToolbar({
  searchPlaceholder = "Search…",
  searchParamName = "q",
  filters = [],
  sortOptions,
  exportRows,
  exportFilename = "export.csv",
}: {
  searchPlaceholder?: string;
  searchParamName?: string;
  filters?: FilterConfig[];
  sortOptions?: SortOption[];
  exportRows?: Record<string, unknown>[];
  exportFilename?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("search") ?? "").trim();
    updateParam(searchParamName, value);
  }

  function handleExport() {
    if (!exportRows || exportRows.length === 0) return;
    const headers = Object.keys(exportRows[0]);
    const csvLines = [
      headers.join(","),
      ...exportRows.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? "")).join(","),
      ),
    ];
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportFilename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form onSubmit={handleSearchSubmit} className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          name="search"
          defaultValue={searchParams.get(searchParamName) ?? ""}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
        />
      </form>

      {filters.map((filter) => (
        <select
          key={filter.param}
          value={searchParams.get(filter.param) ?? ""}
          onChange={(e) => updateParam(filter.param, e.target.value)}
          aria-label={filter.label}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {sortOptions && (
        <select
          value={searchParams.get("sort") ?? sortOptions[0].value}
          onChange={(e) => updateParam("sort", e.target.value)}
          aria-label="Sort"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      <button
        type="button"
        onClick={handleExport}
        disabled={!exportRows || exportRows.length === 0}
        className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-40"
      >
        <Download className="h-4 w-4" /> Export CSV
      </button>
      <button
        type="button"
        onClick={() => startTransition(() => router.refresh())}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300"
      >
        <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} /> Refresh
      </button>
    </div>
  );
}
