// 选番夹 Pinia store — 持久化选番数据至 uni.storage，提供增删查切操作，支持在看/想看/看过分类
import { defineStore } from 'pinia'

const STORAGE_KEY = 'anime_tool_favorites'

export const WATCH_CATEGORIES = {
  watching: '在看',
  want_to_watch: '想看',
  watched: '看过'
}

export const CATEGORY_COLORS = {
  watching: { bg: 'rgba(52, 199, 89, 0.75)', text: '#ffffff' },
  want_to_watch: { bg: 'rgba(73, 118, 208, 0.75)', text: '#ffffff' },
  watched: { bg: 'rgba(175, 82, 222, 0.75)', text: '#ffffff' }
}

export const DEFAULT_CATEGORY = 'want_to_watch'

/**
 * 从番剧完整数据中提取追番所需的关键字段，剔除 synopsis 等冗余信息以节省存储空间
 * @param {Object} anime - normalizeAnime 输出的番剧对象
 * @param {string} category - 追番分类，默认 DEFAULT_CATEGORY
 * @returns {Object} 精简后的追番条目
 */
export function toFavoriteItem(anime, category = DEFAULT_CATEGORY) {
  return {
    id: anime.id,
    title: anime.title,
    image: anime.image,
    score: anime.score,
    type: anime.type,
    episodes: anime.episodes,
    rank: anime.rank,
    members: anime.members,
    genres: anime.genres,
    status: anime.status,
    category
  }
}

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: []
  }),

  getters: {
    count: (state) => state.favorites.length,

    /**
     * 按分类筛选追番列表，不传 category 或传 null 返回全部
     * @returns {(category: string|null) => Array} 筛选后的追番条目
     */
    byCategory: (state) => (category) => {
      if (!category) return state.favorites
      return state.favorites.filter((f) => f.category === category)
    }
  },

  actions: {
    isFavorite(id) {
      return this.favorites.some((item) => String(item.id) === String(id))
    },

    /**
     * 获取指定番剧的当前分类，未收藏返回 null
     * @param {number|string} id
     * @returns {string|null}
     */
    getCategory(id) {
      const item = this.favorites.find((item) => String(item.id) === String(id))
      return item ? item.category : null
    },

    addFavorite(anime, category = DEFAULT_CATEGORY) {
      if (!anime?.id || this.isFavorite(anime.id)) {
        return
      }

      this.favorites.unshift(toFavoriteItem(anime, category))
    },

    removeFavorite(id) {
      this.favorites = this.favorites.filter((item) => String(item.id) !== String(id))
    },

    /**
     * 修改已收藏番剧的分类
     * @param {number|string} id
     * @param {string} category - WATCH_CATEGORIES 中的 key
     */
    setCategory(id, category) {
      const item = this.favorites.find((item) => String(item.id) === String(id))
      if (item) {
        item.category = category
      }
    },

    toggleFavorite(anime) {
      if (this.isFavorite(anime.id)) {
        this.removeFavorite(anime.id)
        return false
      }

      this.addFavorite(anime)
      return true
    }
  },

  persist: {
    key: STORAGE_KEY,
    storage: {
      getItem(key) {
        const value = uni.getStorageSync(key)
        if (typeof value === 'string') return value
        if (value == null) return null
        return JSON.stringify(value)
      },
      setItem(key, value) {
        uni.setStorageSync(key, value)
      }
    }
  }
})
