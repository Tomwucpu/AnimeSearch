const GENRE_NAME_MAP = {
  Action: '动作',
  Adventure: '冒险',
  'Avant Garde': '先锋',
  'Award Winning': '获奖',
  Comedy: '喜剧',
  Drama: '剧情',
  Fantasy: '奇幻',
  Horror: '恐怖',
  Mystery: '悬疑',
  Romance: '恋爱',
  'Sci-Fi': '科幻',
  'Slice of Life': '日常',
  Sports: '运动',
  Supernatural: '超自然',
  Suspense: '悬疑',
  Ecchi: '擦边',
  Gourmet: '美食',
  Hentai: '成人',
  Erotica: '情色'
}

function formatGenreName(name) {
  return GENRE_NAME_MAP[name] || name
}

export function normalizeAnime(record = {}) {
  const jpg = record.images?.jpg || {}

  return {
    id: record.mal_id,
    title: record.title || record.title_english || record.title_japanese || '未命名番剧',
    image: jpg.large_image_url || jpg.image_url || '',
    score: record.score ?? '暂无评分',
    type: record.type || '未知',
    episodes: record.episodes ?? '未知',
    genres: Array.isArray(record.genres)
      ? record.genres.map((item) => formatGenreName(item.name)).filter(Boolean)
      : [],
    synopsis: record.synopsis || '',
    status: record.status || '',
    year: record.year || '',
    rating: record.rating || ''
  }
}

export function normalizeAnimeList(list) {
  if (!Array.isArray(list)) {
    return []
  }

  return list.map((item) => normalizeAnime(item))
}
