#!/usr/bin/env python3
"""Build src/data/vault-related.json for the RongRise website article pages.
Matches each official article (articles.json) against second-brain vault notes
(index.json) by title keywords + tag overlap, and writes top-N related notes.

Usage: python3 scripts/build-vault-related.py
Output: src/data/vault-related.json  (slug -> [{slug,title,category,excerpt,url}])
"""
import json, os, re, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTICLES_PATH = os.path.join(ROOT, "src/data/articles.json")
VAULT_INDEX = "/opt/data/second-brain-portal/data/index.json"
OUT_PATH = os.path.join(ROOT, "src/data/vault-related.json")
TOP_N = 3

STOPWORDS = set("的了與和或是又在對將及嗎呢什麼如何為何可以應該這個那個我們你們他們企業公司台灣台灣管理組織人力資源AI智能體")
TAG_MAP = {
    "AI 轉型": ["AI轉型", "AI 轉型", "轉型"],
    "AI 趨勢": ["AI趨勢", "趨勢"],
    "人才策略": ["人才策略", "人才", "HR"],
    "管理心理學": ["管理心理學", "心理", "管理"],
    "ESG 永續": ["ESG", "永續", "碳"],
    "案例分享": ["案例"],
    "工具資源": ["工具", "資源"],
    "策略管理": ["策略", "管理"],
    "系統架構": ["系統架構", "架構"],
}

def load_json(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)

def tokens(text):
    """Extract meaningful keyword tokens (len>=2, non-stopword, CJK or alnum)."""
    out = []
    for seg in re.split(r"[^\u4e00-\u9fffA-Za-z0-9]+", text):
        seg = seg.strip()
        if len(seg) < 2:
            continue
        if all(c in STOPWORDS for c in seg):
            continue
        out.append(seg.lower())
    return out

def score_article(art, note):
    """Return relevance score between an official article and a vault note."""
    score = 0
    art_t = tokens(art.get("title", ""))
    note_t = tokens(note.get("title", ""))
    # title keyword overlap (bidirectional containment on tokens)
    for a in art_t:
        if a in note.get("title", "").lower():
            score += 3
    for n in note_t:
        if n in art.get("title", "").lower():
            score += 3
    # tag overlap
    art_tags = {t.lower() for t in art.get("tags", [])}
    note_tags = {t.lower() for t in note.get("tags", [])}
    score += 4 * len(art_tags & note_tags)
    # category affinity via TAG_MAP
    cat = art.get("cat", "")
    note_cat = (note.get("category", "") + " " + note.get("domain", "")).lower()
    for kw in TAG_MAP.get(cat, []):
        if kw.lower() in note_cat:
            score += 2
            break
    return score

def main():
    articles = load_json(ARTICLES_PATH)
    vault = load_json(VAULT_INDEX)
    notes = vault.get("articles", [])
    print(f"官網文章 {len(articles)} 篇 × vault 筆記 {len(notes)} 篇")

    result = {}
    matched = 0
    for art in articles:
        scored = []
        for note in notes:
            # skip domain index pages (title == category) and empty titles
            if not note.get("title") or note.get("title") == note.get("category"):
                continue
            s = score_article(art, note)
            if s > 0:
                scored.append((s, note))
        scored.sort(key=lambda x: (-x[0], x[1].get("date") or ""))
        top = scored[:TOP_N]
        if top:
            matched += 1
        result[art["slug"]] = [
            {
                "slug": n["slug"],
                "title": n["title"],
                "category": n.get("category", ""),
                "excerpt": (n.get("excerpt", "") or "").replace("...", "")[:80],
                "url": f"https://brain.rong-rise.com/brain/{n['slug']}/",
            }
            for _, n in top
        ]

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    n_with = sum(1 for v in result.values() if v)
    print(f"✅ 輸出 {OUT_PATH}")
    print(f"有相關筆記的文章: {n_with}/{len(articles)}")
    # sample
    for slug, rel in list(result.items()):
        if rel:
            print(f"  範例 {slug}: " + " | ".join(r["title"][:20] for r in rel))
            break

if __name__ == "__main__":
    main()
