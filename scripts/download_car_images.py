#!/usr/bin/env python3
"""Fetch a curated set of car photographs from Unsplash and store them locally."""
import json
import os
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images"
OUT.mkdir(parents=True, exist_ok=True)

QUERIES = [
    ("car", 18),
    ("sports car", 10),
    ("suv car", 10),
    ("sedan car", 8),
    ("car dealership", 6),
    ("classic car", 4),
]
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; KhodroImageCollector/1.0)",
    "Accept": "application/json",
}
seen = set()
photos = []

def get_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=35) as response:
        return json.loads(response.read().decode("utf-8"))

for query, wanted in QUERIES:
    endpoint = "https://unsplash.com/napi/search/photos?" + urllib.parse.urlencode({
        "query": query, "per_page": min(30, wanted * 2), "orientation": "landscape"
    })
    try:
        data = get_json(endpoint)
        for item in data.get("results", []):
            pid = item.get("id")
            urls = item.get("urls") or {}
            image_url = urls.get("raw") or urls.get("regular") or urls.get("full")
            if not pid or pid in seen or not image_url:
                continue
            seen.add(pid)
            photos.append({
                "id": pid,
                "query": query,
                "url": image_url,
                "page": item.get("links", {}).get("html", ""),
                "photographer": (item.get("user") or {}).get("name", ""),
                "photographer_url": (item.get("user") or {}).get("links", {}).get("html", ""),
                "description": item.get("alt_description") or item.get("description") or query,
            })
            if sum(1 for p in photos if p["query"] == query) >= wanted:
                break
    except Exception as exc:
        print(f"Search failed for {query!r}: {exc}")
    time.sleep(1)

downloaded = []
for item in photos:
    if len(downloaded) >= 50:
        break
    index = len(downloaded) + 1
    filename = f"car-{index:02d}.jpg"
    target = OUT / filename
    image_url = item["url"]
    separator = "&" if "?" in image_url else "?"
    image_url = image_url + separator + urllib.parse.urlencode({
        "fm": "jpg", "fit": "crop", "w": 1200, "q": 82
    })
    try:
        req = urllib.request.Request(image_url, headers={"User-Agent": HEADERS["User-Agent"]})
        with urllib.request.urlopen(req, timeout=45) as response:
            content_type = response.headers.get("Content-Type", "")
            blob = response.read()
        if not content_type.startswith("image/") or len(blob) < 12000:
            print(f"Skip invalid image {filename}: {content_type}, {len(blob)} bytes")
            continue
        target.write_bytes(blob)
        item["file"] = filename
        item["bytes"] = len(blob)
        downloaded.append(item)
        print(f"Saved {filename} ({len(blob)} bytes) from {item['query']}")
    except Exception as exc:
        print(f"Download failed for {item['id']}: {exc}")
    time.sleep(0.2)

# Keep the output deterministic and ensure stale files from earlier runs do not remain.
for old in OUT.glob("car-*.jpg"):
    if old.name not in {p["file"] for p in downloaded}:
        old.unlink()

(OUT / "sources.json").write_text(
    json.dumps({
        "note": "Illustrative automotive photographs downloaded from Unsplash search results. These images are not evidence of the exact make/model shown in vehicle listings.",
        "count": len(downloaded),
        "photos": downloaded,
    }, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
if len(downloaded) < 50:
    raise SystemExit(f"Expected 50 images, downloaded {len(downloaded)}. Check Unsplash availability and rerun.")
print(f"Successfully downloaded {len(downloaded)} car images into {OUT}")
