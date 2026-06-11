// 清理 MAL (MyAnimeList) 简介文本：移除 HTML 标签、MAL 元数据标记、解码 HTML 实体
function cleanSynopsis(text) {
  if (!text) {
    return ''
  }

  return text
    .replace(/\[Written by MAL Rewrite\]/gi, '')
    .replace(/\(Source:.*?\)/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#?\w+;/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ {2,}/g, ' ')
    .trim()
}

/**
 * 将 Jikan API 原始番剧数据规范化为应用统一数据模型
 * 字段映射：mal_id → id，images.jpg → image，genres[].name → genres[]
 */
export function normalizeAnime(record = {}) {
  const jpg = record.images?.jpg || {}

  return {
    id: record.mal_id,
    title: record.title || record.title_english || record.title_japanese || '未命名番剧',
    image: jpg.large_image_url || jpg.image_url || '',
    score: record.score ?? '暂无评分',
    type: record.type || '未知',
    episodes: record.episodes ?? '未知',
    rank: record.rank ?? '',
    members: record.members ?? '',
    genres: Array.isArray(record.genres)
      ? record.genres.map((item) => item.name).filter(Boolean)
      : [],
    synopsis: cleanSynopsis(record.synopsis),
    status: record.status || '',
    year: record.year || '',
    rating: record.rating || '',
    broadcast: record.broadcast ? {
      day: record.broadcast.day || '',
      time: record.broadcast.time || '',
      timezone: record.broadcast.timezone || '',
      string: record.broadcast.string || ''
    } : null
  }
}

/**
 * 批量规范化番剧列表，过滤非法输入
 */
export function normalizeAnimeList(list) {
  if (!Array.isArray(list)) {
    return []
  }

  return list.map((item) => normalizeAnime(item))
}
