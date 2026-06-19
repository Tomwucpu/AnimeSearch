// Jikan 角色身份 → 中文映射
const ROLE_MAP = {
  Main: '主角',
  Supporting: '配角'
}

// 翻译角色身份（Main/Supporting → 主角/配角），未知值原样返回
function formatRole(role) {
  return ROLE_MAP[role] || role || '未知'
}

// 提取日语声优名，无日语声优时回退到第一位声优
function getVoiceActor(voiceActors) {
  if (!Array.isArray(voiceActors) || !voiceActors.length) return ''
  const ja = voiceActors.find((va) => va.language === 'Japanese')
  return ja ? ja.person.name : (voiceActors[0].person?.name || '')
}

/**
 * 将 Jikan 角色列表规范化为应用数据模型
 * 提取 character.images.jpg.image_url → image，翻译 role 字段，提取日语声优名
 */
export function normalizeCharacterList(list) {
  if (!Array.isArray(list)) {
    return []
  }

  return list.map((item) => {
    const character = item.character || {}
    const jpg = character.images?.jpg || {}

    return {
      id: character.mal_id,
      name: character.name || '未知角色',
      image: jpg.image_url || '',
      role: formatRole(item.role),
      voiceActor: getVoiceActor(item.voice_actors)
    }
  }).filter((item) => item.id)
}

/**
 * 将 Jikan 剧集列表规范化为应用数据模型
 * 提取 mal_id → number, title, 评分, 播出日期, filler/recap 标记
 */
export function normalizeEpisodeList(list) {
  if (!Array.isArray(list)) {
    return []
  }

  return list.map((item) => ({
    number: item.mal_id,
    title: item.title || `第 ${item.mal_id} 集`,
    titleJapanese: item.title_japanese || '',
    score: item.score ?? null,
    aired: item.aired ? item.aired.slice(0, 10) : '',
    filler: !!item.filler,
    recap: !!item.recap
  })).filter((item) => item.number)
}

/**
 * 将 Jikan 评测列表规范化为应用数据模型
 * 提取用户信息、评分、评测正文、标签等
 */
export function normalizeReviewList(list) {
  if (!Array.isArray(list)) {
    return []
  }

  return list.map((item) => {
    const user = item.user || {}
    const jpg = user.images?.jpg || {}

    return {
      id: item.mal_id,
      user: user.username || '匿名用户',
      userImage: jpg.image_url || '',
      score: item.score ?? null,
      tags: Array.isArray(item.tags) ? item.tags : [],
      review: item.review || '',
      date: item.date ? item.date.slice(0, 10) : '',
      isSpoiler: !!item.is_spoiler,
      isPreliminary: !!item.is_preliminary
    }
  }).filter((item) => item.id)
}

/**
 * 将 Jikan 推荐列表规范化为 AnimeCard 兼容数据模型
 * 推荐数据本无 episodes/type 等字段，用占位值填充以复用 AnimeCard 组件
 */
export function normalizeRecommendationList(list) {
  if (!Array.isArray(list)) {
    return []
  }

  return list.map((item) => {
    const entry = item.entry || {}
    const jpg = entry.images?.jpg || {}

    return {
      id: entry.mal_id,
      title: entry.title || '未命名番剧',
      image: jpg.large_image_url || jpg.image_url || '',
      score: `推荐 ${item.votes || 0}`,
      type: '推荐',
      episodes: '未知'
    }
  }).filter((item) => item.id)
}
