import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "後台紀錄 2：管理制度，也可以先做一輪 POC | 榕耀管顧",
  description:
    "後台紀錄第 2 篇：13 天裡每天介入約 37 分鐘，卻被切成十幾段。比起總時間，一天被叫回來幾次，更接近真正的管理問題。下一輪試行三層授權。",
  alternates: {
    canonical: "https://rong-rise.com/knowledge/camino-operation-poc",
  },
  openGraph: {
    title: "後台紀錄 2：管理制度，也可以先做一輪 POC | 榕耀管顧",
    description:
      "工作完成了，流程還在等我。當 AI 團隊擴大，真正的瓶頸是被叫回系統的次數。",
    images: [
      {
        url: "https://rong-rise.com/images/article-camino-operation-poc.jpg",
        width: 1200,
        height: 630,
        alt: "後台紀錄 2：管理制度，也可以先做一輪 POC",
      },
    ],
  },
};

const NAVY = "#0D2B4E";
const BLUE = "#1A6DB5";
const GOLD = "#E8912A";
const TEAL = "#2EC4B6";
const GRID = "#D9D2C6";

const DAYS = [
  { d: "10/03", min: 79.8, visits: 23 },
  { d: "10/04", min: 92.0, visits: 19 },
  { d: "10/05", min: 30.6, visits: 17 },
  { d: "10/06", min: 30.1, visits: 15 },
  { d: "10/07", min: 37.1, visits: 13 },
  { d: "10/08", min: 22.3, visits: 11 },
  { d: "10/09", min: 24.1, visits: 11 },
  { d: "10/10", min: 42.1, visits: 9 },
  { d: "10/11", min: 33.1, visits: 11 },
  { d: "10/12", min: 68.5, visits: 22 },
  { d: "10/13", min: 69.1, visits: 16 },
  { d: "10/14", min: 35.5, visits: 12 },
  { d: "10/15", min: 56.9, visits: 13 },
];

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-bold tracking-widest text-tertiary mb-2">{kicker}</p>
      <h2 className="text-2xl md:text-3xl font-bold text-text-primary">{title}</h2>
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="my-10 rounded-2xl border-l-4 bg-[#FBF8F3] px-6 py-6 md:px-8"
      style={{ borderColor: GOLD }}
    >
      <p className="text-lg md:text-xl font-semibold leading-[1.8]" style={{ color: NAVY }}>
        {children}
      </p>
    </blockquote>
  );
}

function KpiRow() {
  const items = [
    { n: "13 天", t: "實驗期間，只有手機" },
    { n: "約 37 分", t: "每天介入時間" },
    { n: "13 段", t: "每天被切成的段數" },
    { n: "1–2 天", t: "工作等核准的時間" },
  ];
  return (
    <div className="my-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {items.map((it) => (
        <div key={it.t} className="rounded-2xl border border-border-light bg-white p-5">
          <p className="text-2xl md:text-3xl font-bold" style={{ color: NAVY }}>
            {it.n}
          </p>
          <p className="mt-1 text-sm text-text-secondary">{it.t}</p>
        </div>
      ))}
    </div>
  );
}

function MobileFragmentation() {
  const W = 360;
  const H = 340;
  const padL = 26;
  const padR = 8;
  const topH = 190;
  const plotW = W - padL - padR;
  const maxMin = 100;
  const bw = plotW / DAYS.length;
  const yMin = (v: number) => 18 + topH - (v / maxMin) * topH;
  const maxVisits = 25;
  const visitTop = 18 + topH + 52;
  const yVisit = (v: number) => visitTop + 70 - (v / maxVisits) * 70;

  return (
    <div className="md:hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="13 天每日介入時間與進場次數圖（手機版）">
        {[0, 30, 60, 90].map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={yMin(t)} y2={yMin(t)} stroke={GRID} strokeWidth={1} />
            <text x={padL - 6} y={yMin(t) + 5} textAnchor="end" fontSize="13" fill="#6B7280">
              {t}
            </text>
          </g>
        ))}
        <line x1={padL} x2={W - padR} y1={yMin(30)} y2={yMin(30)} stroke={GOLD} strokeWidth={2} strokeDasharray="5 4" />
        <text x={W - padR} y={yMin(30) - 8} textAnchor="end" fontSize="13" fontWeight="700" fill={GOLD}>
          目標 30 分
        </text>
        {DAYS.map((day, i) => {
          const x = padL + i * bw;
          const h = Math.max(2, (day.min / maxMin) * topH);
          const over = day.min > 30;
          return (
            <rect
              key={day.d}
              x={x + bw * 0.22}
              y={18 + topH - h}
              width={bw * 0.56}
              height={h}
              rx={3}
              fill={over ? GOLD : TEAL}
            />
          );
        })}
        <line x1={padL} x2={W - padR} y1={visitTop + 70} y2={visitTop + 70} stroke={GRID} strokeWidth={1} />
        <polyline
          points={DAYS.map((d, i) => `${padL + i * bw + bw * 0.5},${yVisit(d.visits)}`).join(" ")}
          fill="none"
          stroke={BLUE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {DAYS.map((d, i) => (
          <circle key={`mv-${d.d}`} cx={padL + i * bw + bw * 0.5} cy={yVisit(d.visits)} r={3.2} fill={BLUE} />
        ))}
        {DAYS.map((d, i) =>
          i % 2 === 0 ? (
            <text key={`md-${d.d}`} x={padL + i * bw + bw * 0.5} y={H - 8} textAnchor="middle" fontSize="13" fill="#6B7280">
              {d.d.slice(3)}
            </text>
          ) : null
        )}
        <text x={padL - 6} y={visitTop - 6} textAnchor="end" fontSize="13" fill={NAVY} fontWeight="700">
          次數
        </text>
      </svg>
    </div>
  );
}

