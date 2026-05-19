import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../assets/previews");

const PROJECTS = [
  {
    id: "801-studios",
    url: "https://www.801familystudios.com/",
    file: "801-studios-2025.jpg",
    zoom: 0.82,
  },
  { id: "one-heart", url: "https://www.oneheartorchestra.com/" },
  { id: "alley-kats", url: "https://www.thealleykatsvibe.com" },
  { id: "dub-nectar", url: "https://www.dubnectar.com/" },
  { id: "charles-wilson", url: "https://charleswilsonsoul.net/" },
  { id: "tribe-of-i", url: "https://dbaileyfam.github.io/TribeofIEPK/" },
  { id: "the-pearls", url: "https://dbaileyfam.github.io/ThePearlsEPK/" },
  { id: "the-unaffected", url: "https://dbaileyfam.github.io/theunaffectedepk/" },
];

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});

for (const project of PROJECTS) {
  const filePath = join(OUT_DIR, project.file || `${project.id}.jpg`);
  console.log(`Capturing ${project.id}…`);
  try {
    await page.goto(project.url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(4000);
    if (project.zoom) {
      await page.evaluate((z) => {
        document.documentElement.style.zoom = String(z);
      }, project.zoom);
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: filePath,
      type: "jpeg",
      quality: 88,
      clip: { x: 0, y: 0, width: 1280, height: 720 },
    });
    console.log(`  ✓ ${filePath}`);
  } catch (err) {
    console.error(`  ✗ ${project.id}:`, err.message);
  } finally {
    await page.evaluate(() => {
      document.documentElement.style.zoom = "";
    });
  }
}

await browser.close();
console.log("Done.");
