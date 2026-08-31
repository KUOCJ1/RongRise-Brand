import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "第二大腦白皮書 — 把知識變成商業引擎 ｜ 榕耀管顧",
  description:
    "榕耀管顧第二大腦白皮書：運作邏輯（知識飛輪）、資訊架構（五層系統）、理論架構（DIKW × SECI）與落地實況——一套已在運作、會自我生長、可對外輸出的知識基礎設施。",
  alternates: { canonical: "https://rong-rise.com/whitepaper/second-brain" },
  openGraph: {
    type: "article",
    title: "第二大腦白皮書 — 把知識變成商業引擎 ｜ 榕耀管顧",
    description:
      "運作邏輯、資訊架構、理論架構、落地實況——一套已在運作、可對外輸出的知識基礎設施。",
    url: "https://rong-rise.com/whitepaper/second-brain",
    images: [{ url: "https://rong-rise.com/images/second-brain/fig1.jpg", width: 1920, height: 1900, alt: "第二大腦知識飛輪" }],
  },
};

const F = {
  fig1: "/images/second-brain/fig1.jpg",
  fig2: "/images/second-brain/fig2.jpg",
  fig3: "/images/second-brain/fig3.jpg",
};

const components = [
  { name: "Obsidian Vault", en: "Knowledge 本體", desc: "知識的唯一儲存本體：366 篇筆記、17 個領域、36.4 萬字，全部純文字 markdown。", tech: "本機＋VPS 雙備份", badge: "核心", badgeClass: "bg-teal/10 text-teal" },
  { name: "Metadata Schema", en: "標準化欄位", desc: "每篇筆記帶 type／domain／status／date／updated／source／tags／related，讓機器可讀、可查、可排序。", tech: "363 檔 99% 覆蓋", badge: "已標準", badgeClass: "bg-teal/10 text-teal" },
  { name: "知識掃描家族", en: "6 條自動管線", desc: "每日掃描、arXiv 論文、英文部落格、政策法規、產業報告、競對監測——自動抓取並摘要入庫。", tech: "Cron 自動", badge: "6 管線", badgeClass: "bg-primary/10 text-primary" },
  { name: "小賀（AI 代理）", en: "Hermes Agent", desc: "自動整理收件匣、健康檢查、空連結掃描、週報；也是內容生產引擎（文章／電子報／影片）。", tech: "DeepSeek＋自動化", badge: "日常運作", badgeClass: "bg-primary/10 text-primary" },
  { name: "收件匣 SOP", en: "Intake 流程", desc: "所有外部輸入先到收件匣，經分類判讀後歸檔至對應領域，避免雜訊直接污染知識庫。", tech: "每日整理", badge: "流程", badgeClass: "bg-primary/10 text-primary" },
  { name: "scan-brain.js", en: "索引產生器", desc: "掃描 Vault，產生 index.json 搜尋索引（359 篇，含 type／status／related 欄位）。", tech: "Node.js", badge: "已擴充", badgeClass: "bg-teal/10 text-teal" },
  { name: "Cognee 知識圖譜", en: "語意記憶", desc: "將筆記灌入向量記憶庫，支援語意問答、概念碰撞、學習路徑與概念關聯。", tech: "每日增量", badge: "圖譜", badgeClass: "bg-primary/10 text-primary" },
  { name: "brain-api", en: "對外 API 閘道", desc: "提供搜尋、單篇詳情、相關筆記、動態資訊、寫入（ingest）、問答、概念碰撞等 10+ 端點。", tech: "Express :3007", badge: "10+ 端點", badgeClass: "bg-teal/10 text-teal" },
  { name: "n8n 入庫入口", en: "外部寫入管道", desc: "任何外部服務（表單、自動化、Clipper）POST 到 Webhook，即自動寫入收件匣。", tech: "n8n 平台", badge: "已上線", badgeClass: "bg-teal/10 text-teal" },
  { name: "Git 雙向同步", en: "版本控制", desc: "PC ⇄ VPS 透過私有 GitHub 倉庫自動同步，每次變更可回溯。", tech: "GitHub", badge: "自動", badgeClass: "bg-primary/10 text-primary" },
  { name: "Google Drive", en: "備份＋來源", desc: "md5 manifest 增量備份知識庫；同時是外部文件匯入的來源。", tech: "每日備份", badge: "增量", badgeClass: "bg-primary/10 text-primary" },
  { name: "Brain Portal", en: "公開知識庫", desc: "brain.rong-rise.com——將 vault 渲染成可瀏覽的知識網站，每日自動重建。", tech: "Next.js 靜態", badge: "公開", badgeClass: "bg-primary/10 text-primary" },
  { name: "官網延伸閱讀", en: "內容關聯", desc: "官網每篇文章底部自動推薦相關 vault 筆記，建立對外內容與內部知識的橋樑。", tech: "64 篇全覆蓋", badge: "已上線", badgeClass: "bg-teal/10 text-teal" },
  { name: "電子報素材注入", en: "選材供應", desc: "每期電子報產出前，自動注入最新 8 筆知識庫收藏，讓選材有內部研究支撐。", tech: "每週雙刊", badge: "已上線", badgeClass: "bg-teal/10 text-teal" },
  { name: "LINE 機器人", en: "對話式問答", desc: "以自然語言向知識庫提問，直接呼叫 brain-api 問答端點。", tech: "申請中", badge: "規劃中", badgeClass: "bg-tertiary/10 text-tertiary" },
];

