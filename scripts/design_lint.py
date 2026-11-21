#!/usr/bin/env python3
"""設計一致性閘門（deploy gate）：抓「各自手寫」的痕跡，只在新增違規時失敗。

規則
  R1 hex 色碼寫死在 src/**/*.ts(x) 或非 token CSS 裡
  R2 Tailwind 任意字級 text-[Npx]（繞過 type scale）
  R3 inline style={{ }} 數量（元件沒有抽象化的訊號）
  R4 近似色重複（兩個 hex 的 ΔE < 6 且都在用 → 同一個顏色被寫成兩種）

用法
  python3 scripts/design_lint.py                # 檢查；有「新增」違規 → exit 1
  python3 scripts/design_lint.py --report       # 只看統計與違規清單（永遠 exit 0）
  python3 scripts/design_lint.py --update-baseline
  python3 scripts/design_lint.py --quiet        # prebuild 用：只有新增違規才出聲
"""
import json, os, re, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
BASE = os.path.join(ROOT, "src/design/design-lint-baseline.json")
TOKEN_FILES = {"src/app/styles/base.css", "src/design/tokens.json"}

HEX = re.compile(r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b")
ARB_FS = re.compile(r"text-\[(\d+)px\]")
INLINE = re.compile(r"style=\{\{")

def walk(exts):
    for dirpath, _, files in os.walk(SRC):
        for f in files:
            if any(f.endswith(e) for e in exts):
                p = os.path.join(dirpath, f)
                yield p, os.path.relpath(p, ROOT)

def norm_hex(h):
    h = h.lower()
    if len(h) == 4:
        h = "#" + "".join(c * 2 for c in h[1:])
    return h

def hex_to_rgb(h):
    h = norm_hex(h)[1:]
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def lab(rgb):
    def f(c):
        c /= 255.0
        return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92
    r, g, b = [f(c) for c in rgb]
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
    def g2(t):
        return t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    fx, fy, fz = g2(x), g2(y), g2(z)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))

def delta_e(h1, h2):
    a, b = lab(hex_to_rgb(h1)), lab(hex_to_rgb(h2))
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

def scan():
    violations = {}   # rule -> list of "file:detail"
    hex_uses = Counter()
    inline_total = 0
    files_scanned = 0

    for p, rel in walk((".tsx", ".ts", ".css")):
        if rel in TOKEN_FILES:
            continue
        files_scanned += 1
        txt = open(p, encoding="utf-8", errors="ignore").read()
        rel_slash = rel.replace(os.sep, "/")

        # R1：色碼（CSS 與 tsx 都算；設計稿以外的硬寫色）
        for h in HEX.findall(txt):
            h = norm_hex(h)
            hex_uses[h] += 1
            violations.setdefault("R1_硬寫色碼", []).append(f"{rel_slash}:{h}")

        # R2：任意字級
        for px in ARB_FS.findall(txt):
            violations.setdefault("R2_任意字級", []).append(f"{rel_slash}:text-[{px}px]")

        # R3：inline style
        n = len(INLINE.findall(txt))
        if n:
            inline_total += n
            violations.setdefault("R3_inline_style", []).extend([f"{rel_slash}:x{n}"])

    # R4：近似色
    top = [h for h, c in hex_uses.most_common(40)]
    near = []
    for i in range(len(top)):
        for j in range(i + 1, len(top)):
            d = delta_e(top[i], top[j])
            if d < 6:
                near.append(f"{top[i]}({hex_uses[top[i]]})≈{top[j]}({hex_uses[top[j]]}) ΔE={d:.1f}")
    if near:
        violations["R4_近似色"] = near

    summary = {
        "files_scanned": files_scanned,
        "hex_unique": len(hex_uses),
        "hex_total": sum(hex_uses.values()),
        "inline_style_total": inline_total,
        "arb_font_size_total": len(violations.get("R2_任意字級", [])),
        "top_hex": hex_uses.most_common(10),
    }
    return violations, summary

def signature(violations):
    """穩定指紋：只比對「哪些檔案出現哪一種違規」，不比次數（改一個檔案加一行不該算新違規）。"""
    sig = {}
    for rule, items in violations.items():
        files = Counter(i.split(":")[0] for i in items)
        sig[rule] = {f: 1 for f in files} if rule.startswith("R4") else dict(files)
    return sig

def main():
    quiet = "--quiet" in sys.argv
    violations, summary = scan()
    sig = signature(violations)

    if "--update-baseline" in sys.argv:
        os.makedirs(os.path.dirname(BASE), exist_ok=True)
        json.dump({"summary": summary, "signature": sig}, open(BASE, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=2)
        print(f"已更新 baseline：{BASE}")
        return

    if "--report" in sys.argv or not os.path.exists(BASE):
        print("== 設計一致性現況 ==")
        for k, v in summary.items():
            print(f"  {k}: {v}")
        print("\n== 違規（前 40 筆）==")
        for rule, items in violations.items():
            print(f"\n[{rule}] {len(items)} 筆")
            for it in items[:10]:
                print("  -", it)
        if not os.path.exists(BASE):
            print("\n（尚未建立 baseline；跑 --update-baseline 建立）")
            return

    base = json.load(open(BASE, encoding="utf-8"))
    base_sig = base.get("signature", {})
    new = []
    for rule, files in sig.items():
        old_files = base_sig.get(rule, {})
        for f, n in files.items():
            old_n = old_files.get(f, 0)
            if f not in old_files:
                new.append(f"{rule} → 新檔案：{f}")
            elif n > old_n * 1.15 + 2:
                new.append(f"{rule} → {f} 增加 {old_n}→{n}")

    if new:
        print("❌ 設計一致性閘門：發現新增違規")
        for x in new[:20]:
            print("  -", x)
        print(f"\n（現況：hex {summary['hex_unique']} 種／{summary['hex_total']} 次、"
              f"inline style {summary['inline_style_total']} 處、任意字級 {summary['arb_font_size_total']} 處）")
        print("修法：改用 token（var(--color-*)／既有字級 class），或經核准後 python3 scripts/design_lint.py --update-baseline")
        sys.exit(1)

    if not quiet:
        print("✅ 設計一致性閘門通過（沒有新增違規）")
        print(f"   現況基線：hex {summary['hex_unique']} 種／{summary['hex_total']} 次、"
              f"inline style {summary['inline_style_total']} 處、任意字級 {summary['arb_font_size_total']} 處")

if __name__ == "__main__":
    main()
