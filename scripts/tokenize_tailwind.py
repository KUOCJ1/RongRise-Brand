#!/usr/bin/env python3
"""第二批（主菜）：把 Tailwind 任意色值 bg-[#1A6DB5]/20 換成主題色 bg-secondary/20。

只換 @theme 已橋接的顏色，其餘保持不動（回報剩餘量）。
用法：--dry-run / --write
"""
import os, re, sys, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")

BRIDGE = {
    "#0d2b4e": "primary",
    "#1a6db5": "secondary",
    "#e8912a": "tertiary",
    "#9e5b0c": "tertiary-strong",
    "#2ec4b6": "accent",
    "#147a72": "accent-strong",
    "#3dae62": "success",
    "#06c755": "line",
    "#fdfcfa": "bg",
    "#f5f2ed": "bg-alt",
    "#0d1b2a": "bg-dark",
    "#ffffff": "surface",
    "#faf8f4": "surface-hover",
    "#1a1815": "text-primary",
    "#5c564e": "text-secondary",
}

# 只處理 className="..." 與 className={`...`} 兩種最常見形式
CLASS_ATTR = re.compile(r'className=(?:"([^"]*)"|\{`([^`]*)`\})')
ARB = re.compile(r"\[(#[0-9a-fA-F]{6})\]")


def convert_classes(s):
    n = 0

    def rep(m):
        nonlocal n
        name = BRIDGE.get(m.group(1).lower())
        if not name:
            return m.group(0)
        n += 1
        return name

    return ARB.sub(rep, s), n


def main():
    write = "--write" in sys.argv
    agg = collections.Counter()

    for dirpath, _, fs in os.walk(SRC):
        for f in fs:
            if not f.endswith(".tsx"):
                continue
            p = os.path.join(dirpath, f)
            rel = os.path.relpath(p, ROOT).replace(os.sep, "/")
            txt = open(p, encoding="utf-8").read()
            counts = [0]

            def do(m):
                raw = m.group(1) if m.group(1) is not None else m.group(2)
                out, n = convert_classes(raw or "")
                if not n:
                    return m.group(0)
                counts[0] += n
                return m.group(0).replace(raw, out, 1)

            new = CLASS_ATTR.sub(do, txt)
            if new != txt:
                agg[rel] += counts[0]
                if write:
                    open(p, "w", encoding="utf-8").write(new)

    total = sum(agg.values())
    print(f"[{'寫入' if write else 'dry-run'}] 檔案 {len(agg)} 個｜class 內替換 {total} 處")
    for rel, n in agg.most_common(12):
        print(f"  {n:>4}  {rel}")

    left = 0
    left_files = collections.Counter()
    for dirpath, _, fs in os.walk(SRC):
        for f in fs:
            if f.endswith(".tsx"):
                p = os.path.join(dirpath, f)
                k = len(ARB.findall(open(p, encoding="utf-8").read()))
                left += k
                if k:
                    left_files[os.path.relpath(p, ROOT)] = k
    print(f"class 內仍為 [#hex] 的：{left} 處（未橋接色或需新增 token）")
    for rel, k in left_files.most_common(8):
        print(f"  {k:>4}  {rel}")


if __name__ == "__main__":
    main()
