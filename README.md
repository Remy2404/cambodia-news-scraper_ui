# Cambodia News Dashboard (React + TypeScript + Vite)

This repository contains a small News Dashboard built with React, TypeScript, Vite and Tailwind CSS. It provides a UI for browsing, creating, editing, and deleting scraped news articles.

The project focuses on accessibility and resilient UI patterns (defensive image handling, consistent card layouts, high-contrast action buttons, and line-clamped text).

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- ESLint

## Quick start

Prerequisites: Node.js 18+ and npm (or your preferred package manager).

Install dependencies:

```powershell
cd d:\cambodia-news-scraper_ui
npm install
```

Run the dev server:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
```

Preview production build locally:

```powershell
npm run preview
```

Lint the project:

```powershell
npm run lint
```

## Project structure (important files)

- `src/components/articles/ArticleCard.tsx` — News card component. Improved to:
  - Render a fixed 16:9 media area with a gradient + icon fallback when an image is missing or broken
  - Show a loading spinner while images load
  - Clamp title and summary text to keep cards consistent
  - Use flex layout so all cards in a row share equal height
  - Provide accessible primary (View) and secondary (Edit/Delete) action styles
- `src/pages/Dashboard.tsx` — Grid, filters, and pagination
- `src/pages/ArticleDetails.tsx` — Full article view
- `src/context/ToastContext.tsx` — Global toast provider
- `src/types/index.ts` — Article type definitions

## Accessibility & UI notes

- Buttons follow accessible contrast and keyboard focus styles (focus-visible rings).
- Images use a graceful fallback (gradient + icon) to avoid broken layouts when `img_url` is missing or fails to load.
- Titles and summaries are line-clamped to avoid uneven card heights.
- The layout uses `flex` and `mt-auto` for action bar alignment so cards in a grid row remain visually consistent.

## TypeScript notes

- `Article.metadata` uses `Record<string, unknown>` to avoid unsafe `any` usage. When reading `metadata` properties in JSX (for example `base_url`) the code performs a runtime `typeof` check before rendering to satisfy TypeScript's type system.

## Contributing

1. Fork the repo and create a feature branch.
2. Run the project locally and add tests if applicable.
3. Open a PR describing your change.

## License

This project is provided as-is. Add your preferred license if you plan to publish it.

---

If you'd like, I can also:
- Add a short developer checklist (pre-commit hooks, formatting rules)
- Add a small sample `.env.example` (if external API keys are later needed)
- Add screenshots and developer run scripts to the README

Tell me which of those you'd like and I will add them.
