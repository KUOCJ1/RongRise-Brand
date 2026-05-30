/* ============================================
   GA4 事件追蹤工具
   使用 window.gtag 發送自訂事件
   ============================================ */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

/** 檢查 gtag 是否可用 */
function isGtagAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

// ─── CTA 點擊 ──────────────────────────────
export function trackCTALabel(label: string, location: string) {
  if (!isGtagAvailable()) return;
  window.gtag("event", "click_cta", {
    cta_label: label,
    page_location: location,
  });
}

// ─── 小幫手互動 ────────────────────────────
export function trackAssistantSend(messageLength: number) {
  if (!isGtagAvailable()) return;
  window.gtag("event", "assistant_send", {
    message_length: messageLength,
  });
}

// ─── 小幫手快速問題 ------------------------
export function trackAssistantQuickQuestion(question: string) {
  if (!isGtagAvailable()) return;
  window.gtag("event", "assistant_quick_question", {
    question,
  });
}

// ─── 知識文章閱讀 ──────────────────────────
export function trackKnowledgeRead(slug: string, title: string, category: string) {
  if (!isGtagAvailable()) return;
  window.gtag("event", "knowledge_read", {
    article_slug: slug,
    article_title: title,
    article_category: category,
  });
}

// ─── 下載點擊 ──────────────────────────────
export function trackDownloadClick(fileName: string, location: string) {
  if (!isGtagAvailable()) return;
  window.gtag("event", "download_click", {
    file_name: fileName,
    page_location: location,
  });
}

// ─── 滾動深度 ──────────────────────────────
export function trackScrollDepth(depth: number) {
  if (!isGtagAvailable()) return;
  window.gtag("event", "scroll_depth", {
    depth_percent: depth,
  });
}

// ─── ESG 自評 ──────────────────────────────
export function trackEsgAssessmentStart() {
  if (!isGtagAvailable()) return;
  window.gtag("event", "esg_assessment_start");
}

export function trackEsgAssessmentComplete(score: number, level: string) {
  if (!isGtagAvailable()) return;
  window.gtag("event", "esg_assessment_complete", {
    total_score: score,
    result_level: level,
  });
}

// ─── 聯絡表單 ──────────────────────────────
export function trackContactSubmit(method: string) {
  if (!isGtagAvailable()) return;
  window.gtag("event", "contact_submit", {
    contact_method: method,
  });
}
