This is the [Haley365](https://haley365.com) marketing site, built with [Next.js](https://nextjs.org) (App Router) and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Structure

- `app/page.tsx` — homepage, composed from the section components in `app/components/`
- `app/components/` — `Nav`, `Hero`, `Capabilities`, `WhyUs`, `Cta`, `Footer`, plus shared `Icon`/`Logo` and the `data.ts` content arrays
- `app/globals.css` — Tailwind theme tokens (colors, fonts) and the self-hosted Material Symbols icon font
- `public/fonts/` — self-hosted Material Symbols Rounded font

## Build

```bash
npm run build
npm run start
```
