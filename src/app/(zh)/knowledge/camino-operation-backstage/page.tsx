import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "後台紀錄 ②：一天 37 分鐘的管理窗口，出了 7 件錯 | 榕耀管顧",
  description:
    "公開實驗後台紀錄第二篇：13 天、169 次服務檢查全部在線，內容與流程卻出了 7 件錯，其中 6 件是檢查設在錯的位置。附每日在場時間、簽核等待與錯誤分類圖表。",
  alternates: {
    canonical: "https://rong-rise.com/knowledge/camino-operation-backstage",
  },
  openGraph: {
    title: "後台紀錄 ②：一天 37 分鐘的管理窗口，出了 7 件錯 | 榕耀管顧",
    description:
      "13 天、169 次服務檢查全部在線，內容與流程卻出了 7 件錯。機器撐住了，判斷沒有。",
    images: [
      {
        url: "https://rong-rise.com/images/article-camino-operation-backstage.jpg",
        width: 1200,
        height: 630,
        alt: "後台紀錄 ②：一天 37 分鐘的管理窗口，出了 7 件錯",
      },
    ],
  },
};

const DAYS = [
  { d: "10/03", v: 79.8, visits: 23 },
  { d: "10/04", v: 92.0, visits: 19 },
  { d: "10/05", v: 30.6, visits: 17 },
  { d: "10/06", v: 30.1, visits: 15 },
  { d: "10/07", v: 37.1, visits: 13 },
  { d: "10/08", v: 22.3, visits: 11 },
  { d: "10/09", v: 24.1, visits: 11 },
  { d: "10/10", v: 42.1, visits: 9 },
  { d: "10/11", v: 33.1, visits: 11 },
  { d: "10/12", v: 68.5, visits: 22 },
  { d: "10/13", v: 69.1, visits: 16 },
  { d: "10/14", v: 35.5, visits: 12 },
  { d: "10/15", v: 56.9, visits: 13 },
];

const NAVY = "#0D2B4E";
const GOLD = "#E8912A";
const TEAL = "#2EC4B6";
const GRID = "#D9D2C6";

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-bold tracking-widest text-tertiary mb-2">{kicker}</p>
      <h2 className="text-2xl md:text-3xl font-bold text-text-primary">{title}</h2>
    </div>
  );
}

