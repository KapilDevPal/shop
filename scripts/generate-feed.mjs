#!/usr/bin/env node
/**
 * generate-feed.mjs
 *
 * Fetches live products from the ISH API and generates
 * public/feed.xml — a Google Merchant Center RSS 2.0 Product Feed.
 *
 * Run: node scripts/generate-feed.mjs
 * Or:  npm run generate-feed
 *
 * This is called automatically in the GitHub Actions deploy workflow.
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

function buildItem(p) {
  const price = parseFloat(p.price || "0").toFixed(2);
  const availability = p.is_threshold_reached ? "preorder" : "preorder";
  const image = p.thumbnail_url || p.images?.[0] || "";
  const link = `${STORE_URL}/#/product/${p.slug}`;
  const sizes = (p.available_sizes || []);

  // Google Shopping requires at least one size variant if sizes are available
  if (sizes.length > 0) {
    return sizes.map((size) => `
  <item>
    <g:id>${escape(p.slug)}_${size}</g:id>
    <g:title>${escape(p.name)}</g:title>
    <g:description>${escape(p.description || p.name)}</g:description>
    <g:link>${escape(link)}</g:link>
    <g:image_link>${escape(image)}</g:image_link>
    <g:availability>${availability}</g:availability>
    <g:price>${price} INR</g:price>
    <g:brand>${escape(p.brand || "Indian Space Hub")}</g:brand>
    <g:condition>new</g:condition>
    <g:item_group_id>${escape(p.slug)}</g:item_group_id>
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
  </item>`).join("\n");
  }

  return `
  <item>
    <g:id>${escape(p.slug)}</g:id>
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

async function main() {
  console.log("📦 Fetching products from ISH API...");
  const res = await fetch(API_URL);
  const json = await res.json();
  const products = json.data || [];
  console.log(`✅ Found ${products.length} products`);

  const now = new Date().toUTCString();
  const items = products.map(buildItem).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Indian Space Hub Store</title>
    <link>${STORE_URL}</link>
    <description>Official ISRO-inspired merchandise, apparel, scale model rockets, and space gear.</description>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>`;

  const outputPath = join(__dirname, "..", "public", "feed.xml");
  writeFileSync(outputPath, xml, "utf8");
  console.log(`✅ feed.xml written to ${outputPath}`);
  console.log(`🛍️  Submit to Google Merchant Center: ${STORE_URL}/feed.xml`);
}

main().catch((err) => {
  console.error("❌ Error generating feed:", err);
  process.exit(1);
});
