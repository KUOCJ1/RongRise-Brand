import Link from "next/link";
import type { Metadata } from "next";
import coursesData from "@/data/courses.json";

export const metadata: Metadata = {
  title: "課程行事曆｜近期課程與活動｜榕耀管顧",
  description: "從單日工作坊到系列課程，找到最適合您的學習路徑。AI 轉型、人才策略、ESG 永續專業培訓，名額有限建議提早報名。",
  alternates: {
    canonical: "https://rongrise.com/courses",
    languages: {
      en: "https://rongrise.com/en/courses",
    },
  },
  openGraph: {
    title: "課程行事曆｜近期課程與活動 — 榕耀管顧",
    description: "從單日工作坊到系列課程，找到最適合您的學習路徑。AI 轉型、人才策略、ESG 永續專業培訓。",
    images: [{ url: "https://rong-rise.com/images/og-image.jpg", width: 1200, height: 630, alt: "榕耀管顧 RongRise Consulting" }],
  },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  open: { label: "報名中", color: "bg-success/10 text-success" },
  full: { label: "額滿", color: "bg-gray-100 text-gray-500" },
  closed: { label: "已結束", color: "bg-gray-100 text-gray-400" },
};

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export default function CoursesPage() {
  const courses = coursesData.courses.filter((c) => !isPast(c.date));

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">課程行事曆</span>
          <h1 className="heading-hero mt-4 mb-4">近期課程與活動</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            從單日工作坊到系列課程，找到最適合您的學習路徑。
            名額有限，建議提早報名。
          </p>
        </div>
      </section>

      {/* Course List */}
      <section className="section">
        <div className="section-inner">
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
              const status = statusLabels[course.status] || statusLabels.open;
              return (
                <div key={course.id} className="card overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    {/* Date Block */}
                    <div className="md:w-32 bg-primary/5 flex flex-row md:flex-col items-center justify-center p-4 md:p-6 border-b md:border-b-0 md:border-r border-border-light">
                      <div className="text-center">
                        <div className="text-xs text-text-secondary">
                          {new Date(course.date).toLocaleDateString("zh-TW", { month: "short" })}
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          {new Date(course.date).getDate()}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {new Date(course.date).toLocaleDateString("zh-TW", { year: "numeric" })}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="tag">{course.type}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <h3 className="heading-subsection text-dark">{course.title}</h3>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-3">
                        <span>🕐 {course.time}</span>
                        <span>📍 {course.location}</span>
                        <span>👥 剩餘 {course.seatsLeft}/{course.seats} 名</span>
                      </div>

                      <p className="text-text-secondary text-body-sm mb-4">{course.description}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary">{course.price}</span>
                          {course.earlyBirdPrice && (
                            <span className="text-xs text-tertiary ml-2">早鳥 {course.earlyBirdPrice}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link href={course.link} className="btn-ghost text-sm text-primary">
                            課程詳情
                          </Link>
                          <Link href="/about#contact" className="btn-primary text-sm">
                            立即報名
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <p className="text-text-secondary text-sm mb-4">
              想為企業客製化專屬培訓課程？
            </p>
            <Link href="/about#contact" className="btn-secondary">
              聯繫討論企業內訓
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-subtle py-12">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <h3 className="heading-subsection text-dark mb-3">不想錯過開課通知？</h3>
          <p className="text-text-secondary text-body mb-4">
            訂閱轉型快訊，第一時間收到新課程公告與早鳥優惠。
          </p>
          <Link href="/" className="btn-secondary">
            前往首頁訂閱
          </Link>
        </div>
      </section>
    </>
  );
}
