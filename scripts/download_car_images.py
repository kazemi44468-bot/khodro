#!/usr/bin/env python3
"""Download 50 car photographs from Wikimedia Commons and use local site assets."""
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images"
OUT.mkdir(parents=True, exist_ok=True)
HEADERS = {
    "User-Agent": "KhodroWebsitePhotoCollector/1.0 (static website image download)",
    "Accept": "application/json",
}
QUERIES = [
    ("car", 16), ("automobile", 10), ("SUV", 8), ("sedan car", 6),
    ("Peugeot car", 4), ("Toyota car", 3), ("Hyundai car", 3),
]
seen, candidates = set(), []

def fetch_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=40) as response:
        return json.loads(response.read().decode("utf-8"))

def meta_value(meta, key):
    val = meta.get(key) or {}
    return re.sub("<[^>]+>", "", val.get("value", "")).strip()

for query, wanted in QUERIES:
    params = {
        "action": "query", "generator": "search",
        "gsrsearch": "filetype:bitmap " + query, "gsrnamespace": 6,
        "gsrlimit": min(50, wanted * 5), "prop": "imageinfo",
        "iiprop": "url|mime|extmetadata", "iiurlwidth": 1200, "format": "json",
    }
    try:
        data = fetch_json("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params))
        pages = (data.get("query") or {}).get("pages") or {}
        found = 0
        for page in pages.values():
            info_list = page.get("imageinfo") or []
            if not info_list:
                continue
            info = info_list[0]
            if info.get("mime") != "image/jpeg":
                continue
            pageid, title = page.get("pageid"), page.get("title", "")
            if not pageid or pageid in seen:
                continue
            thumb = info.get("thumburl") or info.get("url")
            if not thumb:
                continue
            meta = info.get("extmetadata") or {}
            seen.add(pageid)
            candidates.append({
                "pageid": pageid, "query": query, "title": title, "url": thumb,
                "source_page": "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_")),
                "artist": meta_value(meta, "Artist"),
                "credit": meta_value(meta, "Credit"),
                "license": meta_value(meta, "LicenseShortName"),
                "license_url": meta_value(meta, "LicenseUrl"),
                "description": meta_value(meta, "ImageDescription"),
                "original_url": info.get("descriptionurl", ""),
            })
            found += 1
            if found >= wanted:
                break
    except Exception as exc:
        print(f"Commons search failed for {query!r}: {exc}")
    time.sleep(0.6)

downloaded = []
for item in candidates:
    if len(downloaded) >= 50:
        break
    filename = f"car-{len(downloaded) + 1:02d}.jpg"
    try:
        req = urllib.request.Request(item["url"], headers={"User-Agent": HEADERS["User-Agent"]})
        with urllib.request.urlopen(req, timeout=45) as response:
            content_type, blob = response.headers.get("Content-Type", ""), response.read()
        if content_type.split(";")[0].strip() not in ("image/jpeg", "image/jpg") or len(blob) < 10000:
            print(f"Skip invalid image {item['title']}: {content_type}, {len(blob)} bytes")
            continue
        (OUT / filename).write_bytes(blob)
        item["file"], item["bytes"] = filename, len(blob)
        downloaded.append(item)
        print(f"Saved {filename} ({len(blob)} bytes) — {item['title']}")
    except Exception as exc:
        print(f"Download failed for {item['title']}: {exc}")
    time.sleep(0.15)

if len(downloaded) < 50:
    raise SystemExit(f"Expected 50 images, downloaded {len(downloaded)}. Only verified JPEGs are accepted.")

# Localize image references in all pages.
for html_path in [ROOT / "index.html"] + sorted((ROOT / "pages").glob("*.html")):
    if not html_path.exists():
        continue
    html = html_path.read_text(encoding="utf-8")
    prefix, counter = ("assets/images/" if html_path.name == "index.html" else "../assets/images/"), [0]
    def localize_img(match):
        tag = match.group(0)
        if "images.unsplash.com/" not in tag:
            return tag
        counter[0] += 1
        filename = downloaded[(counter[0] - 1) % len(downloaded)]["file"]
        return re.sub(r'src=(["\'])https://images\.unsplash\.com/[^"\']+\1',
                      lambda m: "src=" + m.group(1) + prefix + filename + m.group(1), tag)
    html = re.sub(r'<img\b[^>]*>', localize_img, html, flags=re.IGNORECASE)
    html_path.write_text(html, encoding="utf-8")

css_path = ROOT / "assets" / "css" / "style.css"
if css_path.exists():
    css = css_path.read_text(encoding="utf-8")
    css = re.sub(r"https://images\.unsplash\.com/[^'\")\s]+", "../images/" + downloaded[0]["file"], css)
    css_path.write_text(css, encoding="utf-8")

(OUT / "sources.json").write_text(json.dumps({
    "note": "Automotive photographs from Wikimedia Commons. Check each source and license entry for reuse conditions; images are illustrative and may not depict the exact model named in a listing.",
    "count": len(downloaded), "photos": downloaded,
}, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Successfully downloaded {len(downloaded)} local car photographs.")
