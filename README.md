# Sudip Koirala — Portfolio

A single-page portfolio built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lenis.
White, black and gray only; every section has its own component and motion. There's no WebGL and no GSAP:
the motion uses CSS, IntersectionObserver and small `requestAnimationFrame` loops.

All text comes from the resume (`Koirala_Sudip_resume.docx`, typeset to `public/resume.pdf`) and lives in
one file: [`src/lib/data.ts`](src/lib/data.ts).

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (type-check + lint)
npm start            # serve the production build
npm run lint
```

Optional checks (they need a local Chrome at `/usr/bin/google-chrome`, or set `CHROME_PATH`):

```bash
npm run build && node scripts/qa.mjs --serve   # screenshots + behaviour checks → ./screenshots
```

## Sections

| # | Section | Component | Signature motion |
|---|---------|-----------|------------------|
| — | Navigation | `Navigation.tsx` | glass pill after 40 px, sliding ink indicator, top progress bar, clip-path mobile menu |
| — | Hero | `hero/Hero.tsx` | seamless looping intro video (multiply-blended), outlined ghost name, voice that pauses off-screen |
| 01 | About | `sections/About.tsx` | lanyard ID card: damped pendulum + idle sway, 3D flip (hover / tap / Enter) |
| 02 | Skills | `sections/Skills.tsx` | periodic table, diagonal wave entrance, family filters, sticky inspector with brand logo pop |
| 03 | Work | `sections/Work.tsx` | expanding accordion gallery, clip-path wipe on the illustrative UI |
| 04 | Experience | `sections/Experience.tsx` | timeline spine drawn by scroll; stops light up as it reaches them |
| 05 | Contact | `sections/Contact.tsx` | letters hop under the cursor, copy-email chip, spinning "say hello" badge |

**Certifications** and **Achievements** are not built, because the resume lists neither. To add them, fill
`CERTIFICATIONS` / `ACHIEVEMENTS` in `data.ts` from a resume that includes them, then add the sections and
nav links.

### Content notes

- The GitHub profile link (`github.com/siuee`) is the owner of the two repository links in the resume.
- The ID card shows Dept. (degree field), Since (first year of freelance work) and Valid till (graduation
  year). The resume has no ID number, so the card doesn't show one.
- The About quote paraphrases the resume summary.
- Project mini-UIs are labelled **Illustrative UI**. They're grayscale sketches, not screenshots, and show
  no data.

## Rebuilding the hero video

```bash
python3 -m venv .venv && .venv/bin/pip install numpy pillow imageio-ffmpeg
.venv/bin/python scripts/build-hero-assets.py ~/Downloads/intro.mp4
# optional overrides:  --crop 570:714:354:0   --level 0.91
```

`scripts/build-hero-assets.py` uses ffmpeg (from `PATH`, `$FFMPEG`, or the `imageio-ffmpeg` wheel) and numpy:

1. **Detect + crop.** It finds the person's bounding box across sampled frames (difference from the
   backdrop colour), then crops a centred 4:5 window head-to-toe and scales it to 768×960.
2. **Whiten.** It applies `colorlevels=rimax=…:gimax=…:bimax=…`. The input white point is measured from the
   backdrop's 5th percentile and capped at the spec's 0.98. This source needed 0.91, because 0.98 left a
   visible gray box under `mix-blend-mode: multiply`.
3. **Seamless loop.** It takes the first 10 s and cross-fades the last 0.5 s into the first 0.5 s: `xfade`
   for picture, and an equal-power, sample-accurate fade in numpy for audio (not `acrossfade`). Nothing is
   retimed, so lips stay in sync. Output length is 9.5 s.
4. **Export.**
   - `public/hero/hero.webm`: VP9 CRF 36 + Opus 80k. Listed first as a `<source>`.
   - `public/hero/hero.mp4`: H.264 yuv420p, CRF 24, preset slow, AAC 96k, `+faststart`.
   - `public/hero/poster.webp`: the first frame, used as the video poster.
5. **Stills.**
   - `public/portrait-bust.webp`: a 480×600 head-to-shirt crop of the sharpest frame (highest Laplacian
     variance).
   - `public/og.jpg`: a 1200×630 social card.

The resume PDF is rebuilt with `scripts/build-resume-pdf.py` (`pip install reportlab`). It keeps the .docx
text and hyperlinks verbatim.

## Structure

```
src/app/         layout.tsx (metadata, OG, fonts, themeColor #f4f2ee) · page.tsx · globals.css
src/components/  App.tsx · Navigation.tsx · hero/Hero.tsx · sections/*.tsx · ui/*.tsx
src/lib/         data.ts · hooks.ts (useInView, useScrollProgress, prefersReducedMotion) · scroll.tsx (Lenis + scrollToTarget)
src/fonts/       Inter Tight (variable) · Instrument Serif (regular + italic) · JetBrains Mono (variable)
public/hero/     hero.webm · hero.mp4 · poster.webp
public/logos/    brand SVGs + licences
scripts/         build-hero-assets.py · build-resume-pdf.py · qa.mjs
```

CSS conventions:
- Component CSS is in a `<style href precedence>` tag inside each component. React 19 hoists and dedupes it.
- Shared classes (`.wrap`, `.btn`, `.rv`, …) are in `@layer components`.
- The `a` / `button` resets are in `@layer base`, so Tailwind utilities always win.

## Accessibility and performance

- The page uses semantic landmarks and an ordered heading outline, plus a skip link.
- Every control has a visible `:focus-visible` ring.
- The ID card flips with Enter or Space, and the work panels open on focus.
- `prefers-reduced-motion` disables Lenis, the pendulum and all decorative animation, and shows all content
  immediately.
- The `--mute` gray is `#6c6a64`, slightly darker than the spec's `#77756f`, so small labels reach 4.5:1 on
  the paper background.
- Below-the-fold sections use `content-visibility: auto`. `scrollToTarget` lays them out once before a jump,
  so anchors land exactly.
- Each section hydrates in its own Suspense boundary.
- First-load JS is about 130 kB.

## Credits and licences

- **Brand logos:** [devicon](https://github.com/devicons/devicon) "original" SVGs, MIT licence
  (`public/logos/devicon/LICENSE`), and the JWT mark from [Simple Icons](https://simpleicons.org), CC0 1.0
  (`public/logos/simple-icons/LICENSE.md`). The logos are trademarks of their respective owners and are used
  only to identify the technologies.
- **Concept icons** (SQL, REST, cryptography, AI …) are original line drawings in `src/components/ui/TechLogo.tsx`.
- **Fonts:** Inter Tight, Instrument Serif and JetBrains Mono, all under the SIL Open Font License 1.1
  (`src/fonts/OFL-*.txt`), from the @fontsource packages.
