# Portfolio Build Brief

A build spec for a designer's portfolio site. Scaffold the project per this document, then pause for review before styling individual components. Work in phases; stop at each checkpoint marked **⏸ CHECKPOINT**.

---

## Stack

- **Next.js** (App Router, TypeScript)
- **Sanity** (headless CMS) — project + Studio already created by the user
- **Mux** for video (via `sanity-plugin-mux-input`)
- **Geist** font (`geist` package)
- **Radix Colors — Sand** scale (`@radix-ui/colors`)
- Design tokens as **CSS custom properties** in `globals.css` (single source of truth; media queries redefine breakpoint-scaled tokens)

Deploy target is Vercel, but do not configure deployment yet.

---

## Phase 0 — Scaffold

1. `create-next-app` with TypeScript, App Router, no Tailwind by default (we use CSS variables; add Tailwind v4 later only if the user wants utilities).
2. Install:
   - `sanity @sanity/client @sanity/image-url next-sanity @portabletext/react`
   - `sanity-plugin-mux-input @mux/mux-player-react`
   - `geist`
   - `@radix-ui/colors`
3. Set up the embedded Sanity Studio at `/studio` using `next-sanity`.
4. Wire env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and a read token if needed. Leave placeholder `.env.local` with comments; the user will paste real values.

**⏸ CHECKPOINT** — confirm the app runs locally and `/studio` loads before continuing.

---

## Phase 1 — Sanity content model

Four document types. Three are singletons.

### `project` (collection)

| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `slug` | slug | from title |
| `intro` | text | large opening statement on detail page |
| `services` | array of string | shown on **index** with cover |
| `thumbnail` | mediaSlot | image **or** Mux video (see Phase 2); shown on **index**. Video thumbs use a poster + hover-to-play — see index rules in Phase 4 |
| `year` | string | for index |
| `contentBlocks` | array | the modular block system — see Phase 2 |
| `metadata` | object | the credits group — see below |

**`metadata` object** — every field is a list, and **each row/section is hidden on the page if it has no data**:

| Field | Type | Shape |
|---|---|---|
| `scope` | array of string | e.g. "Brand Identity", "Website" |
| `credits` | array of object | `{ role, name }` |
| `typography` | array of object | `{ name, url? }` |
| `recognition` | array of object | `{ name, url? }` (awards) |
| `website` | array of object | `{ label, url }` — modeled as array per spec, usually one entry |

### `homePage` (singleton)
Fields TBD with user in Phase 4. Scaffold with `featuredProjects` (array of references to `project`) as a starting point.

### `aboutPage` (singleton)
`heading`, `body` (Portable Text), optional `image`. Refine with user in Phase 4.

### `siteSettings` (singleton)
`navLinks` (array of `{ label, href }`), `socials` (array of `{ platform, url }`), `contactEmail`, `footerText`.

Use a singleton pattern (deskStructure) so these three can't be duplicated in Studio.

**⏸ CHECKPOINT** — user creates one real project in Studio to test the pipeline before building the front end.

---

## Phase 2 — The block system

`contentBlocks` is an ordered array the user drags freely per project. Item types:

### Media slot (shared building block)
Every image position is a **media slot** that holds **either** a Sanity image **or** a Mux video. Model as an object:

```
mediaSlot {
  kind: 'image' | 'video'   // or infer from which field is set
  image?: image             // Sanity image, hotspot on
  video?: mux.video         // from sanity-plugin-mux-input
  alt: string
}
```

### Block types

| Block | Slots | Fixed ratio |
|---|---|---|
| `textBlock` | — | `{ label, summary, body }` — label drives the floating menu; summary = bold one-liner; body = Portable Text |
| `imageWide` | 1 | **3:2** |
| `imageDouble` | 2 | each **4:5** |
| `imageBento` | 3 | one tall **4:5** + a stacked pair filling a matching **4:5** column |

**Bento layout (confirmed):** two columns — one tall 4:5 slot on one side, two stacked slots on the other side together filling a 4:5 column. Add a required block-level field **`tallColumn: 'left' | 'right'`** so the editor chooses, per block, which column holds the tall image. The stacked pair goes in the other column.

### Layout rules
- **All multi-slot blocks stack vertically on mobile.**
- Reserve each slot's box using its fixed aspect ratio (`aspect-ratio` CSS) so there is **zero layout shift** while media loads.
- The floating menu is generated from the `label` of every `textBlock` in order, with anchor links that scroll to each section.

### The equal-spacing rule (important)
A single spacing token governs **three things at once**, and they must always be equal within a breakpoint:
1. Page side margins (container padding-inline)
2. Gap **between** blocks (vertical rhythm)
3. Gap **within** blocks (the gutter in double/bento)

