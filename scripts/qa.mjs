#!/usr/bin/env node
/**
 * Visual + behaviour smoke test against a running server.
 *
 *   npm run build && node scripts/qa.mjs --serve     # starts `next start` on :3123 itself
 *   node scripts/qa.mjs http://localhost:3000        # or test an already running server
 *
 * Uses playwright-core with a locally installed Chrome (set CHROME_PATH to override).
 * Screenshots land in ./screenshots.
 */
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";

const serve = process.argv.includes("--serve");
const URL = serve ? "http://localhost:3123" : (process.argv[2] ?? "http://localhost:3000");
let server;
if (serve) {
  server = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", "3123"], { stdio: "ignore" });
  process.on("exit", () => server.kill());
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(URL)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
}
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  args: ["--autoplay-policy=no-user-gesture-required"],
});

const results = [];
const check = (name, ok, extra = "") => results.push({ name, ok, extra });

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(600);
}

for (const vp of [
  { name: "desktop", width: 1440, height: 900, touch: false },
  { name: "mobile", width: 390, height: 844, touch: true },
  { name: "small", width: 360, height: 740, touch: true },
]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.touch, isMobile: vp.touch, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${vp.name}-hero.png` });

  if (vp.name === "desktop") {
    // nav jump from the top lands on the section (sections use content-visibility)
    await page.locator('.nav-desk a[href="#contact"]').click();
    await page.waitForTimeout(2200);
    const top = await page.evaluate(() => document.getElementById("contact").getBoundingClientRect().top);
    check("desktop: nav jump lands on #contact", Math.abs(top) < 4, `top=${top.toFixed(1)}`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
  }

  // video should be playing while the hero is visible
  const playingTop = await page.evaluate(() => !document.querySelector("video").paused);
  check(`${vp.name}: hero video plays`, playingTop);

  await scrollThrough(page);
  const overflow = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  check(`${vp.name}: no horizontal overflow`, overflow[0] === overflow[1], `${overflow[0]} vs ${overflow[1]}`);

  // paused once the hero is mostly off-screen, resumed on return
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await page.waitForTimeout(500);
  const pausedAway = await page.evaluate(() => document.querySelector("video").paused);
  check(`${vp.name}: video pauses past hero`, pausedAway);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const resumed = await page.evaluate(() => !document.querySelector("video").paused);
  check(`${vp.name}: video resumes on return`, resumed);

  // sections
  for (const id of ["about", "skills", "homelab", "work", "experience", "contact"]) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40);
    }, id);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/${vp.name}-${id}.png` });
  }

  if (vp.name === "desktop") {
    // sound toggle
    const btn = page.locator(".hero-sound");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    const before = await btn.getAttribute("aria-pressed");
    await btn.click();
    const after = await btn.getAttribute("aria-pressed");
    await page.waitForTimeout(300);
    const paused = await page.evaluate(() => document.querySelector("video").paused);
    check("desktop: pause button stops the video", before === "true" && after === "false" && paused, `${before} → ${after}, paused=${paused}`);
    // stays paused after scrolling away and back
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    check("desktop: user pause survives scrolling back", await page.evaluate(() => document.querySelector("video").paused));
    await btn.click();
    await page.waitForTimeout(300);
    const playing = await page.evaluate(() => { const v = document.querySelector("video"); return !v.paused && !v.muted; });
    check("desktop: play button resumes with sound", playing);

    // id card flips via keyboard
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.locator(".idcard").focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1100);
    check("desktop: id card flips on Enter", await page.locator(".idcard.is-flipped").count() === 1);
    const card = await page.locator(".idcard").boundingBox();
    await page.screenshot({ path: `${OUT}/desktop-idcard-back.png`, clip: { x: card.x - 40, y: card.y - 40, width: card.width + 80, height: card.height + 80 } });
    await page.keyboard.press("Enter");

    // swing: rig transform changes after pointer movement
    const box = await page.locator("#about").boundingBox();
    await page.mouse.move(box.x + 100, box.y + 300);
    for (let i = 0; i < 8; i++) await page.mouse.move(box.x + 100 + i * 120, box.y + 300, { steps: 2 });
    await page.waitForTimeout(120);
    const rot = await page.evaluate(() => document.querySelector(".lan-rig").style.transform);
    check("desktop: lanyard swings", /rotate\((?!0\.000)/.test(rot), rot);

    // work accordion opens on hover
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.locator(".wk-panel").nth(3).hover();
    await page.waitForTimeout(1300);
    check("desktop: work panel opens on hover", await page.locator(".wk-panel").nth(3).evaluate((e) => e.classList.contains("is-open")));
    await page.screenshot({ path: `${OUT}/desktop-work-open4.png` });

    // skills inspector follows hover; filter dims
    await page.locator("#skills").scrollIntoViewIfNeeded();
    await page.locator(".sk-tile").nth(13).hover();
    await page.locator(".sk-chip", { hasText: "Security" }).click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/desktop-skills-filter.png` });
    check("desktop: skills filter dims tiles", (await page.locator(".sk-tile.is-dim").count()) > 0);
  }

  if (vp.name === "mobile") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator(".nav-menu-btn").tap();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/mobile-menu.png` });
    const locked = await page.evaluate(() => getComputedStyle(document.documentElement).overflow);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    const closed = await page.locator(".nav-overlay.is-open").count();
    check("mobile: menu opens, locks scroll, Esc closes", locked === "hidden" && closed === 0, `overflow=${locked}`);

    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.locator(".idcard").tap();
    await page.waitForTimeout(1100);
    check("mobile: id card flips on tap", await page.locator(".idcard.is-flipped").count() === 1);
  }

  check(`${vp.name}: no console errors`, errors.length === 0, errors.join(" | "));
  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });
  await ctx.close();
}

// reduced motion: no Lenis, content revealed immediately, no pendulum
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const state = await page.evaluate(() => ({
    lenis: document.documentElement.classList.contains("lenis"),
    hidden: [...document.querySelectorAll(".rv, .rv-mask")].filter((e) => !e.classList.contains("is-in")).length,
    rig: document.querySelector(".lan-rig").style.transform,
  }));
  check("reduced motion: no smooth scroll, all content shown, no swing", !state.lenis && state.hidden === 0 && !state.rig, JSON.stringify(state));
  await ctx.close();
}

await browser.close();
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.extra ? `  (${r.extra})` : ""}`);
process.exit(results.every((r) => r.ok) ? 0 : 1);
