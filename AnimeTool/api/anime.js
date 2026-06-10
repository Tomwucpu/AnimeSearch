import { normalizeAnime, normalizeAnimeList } from '../utils/normalizeAnime.js'
import { request } from '../utils/request.js'

export async function getTopAnime(page = 1) {
  const result = await request({
    url: '/top/anime',
    data: {
      page,
      filter: 'bypopularity'
    }
  })

  return {
    list: normalizeAnimeList(result.data),
    pagination: result.pagination || {}
  }
}

export async function getAnimeDetail(id) {
  const result = await request({
    url: `/anime/${id}`
  })

  return normalizeAnime(result.data || {})
}

export async function searchAnime(keyword, page = 1) {
  const value = String(keyword || '').trim()

  if (!value) {
    return {
      list: [],
      pagination: {}
    }
  }

  const result = await request({
    url: '/anime',
    data: {
      q: value,
      page
    }
  })

  return {
    list: normalizeAnimeList(result.data),
    pagination: result.pagination || {}
  }
}
