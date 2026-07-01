import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: "🔍",
    title: "免費診斷",
    desc: "30 分鐘深度對談，了解您的企業現況、核心挑戰與轉型目標。不推銷，只给方向。",
    detail: "適合：不確定從哪開始的企業"
  },
  {
    step: "02",
    icon: "📊",
    title: "現況評估",
    desc: "以數據為基礎，全面盤點組織能力、AI 成熟度、ESG 差距。找出最關鍵的杠杆點。",
    detail: "交付：現況評估報告 + 優先行動建議"
  },
  {
    step: "03",
    icon: "📋",
    title: "策略規劃",
    desc: "客製化轉型藍圖，包含時程、資源、風險管理。確保每一步都是可執行的。",
    detail: "交付：轉型策略書 + 導入路線圖"
  },
  {
    step: "04",
    icon: "🚀",
    title: "落地執行",
    desc: "陪伴式導入，從 PoC 到全面落地。不只是給魚，更教你釣魚。",
    detail: "交付：導入成效報告 + 團隊賦能"
  },
  {
    step: "05",
    icon: "📈",
    title: "成效追蹤",
    desc: "建立可衡量的 KPI 體系，持續優化。轉型不是專案，是持續的精進。",
    detail: "交付：定期成效 review + 優化建議"
  }
];

export default function ServiceFlowSection() {
  return (
    <section className="section bg-bg-alt">
      <div className="section-inner">
        <div className="text-center mb-12">
          <span className="tag mb-4">服務流程</span>
          <h2 className="heading-section text-text-primary mt-4">我們的合作方式</h2>
          <div className="brand-divider brand-divider-center mt-4" />
          <p className="text-text-secondary text-body-lg mt-4 max-w-2xl mx-auto">
            從第一次對話到轉型落地，每一步都有清晰的目標與交付。
            不只是顧問，更是並肩作戰的夥伴。
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((item, i) => (
            <div key={i} className="flex gap-6 mb-8 last:mb-0">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/20 to-transparent mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-tertiary tracking-wider">STEP {item.step}</span>
                  <h3 className="heading-subsection text-text-primary text-[1.1rem]">{item.title}</h3>
                </div>
                <p className="text-text-secondary text-body leading-relaxed mb-2">{item.desc}</p>
                <p className="text-xs text-text-secondary flex items-center gap-1">
                  <span className="text-primary">✦</span> {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-10 max-w-2xl mx-auto">
            <h3 className="heading-subsection text-white mb-3">準備好踏出第一步了嗎？</h3>
            <p className="text-white/80 text-body mb-6">
              從免費 30 分鐘診斷開始，讓我們了解您的需求。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about#contact" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">
                預約免費診斷
              </Link>
              <Link href="/services" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
                了解完整服務 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
