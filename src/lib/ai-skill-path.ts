/* ============================================
   員工 AI 技能路徑圖 — 規則引擎（B2-6 微型工具）
   2026-09-05 開發（第二批 B2-6）

   方法論基礎：
   - 10-20-70 投資原則（人 70% 的落地工具）
   - CJ哥 HR AI 課程設計經驗
   - 四大部門 × 三級熟度 × 三階段 90 天路徑

   設計原則（與 hr-ai-maturity / ai-roadmap 一致）：
   - 透明：參數與規則公開
   - 具體：每項能力可執行、可驗證
   - 零依賴：純規則引擎，無 LLM API
   ============================================ */

export type DeptKey = "hr" | "marketing" | "sales" | "it" | "management";
export type LevelKey = "beginner" | "intermediate" | "advanced";

export interface SkillItem {
  name: string;
  desc: string;
}

export interface Phase {
  id: string;
  days: string;
  theme: string;
  goal: string;
  skills: SkillItem[];
  tools: string[];
  exercises: string[];
}

export interface DeptInfo {
  label: string;
  icon: string;
  desc: string;
}

export interface SkillPathResult {
  dept: string;
  deptIcon: string;
  level: string;
  levelLabel: string;
  phases: Phase[];
  summary: string;
}

/* ============ 部門資訊 ============ */

const DEPT_INFO: Record<DeptKey, DeptInfo> = {
  hr: { label: "人力資源 HR", icon: "🧑‍💼", desc: "招募、績效、培訓、員工關係" },
  marketing: { label: "行銷", icon: "📣", desc: "內容行銷、數據分析、廣告投放" },
  sales: { label: "業務", icon: "🤝", desc: "客戶開發、銷售流程、CRM 管理" },
  it: { label: "IT / 技術", icon: "💻", desc: "系統維運、開發、數據工程" },
  management: { label: "管理層", icon: "👔", desc: "策略制定、團隊領導、組織變革" },
};

const LEVEL_LABELS: Record<LevelKey, string> = {
  beginner: "入門級 — 想開始但不知道從哪裡學",
  intermediate: "進階級 — 已有基礎，想深化應用",
  advanced: "領導級 — 想帶領團隊全面導入 AI",
};

/* ============ 各部門各等級的路徑 ============ */

type PathMap = Record<DeptKey, Record<LevelKey, { phases: Phase[]; summary: string }>>;

