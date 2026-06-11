import { defineStore } from 'pinia'

// 收藏夹持久化 key，保持不变以兼容旧数据
const STORAGE_KEY = 'anime_tool_favorites'

/**
 * 从番剧完整数据中提取收藏所需的关键字段，剔除 synopsis 等冗余信息以节省存储空间
 */
export function toFavoriteItem(anime) {
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
    status: anime.status
  }
}

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: []
  }),

  getters: {
    count: (state) => state.favorites.length
  },

  actions: {
    isFavorite(id) {
      return this.favorites.some((item) => String(item.id) === String(id))
    },

    addFavorite(anime) {
      if (!anime?.id || this.isFavorite(anime.id)) {
        return
      }

      this.favorites.unshift(toFavoriteItem(anime))
    },

    removeFavorite(id) {
      this.favorites = this.favorites.filter((item) => String(item.id) !== String(id))
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
    // 自定义 storage 适配 uni.storage，同时兼容旧版直接存对象的数据格式
    storage: {
      getItem(key) {
        const value = uni.getStorageSync(key)
        if (typeof value === 'string') return value
        if (value == null) return null
        // 迁移旧数据：旧版 uni.setStorageSync 直接存对象，需转为 JSON 字符串供插件反序列化
        return JSON.stringify(value)
      },
      setItem(key, value) {
        uni.setStorageSync(key, value)
      }
    }
  }
})
