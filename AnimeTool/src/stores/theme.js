// 主题 Pinia store — 支持亮色/暗色/跟随系统三种模式，持久化用户偏好至 uni.storage
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'anime_tool_theme'

/** 用户可选的主题模式 */
export const THEME_MODES = {
  light: '亮色',
  dark: '暗色',
  system: '跟随系统'
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    /** @type {'light'|'dark'|'system'} 用户选择的模式 */
    mode: 'system',
    /** @type {'light'|'dark'} 系统当前主题（运行时，不持久化） */
    systemTheme: 'dark'
  }),

  getters: {
    /** 最终生效的主题 */
    resolvedTheme(state) {
      if (state.mode === 'system') return state.systemTheme
      return state.mode
    },

    /** 是否为暗色主题 */
    isDark(state) {
      const resolved = state.mode === 'system' ? state.systemTheme : state.mode
      return resolved === 'dark'
    },

    /** 页面根元素的 class 对象，供各页面 v-bind 使用 */
    pageClass(state) {
      const resolved = state.mode === 'system' ? state.systemTheme : state.mode
      return { 'theme-light': resolved === 'light' }
    }
  },

  actions: {
    /**
     * 设置用户偏好模式
     * @param {'light'|'dark'|'system'} mode
     */
    setMode(mode) {
      if (!THEME_MODES[mode]) return
      this.mode = mode
      this._updateNavBar()
    },

    /**
     * 更新系统主题（由 onThemeChange 回调调用）
     * @param {'light'|'dark'} theme
     */
    updateSystemTheme(theme) {
      this.systemTheme = theme === 'light' ? 'light' : 'dark'
      if (this.mode === 'system') {
        this._updateNavBar()
      }
    },

    /** 更新当前页面导航栏颜色 */
    _updateNavBar() {
      const isDark = this.isDark
      uni.setNavigationBarColor({
        frontColor: isDark ? '#ffffff' : '#000000',
        backgroundColor: isDark ? '#121419' : '#FFFFFF',
        animation: { duration: 200, timingFunc: 'easeIn' }
      })
      // 同步更新 tabBar 颜色（自定义 tabBar 通过 CSS 变量自动响应，此处仅处理系统原生场景）
    },

    /** 初始化主题（App onLaunch 时调用） */
    initTheme() {
      try {
        const info = uni.getSystemInfoSync()
        this.systemTheme = info.theme === 'light' ? 'light' : 'dark'
      } catch {
        this.systemTheme = 'dark'
      }
      this._updateNavBar()
    }
  },

  persist: {
    key: STORAGE_KEY,
    pick: ['mode'],
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
