// 对接 Jikan v4 API（api.jikan.moe），所有数据经 normalize 后返回统一的应用数据模型
import { normalizeAnime, normalizeAnimeList } from '../utils/normalizeAnime.js'
import {
  normalizeCharacterList,
  normalizeRecommendationList
} from '../utils/normalizeAnimeExtras.js'
import { getGenreChinese } from '../utils/genreMap.js'
import { request } from '../utils/request.js'

/**
 * 获取热门番剧列表（按人气排序）
 * @param {number} page - 页码，默认第 1 页
 * @returns {{ list: Array, pagination: Object }}
 */
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

/**
 * 获取番剧详情（含简介、评分、分类等完整字段）
 * @param {number|string} id - MyAnimeList 番剧 ID
 * @returns {Object} 规范化后的番剧详情
 */
export async function getAnimeDetail(id) {
  const result = await request({
    url: `/anime/${id}`
  })

  return normalizeAnime(result.data || {})
}

/**
 * 获取番剧角色列表
 * @param {number|string} id - MyAnimeList 番剧 ID
 * @returns {Array} 规范化后的角色列表（最多 12 个）
 */
export async function getAnimeCharacters(id) {
  const result = await request({
    url: `/anime/${id}/characters`
  })

  // 角色数据量较大，取前 12 个以控制详情页渲染开销
  return normalizeCharacterList(result.data).slice(0, 12)
}

/**
 * 获取番剧相关推荐
 * @param {number|string} id - MyAnimeList 番剧 ID
 * @returns {Array} 规范化后的推荐列表（最多 8 个，复用 AnimeCard 数据接口）
 */
export async function getAnimeRecommendations(id) {
  const result = await request({
    url: `/anime/${id}/recommendations`
  })

  // 推荐数据量较大，取前 8 个以控制详情页渲染开销
  return normalizeRecommendationList(result.data).slice(0, 8)
}

/**
 * 获取当季新番列表
 * @param {number} page - 页码，默认第 1 页
 * @returns {{ list: Array, pagination: Object }}
 */
export async function getSeasonNow(page = 1) {
  const result = await request({
    url: '/seasons/now',
    data: { page }
  })

  return {
    list: normalizeAnimeList(result.data),
    pagination: result.pagination || {}
  }
}

/**
 * 获取每周放送表（按星期筛选）
 * @param {string} day - 星期英文名（monday ~ sunday）
 * @param {number} page - 页码，默认第 1 页
 * @returns {{ list: Array, pagination: Object }}
 */
export async function getSchedule(day, page = 1) {
  const result = await request({
    url: '/schedules',
    data: {
      filter: day,
      page
    }
  })

  return {
    list: normalizeAnimeList(result.data),
    pagination: result.pagination || {}
  }
}

/**
 * 获取动漫类型列表（含中文名映射）
 * @returns {Array<{ id: number, name: string, nameZh: string }>}
 */
export async function getGenres() {
  const result = await request({
    url: '/genres/anime'
  })

  const list = result.data || []
  return list.map((item) => ({
    id: item.mal_id,
    name: item.name,
    nameZh: getGenreChinese({ name: item.name })
  }))
}

const SEASON_DATES = {
  winter: ['01-01', '03-31'],
  spring: ['04-01', '06-30'],
  summer: ['07-01', '09-30'],
  fall: ['10-01', '12-31']
}

export async function filterAnime(filters, page = 1) {
  const data = { page }
  const { year, season, genres, orderBy, sort } = filters

  if (orderBy) {
    data.order_by = orderBy
    data.sort = sort || 'desc'
  }

  if (Array.isArray(genres) && genres.length) {
    data.genres = genres.join(',')
  }

  if (year && season && SEASON_DATES[season]) {
    const [start, end] = SEASON_DATES[season]
    data.start_date = `${year}-${start}`
    data.end_date = `${year}-${end}`
  } else if (year) {
    data.start_date = `${year}-01-01`
    data.end_date = `${year}-12-31`
  } else if (season && SEASON_DATES[season]) {
    const now = new Date()
    const y = now.getFullYear()
    const [start, end] = SEASON_DATES[season]
    data.start_date = `${y}-${start}`
    data.end_date = `${y}-${end}`
  }

  const result = await request({
    url: '/anime',
    data
  })

  return {
    list: normalizeAnimeList(result.data),
    pagination: result.pagination || {}
  }
}

/**
 * 搜索番剧（按关键词模糊匹配）
 * @param {string} keyword - 搜索关键词
 * @param {number} page - 页码，默认第 1 页
 * @returns {{ list: Array, pagination: Object }} 空关键词时返回空列表，避免无效请求
 */
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
