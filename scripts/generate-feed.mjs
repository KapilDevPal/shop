#!/usr/bin/env node
/**
 * generate-feed.mjs
 *
 * Fetches live products from the ISH API and generates:
 * 1. public/feed.xml — Google Merchant Center RSS 2.0 Product Feed
 * 2. public/sitemap.xml — Dynamic XML Sitemap for Google Search Indexing
 *
 * Run: node scripts/generate-feed.mjs
 * Or:  npm run generate-feed
 *
 * Automatically executed in build step (npm run build).
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = "https://indianspacehub.com/api/space/store_products?is_merchandise=true&per_page=100";
const STORE_URL = "https://shop.indianspacehub.com";

function escape(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildFeedItem(p) {
  const price = parseFloat(p.price || "0").toFixed(2);
  const availability = "preorder";
  const image = p.thumbnail_url || p.images?.[0] || "";
  const safeSlug = encodeURI(p.slug || "");
  const link = `${STORE_URL}/#/product/${safeSlug}`;
  const sizes = p.available_sizes || [];
  const baseId = `ish_prod_${p.id || String(p.slug).slice(0, 30)}`;

  if (sizes.length > 0) {
    return sizes
      .map(
        (size) => `
  <item>
    <g:id>${escape(baseId)}_${size}</g:id>
    <g:title>${escape(p.name)}</g:title>
    <g:description>${escape(p.description || p.name)}</g:description>
    <g:link>${escape(link)}</g:link>
    <g:image_link>${escape(image)}</g:image_link>
    <g:availability>${availability}</g:availability>
    <g:price>${price} INR</g:price>
    <g:brand>${escape(p.brand || "Indian Space Hub")}</g:brand>
    <g:condition>new</g:condition>
    <g:item_group_id>${escape(baseId)}</g:item_group_id>
    <g:size>${escape(size)}</g:size>
    <g:size_type>regular</g:size_type>
    <g:size_system>IN</g:size_system>
    <g:age_group>adult</g:age_group>
    <g:gender>unisex</g:gender>
    <g:shipping>
      <g:country>IN</g:country>
      <g:service>Standard</g:service>
      <g:price>0 INR</g:price>
    </g:shipping>
    <g:product_type>${escape(p.category || "Merchandise")}</g:product_type>
    <g:custom_label_0>merchandise</g:custom_label_0>
    ${p.is_new ? "<g:custom_label_1>new_drop</g:custom_label_1>" : ""}
  </item>`
      )
      .join("\n");
  }

  return `
  <item>
    <g:id>${escape(baseId)}</g:id>
    <g:title>${escape(p.name)}</g:title>
    <g:description>${escape(p.description || p.name)}</g:description>
    <g:link>${escape(link)}</g:link>
    <g:image_link>${escape(image)}</g:image_link>
    <g:availability>${availability}</g:availability>
    <g:price>${price} INR</g:price>
    <g:brand>${escape(p.brand || "Indian Space Hub")}</g:brand>
    <g:condition>new</g:condition>
    <g:shipping>
      <g:country>IN</g:country>
      <g:service>Standard</g:service>
      <g:price>0 INR</g:price>
    </g:shipping>
    <g:product_type>${escape(p.category || "Merchandise")}</g:product_type>
    <g:custom_label_0>merchandise</g:custom_label_0>
    ${p.is_new ? "<g:custom_label_1>new_drop</g:custom_label_1>" : ""}
  </item>`;
}

function buildSitemap(products, todayDate) {
  const productUrls = products
    .map((p) => {
      const safeSlug = encodeURI(p.slug || "");
      const loc = `${STORE_URL}/#/product/${safeSlug}`;
      const img = p.thumbnail_url || p.images?.[0] || "";
      const title = p.name || "";
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>${
      img
        ? `
    <image:image>
      <image:loc>${escape(img)}</image:loc>
      <image:title>${escape(title)}</image:title>
    </image:image>`
        : ""
    }
  </url>`;
    })
    .join("\n\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Home / Product Listing -->
  <url>
    <loc>${STORE_URL}/</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${STORE_URL}/indian_space_hub_logo.png</image:loc>
      <image:title>Indian Space Hub Store Logo</image:title>
    </image:image>
  </url>

  <!-- Live API Product Pages -->
${productUrls}

  <!-- Static Pages -->
  <url>
    <loc>${STORE_URL}/#/refund-policy</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>${STORE_URL}/#/privacy</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>${STORE_URL}/#/contact</loc>
    <lastmod>${todayDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

</urlset>
`;
}

async function main() {
  console.log("📦 Fetching live products from ISH API...");
  const res = await fetch(API_URL);
  const json = await res.json();
  const products = json.data || [];
  console.log(`✅ Found ${products.length} products`);

  const now = new Date().toUTCString();
  const todayDate = new Date().toISOString().split("T")[0];

  // 1. Generate feed.xml
  const feedItems = products.map(buildFeedItem).join("\n");
  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Indian Space Hub Store</title>
    <link>${STORE_URL}</link>
    <description>Official ISRO-inspired merchandise, apparel, scale model rockets, and space gear.</description>
    <lastBuildDate>${now}</lastBuildDate>
${feedItems}
  </channel>
</rss>`;

  const feedPath = join(__dirname, "..", "public", "feed.xml");
  writeFileSync(feedPath, feedXml, "utf8");
  console.log(`✅ feed.xml written to ${feedPath}`);

  // 2. Generate sitemap.xml
  const sitemapXml = buildSitemap(products, todayDate);
  const sitemapPath = join(__dirname, "..", "public", "sitemap.xml");
  writeFileSync(sitemapPath, sitemapXml, "utf8");
  console.log(`✅ sitemap.xml written to ${sitemapPath}`);

  console.log(`🛍️  Merchant Feed: ${STORE_URL}/feed.xml`);
  console.log(`🔍 Google Sitemap: ${STORE_URL}/sitemap.xml`);
}

main().catch((err) => {
  console.error("❌ Error generating feed and sitemap:", err);
  process.exit(1);
});
