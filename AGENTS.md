# Repository Guidelines

## Project Structure & Module Organization
- `app/` hosts the Next.js 14 App Router entrypoints, layouts, and page logic.
- `components/` contains reusable client components such as the chat window, message input, and emoji picker.
- `lib/` centralizes frontend utilities (e.g., the Socket.IO client singleton), while `types/` shares TypeScript contracts across tiers.
- `server/` exposes the Express + Socket.IO backend that drives real-time updates.
- Static assets, icons, and favicons live in `public/`; configuration resides in the root (`eslint.config.mjs`, `next.config.ts`, `tsconfig.json`).

## Build, Test, and Development Commands
- `npm run dev` — Launch the Next.js development server on port 3000.
- `npm run server` — Start the Express + Socket.IO backend on port 4000.
- `npm run build` — Create an optimized production build of the Next.js app.
- `npm run start` — Serve the production build locally (requires a prior `npm run build`).
- `npm run lint` — Run ESLint against the entire project.

## Coding Style & Naming Conventions
- TypeScript and React components use PascalCase filenames (e.g., `EmojiPicker.tsx`); utility modules prefer camelCase.
- Stick to 2-space indentation and rely on Prettier defaults via the Next.js toolchain.
- Favor functional React components with TypeScript props. Keep hooks at the top level and prefix internal handlers with `handle*`.
- Tailwind classes follow the existing rounded-dark aesthetic; reuse tokens from current components before introducing new patterns.

## Testing Guidelines
- Unit and integration tests are not yet scaffolded; add new tests under `__tests__/` or alongside components using `.test.ts(x)` naming.
- Prior to opening a PR, run `npm run lint` and perform manual smoke tests covering: message send/receive, emoji insertion, and multi-client syncing.
- Document any gaps (e.g., manual verification steps) in the PR description.

## Commit & Pull Request Guidelines
- Use concise Conventional Commit prefixes (`feat:`, `fix:`, `chore:`) that mirror the existing history.
- Reference issues directly in commit bodies or PR descriptions using `Closes #<id>`.
- Pull requests should include: purpose summary, test evidence (`npm run lint`, manual checks), screenshots/GIFs for UI changes, and notes on accessibility or edge cases.
- Pull requests review should include: error found, explanation, and how to fix it. All these details should be on the comment of the Pull Request created.
