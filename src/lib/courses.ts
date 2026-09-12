// src/lib/courses.ts
// 課程資料來源：行事曆 app 的公開 API（單一來源，不再用手寫 JSON）
import courseDetails from "@/data/course-details.json";

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  courseType: string | null;
  location: string | null;
  price: string | null;
  earlyBirdPrice: string | null;
  promoEnd: string | null;
  seats: number | null;
  enrollOpen: boolean;
  tags: string[];
  enrolled: number;
  seatsLeft: number | null;
  full: boolean;
  enrollable: boolean;
};

const API_BASE = process.env.COURSES_API_URL || "https://rong-rise.com/api/courses";

export async function getCourses(includePast = false): Promise<Course[]> {
  const url = includePast ? `${API_BASE}?past=1` : API_BASE;
  try {
    // 建置時抓取並快取（output: export 需靜態；勿用 no-store 否則頁面會被判定為動態）
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[courses] API ${res.status}`);
      return [];
    }
    const data = await res.json();
    return (data.courses || []) as Course[];
  } catch (err) {
    console.warn("[courses] fetch failed:", err);
    return [];
  }
}

export async function getCourse(slug: string): Promise<Course | null> {
  const all = await getCourses(true);
  return all.find((c) => c.slug === slug) || null;
}

// 課程狀態：course-details.json 的 status === "preparing" 代表「籌備中，即將公開」
// （尚未開放報名、資訊仍在確認；前台要 grey out 報名表並隱藏未定資訊）
export function isPreparing(slug: string): boolean {
  const entry = (courseDetails as Record<string, { status?: string }>)[slug];
  return entry?.status === "preparing";
}

export function courseStatus(c: Course, preparing = false): { label: string; color: string } {
  if (preparing) return { label: "籌備中，即將公開", color: "bg-accent/15 text-accent" };
  if (!c.enrollOpen) return { label: "已關閉報名", color: "bg-gray-100 text-gray-500" };
  if (c.full) return { label: "額滿（可候補）", color: "bg-gray-100 text-gray-500" };
  if (new Date(c.endAt) < new Date()) return { label: "已結束", color: "bg-gray-100 text-gray-400" };
  return { label: "報名中", color: "bg-success/10 text-success" };
}

export function formatCourseDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("zh-TW", { year: "numeric", month: "short", day: "numeric" });
}

export function formatCourseRange(c: Course): string {
  const s = new Date(c.startAt);
  const e = new Date(c.endAt);
  const fmt = (d: Date) =>
    `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const sameDay = s.toDateString() === e.toDateString();
  if (sameDay) {
    return `${fmt(s)}–${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}`;
  }
  return `${fmt(s)} 起`;
}