function FragmentationChart() {
  const W = 760;
  const H = 400;
  const padL = 46;
  const padR = 16;
  const topH = 230;
  const gap = 54;
  const plotW = W - padL - padR;
  const maxMin = 100;
  const bw = plotW / DAYS.length;
  const yMin = (v: number) => 24 + topH - (v / maxMin) * topH;
  const maxVisits = 25;
  const visitTop = 24 + topH + gap;
  const yVisit = (v: number) => visitTop + 96 - (v / maxVisits) * 96;

  return (
    <figure className="my-10 rounded-2xl border border-border-light bg-[#FBF8F3] p-5 md:p-7">
      <figcaption className="mb-4">
        <p className="text-base md:text-lg font-bold text-text-primary">
          13 天：每天介入時間，與每天被叫回來的次數
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          上排是當天在場分鐘數（橘色＝超過 30 分鐘），下排是當天進場次數。中位數 37.1 分、13 次。
        </p>
      </figcaption>
      <div className="hidden md:block">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="13 天每日介入時間與進場次數圖">
        {[0, 30, 60, 90].map((t) => (
          <g key={t}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yMin(t)}
              y2={yMin(t)}
              stroke={GRID}
              strokeWidth={1}
              strokeDasharray={t === 30 ? "6 5" : undefined}
            />
            <text x={padL - 8} y={yMin(t) + 5} textAnchor="end" fontSize="13" fill="#6B7280">
              {t}
            </text>
          </g>
        ))}
        <text x={padL - 8} y={16} textAnchor="end" fontSize="12" fontWeight="700" fill={NAVY}>
          分鐘
        </text>
        <line x1={padL} x2={W - padR} y1={yMin(30)} y2={yMin(30)} stroke={GOLD} strokeWidth={2} strokeDasharray="6 5" />
        <text x={W - padR} y={yMin(30) - 8} textAnchor="end" fontSize="13" fontWeight="700" fill={GOLD}>
          目標 30 分
        </text>
        {DAYS.map((day, i) => {
          const x = padL + i * bw;
          const h = Math.max(2, (day.min / maxMin) * topH);
          const over = day.min > 30;
          return (
            <g key={day.d}>
              <rect
                x={x + bw * 0.2}
                y={24 + topH - h}
                width={bw * 0.6}
                height={h}
                rx={4}
                fill={over ? GOLD : TEAL}
              />
              <text x={x + bw * 0.5} y={24 + topH - h - 7} textAnchor="middle" fontSize="12" fontWeight="700" fill={NAVY}>
                {Math.round(day.min)}
              </text>
              <text x={x + bw * 0.5} y={H - 6} textAnchor="middle" fontSize="11" fill="#6B7280">
                {day.d.slice(3)}
              </text>
            </g>
          );
        })}
        <line x1={padL} x2={W - padR} y1={visitTop + 96} y2={visitTop + 96} stroke={GRID} strokeWidth={1} />
        <text x={padL - 8} y={visitTop + 8} textAnchor="end" fontSize="12" fontWeight="700" fill={NAVY}>
          次數
        </text>
        {[0, 10, 20].map((t) => (
          <text key={t} x={padL - 8} y={yVisit(t) + 4} textAnchor="end" fontSize="11" fill="#9CA3AF">
            {t}
          </text>
        ))}
        <polyline
          points={DAYS.map((d, i) => `${padL + i * bw + bw * 0.5},${yVisit(d.visits)}`).join(" ")}
          fill="none"
          stroke={BLUE}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {DAYS.map((d, i) => (
          <g key={`v-${d.d}`}>
            <circle cx={padL + i * bw + bw * 0.5} cy={yVisit(d.visits)} r={4.5} fill={BLUE} />
            <text x={padL + i * bw + bw * 0.5} y={yVisit(d.visits) - 10} textAnchor="middle" fontSize="11" fill={BLUE}>
              {d.visits}
            </text>
          </g>
        ))}
      </svg>
      </div>
      <MobileFragmentation />
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded" style={{ background: TEAL }} />
          30 分鐘內（2 天）
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded" style={{ background: GOLD }} />
          超過 30 分鐘（11 天）
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: BLUE }} />
          當天進場次數（9 到 23 次）
        </span>
      </div>
    </figure>
  );
}

