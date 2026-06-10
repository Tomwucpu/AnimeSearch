import { normalizeAnime, normalizeAnimeList } from '../utils/normalizeAnime.js'
import {
  normalizeCharacterList,
  normalizeRecommendationList
} from '../utils/normalizeAnimeExtras.js'
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

export async function getAnimeCharacters(id) {
  const result = await request({
    url: `/anime/${id}/characters`
  })

  return normalizeCharacterList(result.data).slice(0, 12)
}

export async function getAnimeRecommendations(id) {
  const result = await request({
    url: `/anime/${id}/recommendations`
  })

  return normalizeRecommendationList(result.data).slice(0, 8)
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
