#!/usr/bin/env python3
"""列出「用了但不在 token 裡」的顏色，以及它最接近哪個 token、差多少（ΔE）。
用途：決定哪些硬寫色可以先換成既有 token（ΔE 小＝看起來一樣），哪些要新增 token。"""
import json, os, re
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
TOKENS = json.load(open(os.path.join(ROOT, "src/design/tokens.json"), encoding="utf-8"))["tokens"]
HEX = re.compile(r"#(?:[0-9a-fA-F]{6})\b")

tok_hex = {}
for group, kv in TOKENS.items():
    for k, v in kv.items():
        m = re.fullmatch(r"#[0-9a-fA-F]{6}", v.strip())
        if m:
            tok_hex[k] = v.lower()

def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def lab(h):
    def f(c):
        c /= 255.0
        return ((c+0.055)/1.055)**2.4 if c > 0.04045 else c/12.92
    r, g, b = [f(c) for c in rgb(h)]
    x = (r*0.4124+g*0.3576+b*0.1805)/0.95047
    y = (r*0.2126+g*0.7152+b*0.0722)
    z = (r*0.0193+g*0.1192+b*0.9505)/1.08883
    g2 = lambda t: t**(1/3) if t > 0.008856 else 7.787*t+16/116
    fx, fy, fz = g2(x), g2(y), g2(z)
    return (116*fy-16, 500*(fx-fy), 200*(fy-fz))

def de(a, b):
    la, lb = lab(a), lab(b)
    return sum((x-y)**2 for x, y in zip(la, lb))**0.5

use = Counter()
for dirpath, _, files in os.walk(SRC):
    for f in files:
        if not f.endswith((".tsx", ".ts", ".css")):
            continue
        rel = os.path.relpath(os.path.join(dirpath, f), ROOT).replace(os.sep, "/")
        if rel in ("src/app/styles/base.css", "src/design/tokens.json"):
            continue
        txt = open(os.path.join(dirpath, f), encoding="utf-8", errors="ignore").read()
        for h in HEX.findall(txt):
            use[h.lower()] += 1

rows = []
for h, n in use.most_common(60):
    best_k, best_d = None, 999
    for k, v in tok_hex.items():
        d = de(h, v)
        if d < best_d:
            best_k, best_d = k, d
    rows.append((n, h, best_k, best_d))

print(f"硬寫色 {len(use)} 種；下表列出使用最多的 25 種與最接近的 token")
print(f"{'次數':>5}  {'色碼':<9} {'最接近 token':<32} ΔE")
same, near, off = [], [], []
for n, h, k, d in rows[:25]:
    tag = "可換" if d < 2.5 else ("微差" if d < 6 else "不同色")
    print(f"{n:>5}  {h:<9} {k:<32} {d:5.1f}  {tag}")
    (same if d < 2.5 else near if d < 6 else off).append((n, h, k, d))

print(f"\n可直接換成既有 token（ΔE<2.5，看起來一樣）：{sum(x[0] for x in same)} 處")
print(f"微差（ΔE 2.5–6，換掉會有一點點差）：{sum(x[0] for x in near)} 處")
print(f"不在品牌色盤（ΔE≥6，需要新增 token 或淘汰）：{sum(x[0] for x in off)} 處")