function WaitBar() {
  const nightPct = (21.3 / 56.3) * 100;
  return (
    <figure className="my-10 rounded-2xl border border-border-light bg-[#FBF8F3] p-5 md:p-7">
      <figcaption className="mb-5">
        <p className="text-base md:text-lg font-bold text-text-primary">工作完成了，流程還在等我</p>
        <p className="mt-1 text-sm text-text-secondary">
          10 月兩期電子報，從完稿到核准累計 56.3 小時；其中 21.3 小時是半夜，真正的判斷不到 10 分鐘。
        </p>
      </figcaption>
      <div className="flex h-10 w-full overflow-hidden rounded-lg" role="img" aria-label="核准等待與判斷時間比例圖">
        <div className="flex items-center justify-center text-xs font-bold text-white md:text-sm" style={{ width: `${nightPct}%`, background: NAVY }}>
          半夜 21.3 小時
        </div>
        <div
          className="flex items-center justify-center text-xs font-bold md:text-sm"
          style={{ width: `${100 - nightPct}%`, background: "#C9D3DF", color: NAVY }}
        >
          白天等 35 小時
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded" style={{ background: NAVY }} />
          半夜（在等我睡覺）
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded" style={{ background: "#C9D3DF" }} />
          白天（在等我上線）
        </span>
      </div>
      <p className="mt-3 text-sm font-bold" style={{ color: GOLD }}>
        真正的判斷時間，兩期加起來不到 10 分鐘。
      </p>
    </figure>
  );
}

