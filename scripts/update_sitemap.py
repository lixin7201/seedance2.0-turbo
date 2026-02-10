
import os

BASE_URL = "https://seedance2.shop"
LOCALES = ["", "es", "ar", "zh"]
PAGES = [
    "",
    "pricing",
    "blog",
    "updates",
    "features/text-to-video",
    "features/image-to-video",
    "about",
    "refund-policy",
    "privacy-policy",
    "terms-of-service"
]

def generate_sitemap():
    xml_content = "<?xml version='1.0' encoding='utf-8' standalone='yes'?>\n"
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for page in PAGES:
        for locale in LOCALES:
            if locale:
                url = f"{BASE_URL}/{locale}/{page}" if page else f"{BASE_URL}/{locale}"
            else:
                url = f"{BASE_URL}/{page}" if page else f"{BASE_URL}/"
            
            # Clean up double slashes if any (though logic above should avoid it for root)
            if url.endswith("/") and page != "":
                url = url.rstrip("/")
            
            # Priority and changefreq logic (simplified)
            priority = "0.8"
            changefreq = "weekly"
            
            if page == "":
                priority = "1.0"
                changefreq = "daily"
            elif page == "pricing":
                priority = "0.9"
            elif "features" in page:
                priority = "0.8"
            elif "policy" in page or "terms" in page:
                priority = "0.6"
                changefreq = "monthly"
            
            xml_content += "  <url>\n"
            xml_content += f"    <loc>{url}</loc>\n"
            xml_content += "    <lastmod>2026-02-10T00:00:00+00:00</lastmod>\n"
            xml_content += f"    <changefreq>{changefreq}</changefreq>\n"
            xml_content += f"    <priority>{priority}</priority>\n"
            xml_content += "  </url>\n"
            
    xml_content += "</urlset>\n"
    
    with open("public/sitemap.xml", "w") as f:
        f.write(xml_content)
    
    print("Sitemap generated successfully.")

if __name__ == "__main__":
    generate_sitemap()
