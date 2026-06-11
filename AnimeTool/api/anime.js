// 对接 Jikan v4 API（api.jikan.moe），所有数据经 normalize 后返回统一的应用数据模型
import { normalizeAnime, normalizeAnimeList } from '../utils/normalizeAnime.js'
import {
  normalizeCharacterList,
  normalizeRecommendationList
} from '../utils/normalizeAnimeExtras.js'
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
