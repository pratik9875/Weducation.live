"use client";

import { useRef, useTransition } from "react";

// A <select> that submits its enclosing server-action form on change,
// so inline table mutations don't need a separate Save button.
export function InlineSelectForm({
  action,
  hiddenFields,
  name,
  value,
  options,
  ariaLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  hiddenFields: Record<string, string>;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  ariaLabel: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await action(formData);
        });
      }}
    >
      {Object.entries(hiddenFields).map(([key, val]) => (
        <input key={key} type="hidden" name={key} value={val} />
      ))}
      <select
        name={name}
        defaultValue={value}
        aria-label={ariaLabel}
        disabled={pending}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-brand-500 focus:outline-none disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
}