function DailyChart() {
  const max = 100;
  const W = 720;
  const H = 320;
  const padL = 44;
  const padB = 46;
  const padT = 24;
  const plotW = W - padL - 12;
  const plotH = H - padB - padT;
  const bw = plotW / DAYS.length;
  const y = (v: number) => padT + plotH - (v / max) * plotH;

  return (
    <figure className="my-10 rounded-2xl border border-border-light bg-[#FBF8F3] p-5 md:p-7">
      <figcaption className="mb-4">
        <p className="text-base md:text-lg font-bold text-text-primary">
          每天在場時間，13 天裡只有 2 天在 30 分鐘內
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          橘色為超過 30 分鐘的當天；點上數字是當天進場次數。單位：分鐘。
        </p>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="13 天每日在場時間長條圖">
        {[0, 30, 60, 90].map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - 12} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} strokeDasharray={t === 30 ? "6 5" : undefined} />
            <text x={padL - 8} y={y(t) + 5} textAnchor="end" fontSize="14" fill="#6B7280">
              {t}
            </text>
          </g>
        ))}
        <line x1={padL} x2={W - 12} y1={y(30)} y2={y(30)} stroke={GOLD} strokeWidth={2} strokeDasharray="6 5" />
        <text x={W - 14} y={y(30) - 8} textAnchor="end" fontSize="14" fontWeight="700" fill={GOLD}>
          目標 30 分
        </text>
        {DAYS.map((day, i) => {
          const x = padL + i * bw + bw * 0.22;
          const h = Math.max(2, (day.v / max) * plotH);
          const over = day.v > 30;
          return (
            <g key={day.d}>
              <rect x={x} y={padT + plotH - h} width={bw * 0.56} height={h} rx={4} fill={over ? GOLD : TEAL} />
              <text x={x + bw * 0.28} y={padT + plotH - h - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill={NAVY}>
                {Math.round(day.v)}
              </text>
              <text x={x + bw * 0.28} y={H - padB + 18} textAnchor="middle" fontSize="12" fill="#6B7280">
                {day.d.slice(3)}
              </text>
              <text x={x + bw * 0.28} y={H - padB + 34} textAnchor="middle" fontSize="11" fill="#9CA3AF">
                {day.visits} 次
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded" style={{ background: TEAL }} />
          30 分鐘內（2 天）
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded" style={{ background: GOLD }} />
          超過 30 分鐘（11 天）
        </span>
        <span>中位數 37.1 分、平均 47.8 分、最長 92 分、合計 10.4 小時</span>
      </div>
    </figure>
  );
}

function HealthBars() {
  const rows = [
    { label: "13 個服務 × 13 天", value: 169, total: 169, note: "169 次檢查全在線" },
    { label: "5 個對外入口 × 13 天", value: 65, total: 65, note: "65 次 HTTP 實測全正常" },
    { label: "13 天健康報告", value: 12, total: 13, note: "12 天全綠、1 天黃燈" },
  ];
  return (
    <figure className="my-10 rounded-2xl border border-border-light bg-[#FBF8F3] p-5 md:p-7">
      <figcaption className="mb-5">
        <p className="text-base md:text-lg font-bold text-text-primary">機器這一層：13 天全部在線</p>
        <p className="mt-1 text-sm text-text-secondary">每天台北時間 12:30 自動檢查一次，13 天沒有缺過。</p>
      </figcaption>
      <div className="space-y-5">
        {rows.map((r) => {
          const pct = Math.round((r.value / r.total) * 100);
          return (
            <div key={r.label}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-sm md:text-base font-semibold text-text-primary">{r.label}</span>
                <span className="text-sm text-text-secondary">
                  <strong className="text-lg" style={{ color: NAVY }}>
                    {r.value}
                  </strong>
                  ／{r.total}　{pct}%
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-[#EDE7DA]">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? TEAL : GOLD }} />
              </div>
              <p className="mt-1 text-xs md:text-sm text-text-secondary">{r.note}</p>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

function WaitChart() {
  const wait = 56.3;
  const night = 21.3;
  const judge = 0.17;
  const W = 720;
  const H = 150;
  const padL = 8;
  const barW = W - 16;
  const waitW = barW;
  const nightW = (night / wait) * waitW;
  const judgeW = Math.max(4, (judge / wait) * waitW);
  return (
    <figure className="my-10 rounded-2xl border border-border-light bg-[#FBF8F3] p-5 md:p-7">
      <figcaption className="mb-5">
        <p className="text-base md:text-lg font-bold text-text-primary">簽核那一關：56.3 小時的等待，不到 10 分鐘的判斷</p>
        <p className="mt-1 text-sm text-text-secondary">10 月兩期電子報，從完稿到點頭。以每次進場 3 分鐘估。</p>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="簽核等待與判斷時間比例圖">
        <rect x={padL} y={20} width={waitW} height={44} rx={8} fill={NAVY} opacity={0.25} />
        <rect x={padL} y={20} width={nightW} height={44} rx={8} fill={NAVY} />
        <rect x={padL} y={24} width={judgeW} height={36} rx={6} fill={GOLD} />
        <text x={padL + 12} y={86} fontSize="15" fontWeight="700" fill={NAVY}>
          等 56.3 小時
        </text>
        <text x={padL + nightW + 8} y={86} fontSize="14" fill="#4A4540">
          其中 21.3 小時是半夜
        </text>
        <text x={padL} y={118} fontSize="14" fontWeight="700" fill={GOLD}>
          ▲ 金色那一段：真正的判斷時間，兩期加起來不到 10 分鐘
        </text>
      </svg>
      <p className="mt-3 text-sm text-text-secondary">
        一天 24 小時，他有紀錄的在場時間 37 分鐘，剩下 23 小時 23 分鐘，任何要等他點頭的事都停在那裡。
      </p>
    </figure>
  );
}

function IncidentChart() {
  const buckets = [
    { label: "影響到讀者", n: 1, color: GOLD },
    { label: "影響前被攔下", n: 1, color: TEAL },
    { label: "同類重複犯", n: 2, color: "#1A6DB5" },
    { label: "沒對外但吃時間", n: 3, color: "#9AA5B1" },
  ];
  const total = buckets.reduce((s, b) => s + b.n, 0);
  const W = 720;
  const barH = 52;
  return (
    <figure className="my-10 rounded-2xl border border-border-light bg-[#FBF8F3] p-5 md:p-7">
      <figcaption className="mb-5">
        <p className="text-base md:text-lg font-bold text-text-primary">7 件錯，6 件是檢查的問題</p>
        <p className="mt-1 text-sm text-text-secondary">只有 1 件是工具真的壞掉。另計排程層 5 次故障，全部自行解除。</p>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${barH + 56}`} className="w-full h-auto" role="img" aria-label="7 件事故分類堆疊圖">
        {(() => {
          let x = 0;
          return buckets.map((b) => {
            const w = (b.n / total) * W;
            const el = (
              <g key={b.label}>
                <rect x={x} y={8} width={w - 4} height={barH} rx={8} fill={b.color} />
                <text x={x + (w - 4) / 2} y={8 + barH / 2 + 8} textAnchor="middle" fontSize="20" fontWeight="700" fill={b.color === "#9AA5B1" ? "#1F2937" : "#FFFFFF"}>
                  {b.n}
                </text>
              </g>
            );
            x += w;
            return el;
          });
        })()}
        {buckets.map((b, i) => {
          const totalW = W;
          let offset = 0;
          for (let j = 0; j < i; j += 1) offset += (buckets[j].n / total) * totalW;
          const cx = offset + ((b.n / total) * totalW - 4) / 2;
          return (
            <text key={b.label} x={cx} y={barH + 32} textAnchor="middle" fontSize="13" fill="#4A4540">
              {b.label}
            </text>
          );
        })}
      </svg>
    </figure>
  );
}

function KpiGrid() {
  const items = [
    { k: "5 篇", v: "官網文章" },
    { k: "3 期", v: "電子報寄出" },
    { k: "4 支", v: "影片上線" },
    { k: "10 組", v: "IG 圖卡" },
    { k: "13 天", v: "情報掃描沒中斷" },
    { k: "10.4 小時", v: "13 天的管理時間" },
  ];
  return (
    <div className="my-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {items.map((it) => (
        <div key={it.v} className="rounded-2xl border border-border-light bg-white p-5 text-center">
          <p className="text-2xl md:text-3xl font-bold" style={{ color: NAVY }}>
            {it.k}
          </p>
          <p className="mt-1 text-sm text-text-secondary">{it.v}</p>
        </div>
      ))}
    </div>
  );
}

export default function Post() {
  const SITE_URL = "https://rong-rise.com";
  const pageTitle = "後台紀錄 ②：一天 37 分鐘的管理窗口，出了 7 件錯";

  return (
    <>
      <script
        id="jsonld-camino-operation-backstage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: pageTitle,
            description:
              "13 天、169 次服務檢查全部在線，內容與流程卻出了 7 件錯，其中 6 件是檢查設在錯的位置。",
            author: { "@type": "Person", name: "郭鎮榕 C.J. Kuo", url: `${SITE_URL}/about` },
            datePublished: "2026-10-25",
            dateModified: "2026-10-25",
            image: `${SITE_URL}/images/article-camino-operation-backstage.jpg`,
            publisher: {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "榕耀管顧 RongRise Consulting",
              logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo-512.png`, width: 512, height: 512 },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/knowledge/camino-operation-backstage` },
            keywords: ["公開實驗", "AI 員工", "管理窗口", "後台紀錄"],
            articleSection: "AI 轉型",
          }),
        }}
      ></script>
      <script
        id="breadcrumb-camino-operation-backstage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "首頁", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "知識庫", item: `${SITE_URL}/knowledge` },
              { "@type": "ListItem", position: 3, name: pageTitle, item: `${SITE_URL}/knowledge/camino-operation-backstage` },
            ],
          }),
        }}
      ></script>
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">公開實驗・後台紀錄 ②</span>
          <h1 className="heading-hero mt-4 mb-4">一天 37 分鐘的管理窗口，出了 7 件錯</h1>
          <p className="text-body-lg text-white/85 mb-2">
            機器撐住了，判斷沒有。13 天、169 次服務檢查全部在線，內容與流程卻出了 7 件錯。
          </p>
          <p className="text-sm text-white/60">2026-10-25　閱讀時間約 8 分鐘</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6">
          <p className="text-text-secondary leading-[1.9] text-lg mb-6">
            10 月 8 日我們發過〈人不在的一個月〉，條件是：我不在辦公室，沒有其他真人員工，內容交給 AI 團隊，我只保留簽核。這篇先講結果。
          </p>
          <p className="text-text-secondary leading-[1.9] mb-6">
            這個實驗測的不是 AI 有多萬能，是管理者每天只有 30 分鐘、只有手機，其餘交給 AI 員工，後台會怎樣。30 分鐘，夠不夠管住一家公司。
          </p>
          <p className="text-text-secondary leading-[1.9] mb-6">
            13 天後，先講結論。機器撐住了，判斷沒有。169 次檢查全部在線，內容與流程卻出了 7 件錯，其中 6 件不是機器壞掉，是檢查設在錯的位置。
          </p>

          <figure className="my-12">
            <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-2xl border border-border-light bg-black/5">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/images/backstage-ep02-poster.jpg"
                className="h-auto w-full"
              >
                <source src="/videos/backstage-ep02-short.mp4" type="video/mp4" />
                你的瀏覽器不支援影片播放。
              </video>
            </div>
            <figcaption className="mt-3 text-center text-sm text-text-secondary">
              52 秒看完這篇：7 件錯、37.1 分鐘、56.3 小時的等待
            </figcaption>
          </figure>

          <div className="my-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { n: "169 / 169", t: "服務檢查全在線" },
              { n: "37.1 分鐘", t: "一天在場，是目標的 1.24 倍" },
              { n: "1 / 7", t: "7 件錯裡只有 1 件是工具壞掉" },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-border-light bg-[#FBF8F3] p-5">
                <p className="text-2xl font-bold" style={{ color: NAVY }}>
                  {x.n}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{x.t}</p>
              </div>
            ))}
          </div>

          <div className="my-14">
            <SectionTitle kicker="01" title="機器這一層" />
            <p className="text-text-secondary leading-[1.9] mb-6">
              每天一次健康檢查，13 天沒缺；13 個服務乘 13 天，169 次全在線，5 個對外入口每天實測 HTTP，65 次正常。12 天全綠，10 月 4 日黃燈一天（兩服務各重啟 3 次，不是中斷）。
            </p>
            <HealthBars />
            <p className="text-text-secondary leading-[1.9] mb-6">
              有個數字沒觸發警示：磁碟從 74% 爬到 84%，就像腳上的酸痛，慢慢累積，等你發現時已經走不動。
            </p>
          </div>

          <div className="my-14">
            <SectionTitle kicker="02" title="人這一邊" />
            <p className="text-text-secondary leading-[1.9] mb-6">
              目標 30 分鐘。實際中位數 37.1 分、平均 47.8、最短 22.3、最長 92，一天進場 13 次、每次 3 分鐘，13 天只有 2 天達標，合計 10.4 小時。
            </p>
            <DailyChart />
            <p className="text-text-secondary leading-[1.9] mb-6">
              換算下來，我每 1.8 小時出現一次，每次 3 分鐘，比較像來按讚的路人。問題不在多出的 7 分鐘，在 37 分鐘切成 13 段。這種狀態下，人只能看結論、點頭或退回，沒有餘裕驗事實（在場時間是估計值，5 分鐘內算在線）。
            </p>
            <WaitChart />
          </div>

          <div className="my-14">
            <SectionTitle kicker="03" title="7 件錯" />
            <p className="text-text-secondary leading-[1.9] mb-6">
              7 件、8 筆，多出的那筆是同一件誤判被推翻。一件影響到讀者：電子報頁面夾著內部註記，前後 10 期；同一份檔案兩個出口，寄信有稽核，官網沒有。一件在造成影響前被攔下：情報摘要寫了當天沒收錄的 Gartner，是程式做機構名交集抓到的。
            </p>
            <IncidentChart />
            <p className="text-text-secondary leading-[1.9] mb-6">
              一類重複犯兩次：跨日去重先漏 1 筆、又漏 4 則，改成 30 天池 350 條。另三件沒對外但吃時間：IG 檢查程式寫錯、模型卡七分鐘、封面誤判三輪；排程層 5 次故障都自己解除。只有 1 件是工具壞掉，其餘都是檢查的問題。
            </p>
          </div>

          <div className="my-14">
            <SectionTitle kicker="04" title="換到什麼" />
            <KpiGrid />
            <p className="text-text-secondary leading-[1.9] mb-6">
              10.4 小時，換 13 天 operation：文章 5 篇、電子報 3 期、影片 4 支、IG 10 組，情報掃描沒中斷。代價是 7 件只有 2 件留下修復時間。
            </p>
          </div>

          <div className="my-14">
            <SectionTitle kicker="05" title="學到什麼" />
            <div className="space-y-4">
              {[
                "系統健康不等於內容正確，檢查看服務，不看交付物。",
                "30 分鐘買到的是判斷，不是驗證，驗證要在東西送到他面前之前做完。",
                "有限窗口下，人的作用是推翻，不是多讀，力氣花在指定「驗什麼」。",
              ].map((t, i) => (
                <div key={t} className="flex gap-4 rounded-2xl border border-border-light bg-white p-5">
                  <span className="text-xl font-bold" style={{ color: GOLD }}>
                    0{i + 1}
                  </span>
                  <p className="text-text-secondary leading-[1.8]">{t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="my-14">
            <SectionTitle kicker="06" title="CJ 哥的反思" />
            <div className="rounded-2xl border-l-4 bg-[#FBF8F3] p-6 md:p-8" style={{ borderColor: GOLD }}>
              <p className="text-text-secondary leading-[1.9] mb-5">
                這 13 天我在朝聖路上。我原以為要驗的是 AI，結果 AI 一次都沒停，停下來的是我這一關。回頭看，我最常做的決策叫「可以」。
              </p>
              <p className="text-text-secondary leading-[1.9] mb-5">
                人工簽核我以前覺得是負責。這次 7 件告訴我，簽核後面沒有證據，只是一種感覺。這種感覺，山上特別多。
              </p>
              <p className="text-text-secondary leading-[1.9] mb-5">
                還有一件我要承認：很多 pending 不是東西沒做好，是我在走路，一天走七到九小時。最大的風險不是 AI，是我走到沒訊號的地方。
              </p>
              <p className="text-text-secondary leading-[1.9]">
                我要改的是順序：先問這件東西被誰驗過、用什麼驗、驗的是不是要交出去那份，再問我覺得好不好。前一題十分鐘就夠。
              </p>
              <p className="mt-6 text-sm font-bold" style={{ color: NAVY }}>
                郭鎮榕　榕耀管顧
              </p>
            </div>
          </div>

          <div className="my-14">
            <SectionTitle kicker="07" title="接下來" />
            <p className="text-text-secondary leading-[1.9] mb-6">
              本來這篇排在十一月，颱風天在家閒閒沒事，就先結算了。下週我們會公告改善計畫：根據這 13 天的結果，說明管理方式要怎麼改。
            </p>
          </div>

          <div className="my-14 rounded-2xl bg-[#FBF8F3] p-6 md:p-8">
            <p className="text-sm font-bold tracking-widest text-tertiary mb-2">公開實驗</p>
            <p className="text-text-secondary leading-[1.9] mb-4">
              這是「人不在的一個月」公開實驗的第二篇。第一篇寫條件，這一篇寫結果，下週寫我們要怎麼改。
            </p>
            <Link href="/knowledge" className="btn-secondary inline-block">
              回到知識庫
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
