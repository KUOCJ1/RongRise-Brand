import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "企業 AI 包班內訓｜兩天，近四十位主管把 AI Agent 做出來｜登泰國際物流｜榕耀管顧",
  description:
    "2026 年 11 月 21、22 日，高雄登泰國際物流的企業 AI 包班內訓。第一天我低估了他們；第二天我把課程整個改掉，改成以他們自己的題目做黑客松，最後做出能實際運作的 AI Agent。總經理與副總全程在場。",
};

const P = "text-text-secondary leading-[1.85] my-6";
const H2 = "text-text-primary text-2xl font-bold mb-4 mt-12";
const CAP = "text-sm text-text-secondary mt-3 text-center leading-relaxed";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "企業 AI 包班內訓：兩天，近四十位主管把 AI Agent 做出來",
  description:
    "高雄登泰國際物流企業 AI 包班內訓紀實：第一天我低估了他們，第二天把課程改成以他們的題目做黑客松，做出能實際運作的 AI Agent。",
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
          <span className="tag bg-white/15 text-white mb-4">最新活動</span>
          <p className="text-sm tracking-wide text-white/70 mt-4">企業 AI 包班內訓</p>
          <h1 className="heading-hero mt-2 mb-4">
            兩天，近四十位主管，把 AI Agent 做出來
          </h1>
          <p className="text-body-lg text-white/85 max-w-2xl">
            這個週末兩天，我在高雄。登泰的辦公室在光榮碼頭海景第一排，窗外就是港。
            第一天講完我心裡有點慚愧，第二天我把整個課程改掉了。
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-white/75">
            <span>2026-11-21 至 11-22（週六、週日）</span>
            <span>登泰國際物流股份有限公司</span>
            <span>高雄・光榮碼頭</span>
            <span>36 位主管，總經理與副總全程參與</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="max-w-3xl mx-auto">
            <p className={P}>
              這個週末兩天，我在高雄，在登泰國際物流做一場企業 AI 包班內訓。教室裡坐了 36 位主管，
              總經理和副總也在，從第一分鐘坐到最後一分鐘。加上我與助教，現場將近 40 人。
            </p>
            <p className={P}>
              課程安排是兩天 12 小時。原本的規劃是第一天建立觀念，第二天教進階技巧。
              但我第一天講完，心裡有點慚愧：我低估了他們。
            </p>

            <figure className="my-10">
              <img
                src="/images/events/draco-day2-class.jpg"
                alt="登泰國際物流企業 AI 包班內訓上課現場"
                className="w-full rounded-2xl border border-border-light"
                loading="lazy"
              />
              <figcaption className={CAP}>
                第二天的上課現場。為保護學員，學員臉部已模糊處理。
              </figcaption>
            </figure>

            <h2 className={H2}>第一天：越著急，越要守住順序</h2>
            <p className={P}>
              這群主管的底子比我想的好，而且他們是真的想把東西帶回公司用，
              不是來聽一場熱鬧的演講。越是這樣，我越不敢讓他們衝太快。
            </p>
            <p className={P}>
              基本素養、公司內部的規定、資安的配套，這些沒先做起來，後面補起來會很痛。
              我寧可當那個踩煞車的人。因為員工的 AI 能力一旦全面拉起來，組織卻沒有跟上，
              最後只會多出一批各自用得很開心、卻接不回公司流程的人。
            </p>
            <p className={P}>
              這幾天我在很多場課裡一直提醒同一個順序：先想清楚誰負責、什麼情況要停下來、
              出錯的時候怎麼查，再去談要用哪一個工具。反過來做，通常會在第三個月卡住，
              而且卡住的時候，大家會以為是工具不好用。
            </p>
            <p className={P}>
              事後想起來還有一個細節：那個週末高雄正好有演唱會，整個城市很熱鬧。
              但這群主管選擇留在會議室裡兩天。不是因為課比演唱會有趣，
              是他們願意把兩天的時間完整交給一件事。
            </p>

            <h2 className={H2}>第二天：把課表整個換掉</h2>
            <p className={P}>
              講完第一天，我做了一個決定：把第二天原本排好的進階內容整個換掉，
              改成以他們自己的題目當主軸。每一組挑一個部門裡真的想解的問題，用黑客松的方式，
              最後做出一個能實際運作的 AI Agent。
            </p>
            <p className={P}>
              會這樣改，是因為在現場看到兩件事。第一，有相當多主管是真的想落地，
              這在企業內訓裡並不常見；第二，他們自己有 low-code 平台，平常就在開發，
              這件事對他們不是從零開始。那就不需要我再教一次工具怎麼用，
              我只要把開發時會踩到的坑先講給他們聽。
            </p>
            <p className={P}>
              所以那兩天的節奏是他們在動：規劃、開發、測試都由他們自己來，我在旁邊一組一組看。
              卡住的，我才過去講一下；好幾組同時卡在類似的地方，我就停下來統一講一次。
              各組卡住的點其實都不一樣，後來大多是他們自己解的，有人直接跟 AI 把問題拆開。
              我不太像講師，比較像陪跑。
            </p>
            <p className={P}>
              整天下來其實很單純，就是要把 POC 做出來，讓 MVP 真的落地。
            </p>

            <h2 className={H2}>這次，我第一次全程用 Claude Code 上課</h2>
            <p className={P}>
              這一場也是我第一次全程都靠 Claude Code 撐住：示範、解釋、再帶著他們改，
              都在同一個畫面上完成。中間有人問的問題跟原本排的不一樣，我就當場請它重寫一版。
            </p>
            <p className={P}>
              臨場改課，其實是在考我自己。能不能當下判斷這班人要什麼、能不能靠 AI 把教材重新組一遍、
              能不能跟著他們的問題隨時轉。這些如果沒有平常累積，當場是裝不出來的。
            </p>
            <p className={P}>
              以前我總覺得這種工具是技術人員在用的，企業裡的人很難入手。
              這兩天我看著一群非工程背景的主管把它用起來。
              只要有人願意陪著培養，他們一樣做得完，而且是自己做得完。
            </p>

            <h2 className={H2}>地端、權限、主管的職責：那天被提出來的問題</h2>
            <p className={P}>
              中間有人問我，什麼東西適合放地端。我們就順著這個問題談下去：
              哪些程式走雲端比較快，哪些拉回地端模型比較安全。
              再往下就是權限怎麼控、資料放哪裡、測試要怎麼驗，以及主管的職責怎麼切。
            </p>
            <p className={P}>
              這幾題當天答不完，但先被提出來，比事後補救好。
              一個組織開始問這些問題，通常代表它已經跨過「要不要用」那一關，
              正在面對「用了之後怎麼管」。對企業來說，這才是真正難的那一段。
            </p>

            <figure className="my-10">
              <img
                src="/images/events/draco-day2-group.jpg"
                alt="登泰國際物流企業 AI 包班內訓成果發表與大合照"
                className="w-full rounded-2xl border border-border-light"
                loading="lazy"
              />
              <figcaption className={CAP}>
                第二天的成果發表與大合照。為保護學員，學員臉部已模糊處理。
              </figcaption>
            </figure>

            <h2 className={H2}>成果：三個獎，但每一組都值得一個</h2>
            <p className={P}>
              下午換他們上台，講自己這兩天做出什麼。最後我們頒了三個獎，三組上台時，
              台下都在鼓掌。但老實說，每一組都做出了東西，我心裡覺得每個人都值得領一個。
            </p>
            <p className={P}>
              我原本只期待一組做出一兩個 Agent，結果有人做到五個。
              第一天大家對課程內容還有點懷疑，反應比較冷；第二天每一組都在動，討論聲沒停過。
              這個轉變不是因為課講得比較好，是因為他們自己動手做出東西了。
            </p>

            <figure className="my-10">
              <img
                src="/images/events/draco-day2-cert.jpg"
                alt="登泰國際物流企業 AI 包班內訓結訓合影"
                className="w-full rounded-2xl border border-border-light"
                loading="lazy"
              />
              <figcaption className={CAP}>
                結訓合影。為保護學員，學員臉部已模糊處理。
              </figcaption>
            </figure>

            <h2 className={H2}>謝謝登泰，特別是總經理</h2>
            <p className={P}>
              最後，我想好好謝謝登泰這群主管。週末兩天，把時間交給一個外人，
              跟著我做一堆不熟悉的事，本身就不容易。
            </p>
            <p className={P}>
              特別是總經理，謝謝您給我這個機會，也謝謝您從頭坐到尾。
              後續要怎麼推，也是總經理親自下的指令。
              一個組織的最高主管願意這樣參與，會讓底下的人知道這件事不只是上課。
            </p>
            <p className={P}>
              離開前我想到的是：在 AI 時代，主管要身先士卒。
              從最高的主管到下面的每一位主管，願意用行動參與，比任何獎勵或規定都有效。
            </p>
            <p className={P}>
              我也希望這兩天是一個開始。讓更多員工和主管真的投入開發，
              把這樣的文化留在公司裡，才是我最想看到的事。
            </p>

            <hr className="my-12 border-border-light" />
            <p className="text-sm text-text-secondary leading-relaxed">
              課程資訊：登泰國際物流股份有限公司｜企業 AI 包班內訓（兩天 12 小時）｜
              2026-11-21 至 11-22｜高雄。企業內訓與 AI 治理工作坊的進行方式，可見{" "}
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
