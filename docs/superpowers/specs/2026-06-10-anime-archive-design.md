# Anime Archive Design

## Project Goal

Build a UniApp Vue 3 H5 project named "影视番剧档案馆 · 我的追剧助手". The app shows popular or classic anime titles from the Jikan API, lets users view details, preview large images, rate visually through API scores, and maintain a persistent "收藏/想看" list.

The project should satisfy the course requirements:

- Use a swiper carousel.
- Use real network requests through the Jikan API.
- Use component props and events.
- Use `uni.previewImage` for large image preview.
- Include at least three pages.
- Persist user favorites with Pinia plus `uni.storage`.
- Include pull-to-refresh and load-more interactions.
- Extract at least two reusable custom components.
- Keep the project directory tidy and avoid duplicated page code.

## Target Platform

The primary target is H5 browser preview in HBuilderX. The design should use UniApp APIs where possible so it remains reasonably portable, but H5 debugging and assignment demonstration are the priority.

## Interface Language

All visible page text should be displayed in Chinese, including navigation titles, tabBar labels, buttons, loading text, empty states, error messages, and list status text. Code identifiers can remain English for readability, but user-facing text should not be English.

## Recommended Product Shape

Use a "番剧档案馆" structure:

- Home page for hot recommendations and paginated anime list.
- Search page for keyword-based anime discovery.
- Favorite page for persistent "想看" items.
- Detail page opened through `uni.navigateTo`, receiving the anime id through the URL.

This shape covers all required technical points without adding unnecessary tracking features such as episode progress or user-created lists.

## Pages

### `pages/index/index.vue`

The home page is the app entry.

Navigation title: "番剧档案馆".

Responsibilities:

- Fetch top anime from `https://api.jikan.moe/v4/top/anime`.
- Render a top swiper using the first several records from the first page.
- Render a list of anime cards below the swiper.
- Support pull-to-refresh by resetting the page number and fetching page 1 again.
- Support reach-bottom load more by requesting the next API page.
- Navigate to detail with `uni.navigateTo({ url: '/pages/detail/detail?id=' + id })`.

### `pages/detail/detail.vue`

The detail page shows one anime item.

Navigation title: "番剧详情".

Responsibilities:

- Read `id` from `onLoad(options)`.
- Fetch detail data from `https://api.jikan.moe/v4/anime/{id}`.
- Show cover image, title, score, type, episodes, status, year, and synopsis.
- Call `uni.previewImage` when the user taps the cover image.
- Show a "想看" / "已想看" action.
- Use the favorite store to add, remove, toggle, and check favorite state.

### `pages/search/search.vue`

The search page lets users find anime by keyword.

Navigation title: "搜索番剧".

Responsibilities:

- Accept a search keyword.
- Fetch results from `https://api.jikan.moe/v4/anime?q={keyword}&page={page}`.
- Render results with the same `AnimeCard` component used by the home page.
- Support loading more search results.
- Navigate to detail when a result is tapped.
- Show an empty state when no keyword or no result exists.

### `pages/favorite/favorite.vue`

The favorite page reads local persistent state.

Navigation title: "我的想看".

Responsibilities:

- Display favorite anime from the Pinia store.
- Let users remove an item from favorites.
- Navigate to detail from a favorite item.
- Show an empty state when the list is empty.

## Navigation

Use a three-item tabBar:

- 首页: `pages/index/index`
- 搜索: `pages/search/search`
- 想看: `pages/favorite/favorite`

The detail page is not part of the tabBar. It is opened by `uni.navigateTo` and receives an `id` query parameter.

## Components

### `components/AnimeCard/AnimeCard.vue`

Reusable anime list card.

Props:

- `anime`: normalized anime object.

Events:

- `click`: emitted when the card is tapped.

Display:

- Poster image.
- Title.
- Score.
- Type or episode count.

### `components/RatingBadge/RatingBadge.vue`

Small score display component.

Props:

- `score`: number or string.

Display:

- Show score when available.
- Show "暂无评分" when score is missing.

### `components/EmptyState/EmptyState.vue`

