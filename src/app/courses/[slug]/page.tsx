import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCourses,
  getCourse,
  courseStatus,
  formatCourseRange,
} from "@/lib/courses";
import EnrollForm from "./EnrollForm";
import courseDetailsData from "@/data/course-details.json";
import coursePolicy from "@/data/course-policy.json";

type CourseDetail = {
  intro?: string[];
  audience?: string[];
  outcomes?: string[];
  outline?: { time: string; title: string; detail?: string }[];
  takeaway?: string[];
  prereq?: string;
  instructor?: string;
  notes?: string[];
};

const courseDetails = courseDetailsData as Record<string, CourseDetail>;

export async function generateStaticParams() {
  const courses = await getCourses(true);
  // ⚠️ output: export 下回傳空陣列會導致 build 失敗，需給一個佔位路徑
  if (courses.length === 0) return [{ slug: "_placeholder" }];
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCourse(slug);
  if (!c) return { title: "課程｜榕耀管顧 RongRise Consulting" };
  return {
    title: `${c.title}｜課程｜榕耀管顧`,
    description: c.description || `${c.title} — 榕耀管顧專業培訓課程，名額有限。`,
    alternates: { canonical: `https://rong-rise.com/courses/${c.slug}` },
    openGraph: {
      title: `${c.title}｜榕耀管顧`,
      description: c.description || "",
      images: [
        {
          url: "https://rong-rise.com/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: c.title,
        },
      ],
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const status = courseStatus(course);
  const extra = courseDetails[course.slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description || undefined,
    teaches: extra?.outcomes?.length ? extra.outcomes.join("、") : undefined,
    coursePrerequisites: extra?.prereq,
    provider: {
      "@type": "Organization",
      name: "榕耀管顧 RongRise Consulting",
      sameAs: "https://rong-rise.com",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: course.courseType === "線上課程" ? "online" : "onsite",
      startDate: course.startAt,
      endDate: course.endAt,
      location: course.location
        ? { "@type": "Place", name: course.location }
        : undefined,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14 md:py-18">
          <Link href="/courses" className="text-white/70 text-sm hover:text-white">
            ← 回課程列表
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-5 mb-3">
            {course.courseType && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white font-medium">
                {course.courseType}
              </span>
            )}
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-white font-medium">
              {status.label}
            </span>
          </div>
          <h1 className="heading-hero mb-4">{course.title}</h1>
          {course.description && (
            <p className="text-body-lg text-white/85 max-w-3xl">{course.description}</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* 左：課程資訊 */}
            <div className="lg:col-span-2 space-y-8">
              <div className="card p-6">
                <h2 className="heading-subsection text-text-primary mb-4">課程資訊</h2>
                <dl className="space-y-3 text-body">
                  <div className="flex gap-4">
                    <dt className="w-20 text-text-secondary shrink-0">時間</dt>
                    <dd className="text-text-primary font-medium">
                      {formatCourseRange(course)}
                    </dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-20 text-text-secondary shrink-0">地點</dt>
                    <dd className="text-text-primary font-medium">
                      {course.location || "將於開課前通知"}
                    </dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-20 text-text-secondary shrink-0">費用</dt>
                    <dd className="text-text-primary font-medium">
                      {course.price || "請與我們聯繫"}
                      {course.earlyBirdPrice && (
                        <span className="block text-sm text-accent mt-1">
                          早鳥優惠 {course.earlyBirdPrice}
                          {course.promoEnd &&
                            `（${new Date(course.promoEnd).toLocaleDateString("zh-TW", {
                              month: "numeric",
                              day: "numeric",
                            })} 前）`}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-20 text-text-secondary shrink-0">名額</dt>
                    <dd className="text-text-primary font-medium">
                      {course.seatsLeft === null
                        ? "不限"
                        : course.full
                          ? "已額滿（可排候補）"
                          : `剩餘 ${course.seatsLeft}/${course.seats} 位`}
                    </dd>
                  </div>
                </dl>
              </div>

              {course.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((t) => (
                    <span
                      key={t}
                      className="text-sm px-3 py-1.5 rounded-full bg-bg-secondary text-text-secondary"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {extra?.intro && extra.intro.length > 0 && (
                <div className="card p-6">
                  <h2 className="heading-subsection text-text-primary mb-4">課程介紹</h2>
                  <div className="space-y-4 text-body text-text-secondary leading-relaxed">
                    {extra.intro.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {extra?.outcomes && extra.outcomes.length > 0 && (
                <div className="card p-6">
                  <h2 className="heading-subsection text-text-primary mb-4">這堂課你會學到</h2>
                  <ol className="space-y-3">
                    {extra.outcomes.map((o, i) => (
                      <li key={i} className="flex gap-3 text-body text-text-primary">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-bg-secondary text-primary text-sm font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{o}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {extra?.outline && extra.outline.length > 0 && (
                <div className="card p-6">
                  <h2 className="heading-subsection text-text-primary mb-2">課程大綱</h2>
                  <p className="text-sm text-text-secondary mb-4">
                    一整天 8 小時，上午建立觀念與判讀力，下午動手實作。
                  </p>
                  <ul>
                    {extra.outline.map((slot, i) => (
                      <li
                        key={i}
                        className="flex gap-4 py-3 border-b border-border last:border-0"
                      >
                        <span className="w-24 shrink-0 text-sm font-semibold text-primary tabular-nums">
                          {slot.time}
                        </span>
                        <div>
                          <div className="text-body font-semibold text-text-primary">
                            {slot.title}
                          </div>
                          {slot.detail && (
                            <div className="text-sm text-text-secondary mt-1 leading-relaxed">
                              {slot.detail}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {((extra?.audience && extra.audience.length > 0) || extra?.prereq) && (
                <div className="card p-6">
                  <h2 className="heading-subsection text-text-primary mb-4">適合對象</h2>
                  {extra?.audience && extra.audience.length > 0 && (
                    <ul className="space-y-2 text-body text-text-secondary list-disc list-inside">
                      {extra.audience.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                  {extra?.prereq && (
                    <p className="mt-4 pt-4 border-t border-border text-sm text-text-secondary leading-relaxed">
                      <span className="font-semibold text-text-primary">先備條件：</span>
                      {extra.prereq}
                    </p>
                  )}
                </div>
              )}

              {extra?.takeaway && extra.takeaway.length > 0 && (
                <div className="card p-6 bg-bg-secondary">
                  <h2 className="heading-subsection text-text-primary mb-4">你將帶走</h2>
                  <ul className="space-y-2 text-body text-text-primary">
                    {extra.takeaway.map((t, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-accent shrink-0 font-bold">✓</span>
                        <span className="leading-relaxed">{t}</span>
                      </li>
                    ))}
                  </ul>
                  {extra?.notes && extra.notes.length > 0 && (
                    <ul className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm text-text-secondary">
                      {extra.notes.map((n, i) => (
                        <li key={i}>・{n}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {extra?.instructor && (
                <div className="card p-6">
                  <h2 className="heading-subsection text-text-primary mb-3">講師</h2>
                  <p className="text-body text-text-secondary leading-relaxed">
                    {extra.instructor}
                  </p>
                </div>
              )}

              <div className="card p-6 bg-bg-secondary">
                <h2 className="heading-subsection text-text-primary mb-3">報名流程</h2>
                <ol className="space-y-2 text-body text-text-secondary list-decimal list-inside">
                  <li>填寫右側報名表單送出</li>
                  <li>系統立即寄出確認信到你的 Email</li>
                  <li>我們在 1 個工作日內以 Email 寄發繳費資訊（匯款）</li>
                  <li>完成繳費後保留名額，並於開課前寄發行前通知</li>
                </ol>
              </div>

              {coursePolicy?.items?.length > 0 && (
                <div className="card p-6">
                  <h2 className="heading-subsection text-text-primary mb-2">
                    {coursePolicy.title}
                  </h2>
                  {coursePolicy.updated && (
                    <p className="text-xs text-text-secondary mb-4">
                      最後更新：{coursePolicy.updated}
                    </p>
                  )}
                  <ol className="space-y-2 text-body text-text-secondary list-decimal list-inside leading-relaxed">
                    {coursePolicy.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                  {coursePolicy.note && (
                    <p className="mt-4 pt-4 border-t border-border text-sm text-text-secondary leading-relaxed">
                      {coursePolicy.note}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 右：報名表單 */}
            <div className="lg:col-span-1" id="enroll">
              <div className="lg:sticky lg:top-24">
                <EnrollForm
                  slug={course.slug}
                  courseTitle={course.title}
                  enrollable={course.enrollable}
                  full={course.full}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
