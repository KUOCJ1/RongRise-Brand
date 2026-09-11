"use client";

import { useState } from "react";

type Props = {
  slug: string;
  courseTitle: string;
  enrollable: boolean;
  full: boolean;
};

const input =
  "w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-body";
const label = "block text-sm font-medium text-text-primary mb-1.5";

export default function EnrollForm({ slug, courseTitle, enrollable, full }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    taxId: "",
    note: "",
    website: "", // honeypot
  });
  const [agree, setAgree] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string; waitlist?: boolean } | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setResult({ ok: false, msg: "請填寫姓名與 Email。" });
      return;
    }
    if (!agree) {
      setResult({ ok: false, msg: "請先同意個人資料使用聲明。" });
      return;
    }
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug, source: `website:${slug}` }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResult({ ok: true, msg: data.message || "報名成功！", waitlist: data.waitlist });
        setForm({ name: "", email: "", phone: "", company: "", taxId: "", note: "", website: "" });
        setAgree(false);
      } else {
        setResult({ ok: false, msg: data.message || "送出失敗，請稍後再試或直接來信。" });
      }
    } catch {
      setResult({ ok: false, msg: "連線失敗，請稍後再試或直接來信 info@rongrise.com。" });
    } finally {
      setSending(false);
    }
  };

  if (result?.ok) {
    return (
      <div className="card p-6 bg-success/5 border border-success/20">
        <p className="text-2xl mb-2">{result.waitlist ? "⏳" : "✅"}</p>
        <h3 className="heading-subsection text-text-primary mb-2">
          {result.waitlist ? "已為你保留候補順位" : "報名成功！"}
        </h3>
        <p className="text-body text-text-secondary">{result.msg}</p>
      </div>
    );
  }

  if (!enrollable) {
    return (
      <div className="card p-6 bg-bg-secondary">
        <h3 className="heading-subsection text-text-primary mb-2">
          {full ? "這門課已額滿" : "目前未開放報名"}
        </h3>
        <p className="text-body text-text-secondary mb-4">
          歡迎來信留下聯絡方式，我們會在下一梯次開放時第一時間通知你。
        </p>
        <a href="mailto:info@rongrise.com" className="btn-secondary inline-block">
          info@rongrise.com
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 space-y-4">
      <h3 className="heading-subsection text-text-primary">報名這門課</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>姓名 *</label>
          <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <div>
          <label className={label}>Email *</label>
          <input type="email" className={input} value={form.email}
                 onChange={(e) => set("email", e.target.value)} required />
        </div>
        <div>
          <label className={label}>手機</label>
          <input className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className={label}>公司 / 單位</label>
          <input className={input} value={form.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div>
          <label className={label}>統一編號（需開立統編者填寫）</label>
          <input className={input} value={form.taxId} onChange={(e) => set("taxId", e.target.value)} />
        </div>
        <div>
          <label className={label}>備註</label>
          <input className={input} value={form.note} onChange={(e) => set("note", e.target.value)}
                 placeholder="例如：飲食需求、想先了解的議題" />
        </div>
      </div>

      {/* honeypot：真人看不到，機器人會填 */}
      <input type="text" tabIndex={-1} autoComplete="off" value={form.website}
             onChange={(e) => set("website", e.target.value)}
             style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
             aria-hidden="true" />

      <label className="flex items-start gap-2 text-sm text-text-secondary">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
               className="mt-1 w-4 h-4" />
        <span>
          我同意榕耀管顧依《個人資料保護法》蒐集、處理及利用我提供的資料，
          用於課程報名、聯繫與後續課程通知。{/* 個資同意 */}
        </span>
      </label>

      {result && !result.ok && <p className="text-sm text-red-600">{result.msg}</p>}

      <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-50">
        {sending ? "送出中..." : "送出報名"}
      </button>

      <p className="text-xs text-text-secondary text-center">
        送出後你會立刻收到確認信；我們會在 1 個工作日內與你聯繫繳費事宜。
        <br />
        課程：{courseTitle}
      </p>
    </form>
  );
}
