#!/usr/bin/env python3
"""從 base.css 抽出 design tokens → src/design/tokens.json（單一來源的可讀副本）。

設計原則：
- base.css 仍是作者手改的唯一檔案（避免產生器反向覆蓋造成漂移）。
- 本腳本把 :root 內的變數抽成 JSON，讓其他工具（lint／工作台／文件）讀同一份值。
- `--check` 模式：JSON 與 base.css 不一致就 exit 1（CI/prebuild 用）。

用法：
  python3 scripts/extract_tokens.py            # 重新產生
  python3 scripts/extract_tokens.py --check    # 只驗是否同步
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = os.path.join(ROOT, "src/app/styles/base.css")
OUT = os.path.join(ROOT, "src/design/tokens.json")

def parse():
    txt = open(CSS, encoding="utf-8").read()
    m = re.search(r":root\s*\{(.*?)\n\}", txt, re.S)
    if not m:
        raise SystemExit("找不到 :root 區塊")
    block = m.group(1)
    groups, cur = {}, "未分類"
    for line in block.splitlines():
        g = re.search(r"/\*\s*──?\s*(.+?)\s*──?\s*\*/", line)
        if g:
            cur = g.group(1).strip(" ─")
            continue
        d = re.match(r"\s*(--[a-z0-9\-]+)\s*:\s*(.+?);", line, re.I)
        if d:
            groups.setdefault(cur, {})[d.group(1)] = d.group(2).strip()
    return groups

def main():
    groups = parse()
    total = sum(len(v) for v in groups.values())
    payload = {
        "_comment": "由 scripts/extract_tokens.py 從 src/app/styles/base.css 抽出，請改 base.css 再重跑，不要手改本檔。",
        "_source": "src/app/styles/base.css",
        "_count": total,
        "tokens": groups,
    }
    new = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    if "--check" in sys.argv:
        old = open(OUT, encoding="utf-8").read() if os.path.exists(OUT) else ""
        if old != new:
            print("❌ tokens.json 與 base.css 不同步，請跑 python3 scripts/extract_tokens.py")
            sys.exit(1)
        print(f"✅ tokens.json 同步（{total} 個變數）")
        return
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, "w", encoding="utf-8").write(new)
    print(f"已寫入 {OUT}（{len(groups)} 組、{total} 個變數）")
    for g, kv in groups.items():
        print(f"  {g}: {len(kv)}")

if __name__ == "__main__":
    main()