function Voices() {
  const items = [
    {
      who: "Lauren Tan",
      role: "SpaceX AI，Grok Bot",
      point: "管理 AI 開發代理，靠的是驗證機制與工作環境的設計，逐步建立放手的信心。她把這套做法開源成 pstack（MIT）。",
      href: "https://mwolf.dev/library/live-poteto-creator-of-pstack-on-shipping-1-000-s-of-pr-s-a-month-at-spacex/live-poteto-creator-of-pstack-on-shipping-1-000-s-of-pr-s-a-month-at-spacex",
      color: BLUE,
    },
    {
      who: "Matt Pocock",
      role: "AI Engineer Paris",
      point: "AI 加速產出之後，還需要改善驗證與審查，並把反覆出現的問題轉成下一輪的流程改進。",
      href: "https://ai.engineer/talks/LlgiOCmFG_w-fixing-pr-bottleneck",
      color: GOLD,
    },
    {
      who: "Anthropic",
      role: "內部研究，2026-10-16",
      point: "代理產出增加之後，人的注意力開始成為瓶頸，員工投入更多心力管理代理與監控流程。",
      href: "https://www.anthropic.com/research/employment-at-anthropic",
      color: TEAL,
    },
  ];
  return (
    <div className="my-10 space-y-3">
      {items.map((it) => (
        <a
          key={it.who}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-border-light bg-white p-5 transition hover:border-[#C9BFAE] md:p-6"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-base font-bold" style={{ color: it.color }}>
              {it.who}
            </span>
            <span className="text-xs text-text-secondary">{it.role}</span>
          </div>
          <p className="mt-2 text-sm text-text-secondary leading-[1.8] md:text-base">{it.point}</p>
        </a>
      ))}
      <p className="text-xs text-text-secondary">三則外部觀點只作為對照，不構成對我們實驗結果的推論。</p>
    </div>
  );
}

function TierCards() {
  const tiers = [
    {
      n: "①",
      name: "逐件核准",
      color: GOLD,
      when: "高影響、難以復原的工作。",
      human: "執行前由我看過，而且要看最終成果與驗證證據。",
    },
    {
      n: "②",
      name: "授權執行、例外介入",
      color: BLUE,
      when: "範圍清楚的工作。",
      human: "依條件自行推進；超出權限、證據不足或結果異常時再找我。",
    },
    {
      n: "③",
      name: "移出日常審查",
      color: TEAL,
      when: "低風險，而且紀錄穩定。",
      human: "交由流程運作，保留抽查與收回授權的機制。",
    },
  ];
  return (
    <div className="my-10 space-y-4">
      {tiers.map((t) => (
        <div key={t.name} className="rounded-2xl border border-border-light bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xl font-bold" style={{ color: t.color }}>
              {t.n}
            </span>
            <h3 className="text-xl font-bold text-text-primary">{t.name}</h3>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-[#FBF8F3] p-4">
              <p className="text-xs font-bold tracking-widest text-tertiary mb-1">適用條件</p>
              <p className="text-sm text-text-secondary leading-[1.75]">{t.when}</p>
            </div>
            <div className="rounded-xl bg-[#FBF8F3] p-4">
              <p className="text-xs font-bold tracking-widest text-tertiary mb-1">人的角色</p>
              <p className="text-sm text-text-secondary leading-[1.75]">{t.human}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CheckList() {
  const items = ["例行確認是否減少？", "需要判斷的事情能否集中？", "錯誤與等待有沒有增加？"];
  return (
    <div className="my-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((t, i) => (
        <div key={t} className="rounded-2xl border border-border-light bg-white p-5">
          <span className="text-xs font-bold tracking-widest" style={{ color: GOLD }}>
            0{i + 1}
          </span>
          <p className="mt-2 text-base font-semibold leading-[1.7]" style={{ color: NAVY }}>
            {t}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Post() {
  const SITE_URL = "https://rong-rise.com";
  const pageTitle = "後台紀錄 2：管理制度，也可以先做一輪 POC 嗎？";
  const pageDesc =
    "13 天裡每天介入約 37 分鐘，卻被切成十幾段。比起總時間，一天被叫回來幾次，更接近真正的管理問題。";

  return (
    <>
      <script
        id="jsonld-camino-operation-poc"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: pageTitle,
            description: pageDesc,
            author: {
              "@type": "Person",
              name: "郭鎮榕 C.J. Kuo",
              url: `${SITE_URL}/about`,
            },
            datePublished: "2026-10-27",
            dateModified: "2026-10-27",
            image: `${SITE_URL}/images/article-camino-operation-poc.jpg`,
            publisher: {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "榕耀管顧 RongRise Consulting",
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/images/logo-512.png`,
                width: 512,
                height: 512,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SITE_URL}/knowledge/camino-operation-poc`,
            },
            keywords: ["公開實驗", "AI 員工", "授權設計", "管理制度", "後台紀錄"],
            articleSection: "AI 轉型",
          }),
        }}
      ></script>
      <script
        id="breadcrumb-camino-operation-poc"
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
                name: pageTitle,
                item: `${SITE_URL}/knowledge/camino-operation-poc`,
              },
            ],
          }),
        }}
      ></script>
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <Link href="/knowledge/human-absent-13-days" className="tag bg-white/15 text-white mb-4">← 我不在公司的 13 天・系列總覽</Link>
          <h1 className="heading-hero mt-4 mb-4">管理制度，也可以像 Vibe Coding 一樣，先做一輪 POC 嗎？</h1>
          <p className="text-body-lg text-white/85 mb-2">
            工作完成了，流程還在等我。真正的瓶頸，是一天被叫回系統幾次。
          </p>
          <p className="text-sm text-white/60">2026-10-27　閱讀時間約 6 分鐘</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6">
          <p className="text-text-secondary leading-[1.9] text-lg mb-6">
            走朝聖之路那十三天，我和整個 AI Agent 團隊持續工作。
          </p>
          <p className="text-text-secondary leading-[1.9] mb-6">
            白天我在走路，晚上打開手機，一排「待核准」等著。坐下來，十分鐘不到就處理完，但工作可能已經等了我一兩天。
          </p>

          <PullQuote>工作完成了，流程還在等我。</PullQuote>

          <p className="text-text-secondary leading-[1.9] mb-6">
            原先，我想驗證每天能不能用三十分鐘管理這個團隊。實際上，每天約三十七分鐘，有時需要五十到六十分鐘。
          </p>
          <p className="text-text-secondary leading-[1.9] mb-6">
            但更值得注意的是，介入被切成十幾段。每次都要重新理解背景、做決定，再回到原本的工作。
          </p>
          <p className="text-text-secondary leading-[1.9] mb-6">
            我開始想：比起總時間，一天需要被叫回來幾次，是否更接近真正的管理問題？
          </p>

          <KpiRow />

          <div className="my-14">
            <SectionTitle kicker="01" title="真正被切碎的，是注意力" />
            <FragmentationChart />
            <WaitBar />
          </div>

          <div className="my-14">
            <SectionTitle kicker="02" title="最近幾個分享，也讓我重新思考" />
            <Voices />
          </div>

          <div className="my-14">
            <SectionTitle kicker="03" title="下一輪，試行三層授權" />
            <p className="text-text-secondary leading-[1.9] mb-6">
              這些經驗讓我想到：企業主需要一起迭代的，還有授權方式。下一輪，我準備在有限範圍內試行三層授權。
            </p>
            <TierCards />
            <p className="text-text-secondary leading-[1.9] mb-6">執行可以交出去，出了問題仍要有人承接責任。</p>
          </div>

          <div className="my-14">
            <SectionTitle kicker="04" title="用結果決定擴大、修正或收回" />
            <p className="text-text-secondary leading-[1.9] mb-6">
              這次的發現，就成為下一輪沙盒設定成功條件的依據。
            </p>
            <CheckList />
            <p className="text-text-secondary leading-[1.9] mb-6">
              先設定條件、實際運作，再決定擴大、修正或收回授權。
            </p>
          </div>

          <div className="my-14 rounded-2xl bg-[#FBF8F3] p-6 md:p-8">
            <p className="text-lg md:text-xl font-semibold leading-[1.9]" style={{ color: NAVY }}>
              想到這裡，我反而期待下一輪。
            </p>
            <p className="mt-3 text-text-secondary leading-[1.9]">
              AI 讓我們更快驗證產品，也讓我們有機會用實驗，逐步長出適合自己的管理制度。
            </p>
            <p className="mt-6 text-base md:text-lg font-semibold leading-[1.9]" style={{ color: NAVY }}>
              你管理 AI 團隊時，最想減少的是總工時，還是一天被叫回來的次數？
            </p>
            <p className="mt-6 text-sm font-bold" style={{ color: NAVY }}>
              郭鎮榕　榕耀管顧
            </p>
          </div>

          <div className="my-14 rounded-2xl border border-border-light p-6 md:p-8">
            <p className="text-sm font-bold tracking-widest text-tertiary mb-2">公開實驗</p>
            <p className="text-text-secondary leading-[1.9] mb-4">
              這是〈我不在公司的 13 天〉的後台紀錄第 2 篇。第一篇寫條件，第二篇寫 13 天的結果，這一篇寫下一輪要怎麼改。數字來自實驗期紀錄，沒有對照組，不能宣稱因果。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/knowledge/camino-operation-backstage" className="btn-secondary inline-block">
                讀上一篇：後台紀錄 1
              </Link>
              <Link href="/knowledge" className="btn-secondary inline-block">
                回到知識庫
              </Link>
            </div>
          </div>

          <div className="my-14">
            <SectionTitle kicker="資料來源" title="三則外部觀點" />
            <ul className="space-y-3 text-sm text-text-secondary leading-[1.8]">
              <li>
                Lauren Tan（@poteto），SpaceX AI。做法開源於{" "}
                <a
                  className="underline decoration-[#C9BFAE] underline-offset-2"
                  href="https://github.com/backnotprop/pstack"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  backnotprop/pstack
                </a>
                ；與 Matt Pocock 的對談見{" "}
                <a
                  className="underline decoration-[#C9BFAE] underline-offset-2"
                  href="https://mwolf.dev/library/live-poteto-creator-of-pstack-on-shipping-1-000-s-of-pr-s-a-month-at-spacex/live-poteto-creator-of-pstack-on-shipping-1-000-s-of-pr-s-a-month-at-spacex"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mwolf.dev
                </a>
              </li>
              <li>
                Matt Pocock，AI Engineer Paris 演講〈Fixing the PR Bottleneck〉：
                <a
                  className="ml-1 underline decoration-[#C9BFAE] underline-offset-2"
                  href="https://ai.engineer/talks/LlgiOCmFG_w-fixing-pr-bottleneck"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ai.engineer
                </a>
              </li>
              <li>
                Anthropic，〈How employment is changing at Anthropic〉，2026-10-16：
                <a
                  className="ml-1 underline decoration-[#C9BFAE] underline-offset-2"
                  href="https://www.anthropic.com/research/employment-at-anthropic"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anthropic.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
