# Anime Card Style Design

## Goal

Optimize the anime list card so users can understand each item at a glance. The selected direction is a media-style information card with selective visual emphasis: stronger poster presence, clearer score/rank/member hierarchy, and more explicit grouping for basic anime metadata.

## Scope

This design applies to the reusable `AnimeCard` component used by the home and favorite pages. It may also adjust the card metadata formatting helpers if labels need to become more readable. It does not change API requests, normalized data shape, favorite storage, navigation behavior, or page-level loading behavior.

## Current Context

The existing card already shows poster, title, score, rank, member count, type, episode count, status, and up to three genres. The main issue is hierarchy: several metadata items share the same visual weight, so users have to parse the card instead of scanning it.

## Chosen Approach

Use approach 1, "media information card", and absorb limited visual reinforcement from approach 2.

The card keeps a horizontal list layout:

- Left side: larger fixed-ratio poster with a restrained radius and subtle image shadow.
- Right side: structured content areas for title, key metrics, basic metadata, and genres.
- Key metrics: score is the primary signal, while rank and member count are secondary chips.
- Basic metadata: type, episodes, and status become a low-emphasis row with stable spacing.
- Genres: keep a maximum of three tags so long lists do not make the card unstable.

## Visual Rules

The style should feel more like a media browsing app than a dashboard. The card should use a white surface, a light border, restrained shadow, and compact spacing. Visual emphasis should come from hierarchy and placement instead of heavy decoration.

Specific styling expectations:

- The poster is slightly larger than the current version and remains fixed-size in `rpx`.
- The score badge is more prominent than rank and member count.
- Rank and member count use softer chips so they are easy to scan without competing with the title.
- The card radius should stay modest and close to the project's style requirements.
- Text must clamp safely and avoid overlap on mobile widths.
- The list should remain dense enough for browsing many anime entries.

## Component Structure

`AnimeCard` remains a presentational component. It receives an `anime` prop and emits `click`. The template should be reorganized into clear sections:

- `poster-wrap` or equivalent for image presentation.
- `content` for all textual information.
- `title` for the anime title.
- `metrics-row` for score, rank, and members.
- `detail-row` for type, episodes, and status.
- `genre-list` for genre tags.

No new global state, dependencies, or page-level responsibilities are needed.

## Data And Formatting

Existing helpers in `utils/animeCardMeta.js` should continue to own card-specific formatting. If needed, labels can be adjusted so the card reads naturally in Chinese. Empty rank, member count, or genre values should continue to be hidden rather than rendered as blank placeholders.

Fallback text should remain user-facing and clear when title, type, episodes, score, or image are missing.

## Error Handling

This change does not introduce new network or runtime error paths. Missing optional metadata should degrade gracefully:

- Missing poster uses the existing logo fallback.
- Missing score shows the existing no-score fallback.
- Missing rank or member count is omitted.
- Missing genres hides the genre section.

## Testing And Verification

Verification should cover:

- Existing unit tests still pass with `npm test`.
- `AnimeCard.vue` remains valid Vue/uni-app single-file component syntax.
- The card renders correctly in both home and favorite list contexts.
- Long titles clamp without overlapping metrics or tags.
- Optional metadata can be absent without leaving awkward gaps.

## Non-Goals

This work will not add new card actions, change the favorite button, change the banner, introduce a grid layout, add new dependencies, or redesign the detail page.
