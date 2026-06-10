const ROLE_MAP = {
  Main: '主角',
  Supporting: '配角'
}

function formatRole(role) {
  return ROLE_MAP[role] || role || '未知'
}

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
      role: formatRole(item.role)
    }
  }).filter((item) => item.id)
}

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
