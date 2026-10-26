import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = "https://rong-rise.com";
const NAVY = "#0D2B4E";
const GOLD = "#E8912A";
const TEAL = "#2EC4B6";

export const metadata: Metadata = {
  title: "我不在公司的 13 天：一次公開實驗的系列總覽 | 榕耀管顧",
  description:
    "13 天、169 次服務檢查、7 件錯。經營者離開公司，內容 operation 交給 AI 員工團隊，只保留每天約 37 分鐘的簽核。三篇紀錄與一支影片，數字全部公開，包含出包與修復。",
  alternates: {
    canonical: `${SITE_URL}/knowledge/human-absent-13-days`,
  },
  openGraph: {
    title: "我不在公司的 13 天：一次公開實驗的系列總覽 | 榕耀管顧",
    description:
      "13 天、169 次服務檢查、7 件錯。數字全部公開，包含出包與修復。",
    images: [
      {
        url: `${SITE_URL}/images/article-ai-operation-experiment.jpg`,
        width: 1200,
        height: 630,
        alt: "我不在公司的 13 天：一次公開實驗",
      },
    ],
  },
};

const POSTS = [
  {
    n: "開場",
    title: "我不在公司的 13 天：一次公開實驗的起點",
    href: "/knowledge/ai-operation-experiment",
    date: "2026-10-08",
    readTime: "6 分鐘",
    desc: "實驗條件、邊界，以及要公開哪些數字。當時先講清楚：哪些交給 AI、哪些我保留簽核、出包會不會寫出來。",
  },
  {
    n: "後台紀錄 1",
    title: "一天 37 分鐘的管理窗口，出了 7 件錯",
    href: "/knowledge/camino-operation-backstage",
    date: "2026-10-25",
    readTime: "8 分鐘",
    desc: "169 次服務檢查全部在線，內容與流程卻出了 7 件錯，其中 6 件不是機器壞掉，是檢查設在錯的位置。附每日在場時間與錯誤分類。",
  },
  {
    n: "後台紀錄 2",
    title: "管理制度，也可以先做一輪 POC 嗎？",
    href: "/knowledge/camino-operation-poc",
    date: "2026-10-27",
    readTime: "7 分鐘",
    desc: "同樣 37 分鐘，被切成十幾段。比起總時間，一天被叫回來幾次更接近真正的管理問題。下一輪試行三層授權。",
  },
];

const NUMBERS = [
  { n: "13 天", t: "實驗期間", s: "10/03 → 10/15" },
  { n: "37.1 分鐘", t: "每天在場時間", s: "中位數，切成 13 段" },
  { n: "169 次", t: "服務檢查", s: "全部在線" },
  { n: "7 件", t: "內容與流程出錯", s: "6 件是檢查位置設錯" },
];

export default function HumanAbsentThirteenDaysPage() {
  return (
    <>
      <script
        id="jsonld-series-human-absent-13-days"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/knowledge/human-absent-13-days`,
            name: "我不在公司的 13 天",
            description:
              "經營者離開公司 13 天，內容 operation 交給 AI 員工團隊，只保留每天約 37 分鐘的簽核。數字全部公開。",
            hasPart: POSTS.map((p) => ({
              "@type": "Article",
              headline: p.title,
              url: `${SITE_URL}${p.href}`,
              datePublished: p.date,
            })),
          }),
        }}
      ></script>
      <script
        id="breadcrumb-human-absent-13-days"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "首頁", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "知識庫", item: `${SITE_URL}/knowledge` },
              {
                "@type": "ListItem",
                position: 3,
                name: "我不在公司的 13 天",
                item: `${SITE_URL}/knowledge/human-absent-13-days`,
              },
            ],
          }),
        }}
      ></script>

      <section className="bg-gradient-hero text-white">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">公開實驗・系列總覽</span>
          <h1 className="heading-hero mt-4 mb-4">我不在公司的 13 天</h1>
          <p className="text-body-lg text-white/85 mb-3">
            十月，我去走朝聖之路。公司沒有其他真人員工，內容 operation 交給一支 AI 員工團隊，我只保留每天約 37 分鐘的簽核。
          </p>
          <p className="text-body-lg text-white/85 mb-2">
            這不是「AI 可以取代人」的展示，是一次有邊界、有紀錄、有出包的公開實驗。三篇寫完，數字全部留在這裡。
          </p>
          <p className="text-sm text-white/60">2026-10-08 起連載　共 3 篇＋1 支影片</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {NUMBERS.map((x) => (
              <div key={x.t} className="rounded-2xl border border-border-light bg-[#FBF8F3] p-4">
                <p className="text-2xl font-bold" style={{ color: NAVY }}>
                  {x.n}
                </p>
                <p className="mt-1 text-sm font-bold" style={{ color: GOLD }}>
                  {x.t}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{x.s}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <p className="text-sm font-bold tracking-widest mb-2" style={{ color: GOLD }}>
              系列文章
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">從條件、結果，到下一輪怎麼改</h2>

            <div className="space-y-4">
              {POSTS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="block rounded-2xl border border-border-light bg-white p-6 transition hover:border-[#0D2B4E]/40 hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
                    <span className="rounded-full px-2.5 py-1 font-bold text-white" style={{ backgroundColor: NAVY }}>
                      {p.n}
                    </span>
                    <span className="text-text-secondary">
                      {p.date}　閱讀約 {p.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-text-primary mb-2">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{p.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <figure className="my-14">
            <div className="mx-auto w-full max-w-[440px] overflow-hidden rounded-2xl border border-border-light bg-black/5">
              <video controls playsInline preload="metadata" poster="/images/backstage-ep02-poster.jpg" className="h-auto w-full">
                <source src="/videos/backstage-ep02-short.mp4" type="video/mp4" />
                你的瀏覽器不支援影片播放。
              </video>
            </div>
            <figcaption className="mt-3 text-center text-base text-text-secondary">
              52 秒看完後台紀錄 1：7 件錯、37.1 分鐘、56.3 小時的等待
            </figcaption>
          </figure>

          <div className="my-12 rounded-2xl border border-border-light bg-[#FBF8F3] p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>
              這個系列在測什麼
            </h2>
            <ul className="list-disc space-y-3 pl-5 text-text-secondary leading-relaxed">
              <li>
                <strong className="text-text-primary">測的不是 AI 有多萬能</strong>，是管理者每天只有 30 分鐘、只有手機時，一家公司的內容 operation 會變成什麼樣子。
              </li>
              <li>
                <strong className="text-text-primary">30 分鐘是期望，不是限制</strong>。實際中位數 37.1 分鐘，是目標的 1.24 倍，這一段寫在後台紀錄 1。
              </li>
              <li>
                <strong className="text-text-primary">沒有對照組</strong>。這是一個人的公司做的一次實驗，不能宣稱因果，只能說這 13 天發生了什麼。
              </li>
              <li>
                <strong className="text-text-primary">出包照寫</strong>。7 件錯全部列出，包含哪 6 件是我們自己設計錯了檢查位置。
              </li>
            </ul>
          </div>

          <div className="mt-10 mb-4 text-center">
            <p className="text-text-secondary mb-4">如果你也在想「離開兩週，公司還能不能跑」，這三篇是我們的答案與代價。</p>
            <Link
              href="/contact"
              className="inline-block rounded-full px-7 py-3 font-bold text-white"
              style={{ backgroundColor: GOLD }}
            >
              聊聊你的情況
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
