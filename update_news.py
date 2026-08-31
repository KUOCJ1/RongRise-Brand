#!/usr/bin/env python3
"""插入第二大腦白皮書公告到 news.json 置頂（id=n45）"""
import json

path = "src/data/news.json"
with open(path, encoding="utf-8") as f:
    d = json.load(f)

entry = {
    "id": "n45",
    "date": "2026-08-31",
    "category": "公告",
    "title": "白皮書發布：第二大腦 —— 一套正在運作的知識基礎設施",
    "summary": "榕耀管顧發布《第二大腦》白皮書 v1.1：知識飛輪、五層架構、理論基礎，加上落地實況。366 篇筆記、六條自動掃描管線、公開知識庫，全部已在運作——這份白皮書本身就是系統的產出。",
    "link": "/whitepaper/second-brain",
    "isNew": True,
}

# 避免重複插入
if d["news"] and d["news"][0].get("id") == "n45":
    print("n45 已存在，跳過")
else:
    d["news"].insert(0, entry)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=2)
    print("OK 插入 n45，第一筆:", d["news"][0]["title"])
