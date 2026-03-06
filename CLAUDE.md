# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CosmicPulse is a single-page marketing/landing website for an AI agentic solutions & IT services company. Built with Next.js 14 (App Router), React 18, TypeScript, and Tailwind CSS 3. Deployed on Vercel.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — Run Next.js linter
- `npm start` — Serve production build

## Architecture

This is a single-page app with all content in one file:

- **`src/app/page.tsx`** — The entire landing page (~1400+ lines). Contains all sections (hero, services, about, contact, etc.) as well as inline component definitions (ThemeProvider, ThemeToggle, navbar, footer). This is a `"use client"` component.
- **`src/app/layout.tsx`** — Root layout with Inter and Space Grotesk fonts (via `next/font/google`), metadata/SEO, and an inline script to prevent theme flash on load.
- **`src/app/globals.css`** — CSS variables for the theme system, custom utility classes, space/nebula backgrounds, animations, and glassmorphism effects.

## Theme System

Dark/light theme using CSS custom properties on `:root` and `[data-theme="light"]`. Theme state is managed via React context (`ThemeCtx`) in `page.tsx` and persisted to `localStorage`. Use `var(--*)` CSS variables (defined in `globals.css`) for all theme-aware colors — never hardcode colors that should change between themes.

Key variable groups: `--bg-*`, `--text-*`, `--border-*`, `--accent-*`, `--glow-opacity`, `--noise-opacity`.

Custom Tailwind utility classes are defined in `globals.css` under `@layer utilities` (e.g., `.text-heading`, `.text-body`, `.bg-body`, `.border-theme`).

## Styling Conventions

- Tailwind for layout/spacing; CSS classes in `globals.css` for complex effects (glassmorphism `.glass`, gradient borders `.gradient-border`, glow effects `.glow-text`, animated backgrounds `.space-bg`/`.nebula-bg`).
- Custom color palette: `cosmic-*` (purple shades) and `neon-*` (cyan, purple, blue, pink) defined in `tailwind.config.ts`.
- Font families: `font-sans` (Inter) for body, `font-display` (Space Grotesk) for headings.
- Many dark-mode-only decorative elements (star fields, nebulas, auroras, shooting stars) are hidden in light mode via `[data-theme="light"] .class { display: none !important; }`.

## Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).
