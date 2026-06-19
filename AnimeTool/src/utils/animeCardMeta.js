// 去除数字字符串末尾的 ".0"（e.g. "2.0" → "2"）
function trimTrailingZero(value) {
  return value.replace(/\.0$/, '')
}

/**
 * 格式化排名显示，空值返回空字符串避免误展示
 */
export function formatRank(rank) {
  if (rank === null || rank === undefined || rank === '') {
    return ''
  }

  return `Ranking #${rank}`
}

/**
 * 格式化用户数显示：≥1亿用"亿"，≥1万用"万"，否则直接四舍五入
 */
export function formatMembers(members) {
  const value = Number(members)

  if (!Number.isFinite(value) || value <= 0) {
    return ''
  }

  if (value >= 100000000) {
    return `用户 ${trimTrailingZero((value / 100000000).toFixed(1))}亿`
  }

  if (value >= 10000) {
    return `用户 ${trimTrailingZero((value / 10000).toFixed(1))}万`
  }

  return `用户 ${Math.round(value)}`
}

const STATUS_NAME_MAP = {
  'Currently Airing': '连载中',
  'Finished Airing': '已完结',
  'Not yet aired': '未开播'
}

/**
 * 格式化番剧播出状态为中文显示
 */
export function formatStatus(status) {
  if (!status) {
    return ''
  }

  return STATUS_NAME_MAP[status] || status
}

/**
 * 格式化放送时间为卡片展示文本
 */
export function formatBroadcast(broadcast) {
  if (!broadcast || !broadcast.time) {
    return ''
  }

  const tz = broadcast.timezone === 'Asia/Tokyo' ? 'JST' : (broadcast.timezone || '')
  return `放送 ${broadcast.time}${tz ? ` (${tz})` : ''}`
}

/**
 * 取前 3 个有效类型标签用于卡片紧凑展示
 */
export function getVisibleGenres(genres) {
  if (!Array.isArray(genres)) {
    return []
  }

  return genres.filter(Boolean).slice(0, 3)
}
