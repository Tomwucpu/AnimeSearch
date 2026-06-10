# Anime Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the UniApp Vue 3 H5 anime archive app with Jikan API data, swiper, detail navigation, preview image, Pinia favorites, persistence, refresh, and load more.

**Architecture:** Keep API, normalization, state, and pages separated. Pages render Chinese UI text and call small reusable helpers instead of duplicating request and mapping logic. Pinia owns favorites and persists them through `uni.storage`.

**Tech Stack:** UniApp Vue 3, Pinia, Jikan REST API, `uni.request`, `uni.previewImage`, Node test runner for pure logic.

---

## File Structure

- Create `AnimeTool/package.json`: declare `pinia` and logic test script.
- Modify `AnimeTool/main.js`: register Pinia.
- Modify `AnimeTool/pages.json`: configure pages, detail route, tabBar, and Chinese navigation titles.
- Create `AnimeTool/utils/normalizeAnime.js`: normalize Jikan records.
- Create `AnimeTool/utils/request.js`: Promise wrapper around `uni.request`.
- Create `AnimeTool/api/anime.js`: Jikan API functions.
- Create `AnimeTool/stores/favorite.js`: Pinia favorite store with `uni.storage` persistence.
- Create `AnimeTool/components/AnimeCard/AnimeCard.vue`: reusable anime card.
- Create `AnimeTool/components/RatingBadge/RatingBadge.vue`: reusable score badge.
- Create `AnimeTool/components/EmptyState/EmptyState.vue`: reusable empty state.
- Create `AnimeTool/components/LoadingMore/LoadingMore.vue`: reusable load-more text.
- Modify `AnimeTool/pages/index/index.vue`: home swiper, list, refresh, load more.
- Create `AnimeTool/pages/detail/detail.vue`: detail request, favorite toggle, image preview.
- Create `AnimeTool/pages/search/search.vue`: keyword search and paginated results.
- Create `AnimeTool/pages/favorite/favorite.vue`: persisted favorite list.
- Create `AnimeTool/tests/normalizeAnime.test.mjs`: TDD coverage for normalization.

## Tasks

### Task 1: Logic Test And Data Normalization

- [ ] Write `AnimeTool/tests/normalizeAnime.test.mjs` with Node assertions for mapping `mal_id`, title fallback, large image fallback, missing score, and detail fields.
- [ ] Run `npm test` from `AnimeTool`; expected failure because `utils/normalizeAnime.js` does not exist.
- [ ] Create `AnimeTool/utils/normalizeAnime.js` with `normalizeAnime(record)`.
- [ ] Run `npm test`; expected pass.

### Task 2: Project Config And Pinia

- [ ] Create `AnimeTool/package.json` with `"type": "module"`, `"test": "node --test tests/*.test.mjs"`, and `pinia`.
- [ ] Modify `main.js` to create and use Pinia in Vue 3.
- [ ] Modify `pages.json` with four pages and three Chinese tabBar items.
- [ ] Run `npm test`; expected pass.

### Task 3: API And Store

- [ ] Create `utils/request.js` as a Promise wrapper around `uni.request`.
- [ ] Create `api/anime.js` with `getTopAnime`, `getAnimeDetail`, and `searchAnime`.
- [ ] Create `stores/favorite.js` with Pinia state/actions and `uni.storage` persistence.
- [ ] Run `npm test`; expected pass.

### Task 4: Reusable Components

- [ ] Create `RatingBadge`, `EmptyState`, `LoadingMore`, and `AnimeCard`.
- [ ] Use Chinese fallback text inside components.
- [ ] Run `npm test`; expected pass.

### Task 5: Pages

- [ ] Implement home page with swiper, list, pull-to-refresh, load-more, and detail navigation.
- [ ] Implement detail page with API detail, image preview, and favorite toggle.
- [ ] Implement search page with keyword search, empty states, and load more.
- [ ] Implement favorite page with persisted list and remove action.
- [ ] Run `npm test`; expected pass.

### Task 6: Verification

- [ ] Run `npm test` from `AnimeTool`.
- [ ] Run dependency installation if needed with `npm install`.
- [ ] If a build runner is available, run H5 build or preview.
- [ ] If no local build runner exists, report that HBuilderX preview is required for final visual verification.

## Self-Review

The plan covers the confirmed spec: Chinese UI, H5 target, Jikan API, swiper, navigation with id, Pinia persistence, preview image, refresh, load more, at least three pages, and reusable components. No placeholders remain.
