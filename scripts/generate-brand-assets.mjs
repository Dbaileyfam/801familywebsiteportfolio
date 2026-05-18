/**
 * Renders og-image.png and apple-touch-icon.png from the portfolio brand template.
 * Run: node scripts/generate-brand-assets.mjs
 */
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const assets = path.join(root, "assets");
const logoPath = path.join(assets, "801-family-studios-logo.png");
const logoData = fs.readFileSync(logoPath).toString("base64");
const logoSrc = `data:image/png;base64,${logoData}`;

function brandHtml(width, height, variant) {
  const isOg = variant === "og";
  const orbitSize = isOg ? 220 : 150;

  const copyHtml = isOg
    ? [
        '<div class="copy">',
        '<p class="eyebrow">Web design &amp; development</p>',
        '<h1>Sites that<span class="accent">move the room.</span></h1>',
        '<p class="tagline">Eye-catching websites &amp; EPKs for bands, businesses, and clients worldwide.</p>',
        '<span class="badge">801 Family Studios · Portfolio</span>',
        "</div>",
      ].join("")
    : "";

  return [
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"/><style>",
    `body{width:${width}px;height:${height}px;overflow:hidden;margin:0;font-family:system-ui,sans-serif;background:#07060b;color:#f4f0eb}`,
    `.wrap{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:${isOg ? "48px 64px" : "20px"}}`,
    ".orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55}",
    ".orb--1{width:420px;height:420px;background:#ff6b35;top:-120px;left:-80px}",
    ".orb--2{width:380px;height:380px;background:#c77dff;bottom:-100px;right:-60px}",
    ".orb--3{width:300px;height:300px;background:#06d6a0;top:40%;left:55%;opacity:.35}",
    ".grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:48px 48px}",
    `.content{position:relative;z-index:2;display:flex;align-items:center;gap:${isOg ? "48px" : "0"}}`,
    ".orbit-wrap{position:relative;flex-shrink:0}",
    ".ring{position:absolute;inset:0;border-radius:50%;border:3px solid transparent;background:linear-gradient(#07060b,#07060b) padding-box,linear-gradient(135deg,#ff6b35,#c77dff,#06d6a0,#ff6b35) border-box}",
    ".ring--mid{inset:14%;border-width:2px;opacity:.5}",
    ".core{position:absolute;inset:32%;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.12);background:#0f0d16}",
    ".core img{width:100%;height:100%;object-fit:cover}",
    ".dot{position:absolute;width:10px;height:10px;border-radius:50%;box-shadow:0 0 12px currentColor}",
    ".dot--1{top:4%;left:50%;transform:translateX(-50%);background:#06d6a0}",
    ".dot--2{bottom:18%;right:8%;background:#c77dff}",
    ".dot--3{bottom:18%;left:8%;background:#ff6b35}",
    ".eyebrow{font-size:18px;letter-spacing:.22em;text-transform:uppercase;color:#06d6a0;margin-bottom:14px;font-weight:600}",
    "h1{font-size:72px;line-height:.95;letter-spacing:.04em;font-weight:800;text-transform:uppercase;margin-bottom:16px}",
    "h1 .accent{display:block;background:linear-gradient(90deg,#ff6b35,#ffb347,#c77dff,#06d6a0);-webkit-background-clip:text;background-clip:text;color:transparent}",
    ".tagline{font-size:26px;color:rgba(244,240,235,.78);line-height:1.35;max-width:520px}",
    ".badge{display:inline-block;margin-top:28px;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0a0808;background:linear-gradient(135deg,#ff6b35,#ff8f65)}",
    "</style></head><body><div class=\"wrap\">",
    '<div class="orb orb--1"></div><div class="orb orb--2"></div><div class="orb orb--3"></div>',
    '<div class="grid"></div><div class="content">',
    `<div class="orbit-wrap" style="width:${orbitSize}px;height:${orbitSize}px">`,
    '<div class="ring"></div><div class="ring ring--mid"></div>',
    '<span class="dot dot--1"></span><span class="dot dot--2"></span><span class="dot dot--3"></span>',
    `<div class="core"><img src="${logoSrc}" alt=""/></div>`,
    "</div>",
    copyHtml,
    "</div></div></body></html>",
  ].join("");
}

async function screenshot(html, outPath, width, height) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: outPath, type: "png" });
  await browser.close();
  console.log("Wrote", outPath);
}

await screenshot(brandHtml(1200, 630, "og"), path.join(assets, "og-image.png"), 1200, 630);
await screenshot(brandHtml(180, 180, "icon"), path.join(assets, "apple-touch-icon.png"), 180, 180);
await screenshot(brandHtml(32, 32, "icon"), path.join(assets, "favicon-32.png"), 32, 32);
