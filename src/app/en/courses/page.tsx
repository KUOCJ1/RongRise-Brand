import Link from "next/link";
import type { Metadata } from "next";
import coursesData from "@/data/courses.json";

export const metadata: Metadata = {
  title: "Upcoming Courses & Events | RongRise Consulting",
  description: "From single-day workshops to series courses. Seats are limited, early registration recommended. AI transformation, talent strategy, and ESG training.",
  alternates: {
    canonical: "https://rongrise.com/en/courses",
    languages: {
      zh: "https://rongrise.com/courses",
    },
  },
};

const statusLabels = {
  open: { label: "Open", color: "bg-success/10 text-success" },
  full: { label: "Full", color: "bg-gray-100 text-gray-500" },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-400" },
};

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export default function CoursesEnPage() {
  const courses = coursesData.courses.filter((c) => !isPast(c.date));

  return (
    <>
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">Course Calendar</span>
          <h1 className="heading-hero mt-4 mb-4">Upcoming Courses & Events</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            From single-day workshops to series courses. Seats are limited, early registration recommended.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="max-w-4xl mx-auto space-y-6">
            {courses.length === 0 && (
              <div className="text-center py-12 text-text-secondary">
                <p className="text-4xl mb-4">📅</p>
                <p className="text-body-lg">No upcoming courses at the moment. Stay tuned!</p>
                <Link href="/en/news" className="btn-secondary mt-4 inline-block">View Latest News</Link>
              </div>
            )}
            {courses.map((course) => {
              const status = statusLabels[course.status as keyof typeof statusLabels] || statusLabels.open;
              return (
                <div key={course.id} className="card overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    <div className="md:w-32 bg-primary/5 flex flex-row md:flex-col items-center justify-center p-4 md:p-6 border-b md:border-b-0 md:border-r border-border-light">
                      <div className="text-center">
                        <div className="text-xs text-text-secondary">{new Date(course.date).toLocaleDateString("en-US", { month: "short" })}</div>
                        <div className="text-3xl font-bold text-primary">{new Date(course.date).getDate()}</div>
                        <div className="text-xs text-text-secondary">{new Date(course.date).getFullYear()}</div>
                      </div>
                    </div>
                    <div className="flex-1 p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="tag">{course.type}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${status.color}`}>{status.label}</span>
                          </div>
                          <h3 className="heading-subsection text-dark">{course.title}</h3>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-3">
                        <span>🕐 {course.time}</span>
                        <span>📍 {course.location}</span>
                        <span>👥 {course.seatsLeft}/{course.seats} seats left</span>
                      </div>
                      <p className="text-text-secondary text-body-sm mb-4">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary">{course.price}</span>
                          {course.earlyBirdPrice && <span className="text-xs text-tertiary ml-2">Early bird {course.earlyBirdPrice}</span>}
                        </div>
                        <div className="flex gap-2">
                          <Link href={course.link} className="btn-ghost text-sm text-primary">Details</Link>
                          <Link href="/en/about#contact" className="btn-primary text-sm">Register</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <p className="text-text-secondary text-sm mb-4">Need customized corporate training?</p>
            <Link href="/en/about#contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