const PATHS: PathMap = {
  /* ----- HR ----- */
  hr: {
    beginner: {
      summary: "從 AI 工具基礎操作到 HR 場景應用，30 天會用、60 天會串、90 天能設計流程",
      phases: [
        {
          id: "hr-b1",
          days: "第 1-30 天",
          theme: "AI 工具入門與 HR 場景初探",
          goal: "熟悉主流 AI 工具，能在 HR 日常工作中實際使用",
          skills: [
            { name: "生成式 AI 基礎操作", desc: "學會用 ChatGPT/Gemini 寫職缺描述、面試問題、回覆郵件" },
            { name: "Prompt 工程入門", desc: "掌握結構化提問技巧，讓 AI 產出符合 HR 專業的內容" },
            { name: "AI 履歷篩選實作", desc: "用 AI 工具輔助比對履歷與職缺條件，建立初篩標準流程" },
            { name: "AI 文件摘要", desc: "學會用 AI 快速摘要長篇文件（勞動法規、會議記錄、報告）" },
          ],
          tools: ["ChatGPT / Gemini", "Notion AI", "Canva AI 輔助設計"],
          exercises: [
            "用 AI 寫一份招募職缺描述，然後手動修改到滿意",
            "用 AI 摘要一份勞動法規文件，限 200 字內",
            "實際操作 AI 履歷篩選，記錄時間節省比例",
          ],
        },
        {
          id: "hr-b2",
          days: "第 31-60 天",
          theme: "HR 場景深化與流程整合",
          goal: "能獨立設計 AI 輔助的 HR 工作流程",
          skills: [
            { name: "AI 績效回饋生成", desc: "用 AI 輔助撰寫績效回饋、設定 OKR/KPI 草案" },
            { name: "AI 培訓教材製作", desc: "用 AI 生成教育訓練教材初稿與測驗題庫" },
            { name: "AI 員工問答分析", desc: "用 AI 分析員工滿意度調查開放式回應" },
            { name: "AI 數據整理入門", desc: "學會用 AI 清理與整理 HR 數據報表" },
          ],
          tools: ["ChatGPT Advanced Data Analysis", "Google Sheets + AI 擴充", "Gamma AI 簡報工具"],
          exercises: [
            "用 AI 產出一份完整的績效回饋草稿（含具體行為描述與改善建議）",
            "設計一份 30 分鐘的 AI 培訓課程大綱 + 測驗題",
            "用 AI 分析上一季的員工滿意度開放式回應，找出三個趨勢",
          ],
        },
        {
          id: "hr-b3",
          days: "第 61-90 天",
          theme: "HR AI 流程設計師",
          goal: "能用低程式碼工具自主設計 HR 流程解決方案",
          skills: [
            { name: "HR 流程自動化設計", desc: "學會用低程式碼工具（Airtable/Zapier）串接 HR 流程" },
            { name: "AI 人才數據分析", desc: "用 AI 輔助人才盤點、接班人規劃分析" },
            { name: "AI Agent 管理認知", desc: "理解 AI Agent 的概念與 HR 在 Agent 治理中的角色" },
            { name: "HR AI 專案規劃", desc: "能規劃一個 HR AI 導入專案（含 KPI、時程、風險）" },
          ],
          tools: ["Airtable", "Zapier / n8n", "AI Agents 基礎概念"],
          exercises: [
            "設計一個自動化員工入職流程（從 offer 到設備申請）",
            "用 AI 分析團隊技能組合，產出培訓優先級建議",
            "寫一份 HR 部門 AI 導入計畫（含 90 天行動方案）",
          ],
        },
      ],
    },
    intermediate: {
      summary: "深化 AI 在各 HR 場景的應用，從工具使用者變成流程設計者",
      phases: [
        {
          id: "hr-i1",
          days: "第 1-30 天",
          theme: "HR 數據驅動決策",
          goal: "能用 AI 進行 HR 數據分析與洞察",
          skills: [
            { name: "HR 數據視覺化", desc: "用 AI 輔助工具將 HR 數據轉化為可讀的儀表板" },
            { name: "留任預測分析", desc: "用 AI 分析離職因子，建立留任風險模型" },
            { name: "招募漏斗優化", desc: "用 AI 分析招募數據，找出瓶頸與改善點" },
            { name: "技能缺口分析", desc: "用 AI 盤點團隊技能組合，產出系統化培訓建議" },
          ],
          tools: ["Tableau / Power BI AI 功能", "Python 基礎（AI 輔助寫 code）", "HR Analytics 工具"],
          exercises: [
            "製作一份離職率分析儀表板（含部門/年資/關鍵因子維度）",
            "分析過去一年招募數據，找出轉換率最低的階段並提出改善方案",
          ],
        },
        {
          id: "hr-i2",
          days: "第 31-60 天",
          theme: "AI 驅動的員工體驗設計",
          goal: "能用 AI 設計與優化員工旅程",
          skills: [
            { name: "員工旅程 AI 分析", desc: "用 AI 分析員工旅程痛點與改進機會" },
            { name: "AI 個人化學習路徑", desc: "設計 AI 驅動的個人化員工培訓方案" },
            { name: "AI 情感分析", desc: "用 AI 分析員工溝通情緒與組織氣候" },
            { name: "AI 內部知識庫", desc: "用 AI 建立與維護 HR 內部知識庫" },
          ],
          tools: ["Qualtrics / SurveyMonkey AI", "Learning Management System AI", "Notion AI 知識庫"],
          exercises: [
            "繪製一份完整的員工旅程地圖，標出 AI 可優化的接觸點",
            "設計一個 AI 員工服務助理的對話流程（top 20 FAQ）",
          ],
        },
        {
          id: "hr-i3",
          days: "第 61-90 天",
          theme: "HR AI 策略規劃",
          goal: "能主導 HR 部門的 AI 導入策略",
          skills: [
            { name: "HR AI 成熟度評估", desc: "能評估組織 HR 各場景的 AI 化程度" },
            { name: "AI Agent 績效管理", desc: "理解並能設計 AI Agent 的 KPI 與考核機制" },
            { name: "HR 技術選型", desc: "能評估與選擇適合組織的 HR AI 工具" },
            { name: "變革管理 AI 應用", desc: "用 AI 輔助變革溝通、訓練與成效追蹤" },
          ],
          tools: ["HRIS AI 功能評估", "RongRise AI 工具箱", "AI 治理框架"],
          exercises: [
            "用 RongRise HR AI 化成熟度評估工具跑一次自家 HR 部門",
            "寫一份 HR AI 導入路線圖（含選型標準、預算配置、成功指標）",
          ],
        },
      ],
    },
    advanced: {
      summary: "成為 HR AI 轉型的領導者，能帶領團隊、設計制度、驅動變革",
      phases: [
        {
          id: "hr-a1",
          days: "第 1-30 天",
          theme: "HR AI 治理與制度設計",
          goal: "能設計 HR 部門的 AI 治理框架",
          skills: [
            { name: "AI 治理框架設計", desc: "設計 HR 部門使用 AI 的規範、權限與審核機制" },
            { name: "AI 倫理與合規", desc: "理解 AI 在 HR 場景中的法律風險（歧視、個資、決策透明）" },
            { name: "人機協作介面設計", desc: "設計人+AI 協作的 HR 流程介面協議" },
            { name: "Agent 績效制度", desc: "為 HR 部門的 AI Agent 設計 KPI 與考核循環" },
          ],
          tools: ["AI 治理框架（RongRise 五檢查）", "Pilot Trap 診斷量表", "法規資料庫"],
          exercises: ["設計一份 HR 部門 AI 使用規範文件", "為 HR 團隊的 AI Agent 建立績效考核表"],
        },
        {
          id: "hr-a2",
          days: "第 31-60 天",
          theme: "AI 驅動的組織設計",
          goal: "能用 AI 重新設計組織流程與角色",
          skills: [
            { name: "組織網絡分析", desc: "用 AI 分析組織內部協作網絡與資訊流" },
            { name: "任務重新設計", desc: "用任務變形蟲方法論盤點團隊工作，重新設計人機分工" },
            { name: "HR 轉型藍圖規劃", desc: "為組織設計 6-12 個月的 HR AI 轉型藍圖" },
            { name: "文化變革領導", desc: "領導組織的 AI 文化變革（恐懼稅管理）" },
          ],
          tools: ["RongRise 任務變形蟲盤點器", "RongRise AI 轉型路線圖", "變革管理工具"],
          exercises: [
            "用任務變形蟲盤點 HR 部門的工作，標出 AI 可接手與不可接手的任務",
            "設計一份 6 個月 HR AI 轉型計畫（含里程碑與成功指標）",
          ],
        },
        {
          id: "hr-a3",
          days: "第 61-90 天",
          theme: "HR AI 生態系建構",
          goal: "能建構 HR AI 生態系統並對外輸出影響力",
          skills: [
            { name: "HR AI 解決方案架構", desc: "設計端到端的 HR AI 解決方案（從工具選型到組織導入）" },
            { name: "AI 人才策略", desc: "用 AI 驅動的人才策略規劃（招募、發展、留任一條龍）" },
            { name: "Thought Leadership", desc: "撰寫 HR AI 觀點文章、演講、顧問交付" },
            { name: "HR AI 團隊建置", desc: "招募、培訓、帶領 HR AI 專職團隊" },
          ],
          tools: ["RongRise 全工具箱", "電子報/文章/影片內容資產", "顧問方法論"],
          exercises: [
            "寫一篇 HR AI 轉型的觀點文章（可發布在公司部落格或社群）",
            "為 HR 團隊設計一份 AI 能力發展計畫（含培訓預算、時程、評估方式）",
          ],
        },
      ],
    },
  },

  /* ----- 行銷 ----- */
  marketing: {
    beginner: {
      summary: "從 AI 內容輔助到數據驅動行銷，30 天上手、60 天優化、90 天規模化",
      phases: [
        {
          id: "mk-b1", days: "第 1-30 天", theme: "AI 內容生產入門",
          goal: "學會用 AI 產出高品質行銷內容",
          skills: [
            { name: "AI 文案寫作", desc: "用 AI 寫社群貼文、廣告文案、電子報標題" },
            { name: "AI 圖片生成", desc: "學會用 Midjourney/Canva AI 產出行銷素材" },
            { name: "AI 社群排程", desc: "用 AI 輔助規劃社群內容行事曆" },
            { name: "SEO 關鍵字 AI 分析", desc: "用 AI 找出目標關鍵字與內容缺口" },
          ],
          tools: ["ChatGPT / Claude", "Canva AI / Recraft", "Notion AI"],
          exercises: ["用 AI 寫一週的社群貼文（3 平台 × 3 篇），手動調整風格","用 AI 產出一組廣告文案 A/B 測試版本"],
        },
        {
          id: "mk-b2", days: "第 31-60 天", theme: "內容策略 AI 化",
          goal: "能用 AI 規劃與優化內容策略",
          skills: [
            { name: "AI 競品分析", desc: "用 AI 分析競爭對手的內容策略與關鍵字佈局" },
            { name: "AI 內容改寫與優化", desc: "用 AI 將既有內容改寫成多平台版本" },
            { name: "AI 影片腳本生成", desc: "用 AI 輔助 YouTube/Reels 短影片腳本" },
            { name: "數據分析基礎", desc: "用 AI 解讀社群/廣告後台數據" },
          ],
          tools: ["Google Analytics AI 洞察", "ChatGPT Advanced Data Analysis", "Descript"],
          exercises: ["分析三個競對的內容策略，用 AI 彙整成報告","將一篇部落格文章改寫成 5 篇社群貼文 + 1 支影片腳本"],
        },
        {
          id: "mk-b3", days: "第 61-90 天", theme: "AI 驅動的行銷自動化",
          goal: "能設計 AI 輔助的行銷自動化流程",
          skills: [
            { name: "行銷漏斗自動化", desc: "用低程式碼工具設計自動化行銷流程" },
            { name: "AI 客戶分群", desc: "用 AI 輔助客戶分群與個人化行銷" },
            { name: "AI A/B 測試分析", desc: "用 AI 設計與分析 A/B 測試結果" },
            { name: "行銷 ROI 估算", desc: "用 AI 輔助計算行銷活動 ROI" },
          ],
          tools: ["Zapier / n8n", "HubSpot AI", "RongRise ROI 估算器"],
          exercises: ["設計一個自動化潛在客戶培育流程（從表單填寫到分眾寄信）","用 AI 分析上一季行銷活動 ROI，提出優化建議"],
        },
      ],
    },
    intermediate: {
      summary: "深化數據驅動行銷，從內容生產者進化為行銷分析師",
      phases: [
        {
          id: "mk-i1", days: "第 1-30 天", theme: "行銷數據分析",
          goal: "能用 AI 進行深度行銷數據分析",
          skills: [
            { name: "AI 轉換率分析", desc: "用 AI 找出轉換率瓶頸與改善方案" },
            { name: "AI 顧客旅程分析", desc: "用 AI 分析顧客旅程中的關鍵 touchpoint" },
            { name: "AI 預測模型基礎", desc: "用 AI 預測客戶終身價值與流失風險" },
          ],
          tools: ["Google Analytics 4", "Python AI 輔助分析", "Tableau"],
          exercises: ["用 AI 分析 GA4 數據，找出轉換率最低的三個頁面與原因","建立客戶分群模型，提出對應行銷策略"],
        },
        {
          id: "mk-i2", days: "第 31-60 天", theme: "AI 驅動個人化行銷",
          goal: "能設計 AI 驅動的個人化行銷方案",
          skills: [
            { name: "動態內容個人化", desc: "用 AI 設計動態內容推薦系統" },
            { name: "AI 廣告投放優化", desc: "用 AI 優化廣告受眾定位與出價策略" },
            { name: "AI 口碑監測", desc: "用 AI 監測品牌聲量與社群輿情" },
          ],
          tools: ["Meta Ads AI", "Google Ads 智慧出價", "Brandwatch"],
          exercises: ["設計一份 AI 驅動的個人化 Email 行銷腳本","用 AI 分析過去三個月的廣告數據，提出受眾重新定位建議"],
        },
        {
          id: "mk-i3", days: "第 61-90 天", theme: "行銷 AI 策略規劃",
          goal: "能主導行銷部門的 AI 導入",
          skills: [
            { name: "行銷科技堆疊評估", desc: "評估 Martech 工具的 AI 能力與整合方案" },
            { name: "AI 行銷預算配置", desc: "用 AI 輔助行銷預算分配與成效預測" },
            { name: "多通路歸因分析", desc: "用 AI 分析多通路行銷的歸因模型" },
          ],
          tools: ["RongRise 路線圖", "Martech 評估表", "Python 分析"],
          exercises: ["為行銷部門撰寫一份 AI 導入計畫（含工具選型、預算、KPI）","設計 AI 驅動的行銷成效儀表板"],
        },
      ],
    },
    advanced: {
      summary: "成為行銷 AI 轉型的策略領導者",
      phases: [
        {
          id: "mk-a1", days: "第 1-30 天", theme: "AI 行銷治理與策略",
          goal: "建立行銷 AI 使用規範與策略框架",
          skills: [
            { name: "AI 內容治理", desc: "建立 AI 生成內容的審核標準與品牌規範" },
            { name: "行銷 AI 風險管理", desc: "管理 AI 行銷中的品牌風險與資料合規" },
            { name: "跨部門 AI 協作", desc: "設計行銷與 IT/業務的 AI 協作流程" },
          ],
          tools: ["AI 治理框架", "品牌規範工具", "RongRise 五檢查"],
          exercises: ["撰寫行銷部門 AI 使用守則","設計行銷 AI 專案治理流程"],
        },
        {
          id: "mk-a2", days: "第 31-60 天", theme: "AI 創新行銷",
          goal: "用 AI 開發創新行銷方案",
          skills: [
            { name: "AI 生成式行銷", desc: "用 AI 開發互動式/個人化行銷活動" },
            { name: "AI 預測性行銷", desc: "用 AI 預測市場趨勢與消費者行為" },
            { name: "AI 行銷自動化架構", desc: "設計企業級行銷自動化架構" },
          ],
          tools: ["生成式 AI 工具", "Python ML 基礎", "自動化平台"],
          exercises: ["設計一個 AI 驅動的互動式行銷活動","規劃行銷自動化架構藍圖"],
        },
        {
          id: "mk-a3", days: "第 61-90 天", theme: "成長策略 AI 化",
          goal: "用 AI 驅動企業成長策略",
          skills: [
            { name: "AI 市場預測", desc: "用 AI 分析市場趨勢與競爭動態" },
            { name: "AI 產品定位", desc: "用 AI 輔助產品定價、定位與訊息策略" },
            { name: "AI 成長駭客", desc: "用 AI 開發成長實驗與優化循環" },
          ],
          tools: ["RongRise 趨勢雷達", "市場分析工具", "成長框架"],
          exercises: ["用 AI 分析市場趨勢，提出下一季成長策略","設計一個 AI 驅動的成長實驗架構"],
        },
      ],
    },
  },

  /* ----- 業務 ----- */
  sales: {
    beginner: {
      summary: "用 AI 提升銷售效率，從客戶開發到結案追蹤全面升級",
      phases: [
        {
          id: "sl-b1", days: "第 1-30 天", theme: "AI 銷售工具入門",
          goal: "熟悉 AI 工具在銷售流程中的基本應用",
          skills: [
            { name: "AI 客戶開發信", desc: "用 AI 寫個人化的開發信與跟進郵件" },
            { name: "AI 銷售簡報輔助", desc: "用 AI 產出銷售簡報初稿與提案內容" },
            { name: "AI 客戶研究", desc: "用 AI 快速研究潛在客戶的公司背景與痛點" },
            { name: "AI 會議記錄", desc: "用 AI 自動摘要客戶會議內容與行動項目" },
          ],
          tools: ["ChatGPT / Claude", "Notion AI", "Canva AI"],
          exercises: ["用 AI 寫 3 封不同產業的客戶開發信","用 AI 研究一個潛在客戶並產出拜訪前 briefing"],
        },
        {
          id: "sl-b2", days: "第 31-60 天", theme: "CRM AI 應用",
          goal: "能用 AI 優化 CRM 管理與銷售流程",
          skills: [
            { name: "AI CRM 資料清理", desc: "用 AI 輔助清理與更新 CRM 客戶資料" },
            { name: "AI 銷售預測", desc: "用 AI 分析銷售 pipeline 預測達成率" },
            { name: "AI 客戶分級", desc: "用 AI 輔助客戶分級與優先順序排序" },
            { name: "AI 跟進排程", desc: "用 AI 優化客戶跟進頻率與時機" },
          ],
          tools: ["Salesforce / HubSpot AI", "Google Sheets AI", "Calendly"],
          exercises: ["用 AI 分析銷售 pipeline，找出卡住的交易","建立 AI 驅動的客戶跟進排程表"],
        },
        {
          id: "sl-b3", days: "第 61-90 天", theme: "AI 銷售優化",
          goal: "能用 AI 優化銷售策略與談判",
          skills: [
            { name: "AI 競爭分析", desc: "用 AI 分析競爭對手的銷售策略與定位" },
            { name: "AI 銷售腳本", desc: "用 AI 設計銷售 call script 與常見異議處理" },
            { name: "AI 客戶成功分析", desc: "用 AI 分析客戶使用數據預測流失風險" },
          ],
          tools: ["Sales Intelligence 工具", "RongRise ROI 估算器", "CRM AI"],
          exercises: ["用 AI 分析 top 3 競爭對手的銷售策略","設計一份 AI 輔助的客戶成功管理流程"],
        },
      ],
    },
    intermediate: {
      summary: "深化數據驅動銷售，從銷售人員進化為銷售分析師",
      phases: [
        {
          id: "sl-i1", days: "第 1-30 天", theme: "銷售數據分析",
          goal: "能用 AI 進行銷售數據深度分析",
          skills: [
            { name: "銷售預測模型", desc: "用 AI 建立更精準的銷售預測模型" },
            { name: "AI 銷售效能分析", desc: "用 AI 分析個別業務的效能與改善空間" },
            { name: "AI 定價分析", desc: "用 AI 分析定價策略與折扣對成交率的影響" },
          ],
          tools: ["Python AI 分析", "Tableau", "Excel AI"],
          exercises: ["建立銷售預測模型並比對實際達成率","分析折扣對成交率與利潤的影響"],
        },
        {
          id: "sl-i2", days: "第 31-60 天", theme: "AI 驅動銷售策略",
          goal: "用 AI 設計數據驅動的銷售策略",
          skills: [
            { name: "客戶旅程分析", desc: "用 AI 分析客戶從開發到成交的完整旅程" },
            { name: "銷售歸因分析", desc: "用 AI 分析各銷售活動對成交的貢獻度" },
            { name: "AI 銷售教練", desc: "用 AI 輔助銷售團隊訓練與 coaching" },
          ],
          tools: ["CRM AI 分析", "Sales Enablement 平台", "RongRise 趨勢雷達"],
          exercises: ["分析 top 10% 業務的共同行為模式","設計 AI 輔助的銷售教練計畫"],
        },
      ],
    },
    advanced: {
      summary: "成為銷售 AI 轉型的領導者",
      phases: [
        {
          id: "sl-a1", days: "第 1-30 天", theme: "銷售 AI 策略",
          goal: "主導銷售部門 AI 轉型策略",
          skills: [
            { name: "銷售 AI 工具評估", desc: "建立銷售 AI 工具的評估框架與導入順序" },
            { name: "AI 銷售流程改造", desc: "重新設計 AI 時代的銷售流程與角色分工" },
            { name: "銷售 AI KPI", desc: "為 AI 輔助的銷售活動設計新的 KPI" },
          ],
          tools: ["RongRise 工具箱", "銷售科技評估表", "專案管理工具"],
          exercises: ["撰寫銷售部門 AI 導入路線圖","設計 AI 時代的銷售 KPI 框架"],
        },
        {
          id: "sl-a2", days: "第 31-60 天", theme: "AI 銷售組織設計",
          goal: "設計 AI 驅動的銷售組織",
          skills: [
            { name: "AI 銷售團隊建置", desc: "設計人+AI Agent 混合銷售團隊結構" },
            { name: "AI 銷售培訓體系", desc: "建立 AI 輔助的銷售培訓與認證體系" },
            { name: "銷售預測治理", desc: "建立 AI 銷售預測的治理與覆核機制" },
          ],
          tools: ["RongRise 員工技能路徑", "學習管理系統", "協作工具"],
          exercises: ["設計混合銷售團隊的運作模型","建立銷售 AI 預測的品質管理機制"],
        },
      ],
    },
  },

  /* ----- IT ----- */
  it: {
    beginner: {
      summary: "從 AI 輔助開發到系統維運 AI 化，打造技術驅動的 AI 能力",
      phases: [
        {
          id: "it-b1", days: "第 1-30 天", theme: "AI 輔助開發入門",
          goal: "學會用 AI 工具加速日常開發工作",
          skills: [
            { name: "AI 程式碼生成", desc: "用 AI 輔助撰寫、審查與重構程式碼" },
            { name: "AI 錯誤除錯", desc: "用 AI 協助分析錯誤訊息與除錯" },
            { name: "AI 技術文件撰寫", desc: "用 AI 自動生成 API 文件與技術說明" },
            { name: "AI Shell 指令輔助", desc: "用 AI 協助撰寫與解釋 shell 腳本" },
          ],
          tools: ["Claude Code / Copilot", "ChatGPT", "GitHub Copilot"],
          exercises: ["用 AI 輔助完成一個小功能（從規格到 PR）","用 AI 分析一個 bug，找出根因並修復"],
        },
        {
          id: "it-b2", days: "第 31-60 天", theme: "系統維運 AI 化",
          goal: "用 AI 優化系統監控與維運流程",
          skills: [
            { name: "AI 日誌分析", desc: "用 AI 分析系統日誌異常與模式" },
            { name: "AI 監控告警", desc: "用 AI 設定智慧監控規則減少誤報" },
            { name: "AI 資料庫查詢", desc: "用 AI 輔助撰寫與優化 SQL 查詢" },
          ],
          tools: ["Grafana AI", "Python + LLM", "DBA AI 工具"],
          exercises: ["用 AI 分析一週的系統日誌，找出異常模式","用 AI 優化一個慢查詢 SQL"],
        },
        {
          id: "it-b3", days: "第 61-90 天", theme: "AI 架構設計",
          goal: "能設計簡單的 AI 應用架構",
          skills: [
            { name: "AI API 串接", desc: "學會串接 OpenRouter/OpenAI 等 AI API" },
            { name: "RAG 概念入門", desc: "理解檢索增強生成的基本原理與應用場景" },
            { name: "AI Agent 概念", desc: "理解 AI Agent 的架構與應用模式" },
          ],
          tools: ["OpenRouter API", "LangChain 基礎", "Docker"],
          exercises: ["建立一個簡單的 AI 客服 API","用 RAG 做一個公司知識庫問答原型"],
        },
      ],
    },
    intermediate: {
      summary: "從 AI 使用者進化為 AI 應用架構師",
      phases: [
        {
          id: "it-i1", days: "第 1-30 天", theme: "AI 應用開發",
          goal: "能獨立開發 AI 應用",
          skills: [
            { name: "LLM 應用開發", desc: "用 LangChain / Vercel AI SDK 開發 LLM 應用" },
            { name: "向量資料庫", desc: "理解並實作向量資料庫與語意搜尋" },
            { name: "AI Agent 框架", desc: "用 LangGraph / CrewAI 實作多 Agent 協作" },
          ],
          tools: ["LangChain", "Pinecone / Qdrant", "CrewAI"],
          exercises: ["建立一個 RAG 應用（從 ingest 到 query）","實作一個簡單的 AI Agent 工作流程"],
        },
        {
          id: "it-i2", days: "第 31-60 天", theme: "AI 基礎設施",
          goal: "能建置與維運 AI 基礎設施",
          skills: [
            { name: "AI API Gateway", desc: "建置 AI API 閘道（路由、快取、費率限制）" },
            { name: "AI 模型部署", desc: "用 vLLM / Ollama 部署開源模型" },
            { name: "AI 監控與可觀測性", desc: "監控 AI 應用的效能、成本與品質" },
          ],
          tools: ["vLLM / Ollama", "Grafana + Prometheus", "OpenRouter"],
          exercises: ["建置一個 AI API Gateway 並設定費率限制","部署一個開源 LLM 並建立效能監控儀表板"],
        },
        {
          id: "it-i3", days: "第 61-90 天", theme: "AI MCP 與工具開發",
          goal: "能開發 MCP 伺服器與自訂 AI 工具",
          skills: [
            { name: "MCP 伺服器開發", desc: "開發 Model Context Protocol 伺服器" },
            { name: "AI 工具鏈設計", desc: "設計 AI agent 可使用的工具集與 API" },
            { name: "AI 安全與治理技術", desc: "實作 AI 應用的安全機制（輸入驗證、輸出過濾）" },
          ],
          tools: ["MCP SDK", "FastAPI", "Hermes Agent"],
          exercises: ["建立一個 MCP 伺服器並整合到 Hermes","設計 AI agent 工具集的安全規範"],
        },
      ],
    },
    advanced: {
      summary: "成為 AI 技術架構的領導者",
      phases: [
        {
          id: "it-a1", days: "第 1-30 天", theme: "AI 技術策略",
          goal: "制定組織的 AI 技術策略",
          skills: [
            { name: "AI 技術選型框架", desc: "建立 AI 技術評估與選型標準" },
            { name: "AI 基礎設施規劃", desc: "設計可擴展的 AI 基礎設施架構" },
            { name: "AI 成本管理", desc: "建立 AI 算力與 API 成本管理機制" },
          ],
          tools: ["雲端 AI 服務評估", "成本管理工具", "RongRise 工具箱"],
          exercises: ["撰寫 AI 技術架構白皮書","設計 AI 成本管理與用量預測模型"],
        },
        {
          id: "it-a2", days: "第 31-60 天", theme: "AI 治理技術",
          goal: "建置 AI 治理技術基礎設施",
          skills: [
            { name: "AI 模型評估", desc: "建立模型評估框架（準確率、延遲、成本）" },
            { name: "AI 安全架構", desc: "設計 AI 應用的安全架構（隔離、審計、合規）" },
            { name: "AI Agent 治理平台", desc: "建置 AI Agent 的資產管理與監控平台" },
          ],
          tools: ["OpenRouter", "Hermes Agent", "安全掃描工具"],
          exercises: ["設計 AI Agent 治理平台的技術架構","建立 AI 模型評估的自動化 pipeline"],
        },
      ],
    },
  },

  /* ----- 管理層 ----- */
  management: {
    beginner: {
      summary: "建立 AI 領導力基礎，從理解 AI 到帶領團隊擁抱 AI",
      phases: [
        {
          id: "mg-b1", days: "第 1-30 天", theme: "AI 基礎認知",
          goal: "建立對 AI 的正確認知與戰略視野",
          skills: [
            { name: "AI 核心概念理解", desc: "理解生成式 AI、LLM、AI Agent 的基本原理與限制" },
            { name: "AI 產業趨勢掃描", desc: "掌握 AI 在各產業的應用現況與發展方向" },
            { name: "AI 對組織的影響", desc: "理解 AI 對組織結構、工作流程、人才需求的影響" },
            { name: "AI 風險認知", desc: "了解 AI 導入的主要風險（資料安全、偏誤、合規）" },
          ],
          tools: ["RongRise 趨勢雷達", "McKinsey / BCG AI 報告", "產業新聞"],
          exercises: ["讀 3 篇 AI 報告並寫下對自家組織的啟發","和團隊討論 AI 對部門的影響"],
        },
        {
          id: "mg-b2", days: "第 31-60 天", theme: "AI 導入實務",
          goal: "能領導 AI 導入專案的初步規劃",
          skills: [
            { name: "AI 專案規劃", desc: "學習 AI 導入專案的基本框架與成功要素" },
            { name: "AI 預算與資源規劃", desc: "理解 AI 導入的資源需求與預算配置原則" },
            { name: "AI 團隊建置", desc: "了解 AI 時代的團隊角色與人才需求" },
            { name: "AI KPI 設計", desc: "學習為 AI 專案設計有效的衡量指標" },
          ],
          tools: ["RongRise ROI 估算器", "RongRise 路線圖", "專案管理工具"],
          exercises: ["用 ROI 估算器評估一個 AI 導入機會","為 AI 專案設計初步的 KPI 框架"],
        },
        {
          id: "mg-b3", days: "第 61-90 天", theme: "AI 組織變革",
          goal: "能帶領團隊度過 AI 導入的變革期",
          skills: [
            { name: "AI 變革管理", desc: "學習變革管理方法論在 AI 導入中的應用" },
            { name: "AI 溝通策略", desc: "設計有效的 AI 導入溝通計畫" },
            { name: "AI 恐懼管理", desc: "理解與管理員工對 AI 的恐懼與抗拒" },
            { name: "AI 文化建設", desc: "建立鼓勵 AI 實驗與學習的組織文化" },
          ],
          tools: ["RongRise 恐懼稅框架", "變革管理工具", "RongRise Pilot Trap"],
          exercises: ["設計 AI 導入的變革溝通計畫","進行團隊 AI 準備度評估"],
        },
      ],
    },
    intermediate: {
      summary: "深化 AI 策略規劃能力，從專案領導進化為策略制定者",
      phases: [
        {
          id: "mg-i1", days: "第 1-30 天", theme: "AI 策略規劃",
          goal: "能制定組織層級的 AI 策略",
          skills: [
            { name: "AI 成熟度診斷", desc: "評估組織 AI 導入的現況與差距" },
            { name: "AI 策略地圖", desc: "制定 AI 轉型策略地圖（目標、路徑、資源）" },
            { name: "AI 投資組合管理", desc: "管理 AI 投資組合（基礎建設、應用、人才）" },
          ],
          tools: ["RongRise 成熟度評估", "RongRise 路線圖", "策略規劃工具"],
          exercises: ["用 RongRise HR 成熟度評估工具評估自家團隊","制定 AI 轉型策略地圖（6-12 個月）"],
        },
        {
          id: "mg-i2", days: "第 31-60 天", theme: "AI 治理與風險管理",
          goal: "建立組織層級的 AI 治理框架",
          skills: [
            { name: "AI 治理框架", desc: "設計組織的 AI 使用政策與治理結構" },
            { name: "AI 合規與倫理", desc: "確保 AI 應用符合法規與倫理標準" },
            { name: "AI 風險管理", desc: "建立 AI 風險評估與管理流程" },
          ],
          tools: ["RongRise 五檢查", "法規資料庫", "風險管理框架"],
          exercises: ["撰寫組織 AI 使用政策","設計 AI 風險評估矩陣"],
        },
        {
          id: "mg-i3", days: "第 61-90 天", theme: "AI 組織設計",
          goal: "能重新設計 AI 時代的組織結構",
          skills: [
            { name: "AI 組織結構設計", desc: "設計人+AI 混合的組織結構" },
            { name: "AI 績效制度改革", desc: "重新設計 AI 時代的績效管理制度" },
            { name: "AI 人才策略", desc: "制定 AI 時代的人才招募、發展與留任策略" },
          ],
          tools: ["RongRise 五層框架", "組織設計工具", "RongRise 員工路徑"],
          exercises: ["設計 AI 時代的組織結構圖草案","重新設計部門績效考核表（納入 AI 相關指標）"],
        },
      ],
    },
    advanced: {
      summary: "成為 AI 轉型的執行領袖，帶領整個組織完成 AI 轉型",
      phases: [
        {
          id: "mg-a1", days: "第 1-30 天", theme: "AI 轉型領導",
          goal: "建立 AI 轉型的領導力與執行力",
          skills: [
            { name: "AI 轉型藍圖設計", desc: "設計組織層級的 AI 轉型藍圖（12-24 個月）" },
            { name: "AI 執行治理", desc: "建立 AI 轉型的治理機制（決策、資源、進度）" },
            { name: "AI 文化變革", desc: "領導組織的 AI 文化變革（從恐懼到賦能）" },
          ],
          tools: ["RongRise 全工具鏈", "變革管理方法論", "策略執行框架"],
          exercises: ["撰寫 AI 轉型宣言與策略文件","設計 AI 轉型治理架構"],
        },
        {
          id: "mg-a2", days: "第 31-60 天", theme: "AI 生態系統建構",
          goal: "建構組織的 AI 生態系統",
          skills: [
            { name: "AI 夥伴生態", desc: "建立 AI 技術夥伴與顧問合作網絡" },
            { name: "AI 人才生態", desc: "建立 AI 人才的招募、培訓與留任系統" },
            { name: "AI 創新機制", desc: "建立持續 AI 創新與實驗的組織機制" },
          ],
          tools: ["合作夥伴評估框架", "人才發展系統", "創新管理工具"],
          exercises: ["設計 AI 人才生態系統","建立 AI 創新的提案與評估機制"],
        },
      ],
    },
  },
};