Reusable empty-state block.

Props:

- `text`: message to show.

### `components/LoadingMore/LoadingMore.vue`

Reusable load-more state.

Props:

- `status`: `more`, `loading`, or `noMore`.

Display:

- "上拉加载更多"
- "加载中..."
- "没有更多了"

## User-Facing Text

Use these Chinese labels consistently:

- App name: "影视番剧档案馆"
- Home title: "番剧档案馆"
- Search title: "搜索番剧"
- Favorite title: "我的想看"
- Detail title: "番剧详情"
- Favorite action: "想看"
- Favorited action: "已想看"
- Remove action: "取消想看"
- Empty favorite text: "还没有想看的番剧"
- Empty search text: "输入关键词搜索番剧"
- No result text: "没有找到相关番剧"
- Network error text: "网络请求失败，请稍后重试"

## Data Layer

Create a small API layer so pages do not repeat raw `uni.request` calls.

### `utils/request.js`

Wrap `uni.request` in a Promise-based helper.

Behavior:

- Prefix requests with the Jikan base URL.
- Resolve API response data.
- Reject network or non-2xx failures.
- Keep error messages friendly for page-level toast display.

### `api/anime.js`

Export anime request functions:

- `getTopAnime(page)`
- `getAnimeDetail(id)`
- `searchAnime(keyword, page)`

Pages should call these functions instead of calling `uni.request` directly.

## State And Persistence

Create `stores/favorite.js`.

Use Pinia for reactive state and `uni.storage` for persistence. This avoids dependency problems in HBuilderX while still satisfying the Pinia and persistence requirement.

Stored favorite item shape:

```js
{
  id,
  title,
  image,
  score,
  type,
  episodes
}
```

Store actions:

- `loadFavorites()`
- `saveFavorites()`
- `addFavorite(anime)`
- `removeFavorite(id)`
- `toggleFavorite(anime)`
- `isFavorite(id)`

Call `loadFavorites()` when the store is initialized or when the app starts.

## Data Normalization

Normalize Jikan API records before rendering or saving.

Common fields:

- `id`: `mal_id`
- `title`: `title` or `title_english`
- `image`: `images.jpg.large_image_url` or `images.jpg.image_url`
- `score`: `score`
- `type`: `type`
- `episodes`: `episodes`
- `synopsis`: `synopsis`
- `status`: `status`
- `year`: `year`

This keeps components independent from Jikan's nested response shape.

## Error Handling

Each network page should handle:

- Initial loading state.
- Empty result state.
- Request failure with `uni.showToast`.
- Load-more status transitions.

Jikan API can rate-limit requests, so pages should avoid duplicate concurrent load-more requests.

## Styling Direction

Use a clean media archive style:

- Dark text on a light background.
- Poster-heavy layout.
- Clear score badges.
- Compact cards for repeated list items.
- Avoid overdecorated landing-page sections.

The first screen should immediately show the swiper and anime content, not a marketing-style hero page.

## Implementation Order

1. Configure `pages.json` with pages, detail route, and tabBar.
2. Register Pinia in `main.js`.
3. Add `utils/request.js` and `api/anime.js`.
4. Add reusable components.
5. Build the home page with swiper, list, refresh, and load-more.
6. Build the detail page with id navigation, detail request, favorite toggle, and image preview.
7. Build the favorite page with persistent favorites.
8. Build the search page with keyword request and paginated results.
9. Polish loading, empty, and error states.
10. Run H5 preview verification in HBuilderX or with the available project runner.

## Acceptance Checklist

- Home page has a working swiper.
- Home page fetches real Jikan API data.
- Anime list shows image, title, and score.
- Pull-to-refresh resets and reloads the home list.
- Reach-bottom loads more items.
- Detail page opens through `uni.navigateTo` with an id parameter.
- Detail page fetches real API detail data.
- Detail image can be previewed with `uni.previewImage`.
- Favorite action persists after page refresh.
- Favorite page renders persisted items.
- At least two custom components are used with props.
- Project has at least three pages.
- Directory structure is clean and reusable code is separated.
