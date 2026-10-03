import Link from "next/link";
import type { Metadata } from "next";
import coursesData from "@/data/courses.json";

export const metadata: Metadata = {
  title: "Upcoming Courses & Events | RongRise Consulting",
  description: "From single-day workshops to series courses. Seats are limited, early registration recommended. AI transformation, talent strategy, and ESG training.",
  alternates: {
    canonical: "https://rong-rise.com/en/courses",
    languages: {
      zh: "https://rong-rise.com/courses",
    },
  },
  openGraph: {
    title: "Upcoming Courses & Events",
    description: "From single-day workshops to series courses. AI transformation, talent strategy, and ESG training.",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "RongRise Consulting" }],
  },
};

const statusLabels = {
  open: { label: "Open", color: "bg-success/10 text-success" },
  full: { label: "Full", color: "bg-gray-100 text-gray-500" },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-400" },
};

function isPast(dateStr: string) {
  return new Date(dateStr.replace(/\./g, "-")) < new Date();
}

// slug → English copy for courses shown on this page (source data is Chinese).
const courseEnCopy: Record<string, { type: string; title: string; desc: string; price: string; location: string; early?: string }> = {
  "ai-bootcamp-jul-2026": {
    type: "Public Class",
    title: "AI Bootcamp: From Fundamentals to Enterprise Deployment",
    desc: "Two-day intensive covering generative AI fundamentals, RTIF prompt engineering, AI maturity assessment, and enterprise rollout roadmaps.",
    price: "NT$8,800 per person",
    location: "Taipei (5 min walk from MRT)",
    early: "NT$7,200 (before 6/30)",
  },
  "agentic-aug-2026": {
    type: "Corporate Training",
    title: "Agentic AI Transformation Executive Alignment Camp",
    desc: "One-day executive workshop aligning vision to implementation, including Agent scenario assessment canvas exercises.",
    price: "Quoted by headcount",
    location: "On-site or Taipei",
  },
  "esg-sep-2026": {
    type: "Certification",
    title: "ESG Sustainability Consultant Certification Program",
    desc: "Certification track covering carbon footprint assessment, ESG reporting frameworks, and practical sustainability governance.",
    price: "NT$9,600 per person",
    location: "Taipei",
    early: "NT$8,000 (before 9/5)",
  },
  "hr-ai-nov-2026": {
    type: "Corporate Training",
    title: "HR × AI Transformation Workshop",
    desc: "Designed for HR professionals: AI tool practice, prompt engineering, Talent Grid 2.0, and HR AI compliance governance.",
    price: "Quoted by headcount",
    location: "Taipei or on-site",
  },
};

export default function CoursesEnPage() {
  const courses = coursesData.courses
    .filter((c: any) => !c.hidden && !isPast(c.date))
    .sort((a: any, b: any) => (a.date < b.date ? -1 : 1));

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
            {courses.map((course: any) => {
              const status = statusLabels[course.status as keyof typeof statusLabels] || statusLabels.open;
              const copy = courseEnCopy[course.id];
              return (
                <div key={course.id} className="card overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    <div className="md:w-32 bg-primary/5 flex flex-row md:flex-col items-center justify-center p-4 md:p-6 border-b md:border-b-0 md:border-r border-border-light">
                      <div className="text-center">
                        <div className="text-xs text-text-secondary">{new Date(course.date.replace(/\./g, "-")).toLocaleDateString("en-US", { month: "short" })}</div>
                        <div className="text-3xl font-bold text-primary">{new Date(course.date.replace(/\./g, "-")).getDate()}</div>
                        <div className="text-xs text-text-secondary">{new Date(course.date.replace(/\./g, "-")).getFullYear()}</div>
                      </div>
                    </div>
                    <div className="flex-1 p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="tag">{copy ? copy.type : course.type}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${status.color}`}>{status.label}</span>
                          </div>
                          <h3 className="heading-subsection text-text-primary">{copy ? copy.title : course.title}</h3>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-3">
                        <span>🕐 {course.time}</span>
                        <span>📍 {copy ? copy.location : course.location}</span>
                        <span>👥 {course.seatsLeft}/{course.seats} seats left</span>
                      </div>
                      <p className="text-text-secondary text-body-sm mb-4">{copy ? copy.desc : course.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary">{copy ? copy.price : course.price}</span>
                          {(copy ? copy.early : course.earlyBirdPrice) && <span className="text-xs text-tertiary ml-2">Early bird {copy ? copy.early : course.earlyBirdPrice}</span>}
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
