function trimTrailingZero(value) {
  return value.replace(/\.0$/, '')
}

export function formatRank(rank) {
  if (rank === null || rank === undefined || rank === '') {
    return ''
  }

  return `Ranking #${rank}`
}

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

export function getVisibleGenres(genres) {
  if (!Array.isArray(genres)) {
    return []
  }

  return genres.filter(Boolean).slice(0, 3)
}
