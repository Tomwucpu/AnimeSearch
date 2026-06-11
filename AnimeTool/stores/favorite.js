import { defineStore } from 'pinia'

const STORAGE_KEY = 'anime_tool_favorites'

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
