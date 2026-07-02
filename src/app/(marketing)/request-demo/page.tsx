import { DemoRequestForm } from "@/components/marketing/DemoRequestForm";

export default function RequestDemoPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Request a Demo</h1>
      <p className="mt-4 text-slate-600">
        Tell us about your institution and we&apos;ll walk you through the platform.
      </p>
      <div className="mt-8">
        <DemoRequestForm />
      </div>
    </div>
  );
}
