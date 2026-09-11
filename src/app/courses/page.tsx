import Link from "next/link";
import type { Metadata } from "next";
import { getCourses, courseStatus, formatCourseDate } from "@/lib/courses";
import LiveSeats from "./LiveSeats";

export const metadata: Metadata = {
  title: "課程行事曆｜AI 轉型與 ESG 永續課程｜榕耀管顧",
  description:
    "從單日工作坊到系列課程，找到最適合您的學習路徑。AI 轉型、人才策略、ESG 永續專業培訓，名額有限建議提早報名。",
  alternates: {
    canonical: "https://rong-rise.com/courses",
    languages: { en: "https://rong-rise.com/en/courses" },
  },
  openGraph: {
    title: "課程行事曆｜AI 轉型與 ESG 永續課程",
    description: "從單日工作坊到系列課程，找到最適合您的學習路徑。",
    images: [
      {
        url: "https://rong-rise.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "榕耀管顧 RongRise Consulting",
      },
    ],
  },
};

export const dynamic = "force-static";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <>
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">課程行事曆</span>
          <h1 className="heading-hero mt-4 mb-4">近期課程與活動</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            從單日工作坊到系列課程，找到最適合您的學習路徑。名額有限，建議提早報名。
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <h2 className="sr-only">近期開課</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {courses.length === 0 && (
              <div className="text-center py-12 text-text-secondary">
                <p className="text-4xl mb-4">📅</p>
                <p className="text-body-lg">目前無近期課程，請關注最新消息。</p>
                <Link href="/news" className="btn-secondary mt-4 inline-block">
                  查看最新消息
                </Link>
              </div>
            )}

            {courses.map((course) => {
              const status = courseStatus(course);
              return (
                <div key={course.id} className="card overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    <div className="md:w-32 bg-primary/5 flex flex-row md:flex-col items-center justify-center p-4 md:p-6 border-b md:border-b-0 md:border-r border-border-light">
                      <div className="text-center">
                        <div className="text-xs text-text-secondary">
                          {new Date(course.startAt).toLocaleDateString("zh-TW", { month: "short" })}
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          {new Date(course.startAt).getDate()}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {new Date(course.startAt).toLocaleDateString("zh-TW", { year: "numeric" })}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-5 md:p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {course.courseType && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary">
                            {course.courseType}
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      <h3 className="heading-subsection text-text-primary">{course.title}</h3>

                      {course.description && (
                        <p className="text-body text-text-secondary mt-2">{course.description}</p>
                      )}

                      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-text-secondary">
                        <span>🗓 {formatCourseDate(course.startAt)}</span>
                        {course.location && <span>📍 {course.location}</span>}
                        <LiveSeats
                          slug={course.slug}
                          initial={{
                            enrolled: course.enrolled,
                            seats: course.seats,
                            seatsLeft: course.seatsLeft,
                            full: course.full,
                            enrollable: course.enrollable,
                          }}
                        />
                      </div>

                      {course.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {course.tags.map((t) => (
                            <span key={t} className="text-xs px-2 py-1 rounded bg-bg-secondary text-text-secondary">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 mt-5">
                        <div>
                          {course.price && <div className="text-lg font-bold text-primary">{course.price}</div>}
                          {course.earlyBirdPrice && (
                            <div className="text-xs text-accent font-medium">
                              早鳥 {course.earlyBirdPrice}
                            </div>
                          )}
                        </div>
                        <div className="flex-1" />
                        <Link href={`/courses/${course.slug}`} className="btn-ghost text-sm text-primary">
                          課程詳情
                        </Link>
                        <Link href={`/courses/${course.slug}#enroll`} className="btn-primary text-sm">
                          {course.enrollable ? "立即報名" : "查看課程"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-bg-secondary">
        <div className="section-inner text-center">
          <h2 className="heading-section mb-4">需要企業內訓或客製課程？</h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto mb-8">
            我們可以依照您的組織需求，設計專屬的 AI 轉型與管理培訓。
          </p>
          <Link href="/about#contact" className="btn-secondary">
            與我們聯繫
          </Link>
        </div>
      </section>
    </>
  );
}
