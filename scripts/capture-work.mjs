/**
 * Captures the poster + scroll-through clip for a Work panel from a live site.
 *
 *   node scripts/capture-work.mjs <slug> <url> [--depth=4]
 *
 * Writes public/work/<slug>.{jpg,mp4,webm} in the same format as the existing
 * panels: a 2880x1800 poster, and a 3s / 24fps / 960x600 clip (72 frames).
 * Frames are captured by stepping the scroll position on an eased curve, so the
 * result reads as one continuous scroll rather than a jump cut.
 *
 * Requires playwright (devDependency) and ffmpeg on PATH.
 */
import {execFileSync} from "node:child_process";
import {mkdtempSync, rmSync, mkdirSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {chromium} from "playwright";

const VIEWPORT = {width: 1440, height: 900};
const FRAMES = 72;
const FPS = 24;
const OUT_DIR = "public/work";

const [slug, url, ...flags] = process.argv.slice(2);
if (!slug || !url) {
  console.error("usage: node scripts/capture-work.mjs <slug> <url> [--depth=4]");
  process.exit(1);
}

/** How many viewport heights the clip travels. Long pinned pages want less. */
const depth = Number(flags.find((f) => f.startsWith("--depth="))?.split("=")[1] ?? 4);

/** easeInOutCubic — settles at both ends so the loop point is not a lurch. */
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const frameDir = mkdtempSync(join(tmpdir(), `capture-${slug}-`));
mkdirSync(OUT_DIR, {recursive: true});

const browser = await chromium.launch();

try {
  // Poster: retina pass, held at the top of the page.
  const posterCtx = await browser.newContext({viewport: VIEWPORT, deviceScaleFactor: 2});
  const posterPage = await posterCtx.newPage();
  await posterPage.goto(url, {waitUntil: "networkidle", timeout: 60_000});
  await posterPage.waitForTimeout(2500); // let entrance animations land
  await posterPage.screenshot({
    path: join(OUT_DIR, `${slug}.jpg`),
    type: "jpeg",
    quality: 88,
  });
  await posterCtx.close();
  console.log(`poster  -> ${OUT_DIR}/${slug}.jpg`);

  // Clip: 1x pass, stepped down the page one frame at a time.
  const clipCtx = await browser.newContext({viewport: VIEWPORT, deviceScaleFactor: 1});
  const clipPage = await clipCtx.newPage();
  await clipPage.goto(url, {waitUntil: "networkidle", timeout: 60_000});
  await clipPage.waitForTimeout(2500);

  const travel = VIEWPORT.height * depth;

  for (let i = 0; i < FRAMES; i += 1) {
    const y = Math.round(ease(i / (FRAMES - 1)) * travel);
    await clipPage.evaluate((top) => window.scrollTo({top, behavior: "instant"}), y);
    // One rAF for scroll-linked work, then a beat for entrance transitions.
    await clipPage.evaluate(() => new Promise(requestAnimationFrame));
    await clipPage.waitForTimeout(90);
    await clipPage.screenshot({
      path: join(frameDir, `${String(i).padStart(3, "0")}.png`),
      type: "png",
    });
  }
  await clipCtx.close();
  console.log(`frames  -> ${FRAMES} captured`);

  const input = join(frameDir, "%03d.png");
  const scale = "scale=960:600:flags=lanczos";

  execFileSync(
    "ffmpeg",
    ["-y", "-framerate", String(FPS), "-i", input, "-vf", scale,
     "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23", "-movflags", "+faststart",
     join(OUT_DIR, `${slug}.mp4`)],
    {stdio: "ignore"},
  );
  console.log(`clip    -> ${OUT_DIR}/${slug}.mp4`);

  execFileSync(
    "ffmpeg",
    ["-y", "-framerate", String(FPS), "-i", input, "-vf", scale,
     "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-crf", "36", "-b:v", "0", "-row-mt", "1",
     join(OUT_DIR, `${slug}.webm`)],
    {stdio: "ignore"},
  );
  console.log(`clip    -> ${OUT_DIR}/${slug}.webm`);
} finally {
  await browser.close();
  rmSync(frameDir, {recursive: true, force: true});
}
