/**
 * 文章配圖映射表 — 單一來源，所有頁面 import 使用
 * Article cover image map — single source of truth
 */

export const COVER_MAP: Record<string, string> = {
  "ai-transformation-bootcamp": "article-ai-bootcamp.jpg",
  "hr-ai-course-design": "article-hr-ai-course.jpg",
  "sme-esg-guide": "article-sme-esg.jpg",
  "manufacturing-ai-quality": "article-manufacturing-ai.jpg",
  "ai-maturity-assessment": "article-ai-maturity.jpg",
  "team-innovation-management": "article-team-innovation.jpg",
  "ai-tool-selection-guide": "article-ai-tool-selection.jpg",
  "service-ai-chatbot-case": "article-service-chatbot.jpg",
  "gov-ai-subsidy-guide": "article-gov-subsidy.jpg",
  "ai-transformation-trends-2026": "article-ai-trends-2026.jpg",
  "agentic-ai-transformation-workshop": "article-agentic-ai.jpg",
  "hr-ai-transformation-five-layers": "article-hr-five-layers.jpg",
  "ai-layoffs-narrative-dead": "article-ai-layoffs.jpg",
  "ai-agent-management-era": "article-ai-agent-mgmt.jpg",
  "strategy-subtraction-traditional-industry": "article-strategy-subtraction.jpg",
  "xiaoha-weekly-vol1": "article-xiaoha-weekly-vol1.svg",
  "10-management-psychology-theories": "article-cover.jpg",
};

export function coverImg(slug: string): string {
  return `/images/${COVER_MAP[slug] || "article-cover.jpg"}`;
}
