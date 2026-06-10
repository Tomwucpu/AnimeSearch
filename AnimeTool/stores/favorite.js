import { defineStore } from 'pinia'

const STORAGE_KEY = 'anime_tool_favorites'

function toFavoriteItem(anime) {
  return {
    id: anime.id,
    title: anime.title,
    image: anime.image,
    score: anime.score,
    type: anime.type,
    episodes: anime.episodes
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
    loadFavorites() {
      try {
        const saved = uni.getStorageSync(STORAGE_KEY)
        this.favorites = Array.isArray(saved) ? saved : []
      } catch (error) {
        this.favorites = []
      }
    },

    saveFavorites() {
      uni.setStorageSync(STORAGE_KEY, this.favorites)
    },

    isFavorite(id) {
      return this.favorites.some((item) => String(item.id) === String(id))
    },

    addFavorite(anime) {
      if (!anime?.id || this.isFavorite(anime.id)) {
        return
      }

      this.favorites.unshift(toFavoriteItem(anime))
      this.saveFavorites()
    },

    removeFavorite(id) {
      this.favorites = this.favorites.filter((item) => String(item.id) !== String(id))
      this.saveFavorites()
    },

    toggleFavorite(anime) {
      if (this.isFavorite(anime.id)) {
        this.removeFavorite(anime.id)
        return false
      }

      this.addFavorite(anime)
      return true
    }
  }
})
