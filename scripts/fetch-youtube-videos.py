#!/usr/bin/env python3
"""Fetch latest videos from CJ哥's YouTube channel and save to JSON.

以頻道的 uploads playlist（UU…）取「上傳順序」（最新上傳在最前），
再用 videos.list 取標題／日期，只取 public 的前 3 支。
比 search?order=date 穩定：search 對「同時轉 public 的舊片」排序會亂跳。
"""
import json
import os
import shutil
import urllib.parse
import urllib.request
from datetime import datetime, timezone

API_KEY_PATH = "/opt/data/home/.secrets/youtube-api-key"
CHANNEL_ID = "UCFfz1iDwqqRfjWgR7GhVMGA"
OUTPUT = "/opt/data/RongRise-Brand/src/data/youtube-videos.json"
MAX = 3

with open(API_KEY_PATH) as f:
    API_KEY = f.read().strip()


def api(path, **params):
    params["key"] = API_KEY
    url = f"https://www.googleapis.com/youtube/v3/{path}?" + urllib.parse.urlencode(params)
    return json.loads(urllib.request.urlopen(urllib.request.Request(url), timeout=20).read().decode())


try:
    uploads = "UU" + CHANNEL_ID[2:]
    items = api("playlistItems", part="contentDetails", maxResults=12, playlistId=uploads)["items"]
    ids = [i["contentDetails"]["videoId"] for i in items]
    detail = {}
    for i in range(0, len(ids), 10):
        chunk = ids[i:i + 10]
        for v in api("videos", part="snippet,status", id=",".join(chunk)).get("items", []):
            detail[v["id"]] = v
    videos = []
    for vid in ids:                                  # playlist 順序＝上傳順序（新→舊）
        v = detail.get(vid)
        if not v or v["status"]["privacyStatus"] != "public":
            continue
        s = v["snippet"]
        videos.append({
            "id": vid,
            "title": s["title"],
            "date": s["publishedAt"][:10],
            "description": s.get("description", "")[:120],
            "thumbnail": f"https://img.youtube.com/vi/{vid}/maxresdefault.jpg",
            "thumbnailFallback": f"https://img.youtube.com/vi/{vid}/hqdefault.jpg",
            "url": f"https://www.youtube.com/watch?v={vid}",
        })
        if len(videos) >= MAX:
            break
    if not videos:
        raise RuntimeError("no public videos found")
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump({"videos": videos, "fetchedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")},
                  f, ensure_ascii=False, indent=2)
    public_dir = OUTPUT.replace("src/data/", "public/data/")
    os.makedirs(os.path.dirname(public_dir), exist_ok=True)
    shutil.copy(OUTPUT, public_dir)
    print(f"✅ Fetched {len(videos)} videos → {OUTPUT}")
    for v in videos:
        print(f"   {v['id']}  {v['date']}  {v['title'][:40]}")
except Exception as e:
    print(f"❌ Failed: {e}")
    if os.path.exists(OUTPUT):
        print("⚠️  Keeping existing video data")
