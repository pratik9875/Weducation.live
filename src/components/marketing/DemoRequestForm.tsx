"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export function DemoRequestForm() {
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      universityName: form.get("universityName"),
      phone: form.get("phone"),
    };

    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-lg border border-brand-200 bg-brand-50 p-6">
        <p className="font-semibold text-brand-800">Request received</p>
        <p className="mt-1 text-sm text-brand-700">
          Our team will reach out shortly to schedule your demo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Your name
        </label>
        <input id="name" name="name" required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Work email
        </label>
        <input id="email" name="email" type="email" required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="universityName" className="block text-sm font-medium text-slate-700">
          University / Institution
        </label>
        <input id="universityName" name="universityName" required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
          Phone (optional)
        </label>
        <input id="phone" name="phone" className={inputClasses} />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700 disabled:opacity-50"
      >
        {state === "submitting" ? "Submitting…" : "Request a Demo"}
      </button>

      {state === "error" && (
        <p className="text-sm text-red-600">Something went wrong — please try again.</p>
      )}
    </form>
  );
}
