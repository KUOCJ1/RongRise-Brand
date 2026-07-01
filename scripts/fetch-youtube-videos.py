#!/usr/bin/env python3
"""Fetch latest videos from CJ哥's YouTube channel and save to JSON."""
import json, urllib.request, os, shutil

API_KEY_PATH = "/opt/data/home/.secrets/youtube-api-key"
CHANNEL_ID = "UCFfz1iDwqqRfjWgR7GhVMGA"
OUTPUT = "/opt/data/RongRise-Brand/src/data/youtube-videos.json"

with open(API_KEY_PATH) as f:
    API_KEY = f.read().strip()

url = (f"https://www.googleapis.com/youtube/v3/search?"
       f"part=snippet&channelId={CHANNEL_ID}&order=date&maxResults=3"
       f"&type=video&key={API_KEY}")

try:
    req = urllib.request.Request(url)
    resp = json.loads(urllib.request.urlopen(req, timeout=15).read().decode())
    videos = []
    for item in resp.get("items", []):
        vid = item["id"]["videoId"]
        snippet = item["snippet"]
        videos.append({
            "id": vid,
            "title": snippet["title"],
            "date": snippet["publishedAt"][:10],
            "description": snippet.get("description", "")[:120],
            "thumbnail": f"https://img.youtube.com/vi/{vid}/maxresdefault.jpg",
            "thumbnailFallback": f"https://img.youtube.com/vi/{vid}/hqdefault.jpg",
            "url": f"https://www.youtube.com/watch?v={vid}"
        })
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump({"videos": videos, "fetchedAt": snippet["publishedAt"]}, f, ensure_ascii=False, indent=2)
    # Also copy to public/ for static site access
    public_dir = OUTPUT.replace("src/data/", "public/data/")
    os.makedirs(os.path.dirname(public_dir), exist_ok=True)
    shutil.copy(OUTPUT, public_dir)
    print(f"✅ Fetched {len(videos)} videos → {OUTPUT}")
except Exception as e:
    print(f"❌ Failed: {e}")
    if os.path.exists(OUTPUT):
        print("⚠️  Keeping existing video data")
