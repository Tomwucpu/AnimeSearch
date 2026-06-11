# AGENTS.md

## Project overview

uni-app (Vue 3) project — "AnimeTool" (番剧档案馆). A mobile app for browsing anime data from the Jikan v4 API (MyAnimeList). Compiled via HBuilderX, not a standard Vite/Webpack toolchain.

## Commands

```bash
# Run all tests (Node.js native test runner, ESM .mjs files)
npm test

# Run a single test file
node --test tests/normalizeAnime.test.mjs
```

No build/lint/typecheck scripts exist. Building and previewing is done inside HBuilderX.

## Architecture

```
AnimeTool/
  api/anime.js          — API layer: wraps Jikan endpoints, returns normalized data
  utils/request.js      — Generic uni.request wrapper (base URL: api.jikan.moe/v4)
  utils/normalizeAnime.js       — Jikan response → app data model (genre names translated to Chinese)
  utils/normalizeAnimeExtras.js — Character & recommendation normalization
  utils/animeCardMeta.js        — Display helpers: formatRank, formatMembers, getVisibleGenres
  stores/favorite.js    — Pinia store, persisted via uni.storage (key: anime_tool_favorites)
  components/           — AnimeCard, EmptyState, LoadingMore, RatingBadge, CustomTabBar (CSS icon tab bar)
  pages/                — index (home), search, favorite, detail
  tests/                — Pure-logic unit tests for utils & stores
```

## Key conventions

- **Vue 3 + `<script setup>`** only. Imports from `@dcloudio/uni-app` for lifecycle hooks (`onLoad`, `onPullDownRefresh`, `onReachBottom`).
- **Navigation**: `uni.navigateTo` for page-to-page, tabBar for the 3 main tabs (index/search/favorite as defined in `pages.json`).
- **Image preview**: always use `uni.previewImage`.
- **Data flow**: Page → API (`api/anime.js`) → normalization utils → component props. Components do NOT call APIs directly.
- **Persistence**: Pages never touch `uni.storage` directly — always go through the favorite Pinia store. Call `favoriteStore.loadFavorites()` on page load.
- **Testing**: Pure logic only (utils, store helpers). Tests are `.mjs` files using `node:test` and `node:assert/strict`. They import source modules directly as ESM.
- **Styles**: SCSS preprocessor available via `uni.scss`. Units in `rpx`. Card border-radius ≤ 22rpx.
- **Genre names** are translated to Chinese in `normalizeAnime.js` (GENRE_NAME_MAP). API responses are otherwise left in original language.

## .opencode/skills/code-format/SKILL.md

Authoritative code format specification. Must be followed for all new code. Covers:
- 解耦 — 单向依赖、接口明确
- 复用 — 同类逻辑只写一次
- 合理拆分 — 单一职责、文件粒度、目录层级
- 注释 — 合理、不过度

Key constraints:
- Chinese UI text, no unnecessary English
- No `console.log` (except app launch/error logging)
- No duplicated API logic across pages
- `const` by default, `async/await` for async
- No static mock data in place of real API calls
- No unrelated refactors or feature creep
