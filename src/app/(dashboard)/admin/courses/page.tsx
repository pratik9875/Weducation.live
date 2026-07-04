import { BookOpen, IndianRupee } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/types/database";
import { StatCard } from "@/components/dashboard/StatCard";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { createCourse, deleteCourse, updateCourse } from "../actions";

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchTerm = q?.trim() ?? "";

  const supabase = await createClient();
  let query = supabase.from("courses").select("*").order("name");
  if (searchTerm) query = query.ilike("name", `%${searchTerm}%`);

  const [{ data: courses }, { count: total }] = await Promise.all([
    query,
    supabase.from("courses").select("*", { count: "exact", head: true }),
  ]);

  const rows = (courses as Course[] | null) ?? [];
  const avgFee =
    rows.length > 0 ? Math.round(rows.reduce((sum, c) => sum + c.fee, 0) / rows.length) : 0;

  const exportRows = rows.map((c) => ({
    name: c.name,
    fee: c.fee,
    intake_year: c.intake_year,
    created_at: c.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Course Management</h1>
      <p className="mt-1 text-sm text-slate-500">
        Courses offered to applicants — the fee and intake year shown here drive the WhatsApp
        assistant&apos;s fee quotes and application eligibility checks.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total courses" value={total ?? 0} icon={BookOpen} />
        <StatCard
          label="Average fee"
          value={`₹${avgFee.toLocaleString("en-IN")}`}
          icon={IndianRupee}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            New course
          </h2>
          <form
            action={createCourse}
            className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <label htmlFor="course-name" className="block text-xs font-medium text-slate-600">
                Name
              </label>
              <input
                id="course-name"
                type="text"
                name="name"
                required
                placeholder="B.Tech Computer Science"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="course-fee" className="block text-xs font-medium text-slate-600">
                Fee (₹)
              </label>
              <input
                id="course-fee"
                type="number"
                name="fee"
                required
                min="0"
                step="0.01"
                placeholder="185000"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="course-intake" className="block text-xs font-medium text-slate-600">
                Intake year
              </label>
              <input
                id="course-intake"
                type="text"
                name="intake_year"
                required
                placeholder="2026"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Add course
            </button>
          </form>
        </section>

        <section className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            All courses
          </h2>
          <div className="mt-3">
            <TableToolbar
              searchPlaceholder="Search course name…"
              exportRows={exportRows}
              exportFilename="courses.csv"
            />
          </div>
          <div className="mt-4 space-y-3">
            {rows.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
                {searchTerm
                  ? "No courses match your search."
                  : "No courses yet — add your first one on the left."}
              </div>
            )}
            {rows.map((course) => (
              <form
                key={course.id}
                action={updateCourse}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <input type="hidden" name="course_id" value={course.id} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={course.name}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">Fee (₹)</label>
                    <input
                      type="number"
                      name="fee"
                      required
                      min="0"
                      step="0.01"
                      defaultValue={course.fee}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      Intake year
                    </label>
                    <input
                      type="text"
                      name="intake_year"
                      required
                      defaultValue={course.intake_year}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="submit"
                    className="rounded-md bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Save changes
                  </button>
                  <button
                    type="submit"
                    formAction={deleteCourse}
                    className="rounded-md border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </form>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
