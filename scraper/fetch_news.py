#!/usr/bin/env python3
"""
Automated News & Blog Scraper & Ingest Pipeline for Digital Services Platform
Fetches trending stories from Google News RSS feeds, formats clean SEO-optimized summaries,
and posts them directly to the Django Ingestion API.
"""
import urllib.request
import xml.etree.ElementTree as ET
import json
import re
import html

API_INGEST_URL = "https://digital-services-platform-slnw.onrender.com/api/v1/blog/ingest/"
INGEST_KEY = "aaradhya-news-ingest-secret-2026"

FEEDS = [
    {
        "category_slug": "technology",
        "url": "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en",
        "default_image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        "tags": ["Technology", "AI", "India Tech"],
    },
    {
        "category_slug": "business",
        "url": "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en",
        "default_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "tags": ["Business", "Startups", "Economy"],
    },
    {
        "category_slug": "trending-news",
        "url": "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
        "default_image": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
        "tags": ["Trending", "Top Stories", "National"],
    }
]

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return html.unescape(cleantext).strip()

def fetch_feed(feed_config, limit=3):
    url = feed_config["url"]
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            xml_data = resp.read()
            root = ET.fromstring(xml_data)
            items = root.findall(".//item")
            print(f"[{feed_config['category_slug']}] Found {len(items)} items in feed.")

            count = 0
            for item in items[:limit]:
                title = clean_html(item.findtext("title", ""))
                link = item.findtext("link", "")
                pub_date = item.findtext("pubDate", "")
                desc = clean_html(item.findtext("description", ""))

                # Split out publisher if available (Google News uses " - Publisher Name")
                source_name = "Google News"
                if " - " in title:
                    parts = title.rsplit(" - ", 1)
                    title = parts[0]
                    source_name = parts[1]

                # Craft clean multi-paragraph HTML body
                body_content = f"""
<h2>Executive Summary</h2>
<p>{desc or title}</p>

<h3>Key Highlights</h3>
<ul>
  <li><strong>Trending Topic:</strong> Coverage curated from leading industry updates across {feed_config['category_slug'].replace('-', ' ').title()}.</li>
  <li><strong>Sector Impact:</strong> Significant implications for technology adoption, market liquidity, and business operational strategies.</li>
</ul>

<p>For official real-time updates and complete ongoing press coverage, explore the primary investigative report published by <strong>{source_name}</strong>.</p>
"""

                payload = {
                    "category_slug": feed_config["category_slug"],
                    "post_type": "news",
                    "title": title,
                    "excerpt": (desc[:280] + "...") if len(desc) > 280 else (desc or title),
                    "content": body_content,
                    "featured_image": feed_config["default_image"],
                    "source_name": source_name,
                    "source_url": link,
                    "tags": feed_config["tags"],
                    "read_time_minutes": 3,
                    "is_trending": True,
                }

                # Ingest to Backend
                post_req = urllib.request.Request(
                    API_INGEST_URL,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={
                        "Content-Type": "application/json",
                        "X-Ingest-Key": INGEST_KEY,
                    }
                )
                try:
                    with urllib.request.urlopen(post_req, timeout=10) as post_resp:
                        res = json.loads(post_resp.read().decode("utf-8"))
                        print(f"  -> Ingested: {title[:50]}... | Status: {res.get('success')}")
                        count += 1
                except Exception as post_err:
                    print(f"  -> Ingest failed for '{title[:30]}': {post_err}")

    except Exception as e:
        print(f"Failed to fetch {url}: {e}")

def sync_public_sitemap():
    """
    Pulls dynamic sitemap from Render and commits/saves it to frontend/public/sitemap.xml
    so static Vercel CDN serves the updated URLs to Googlebot directly.
    """
    sitemap_url = "https://digital-services-platform-slnw.onrender.com/sitemap.xml"
    try:
        req = urllib.request.Request(sitemap_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode("utf-8")
        
        target_path = "frontend/public/sitemap.xml"
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully synchronized frontend/public/sitemap.xml with live database posts.")
    except Exception as e:
        print(f"Could not sync static sitemap: {e}")

if __name__ == "__main__":
    print("Starting automated news ingestion pipeline...")
    for f in FEEDS:
        fetch_feed(f, limit=2)
    sync_public_sitemap()
    print("Ingestion complete.")
