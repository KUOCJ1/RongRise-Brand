import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HR AI Agent 實踐論壇｜當 HR 開始用策略語言談 AI｜榕耀管顧",
  description:
    "2026 年 9 月 20 日，小週末《HR AI Agent 實踐論壇》五位實務講師、近百位 HR 夥伴。現場提問從「要不要做」變成「怎麼落地」，而落地卡住的通常不是技術，是語言。",
};

const P = "text-text-secondary leading-[1.85] my-6";
const H2 = "text-text-primary text-2xl font-bold mb-4 mt-12";

export default function Page() {
  return (
    <>
      <section className="bg-gradient-hero text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="tag bg-white/15 text-white mb-4">活動紀實</span>
          <h1 className="heading-hero mt-4 mb-4">HR AI Agent 實踐論壇</h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            五位實務講師、近百位 HR 夥伴。一整天下來，我最大的收穫是發現：大家問的問題變了。
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-white/75">
            <span>2026-09-20（週日）</span>
            <span>主辦：人資小週末 HR FRIDAY</span>
            <span>我的場次：HR 如何用策略語言來談 AI Agent</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="max-w-3xl mx-auto">
            <p className={P}>
              9 月 20 日，我受邀參加小週末主辦的《HR AI Agent 實踐論壇》，與另外四位實務講師一起，
              用一整天的時間談同一件事：AI Agent 到底怎麼在 HR 真的落地。現場來了近百位 HR 夥伴，
              從早上坐到傍晚。
            </p>

            <h2 className={H2}>一整天聽下來，我最大的感覺是：大家問的問題變了</h2>
            <p className={P}>
              這一兩年談 AI，問的多半是「這是什麼」、「我們該不該做」。這次在現場聽到的問題，
              變成這幾句：
            </p>
            <ul className="list-disc pl-6 my-6 space-y-2 text-text-secondary leading-[1.85]">
              <li>「我們試過了，卡在流程。」</li>
              <li>「做出來了，但沒人要用。」</li>
              <li>「agent 下的判斷，責任算誰的？」</li>
              <li>「導入之後，成效怎麼算？」</li>
            </ul>
            <p className={P}>
              這四句話代表一件事：台灣的 HR 已經跨過「要不要做」的階段，開始面對真正的落地問題。
              而落地的問題，通常不是技術問題。
            </p>

            <h2 className={H2}>我的場次：HR 如何用策略語言來談 AI Agent</h2>
            <p className={P}>
              我觀察到一個很常見的卡點：很多 HR 夥伴推動 AI 的時候，卡住的不是做法，而是「怎麼講」。
              同一件事，用 HR 的語言講，高層聽不進去；換成策略、成本、風險的語言，預算就動了。
            </p>
            <p className={P}>
              所以我那一場沒有談工具，我談的是「翻譯」：把 AI Agent 的導入，翻譯成決策層真正關心的
              三件事。它解決哪一個瓶頸？要付出多少代價？如果失敗，我們的損失是什麼？這三題講得出來，
              比簡報做得漂亮有用。
            </p>

            <h2 className={H2}>五位講師的五個角度</h2>
            <p className={P}>
              一整天聽下來，收穫最大的是坐在台下的時間。同一個題目，五位講師切的角度完全不同：
              有人從流程設計切，有人從工具選型切，有人從制度與治理切，也有人從人的接受度切。
              這種「同一件事、多種切法」的安排，在台灣並不多見。
            </p>
            <p className={P}>
              也因為這樣，我對「落地」這件事的理解更具體了。AI Agent 不是一個採購案，它會動到流程、
              權責與考核方式。只談工具，通常會在第三個月卡住。
            </p>

            <h2 className={H2}>給正在推動 AI Agent 的你</h2>
            <p className={P}>
              如果你的組織還卡在「要不要做」，你要解的其實不是技術問題，是語言問題。先想清楚：
              這件事對決策層來說，解決哪一個瓶頸、要多少成本、失敗的風險是什麼。
            </p>

            <hr className="my-12 border-border-light" />
            <p className="text-sm text-text-secondary leading-relaxed">
              活動資訊：小週末《HR AI Agent 實踐論壇》｜2026-09-20｜五位實務講師 × 五大落地主題。
              實況錄影回看請見{" "}
              <a
                href="https://hrlearning.com.tw/events/20260920"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                主辦單位活動頁
              </a>
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
