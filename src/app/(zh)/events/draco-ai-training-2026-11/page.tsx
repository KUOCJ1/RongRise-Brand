import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "兩天，近四十位主管，總經理全程坐在台下｜登泰國際物流 AI 課程紀實｜榕耀管顧",
  description:
    "2026 年 11 月 21、22 日，我在高雄登泰國際物流，為近四十位主管上課。總經理與副總全場參與，後續推動由總經理親自下達指令。第一天結束後我發現自己低估了學員的程度，但越是著急，越要守住次序。",
};

const P = "text-text-secondary leading-[1.85] my-6";
const H2 = "text-text-primary text-2xl font-bold mb-4 mt-12";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "兩天，近四十位主管，總經理全程坐在台下",
  description:
    "高雄登泰國際物流兩日 AI 課程紀實：領導者的參與程度，決定 AI 導入的天花板。",
  datePublished: "2026-11-22",
  dateModified: "2026-11-22",
  author: { "@type": "Person", name: "郭鎮榕" },
  publisher: {
    "@type": "Organization",
    name: "榕耀管顧 RongRise Consulting",
    url: "https://rong-rise.com",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://rong-rise.com/events/draco-ai-training-2026-11/",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">活動紀實</span>
          <h1 className="heading-hero mt-4 mb-4">兩天，近四十位主管，總經理全程坐在台下</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            一個週末，高雄有兩種熱鬧。一邊是世運主場館的演唱會，一邊是會議室裡的 AI 課。
            主管們選了後者，而總經理與副總從頭到尾都在場。
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-white/75">
            <span>2026-11-21 至 11-22（週六、週日）</span>
            <span>登泰國際物流股份有限公司</span>
            <span>高雄</span>
            <span>近 40 位主管</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="max-w-3xl mx-auto">
            <p className={P}>
              11 月 21、22 這兩天，我在高雄，在登泰國際物流幫將近四十位主管上課。
            </p>
            <p className={P}>
              讓我覺得很難能可貴的是，這個課程除了在座都是主管之外，總經理和副總們也全程都在現場，
              而且積極參與。整個課程的推動與後續推行，都是由總經理親自下達指令。
            </p>

            <figure className="my-10">
              <img
                src="/images/events/draco-ai-training-2026-11.jpg"
                alt="登泰國際物流兩日 AI 課程現場，主管齊聚會議室的插畫版本"
                className="w-full rounded-2xl border border-border-light"
                loading="lazy"
              />
              <figcaption className="text-sm text-text-secondary mt-3 text-center">
                登泰國際物流兩日課程現場。為保護學員，照片已轉為插畫版本。
              </figcaption>
            </figure>

            <h2 className={H2}>領導者的信念，決定這件事的天花板</h2>
            <p className={P}>
              就像我之前常講的，一家公司能否成功導入 AI，關鍵在於領導者的信念、
              commitment 有多少，以及他親自使用的程度。
            </p>
            <p className={P}>
              這一場我看到的不只是「有出席」。總經理坐在台下聽完，後續的推動方向由他自己下指令；
              副總也在場，跟著一起討論。這種參與程度，會直接決定課程結束之後，事情還會不會繼續。
              很多企業的 AI 課上完就結束了，原因通常不是員工不想做，是沒有人在後面追。
            </p>

            <h2 className={H2}>同一個週末，高雄還有另一件事</h2>
            <p className={P}>
              特別的是，這兩天剛好韓國天團 BTS 在高雄開演唱會，整個高雄非常熱鬧。
              但主管們週末卻選擇留在這裡上課，這點讓我覺得很特別。
              不是因為課比演唱會有趣，而是他們願意把兩天完整交給一件事。
            </p>

            <h2 className={H2}>第一天：我低估了他們</h2>
            <p className={P}>
              第一天上完課，覺得學員的程度相當不錯，有點低估他們了。
              我知道大家對 AI 這件事都很著急、很想趕快落地，但有些步驟真的是急不得，
              否則後續要再補起來會很困難。
            </p>
            <p className={P}>
              例如基本素養、公司內部的規定與制度面，以及資安的部分，都要先做好配套。
              否則當員工的 AI 能力全面提升之後，是否真能反映在整個組織的效率與能力上，其實是不一定的。
            </p>
            <p className={P}>
              我很期待他們在員工能力提升後，能花更多時間去架構組織內部面對 AI 帶來的衝擊。
              能力先到位，組織沒跟上，最後只會多出一批各自用得很開心、卻接不回公司流程的人。
            </p>

            <h2 className={H2}>工具不是答案，框架才是</h2>
            <p className={P}>
              就像我在很多講座中提到的，大家往往認為技術或平台工具最重要，
              但如果沒有好的組織框架與治理機制去架構，其實很容易失控；而一旦失控，要付出的代價是很大的。
            </p>
            <p className={P}>
              這也是我這兩天一直提醒的順序：先想清楚誰負責、什麼情況要停下來、出錯時怎麼查，
              再去談要用哪一個工具。反過來做，通常會在第三個月卡住，而且卡住的時候，
              大家會以為是工具不好用。
            </p>

            <h2 className={H2}>第二天：從會用工具，到做出自己的流程</h2>
            <p className={P}>
              我也很期待第二天能教他們更多進階技巧，特別是在 AI Agent 上，
              利用 Claude 或是 Codex 這類的工具，讓他們嘗試建立屬於自己的自動化工作流程。
            </p>
            <p className={P}>
              會用工具，跟有一條自己的流程，是兩件事。前者是上完課就會的能力，
              後者要回到自己的部門，挑一件每天重複、而且有明確對錯的工作，把它拆開、寫下來、交給 AI 執行。
              這件事沒有人能代做，只能自己在現場試一次。
            </p>

            <hr className="my-12 border-border-light" />
            <p className="text-sm text-text-secondary leading-relaxed">
              課程資訊：登泰國際物流股份有限公司主管 AI 課程｜2026-11-21 至 11-22｜高雄。
              企業內訓與 AI 治理工作坊的進行方式，可見{" "}
              <Link href="/services" className="text-primary hover:underline">
                服務頁
              </Link>
              。
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/news" className="btn-secondary">
                回最新消息
              </Link>
              <Link href="/knowledge" className="btn-secondary">
                看更多顧問觀點
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
