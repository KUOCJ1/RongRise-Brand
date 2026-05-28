import Link from "next/link";

/* ============================================
   關於我 About Page
   ============================================ */

const timeline = [
  { year: "發展歷程", title: "深耕企業顧問領域", desc: "累積多年企業管理與顧問實務經驗，服務橫跨製造、科技、服務等多元產業。" },
  { year: "專業聚焦", title: "AI × 人才 × ESG", desc: "將 AI 轉型策略、人才發展與 ESG 永續三大領域整合，提供企業全方位的轉型顧問服務。" },
  { year: "展望未來", title: "智慧轉型，創新未來", desc: "持續陪伴中小企業在數位浪潮中穩健前行，共創永續成長的嶄新未來。" },
];

const expertise = [
  { icon: "📊", title: "AI 轉型顧問", desc: "AI 成熟度評估、導入策略規劃、自動化流程設計、AI 人才培訓" },
  { icon: "🎯", title: "人才發展策略", desc: "組織能力建構、數位人才培訓、接班人計畫、績效管理優化" },
  { icon: "🌿", title: "ESG 永續諮詢", desc: "ESG 現況評估、永續策略規劃、指標體系建立、社會影響力報告" },
  { icon: "💡", title: "創新管理輔導", desc: "商業模式創新、數位轉型路徑、變革管理、敏捷組織建構" },
];

const values = [
  { title: "專業嚴謹", desc: "以精確術語、清晰邏輯、深度知識為基底，確保每一項建議都有數據與理論支撐。" },
  { title: "前瞻創新", desc: "擁抱新技術、引導趨勢，協助企業在變動中搶得先機，而非被動追趕。" },
  { title: "務實可行", desc: "每一個解決方案都聚焦於可執行性，為企業創造看得見的價值效益。" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="tag bg-white/15 text-white">關於我</span>
            <h1 className="heading-hero mt-4 mb-4">
              郭鎮榕
              <br />
              <span className="text-tertiary-light text-3xl md:text-4xl">C.J. Kuo</span>
            </h1>
            <p className="text-body-lg text-white/85">
              榕耀管顧創辦人 · 企業轉型顧問<br />
              協助企業從人才策略到 AI 落地，驅動永續成長。
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="section-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-4 ring-primary/10">
                <img
                  src="/images/cj-avatar.svg"
                  alt="郭鎮榕 C.J. Kuo — 榕耀管顧創辦人"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <h2 className="heading-section mb-4">
                我的<span className="text-primary">故事</span>
              </h2>
              <div className="brand-divider mb-6" />
              <div className="space-y-4 text-text-secondary text-body leading-relaxed">
                <p>
                  在企業顧問領域深耕多年，我见证過許多企業在轉型浪潮中的掙扎與突破。每一次的輔導經驗都讓我更確信——<strong className="text-dark">真正的轉型不只是技術升級，而是思維的革新</strong>。
                </p>
                <p>
                  創辦榕耀管顧的初衷，是希望以<strong>專業且務實</strong>的方式，協助中小型企業在 AI 時代中找到屬於自己的轉型路徑。不走捷徑，不談空話，只提供<strong>真正落地可行的方案</strong>。
                </p>
                <p>
                  我相信，當<strong>人才、策略與科技</strong>三者對齊，企業就能在變動中創造持續的競爭優勢。這是我一路走來的信念，也是我想與每一位業主分享的價值。
                </p>
              </div>
              <div className="mt-6">
                <Link href="/assistant" className="btn-ghost text-primary">
                  💬 想更了解我的服務？問問小幫手 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="section bg-bg-alt">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">專業領域</span>
            <h2 className="heading-section text-dark mt-4">核心專長</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((item, i) => (
              <div key={i} className="card flex gap-4">
                <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="heading-subsection text-dark mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-body-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">歷程</span>
            <h2 className="heading-section text-dark mt-4">我的發展軌跡</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-tertiary flex-shrink-0 mt-2" />
                  {i < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-4">
                  <span className="text-xs font-semibold text-tertiary">{item.year}</span>
                  <h3 className="heading-subsection text-dark mb-1">{item.title}</h3>
                  <p className="text-text-secondary text-body-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-gradient-subtle">
        <div className="section-inner">
          <div className="text-center mb-12">
            <span className="tag mb-4">核心價值</span>
            <h2 className="heading-section text-dark mt-4">我的顧問理念</h2>
            <div className="brand-divider brand-divider-center mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">
                    {i === 0 ? "📐" : i === 1 ? "🚀" : "✅"}
                  </span>
                </div>
                <h3 className="heading-subsection text-dark mb-2">{v.title}</h3>
                <p className="text-text-secondary text-body-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-primary text-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="tag bg-white/15 text-white mb-4">聯絡方式</span>
            <h2 className="heading-section mt-4 text-white">與我聯繫</h2>
            <div className="brand-divider brand-divider-center mt-4 bg-white/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-3xl mb-3">📧</div>
              <h4 className="font-semibold mb-1">Email</h4>
              <p className="text-white/70 text-sm">info@rongrise.com</p>
            </div>
            <div>
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold mb-1">LINE 官方</h4>
              <p className="text-white/70 text-sm">@RongRise</p>
            </div>
            <div>
              <div className="text-3xl mb-3">📍</div>
              <h4 className="font-semibold mb-1">服務地區</h4>
              <p className="text-white/70 text-sm">全台 · 線上諮詢</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-white/80 text-body mb-6">
              準備好開始您的轉型之旅？歡迎透過以下方式與我聯繫，
              <br className="hidden md:block" />
              讓我們一起探索最適合您企業的發展路徑。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:info@rongrise.com" className="btn-primary bg-white text-primary font-bold hover:bg-white/95">
                ✉️ 發送 Email
              </a>
              <Link href="/downloads" className="btn-secondary border-white/40 text-white hover:bg-white/15 hover:border-white">
                📄 下載服務簡章
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