const roadmap = [
  { n: "01", t: "知識品質自動化", d: "LLM 自動標籤分類、重複筆記偵測、過時內容標記" },
  { n: "02", t: "入庫生態擴充", d: "Forms／LINE／Email／Clipper 一鍵入庫、事件 Webhook" },
  { n: "03", t: "AI 深度整合", d: "Cognee 概念地圖、RAG 服務化、自動知識週報" },
  { n: "04", t: "內容閉環", d: "官網文章↔vault 雙向同步、交付物自動引用知識庫" },
  { n: "05", t: "商業化產品化", d: "客戶版第二大腦、研究資產變收費產品" },
];

export default function SecondBrainWhitepaper() {
  return (
    <main className="min-h-screen bg-bg-alt">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-14 md:py-20">

        {/* Cover */}
        <section className="bg-gradient-to-br from-[#0D2B4E] via-[#123A66] to-[#1A6DB5] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden mb-10">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-teal/25 blur-3xl" />
          <div className="absolute -bottom-32 right-24 w-80 h-80 rounded-full bg-tertiary/20 blur-3xl" />
          <div className="relative">
            <span className="inline-block text-sm font-bold tracking-[0.2em] text-tertiary border-2 border-tertiary/60 rounded-full px-4 py-1.5 mb-6">
              WHITEPAPER · 白皮書
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
              第二大腦
              <br />
              把知識變成商業引擎
            </h1>
            <p className="mt-5 text-lg text-white/75 leading-relaxed">
              運作邏輯 · 資訊架構 · 理論架構 · 落地實況 —— 一套已在運作、會自我生長、可對外輸出的知識基礎設施
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/60">
              <span>作者：<b className="text-white">郭鎮榕 C.J. Kuo</b></span>
              <span>發行：<b className="text-white">2026-08-31</b></span>
              <span>版本：<b className="text-white">v1.1</b></span>
              <span>系統：<b className="text-white">brain.rong-rise.com</b></span>
            </div>
          </div>
        </section>

        {/* Abstract */}
        <section className="bg-white rounded-2xl border border-border p-8 md:p-10 mb-8">
          <div className="text-sm font-bold tracking-widest text-tertiary mb-3">摘要 · EXECUTIVE SUMMARY</div>
          <p className="text-[17px] leading-[1.9] text-text-secondary">
            顧問的知識就是產品。過去十五年企業人資管理、十年顧問服務所累積的經驗與判斷，大多散落在腦海、硬碟與對話紀錄中——它們真實存在，卻無法累積、無法複利、無法在需要時被精準召喚。榕耀管顧的第二大腦，把這份無形資產變成一套有紀律的知識基礎設施：知識自動流入、結構化儲存、語意化連結，再輸出為文章、電子報、諮詢服務與顧問交付物；而每一次輸出產生的新經驗，又會回流成為下一輪輸入。本文從運作邏輯（知識飛輪）、資訊架構（五層系統）與理論架構（DIKW × SECI）三個視角，完整說明這套系統的設計，以及其中每一個元件的作用。寫在前面：這不是一份紙上藍圖，而是一套已經架構出來、正在實際運作的系統。文中的每一個數字，此刻都在真實發生。
          </p>
        </section>

        {/* 01 */}
        <Section num="01" title="緣起：知識為什麼需要一座「第二大腦」" en="WHY — THE KNOWLEDGE COMPOUND INTEREST PROBLEM">
          <p>顧問業的本質，是把<b>經驗轉化為建議</b>。但經驗有個致命的特性：它會隨時間流失，且無法直接複製。一篇好的白皮書、一場好的工作坊背後，往往是數十篇研究、上百次實戰與無數次試錯——這些過程若沒有被記錄與組織，就無法成為可重複使用的資產。</p>
          <p>第二大腦的設計目標有三：</p>
          <ul>
            <li><b>知識複利</b>——每一份輸入都結構化沉澱，讓下一份輸出站在更高的起點，而不是每次從零開始。</li>
            <li><b>自動化紀律</b>——不靠意志力維持知識庫。掃描、整理、索引、備份全部自動化，品質由機制守護。</li>
            <li><b>輸出驅動</b>——知識不是收藏品，是生產要素。所有沉澱最終都要流向文章、電子報、課程與顧問交付。</li>
          </ul>
          <Callout gold>核心信念：<b>知識資產的價值，取決於它被輸出的次數，而不是被收藏的數量。</b></Callout>
        </Section>

        {/* 02 */}
        <Section num="02" title="運作邏輯：知識飛輪" en="OPERATING LOGIC — THE KNOWLEDGE FLYWHEEL">
          <p>整個系統圍繞一個循環運作：<b>輸入 → 精煉 → 儲存 → 輸出 → 回流</b>。四個階段各自自動化，構成一個自我強化的飛輪——輸入越多元，精煉越徹底，儲存越結構化，輸出就越有價值；而輸出的產物（文章、電子報、顧問方法）會再回流成為新的知識輸入，讓飛輪每轉一圈都更厚實。</p>
          <Figure src={F.fig1} cap="圖一｜知識飛輪全景圖 —— 四大階段＋回流閉環＋治理機制" />
          <p>四個階段的職責如下：</p>
          <ul>
            <li><b>輸入（Ingest）</b>：Obsidian 手動撰寫、Telegram 即時收藏、六條自動掃描管線、n8n 外部入庫、Google Drive 匯入——知識從所有入口湧入。</li>
            <li><b>精煉（Process）</b>：收件匣 SOP 分類判讀、小賀（AI 代理）整理歸檔、scan-brain 建立索引、Cognee 建立語意關聯——原始資料被提純為結構化知識。</li>
            <li><b>儲存（Storage）</b>：Obsidian Vault 為知識本體（366 篇、17 領域、36.4 萬字），標準化 Metadata 讓機器可讀，Git 雙向同步確保版本可回溯，Google Drive 增量備份守住安全。</li>
            <li><b>輸出（Consume）</b>：Brain Portal 公開知識庫、brain-api 對外服務、官網文章延伸閱讀、電子報素材注入、LINE 機器人——知識轉化為對外價值。</li>
          </ul>
          <Callout>飛輪的關鍵不在任何單一階段，而在<b>回流</b>：官網文章的讀者回饋、電子報的訂閱數據、諮詢服務的實戰案例，最終都會回到知識庫，成為下一輪輸出的養分。</Callout>
        </Section>

        {/* 03 */}
        <Section num="03" title="資訊架構：五層系統" en="INFORMATION ARCHITECTURE — FIVE-LAYER SYSTEM">
          <p>若說知識飛輪是「時間軸」上的運作邏輯，五層系統就是「空間軸」上的部署架構。它是一套標準的分層資訊系統：每一層只依賴下一層，職責單一、介面清楚，讓系統可以獨立演進、逐層擴充。</p>
          <Figure src={F.fig2} cap="圖二｜五層分層系統架構 —— 訪問 → 應用 → 接口 → 服務 → 資料" />
          <ul>
            <li><b>訪問層（Clients）</b>：Obsidian PC、Telegram、瀏覽器、LINE 機器人——所有與人接觸的入口。</li>
            <li><b>應用層（Apps & Web）</b>：官網（含延伸閱讀）、Brain Portal 知識庫網站、電子報系統、n8n 自動化平台。</li>
            <li><b>接口層（API Gateway）</b>：brain-api 閘道，對外提供 REST API（搜尋、相關筆記、動態資訊、寫入、問答、概念碰撞、圖譜查詢），經 Traefik 統一路由與 HTTPS 保護。</li>
            <li><b>服務層（Services）</b>：知識處理（scan-brain、Cognee、小賀、收件匣 SOP）、知識獲取（掃描管線、n8n 入庫、Telegram 收藏、Drive 匯入）、治理服務（健康檢查、Git 同步、備份、電子報素材）。</li>
            <li><b>資料層（Data）</b>：Obsidian Vault（單一資料源）、index.json 搜尋索引、Cognee 圖譜庫、GitHub 私有倉庫、Google Drive 備份。</li>
          </ul>
          <Callout blue>架構原則：<b>資料層是唯一的 Single Source of Truth</b>。所有輸出端的內容都來自 Vault，而不是各系統各自維護一份資料——這是知識一致性最重要的設計決定。</Callout>
        </Section>

        {/* 04 */}
        <Section num="04" title="理論架構：DIKW 金字塔 × SECI 知識螺旋" en="THEORETICAL FRAMEWORK — DIKW & SECI">
          <p>第二大腦不是工具的堆疊，而是有理論依據的知識管理系統。兩個經典框架解釋了它的設計邏輯：<b>DIKW 金字塔</b>說明了知識的價值遞升路徑，<b>SECI 模型</b>說明了知識如何在個人與組織之間創造與流動。</p>
          <Figure src={F.fig3} cap="圖三｜理論架構圖 —— DIKW 金字塔與 SECI 螺旋，每個理論層級對應具體元件" />
          <p><b>DIKW 金字塔（Ackoff, 1989）</b>——資料是原始的訊號；資訊是結構化後的紀錄；知識是彼此關聯的理解；洞察是跨領域的判斷；決策與價值是知識真正變現的那一刻。第二大腦的每個階段都對應金字塔的一層：掃描管線產出資料，標準化筆記是資訊，wikilink 與 Cognee 圖譜是知識，跨領域碰撞與小賀觀點是洞察，官網文章與顧問交付則是決策與價值。</p>
          <p><b>SECI 知識螺旋（Nonaka & Takeuchi, 1995）</b>——知識在「暗黙知」與「形式知」之間循環轉換：社會化（經驗對話）、外化（寫成筆記）、組合（跨領域彙編）、內化（閱讀應用）。第二大腦的設計刻意覆蓋了完整的螺旋：Telegram 收藏捕捉暗黙知，Obsidian 撰寫完成外化，電子報與白皮書完成組合，而顧問實務的應用與回饋，讓知識內化為新的暗黙知——螺旋因此永續。</p>
          <Callout>此外，系統亦遵循 Zettelkasten 卡片盒筆記法（原子化筆記＋連結即思考）與個人知識管理（PKM）的複利原則——<b>筆記之間的可見連結，本身就是知識</b>。</Callout>
        </Section>

        {/* 05 */}
        <Section num="05" title="落地實況：這不是理論，是正在運作的系統" en="LIVE STATUS — ALREADY OPERATING, NOT A BLUEPRINT">
          <p>讀到這裡，如果你以為這只是一份理論架構文件，我要先澄清：本文描述的每一根管線、每一個元件，此刻都在實際運作。它不是願景，而是榕耀管顧每天賴以生產的基礎設施——文章、電子報、顧問交付，都從這套系統流出。</p>
          <ul>
            <li><b>知識本體持續增長</b>——Vault 現有 366 篇筆記、17 個領域、36.4 萬字，每日健康檢查與每週週報持續追蹤它的演化方向。</li>
            <li><b>六條掃描管線每日入庫</b>——arXiv、英文部落格、政策法規、產業報告、競對監測與每日掃描，每天自動抓取、摘要並歸檔，品質由機制守護。</li>
            <li><b>公開知識庫對外服務</b>——brain.rong-rise.com 每日自動重建，任何讀者都能瀏覽；brain-api 提供 10+ 個端點，供官網與外部服務呼叫。</li>
            <li><b>內容生產全面接軌</b>——官網 64 篇文章底部自動串接知識庫延伸閱讀，電子報每週雙刊的選材由知識庫自動注入。</li>
            <li><b>治理機制每日運作</b>——Git 雙向同步、Google Drive 增量備份、Cognee 每日圖譜增量，讓知識資產可回溯、可保全、可語意檢索。</li>
          </ul>
          <Callout gold>最直接的證據是：<b>你正在讀的這份白皮書，本身就是這套系統的產出</b>——它的選題來自知識庫的累積，它的結構由輸出驅動的原則決定，它的圖表由同一套設計系統產出。系統不是為了這份文件才存在；這份文件只是系統日常輸出的一次展示。</Callout>
        </Section>

        {/* 06 */}
        <Section num="06" title="核心元件說明" en="COMPONENT GUIDE">
          <p>下表逐一說明系統中每個元件的職責、技術與現況——這是理解整個第二大腦的元件地圖。</p>
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left text-[15px] border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3.5 font-semibold rounded-tl-xl w-[24%]">元件</th>
                  <th className="px-4 py-3.5 font-semibold w-[48%]">職責</th>
                  <th className="px-4 py-3.5 font-semibold rounded-tr-xl w-[28%]">技術／狀態</th>
                </tr>
              </thead>
              <tbody>
                {components.map((c, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-bg-alt/60" : "bg-white"}>
                    <td className="px-4 py-3.5 border-b border-border-light align-top">
                      <div className="font-bold text-text-primary">{c.name}</div>
                      <div className="text-xs text-text-secondary">{c.en}</div>
                    </td>
                    <td className="px-4 py-3.5 border-b border-border-light align-top leading-relaxed text-text-secondary">{c.desc}</td>
                    <td className="px-4 py-3.5 border-b border-border-light align-top">
                      <span className="text-text-secondary">{c.tech}</span>
                      <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ml-2 ${c.badgeClass}`}>{c.badge}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 07 */}
        <Section num="07" title="治理與品質保證" en="GOVERNANCE & QUALITY">
          <p>知識庫最大的風險不是「沒有內容」，而是「內容失去信任」。第二大腦以五道防線守住品質底線：</p>
          <ul>
            <li><b>每日健康檢查</b>——自動統計檔案數、空連結、待處理內容與 git 狀態，異常即回報。</li>
            <li><b>每週週報</b>——git 歷史、字數分佈、趨勢分析，掌握知識庫的演化方向。</li>
            <li><b>API Token 保護</b>——寫入端點（ingest）需 Bearer token 授權，無 token 一律 401。</li>
            <li><b>Git 版本控制</b>——重要產出強制 commit＋push，任何錯誤都可回溯復原。</li>
            <li><b>原創性鐵律</b>——內容不重複舊觀點，跨領域碰撞產生獨家見解；這是最難自動化、也最重要的品質標準。</li>
          </ul>
          <Callout gold>治理的哲學：<b>用機制取代意志力。</b>品質不依賴任何人的記憶或自律，而是內建在每日的系統運作中。</Callout>
        </Section>

        {/* 08 */}
        <Section num="08" title="未來進化路線" en="ROADMAP">
          <p>第二大腦的下一階段，是讓知識資產從「支撐內容生產」進化為「驅動商業價值」。五大方向依序推進：</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {roadmap.map((r) => (
              <div key={r.n} className="bg-teal/5 border border-teal/30 rounded-2xl p-5">
                <div className="text-xs font-bold text-teal tracking-wider">{r.n}</div>
                <div className="font-bold text-text-primary mt-2">{r.t}</div>
                <div className="text-sm text-text-secondary mt-1.5 leading-relaxed">{r.d}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 09 */}
        <Section num="09" title="結語" en="CLOSING">
          <p>AI 時代，企業與顧問的競爭力，正從「擁有知識」轉向「組織知識的速度」。第二大腦是榕耀管顧對這個問題的回答：一套有理論依據、有自動化紀律、有商業輸出的知識基礎設施。它讓每一次閱讀都成為資產，每一次輸出都成為複利，讓「以管理為本、以 AI 為用」不再只是一句標語，而是每天在系統中真實發生的循環。</p>
          <p className="mb-0">這份白皮書的內容本身，就是第二大腦的產物——而它的下一版，會因為這份文件的產出而變得更好。它不是停留在紙上的理論，而是一套正在運作的系統：你讀到的每一個數字，此刻都在真實發生。</p>
        </Section>

      </div>
    </main>
  );
}

/* ── helpers ── */

function Section({ num, title, en, children }: { num: string; title: string; en: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-border p-8 md:p-10 mb-8">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tertiary to-[#F5A623] text-white flex items-center justify-center text-xl font-extrabold mb-4">
        {num}
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary">{title}</h2>
      <div className="text-sm text-text-secondary tracking-widest mt-1 mb-6">{en}</div>
      <div className="text-[16.5px] leading-[1.9] text-text-secondary space-y-4 [&_b]:text-text-primary [&_li]:pl-6 [&_li]:relative [&_li]:before:content-['▸'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-tertiary [&_li]:before:font-bold">
        {children}
      </div>
    </section>
  );
}

function Callout({ children, gold, blue }: { children: React.ReactNode; gold?: boolean; blue?: boolean }) {
  const cls = gold
    ? "bg-tertiary/5 border-l-[5px] border-tertiary"
    : blue
      ? "bg-primary/5 border-l-[5px] border-primary"
      : "bg-teal/5 border-l-[5px] border-teal";
  return (
    <div className={`${cls} rounded-r-xl px-6 py-4 text-[15.5px] leading-relaxed text-text-secondary my-6`}>
      {children}
    </div>
  );
}

function Figure({ src, cap }: { src: string; cap: string }) {
  return (
    <figure className="my-8">
      <img src={src} alt={cap} className="w-full rounded-2xl border border-border shadow-lg" />
      <figcaption className="text-sm text-text-secondary text-center mt-3">
        <b className="text-text-primary">{cap.split("——")[0]}</b>
        {cap.includes("——") ? ` —— ${cap.split("——").slice(1).join("——")}` : ""}
      </figcaption>
    </figure>
  );
}
