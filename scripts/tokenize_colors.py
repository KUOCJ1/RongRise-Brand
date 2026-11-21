#!/usr/bin/env python3
"""第二批：把「與 token 完全相同」的硬寫色碼機械換成 var(--token)（外觀零變化）。

只動兩種安全情境，其餘一律不動（回報清單留給元件庫那一步）：
  1) CSS 檔（base.css 除外）的宣告值
  2) TSX/TS 的 style={{ ... }} 物件內

用法：
  python3 scripts/tokenize_colors.py --dry-run
  python3 scripts/tokenize_colors.py --write
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
TOKENS = json.load(open(os.path.join(ROOT, "src/design/tokens.json"), encoding="utf-8"))["tokens"]

PRIORITY = [
    "color-primary", "color-secondary", "color-tertiary", "color-tertiary-light",
    "color-tertiary-strong", "color-accent", "color-accent-strong", "color-success",
    "color-line", "color-bg", "color-bg-alt", "color-bg-dark", "color-surface",
    "color-surface-hover", "color-text-primary", "color-text-secondary",
    "color-text-inverse", "color-border", "color-border-light",
]

hex2var = {}
for group, kv in TOKENS.items():
    for name, val in kv.items():
        v = val.strip().lower()
        if not re.fullmatch(r"#[0-9a-f]{6}", v):
            continue
        var = "--" + name.lstrip("-")
        if v not in hex2var:
            hex2var[v] = var
for name in PRIORITY:
    for group, kv in TOKENS.items():
        v = kv.get(name)
        if v and re.fullmatch(r"#[0-9a-fA-F]{6}", v.strip()):
            hex2var[v.strip().lower()] = "--" + name

HEX = re.compile(r"#([0-9a-fA-F]{6})\b")
STYLE_BLOCK = re.compile(r"style=\{\{.*?\}\}", re.S)
SKIP_FILES = {"src/app/styles/base.css", "src/design/tokens.json"}


def sub_hex(text):
    """把 text 內的 hex 換成 var()，回傳 (新字串, 換了幾個)。"""
    n = 0
    def rep(m):
        nonlocal n
        h = "#" + m.group(1).lower()
        if h in hex2var:
            n += 1
            return f"var({hex2var[h]})"
        return m.group(0)
    return HEX.sub(rep, text), n


def main():
    write = "--write" in sys.argv
    total_css = total_style = skipped_hash = 0
    changed_files = 0
    detail = []

    for dirpath, _, files in os.walk(SRC):
        for f in files:
            if not f.endswith((".tsx", ".ts", ".css")):
                continue
            p = os.path.join(dirpath, f)
            rel = os.path.relpath(p, ROOT).replace(os.sep, "/")
            if rel in SKIP_FILES:
                continue
            txt = open(p, encoding="utf-8").read()
            orig = txt
            cnt = 0

            if rel.endswith(".css"):
                txt, cnt = sub_hex(txt)
                total_css += cnt
            else:
                blocks = []

                def repl_block(m):
                    new, k = sub_hex(m.group(0))
                    nonlocal cnt
                    cnt += k
                    blocks.append((m.start(), m.end(), new))
                    return new

                txt = STYLE_BLOCK.sub(repl_block, txt)
                total_style += cnt

            # 剩下來沒換到的（含 SVG 屬性、常數、className 內的任意色）
            left = len(HEX.findall(txt))
            skipped_hash += left

            if txt != orig:
                changed_files += 1
                detail.append((rel, cnt, left))
                if write:
                    open(p, "w", encoding="utf-8").write(txt)

    mode = "寫入" if write else "dry-run"
    print(f"[{mode}] 檔案 {changed_files} 個｜CSS 內替換 {total_css}｜style 區塊內替換 {total_style}"
          f"｜仍為硬寫 {skipped_hash}")
    for rel, c, left in sorted(detail, key=lambda x: -x[1])[:15]:
        print(f"  {c:>4} 換 / 剩 {left:>3}  {rel}")


if __name__ == "__main__":
    main()