/* ============ 計算邏輯 ============ */

export function generatePath(dept: DeptKey, level: LevelKey): SkillPathResult {
  const deptInfo = DEPT_INFO[dept];
  const path = PATHS[dept]?.[level];

  if (!path) {
    // fallback
    return {
      dept: deptInfo.label,
      deptIcon: deptInfo.icon,
      level: level,
      levelLabel: LEVEL_LABELS[level],
      phases: [
        {
          id: "fallback",
          days: "第 1-30 天",
          theme: "AI 基礎養成",
          goal: "建立 AI 基礎能力",
          skills: [{ name: "AI 工具操作", desc: "學習使用主流 AI 工具" }],
          tools: ["ChatGPT", "Copilot"],
          exercises: ["每天用 AI 完成一項工作任務"],
        },
      ],
      summary: "建立 AI 基礎能力，逐步深化應用。",
    };
  }

  return {
    dept: deptInfo.label,
    deptIcon: deptInfo.icon,
    level,
    levelLabel: LEVEL_LABELS[level],
    phases: path.phases,
    summary: path.summary,
  };
}

export function getDeptList(): { key: DeptKey; info: DeptInfo }[] {
  return (Object.keys(DEPT_INFO) as DeptKey[]).map((key) => ({ key, info: DEPT_INFO[key] }));
}

export function getLevelList(): { key: LevelKey; label: string }[] {
  return (Object.keys(LEVEL_LABELS) as LevelKey[]).map((key) => ({ key, label: LEVEL_LABELS[key] }));
}