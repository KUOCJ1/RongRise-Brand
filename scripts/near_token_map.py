#!/usr/bin/env python3
"""算出「ΔE<2.5 可安全併入既有 token」的色碼對照表（只限已橋接到 Tailwind 的 token）。"""
import json, os, re, colorsys

ROOT = "/opt/data/RongRise-Brand"
tokens = json.load(open(f"{ROOT}/src/design/tokens.json", encoding="utf-8"))["tokens"]

BRIDGED = {"color-primary": "primary", "color-secondary": "secondary", "color-tertiary": "tertiary",
           "color-tertiary-strong": "tertiary-strong", "color-accent": "accent",
           "color-accent-strong": "accent-strong", "color-success": "success", "color-line": "line",
           "color-bg": "bg", "color-bg-alt": "bg-alt", "color-bg-dark": "bg-dark",
           "color-surface": "surface", "color-surface-hover": "surface-hover",
           "color-text-primary": "text-primary", "color-text-secondary": "text-secondary"}

def hex2lab(h):
    h = h.lstrip("#")
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
    def f(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = f(r), f(g), f(b)
    X = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
    Y = (r * 0.2126 + g * 0.7152 + b * 0.0722)
    Z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
    def g_(t):
        return t ** (1/3) if t > 0.008856 else 7.787 * t + 16/116
    fx, fy, fz = g_(X), g_(Y), g_(Z)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))

def de(a, b):
    la, lb = hex2lab(a), hex2lab(b)
    return sum((x - y) ** 2 for x, y in zip(la, lb)) ** 0.5

# 收集檔案內的 hex
hexes = {}
for dp, _, fs in os.walk(f"{ROOT}/src"):
    for f in fs:
        if not f.endswith((".tsx", ".ts")):
            continue
        p = os.path.join(dp, f)
        for m in re.finditer(r"#([0-9a-fA-F]{6})\b", open(p, encoding="utf-8", errors="ignore").read()):
            h = "#" + m.group(1).lower()
            hexes[h] = hexes.get(h, 0) + 1

existing = {}
for group, kv in tokens.items():
    for name, val in kv.items():
        v = val.strip().lower()
        if re.fullmatch(r"#[0-9a-f]{6}", v):
            existing[v] = name.lstrip("-")

match = {}
for h, n in sorted(hexes.items(), key=lambda x: -x[1]):
    if h in existing:
        continue
    best = min(existing.items(), key=lambda kv: de(h, kv[0]))
    d = de(h, best[0])
    if d < 2.5 and best[1] in BRIDGED:
        match[h] = BRIDGED[best[1]]
        print(f'{h}: "{match[h]}",   # {n} 次, 對 {best[0]} ΔE={d:.1f}')

print(f"\n可併入 {len(match)} 色 / 共 {sum(hexes[h] for h in match)} 處")
