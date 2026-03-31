# AlayaCare EVV — US state map

Small Vite + React app that colors a US map by AlayaCare EVV status and shows per-state aggregator rows on hover (and click-to-pin for touch).

## Run locally

```bash
cd evv-us-map
npm install
npm run dev
```

```bash
npm run build   # output in dist/
npm run preview # serve production build
```

## Updating state data

1. Open the canonical Confluence page: **[EVV] Ultimate Guide to EVV**  
   https://alayacare.atlassian.net/wiki/spaces/PM/pages/5621088257/EVV+Ultimate+Guide+to+EVV

2. Edit [`src/data/evvByState.ts`](src/data/evvByState.ts):
   - Set `EVV_LAST_UPDATED` to the **Map Summary** date from Confluence.
   - Update each state’s `rows` (status, aggregator, optional `integrationType`, `notes`, `links`).

3. Map colors use `computeMapBucket()` in the same file:
   - **Closed** and **needs final certification** override other rows.
   - If any row is **in production** and any other is **sponsored**, the state uses the **amber** “in production + other paths” bucket (aligned with mixed / “1 of many” situations in the guide).

## Deploy (e.g. Vercel)

This is a static SPA. Connect the repo (or deploy the `evv-us-map` directory as the project root), use **Framework Preset: Vite**, and set **Output Directory** to `dist`. No extra `vercel.json` is required for a single-page app.

## Tech

- [Vite](https://vite.dev/) + React + TypeScript  
- [@mirawision/usa-map-react](https://mirawision.github.io/usa-map-react) — interactive SVG US map (states + DC), tooltips, and labels