One token — `--space` — drives all three. It changes per breakpoint (see Phase 3). Never hardcode these gaps independently.

---

## Phase 3 — Design tokens

All tokens live as CSS custom properties in `globals.css`. This is the single source of truth. The user swaps custom fonts and final values later by editing tokens only.

### Font
Geist Sans via `geist/font/sans`. **Tight tracking and line-height at display/heading levels:**
- Display: `letter-spacing: -0.02em; line-height: 1.0–1.05`
- Heading: `letter-spacing: -0.01em; line-height: 1.1`
- Body: normal tracking, `line-height: 1.5`

### Type scale — 4 steps only (minimal by intent)
Use `clamp()` so type scales fluidly across breakpoints (no hard jumps):

```
--text-display:  clamp(2.5rem, 1.5rem + 4vw, 5rem);
--text-heading:  clamp(1.25rem, 1rem + 1vw, 1.75rem);
--text-body:     clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
--text-caption:  0.875rem;
```
(Starting values — user will tune.)

### Color — Radix Sand, following Radix's step semantics
Import `@radix-ui/colors/sand.css`. Map per Radix's rules (step 12 = high-contrast text, step 11 = low-contrast text, steps 6–8 = borders, steps 1–2 = backgrounds):

```
--color-bg:         var(--sand-1);   /* page background */
--color-bg-subtle:  var(--sand-2);
--color-border:     var(--sand-6);
--color-fg:         var(--sand-12);  /* primary text */
--color-fg-muted:   var(--sand-11);  /* secondary/body text */
```

**Hierarchy through color, not size:** a section label (`--color-fg`) and its body (`--color-fg-muted`) can share the same type size and differ only in color. That is the intended minimalist effect.

> Accessibility note per Radix: only steps 11 and 12 are guaranteed as accessible text on the step 1–2 background. Do **not** use lighter steps (9–10) for small text. If a third, lighter "meta" tone is wanted, reserve it for large or non-essential text only, or keep meta at `--color-fg-muted`.

### Spacing — the shared token, breakpoint-scaled
```
:root        { --space: 16px; }   /* mobile */
@media (min-width: 768px)  { :root { --space: 24px; } }
@media (min-width: 1200px) { :root { --space: 32px; } }
```
`--space` is applied to container padding-inline, between-block gap, and within-block gap. (Starting values — user will tune.)

---

## Phase 4 — Pages

Build in this order, pausing after each for design review from the user's Figma sketches:

1. **Project detail** — the block renderer + floating menu + metadata list. This is the core; build it first.
2. **Project index** — grid of `thumbnail` + title + services + year. The `thumbnail` is a mediaSlot (image or video). **Thumbnail behavior:**
   - **Image thumb:** static, responsive image.
   - **Video thumb (desktop/pointer devices):** show the Mux poster frame at rest; **play on hover**, pause and reset to poster on mouse-out. Muted/loop/playsinline.
   - **Video thumb (mobile/touch):** show the **poster image only** — no autoplay, no hover. Detect via pointer/hover media query (`@media (hover: hover)`), not user-agent sniffing.
   - Reserve the thumb box with a fixed aspect ratio so the grid never shifts as media loads.
3. **Home** — refine schema with user, then build.
4. **About** — refine schema with user, then build.

Each page pulls from Sanity via GROQ queries. Render Portable Text with `@portabletext/react`. Render images with `@sanity/image-url` (responsive `srcset`, hotspot-aware). Render video with `@mux/mux-player-react`.

### Video front-end requirements
- Lazy-load via IntersectionObserver — start playback only when the slot nears the viewport; pause when it leaves.
- Attributes: `muted loop autoplay playsinline`.
- Use the Mux poster frame as the placeholder inside the reserved aspect-ratio box.

**⏸ CHECKPOINT** after each page.

---

## Scope: interactions now vs. later

**Build now (structural — these shape the components):**
- Hover-to-play index video thumbnails, with mobile poster-only fallback.
- Floating-menu scroll behavior and active-section state.
- Lazy-load / pause-on-exit for in-page videos.

**Defer to a later motion pass (do not add yet):**
- Easing curves, hover/transition timing, scroll-triggered reveals, page transitions, and any decorative animation.
- These will be specced once the static type/spacing/layout system is standing and reviewable in-browser.

---

## Build order summary
Phase 0 scaffold → ⏸ → Phase 1 schemas → ⏸ (user adds a project) → Phase 2 block system → Phase 3 tokens → Phase 4 pages (detail first) → ⏸ per page.

Do not skip checkpoints. Prefer grid/token-bound values over hardcoded numbers throughout.
