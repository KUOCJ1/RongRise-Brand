#!/usr/bin/env python3
"""把剩下的硬寫色按「使用情境」分類，判斷哪些能安全換成 token。
情境：svg_attr（fill/stroke 屬性）、tailwind（className 內 bg-[#xxx]）、
      js_object（const 色票物件）、email_css（route.ts 產生的 HTML email）、style_block、other
"""
import os, re, collections

ROOT = "/opt/data/RongRise-Brand"
SRC = os.path.join(ROOT, "src")
HEX = re.compile(r"#([0-9a-fA-F]{6})\b")
SKIP = {"src/app/styles/base.css", "src/design/tokens.json"}

cats = collections.Counter()
per_file = collections.defaultdict(collections.Counter)
samples = collections.defaultdict(list)

for dirpath, _, files in os.walk(SRC):
    for f in files:
        if not f.endswith((".tsx", ".ts", ".css")):
            continue
        p = os.path.join(dirpath, f)
        rel = os.path.relpath(p, ROOT).replace(os.sep, "/")
        if rel in SKIP:
            continue
        for ln, line in enumerate(open(p, encoding="utf-8", errors="ignore"), 1):
            for m in HEX.finditer(line):
                h = "#" + m.group(1).lower()
                before = line[:m.start()]
                if re.search(r"(fill|stroke|stopColor|color)\s*=\s*[\"'][^\"']*$", before):
                    c = "svg_attr"
                elif "className=" in line and "[" in line:
                    c = "tailwind"
                elif re.search(r"/\*|\.(section|h2|p|btn)[^;]*\{", line) or "route.ts" in rel:
                    c = "email_css"
                elif "style={{" in line or "style={" in line:
                    c = "style_block"
                elif re.search(r"^\s*[a-zA-Z_]+:\s*[\"']#" + m.group(1), line, re.I):
                    c = "js_object"
                else:
                    c = "other"
                cats[c] += 1
                per_file[rel][c] += 1
                if len(samples[c]) < 3:
                    samples[c].append(f"{rel}:{ln} {line.strip()[:90]}")

print("剩餘硬寫色的使用情境：")
for c, n in cats.most_common():
    print(f"  {c:<12}{n:>6}")
print("\n樣本：")
for c, ss in samples.items():
    print(f"\n[{c}]")
    for s in ss:
        print("  ", s)

print("\n最集中的 12 個檔案：")
for rel, cc in sorted(per_file.items(), key=lambda x: -sum(x[1].values()))[:12]:
    print(f"  {sum(cc.values()):>4}  {rel}  ({dict(cc)})")
