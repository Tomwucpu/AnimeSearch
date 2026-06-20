<template>
  <view class="page" :class="pageClass">
    <view class="fade-curtain" :class="{ hide: curtainHide }" />
    <view v-if="anime" class="detail">
      <view class="header-card">
        <!-- #ifdef MP -->
        <button class="share-btn header-action" open-type="share">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
        </button>
        <!-- #endif -->
        <!-- #ifndef MP -->
        <view class="share-btn header-action" @tap.stop="handleShare">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
        </view>
        <!-- #endif -->
        <text class="title">{{ anime.title }}</text>

        <view class="header-top">
          <image class="poster" :src="anime.image || '/static/logo.png'" mode="aspectFill" lazy-load @tap="previewImage" />
          <view class="header-info">
            <view class="info-block">
              <text class="info-label">放送开始</text>
              <text class="info-value">{{ broadcastText }}</text>
            </view>

            <view class="info-block">
              <text class="info-label">评分</text>
              <view class="score-row">
                <text class="score-number">{{ anime.score }}</text>
                <StarRating :score="anime.score" />
              </view>
            </view>

            <view class="info-block">
              <text class="info-label">状态</text>
              <text class="info-value">{{ statusText }}</text>
            </view>

            <button class="favorite-button" :style="favoriteButtonStyle" @tap="handleFavoriteTap">
              <template v-if="favoriteCategory">
                <view class="favorite-btn-icon">
                  <svg v-if="favoriteCategory === 'watching'" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z" />
                  </svg>
                  <svg v-else-if="favoriteCategory === 'want_to_watch'" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path fill="currentColor" d="M17.562 21.56a1 1 0 0 1-.465-.116L12 18.764l-5.097 2.68a1 1 0 0 1-1.45-1.053l.973-5.676l-4.124-4.02a1 1 0 0 1 .554-1.705l5.699-.828l2.549-5.164a1.04 1.04 0 0 1 1.793 0l2.548 5.164l5.699.828a1 1 0 0 1 .554 1.705l-4.124 4.02l.974 5.676a1 1 0 0 1-.985 1.169Z" />
                  </svg>
                  <svg v-else-if="favoriteCategory === 'watched'" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16">
                    <path d="M0 0h16v16H0z" fill="none" />
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                      <path d="m14.25 8.75c-.5 2.5-2.3849 4.85363-5.03069 5.37991-2.64578.5263-5.33066-.7044-6.65903-3.0523-1.32837-2.34784-1.00043-5.28307.81336-7.27989 1.81379-1.99683 4.87636-2.54771 7.37636-1.54771" />
                      <polyline points="5.75 7.75 8.25 10.25 14.25 3.75" />
                    </g>
                  </svg>
                </view>
                <text class="favorite-btn-text">{{ categoryLabel }}</text>
              </template>
              <text v-else class="favorite-btn-text">加入追番</text>
            </button>
          </view>
        </view>
      </view>

      <view class="tab-bar">
        <view class="tab-list">
          <view
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-item"
            :class="{ active: currentTab === tab.key }"
            @tap="currentTab = tab.key"
          >
            <text class="tab-text">{{ tab.label }}</text>
            <view v-if="currentTab === tab.key" class="tab-indicator" />
          </view>
        </view>
      </view>

      <view class="tab-content-panel">
        <view class="tab-content">
          <view v-show="currentTab === 'overview'">
            <view v-if="anime.genres && anime.genres.length" class="section">
              <text class="section-title">分类</text>
              <view class="genre-box">
                <text v-for="genre in anime.genres" :key="genre" class="genre-tag">{{ genre }}</text>
              </view>
            </view>

            <view class="section">
              <text class="section-title">简介</text>
              <view class="intro-box">
                <text class="intro-text">{{ anime.synopsis || '暂无简介' }}</text>
              </view>
            </view>
          </view>

          <view v-show="currentTab === 'characters'">
            <view v-if="characters.length" class="section">
              <text class="section-title">角色列表</text>
              <view class="character-list">
                <view v-for="item in characters" :key="item.id" class="character-item">
                  <image class="character-avatar" :src="item.image || '/static/logo.png'" mode="aspectFill" lazy-load />
                  <view class="character-info">
                    <view class="character-left">
                      <text class="character-name">{{ item.name }}</text>
                      <text v-if="item.voiceActor" class="character-voice-actor">CV: {{ item.voiceActor }}</text>
                    </view>
                    <text class="character-role">{{ item.role }}</text>
                  </view>
                </view>
              </view>
            </view>
            <EmptyState v-else text="暂无角色信息" />
          </view>

          <view v-show="currentTab === 'studios'">
            <view class="section">
              <text class="section-title">动画工作室</text>
              <view v-if="anime.studios && anime.studios.length" class="studio-box">
                <text v-for="studio in anime.studios" :key="studio" class="studio-tag">{{ studio }}</text>
              </view>
              <EmptyState v-else text="暂无工作室信息" />
            </view>
          </view>

          <view v-show="currentTab === 'recommendations'">
            <view v-if="recommendations.length" class="section">
              <text class="section-title">相关推荐</text>
              <view class="recommend-list">
                <AnimeCard
                  v-for="item in recommendations"
                  :key="item.id"
                  :anime="item"
                  @click="goDetail(item.id)"
                />
              </view>
            </view>
            <EmptyState v-else text="暂无相关推荐" />
          </view>

          <view v-show="currentTab === 'episodes'" class="section">
            <view v-if="favoriteCategory && anime.episodes !== '未知'" class="progress-header">
              <view class="progress-info">
                <text class="progress-label">观看进度</text>
                <text class="progress-text">{{ episodeProgress }} / {{ anime.episodes }} 集</text>
              </view>
              <view class="progress-bar-bg">
                <view class="progress-bar-fill" :style="{ width: progressPercent + '%' }" />
              </view>
              <view class="progress-actions">
                <view class="progress-btn" @tap="adjustProgress(-1)">−</view>
                <view class="progress-btn" @tap="adjustProgress(1)">+</view>
              </view>
            </view>

            <view v-if="episodesLoading" class="episode-loading">
              <text class="loading-text">加载中...</text>
            </view>

            <view v-else-if="episodes.length">
              <view
                v-for="ep in episodes"
                :key="ep.number"
                class="episode-item"
                :class="{ 'episode-watched': favoriteCategory && ep.number <= episodeProgress, 'episode-filler': ep.filler, 'episode-recap': ep.recap }"
                @tap="toggleEpisode(ep.number)"
              >
                <view class="episode-left">
                  <view class="episode-number-wrap">
                    <text class="episode-number">#{{ String(ep.number).padStart(2, '0') }}</text>
                    <text v-if="ep.filler" class="episode-badge filler-badge">原创</text>
                    <text v-else-if="ep.recap" class="episode-badge recap-badge">总集</text>
                  </view>
                  <view class="episode-title-wrap">
                    <text class="episode-title">{{ ep.title }}</text>
                    <text v-if="ep.aired" class="episode-aired">{{ ep.aired }}</text>
                  </view>
                </view>
                <view class="episode-right">
                  <text v-if="ep.score" class="episode-score">★{{ ep.score }}</text>
                  <view v-if="favoriteCategory" class="episode-check">
                    <view :class="{ 'check-on': ep.number <= episodeProgress, 'check-off': ep.number > episodeProgress }" />
                  </view>
                </view>
              </view>
              <view
                v-if="episodePagination?.has_next_page"
                class="episode-load-more"
                @tap="loadEpisodes(currentId, episodePage + 1)"
              >
                <text class="load-more-text">加载更多</text>
              </view>
            </view>

            <EmptyState v-else text="暂无剧集信息" />
          </view>

          <view v-show="currentTab === 'reviews'" class="section">
            <text class="section-title">用户评测</text>

            <view v-if="reviewsLoading" class="episode-loading">
              <text class="loading-text">加载中...</text>
            </view>

            <view v-else-if="reviews.length" class="review-list">
              <view v-for="item in reviews" :key="item.id" class="review-item">
                <view class="review-header">
                  <image v-if="item.userImage" class="review-avatar" :src="item.userImage" mode="aspectFill" lazy-load />
                  <view v-else class="review-avatar review-avatar-placeholder" />
                  <view class="review-meta">
                    <text class="review-user">{{ item.user }}</text>
                    <text class="review-date">{{ item.date }}</text>
                  </view>
                  <view v-if="item.score != null" class="review-score-badge">
                    <text class="review-score-text">{{ item.score }}</text>
                  </view>
                </view>
                <view v-if="item.tags.length" class="review-tags">
                  <text v-for="tag in item.tags" :key="tag" class="review-tag">{{ tag }}</text>
                </view>
                <text v-if="item.isSpoiler" class="review-spoiler-hint">⚠ 以下评测可能含有剧透</text>
                <text class="review-body">{{ item.review }}</text>
              </view>
            </view>

            <EmptyState v-else text="暂无评测信息" />
          </view>

          <view class="tab-bottom-spacer" />
        </view>
      </view>
      <CategoryPicker
        :visible="pickerVisible"
        :current-category="favoriteCategory"
        @close="pickerVisible = false"
        @select="handleCategorySelect"
        @remove="handleRemoveFavorite"
      />
      <BackToTop :visible="backTopVisible" @click="scrollToTop" />
    </view>

    <EmptyState v-else-if="!loading" text="没有找到番剧详情" />
  </view>
</template>

<script setup>
// 番剧详情页：封面、元信息、四标签页点击切换（概览/角色/工作室/推荐）、收藏切换
import { computed, ref, watch } from 'vue'
import { onLoad, onPageScroll, onPullDownRefresh } from '@dcloudio/uni-app'

import EmptyState from '../components/EmptyState.vue'
import StarRating from '../components/detail/StarRating.vue'
import CategoryPicker from '../components/detail/CategoryPicker.vue'
import AnimeCard from '../components/AnimeCard.vue'
import BackToTop from '../components/BackToTop.vue'
import {
  getAnimeCharacters,
  getAnimeEpisodes,
  getAnimeFull,
  getAnimeRecommendations,
  getAnimeReviews
} from '../api/anime.js'
import { useFavoriteStore, WATCH_CATEGORIES, getCategoryColors } from '../stores/favorite.js'
import { formatStatus } from '../utils/animeCardMeta.js'
import { useBackToTop } from '../composables/useBackToTop.js'
import { useNavigation } from '../composables/useNavigation.js'
import { useFadeIn } from '../composables/useFadeIn.js'
import { useTheme } from '../composables/useTheme.js'

const { goDetail } = useNavigation()
const { curtainHide } = useFadeIn()
const { pageClass, themeStore } = useTheme()
const { backTopVisible, scrollToTop } = useBackToTop()

const anime = ref(null)
const characters = ref([])
const recommendations = ref([])
const loading = ref(false)
const currentId = ref(null)
const favoriteStore = useFavoriteStore()

const currentTab = ref('overview')

const episodes = ref([])
const episodePagination = ref(null)
const episodePage = ref(1)
const episodesLoading = ref(false)

const reviews = ref([])
const reviewsLoading = ref(false)

const tabs = [
  { key: 'overview', label: '概览' },
  { key: 'episodes', label: '剧集' },
  { key: 'characters', label: '角色' },
  { key: 'studios', label: '工作室' },
  { key: 'recommendations', label: '推荐' },
  { key: 'reviews', label: '评测' }
]

const favoriteCategory = computed(() => {
  return anime.value ? favoriteStore.getCategory(anime.value.id) : null
})

const pickerVisible = ref(false)

const categoryLabel = computed(() => {
  return favoriteCategory.value ? WATCH_CATEGORIES[favoriteCategory.value] : ''
})

const favoriteButtonStyle = computed(() => {
  if (!favoriteCategory.value) return {}
  const colors = getCategoryColors(themeStore.isDark)[favoriteCategory.value]
  return colors ? { background: colors.bg } : {}
})

const broadcastText = computed(() => {
  const from = anime.value?.airedFrom
  if (!from) return '暂无信息'
  return from.slice(0, 10)
})

const statusText = computed(() => {
  return anime.value?.status ? formatStatus(anime.value.status) : '未知'
})

const episodeProgress = computed(() => {
  if (!anime.value) return 0
  const item = favoriteStore.favorites.find((f) => String(f.id) === String(anime.value.id))
  return item ? (item.progress ?? 0) : 0
})

const progressPercent = computed(() => {
  const total = Number(anime.value?.episodes)
  if (!total || total === 0) return 0
  return Math.min((episodeProgress.value / total) * 100, 100)
})

/**
 * 加载番剧剧集（懒加载，切换到剧集 tab 时触发）
 * @param {number|string} id
 * @param {number} page - 页码，默认第 1 页
 */
async function loadEpisodes(id, page = 1) {
  if (episodesLoading.value) return

  episodesLoading.value = true
  try {
    const result = await getAnimeEpisodes(id, page)
    if (page === 1) {
      episodes.value = result.list
    } else {
      episodes.value = episodes.value.concat(result.list)
    }
    episodePagination.value = result.pagination
    episodePage.value = page
  } catch (error) {
    uni.showToast({ title: '剧集加载失败', icon: 'none' })
  } finally {
    episodesLoading.value = false
  }
}

/**
 * 加载番剧评测（懒加载，切换到评测 tab 时触发）
 * @param {number|string} id
 */
async function loadReviews(id) {
  if (reviewsLoading.value) return

  reviewsLoading.value = true
  try {
    reviews.value = await getAnimeReviews(id)
  } catch (error) {
    uni.showToast({ title: '评测加载失败', icon: 'none' })
  } finally {
    reviewsLoading.value = false
  }
}

/**
 * 调整追番进度（±N 集）
 * @param {number} delta - 变化量（1 或 -1）
 */
function adjustProgress(delta) {
  if (!anime.value || !favoriteCategory.value) return

  const current = episodeProgress.value
  const total = Number(anime.value.episodes) || Infinity
  const next = current + delta
  const clamped = Math.max(0, Math.min(next, total))
  favoriteStore.updateProgress(anime.value.id, clamped)
}

/**
 * 点击单集切换已看/未看状态
 * 如果点击的集数等于当前进度 + 1，则前进；如果小于等于当前进度，则回退到该集 - 1
 * @param {number} number - 点击的集号
 */
function toggleEpisode(number) {
  if (!anime.value || !favoriteCategory.value) return

  const current = episodeProgress.value
  if (number === current + 1) {
    favoriteStore.updateProgress(anime.value.id, current + 1)
  } else if (number <= current) {
    favoriteStore.updateProgress(anime.value.id, number - 1)
  }
}

/**
 * 加载番剧完整详情，触发后立即返回（不阻塞渲染）
 * @param {number|string} id - MyAnimeList 番剧 ID
 */
async function loadDetail(id) {
  loading.value = true
  characters.value = []
  recommendations.value = []

  try {
    anime.value = await getAnimeFull(id)
    loadDetailExtras(id)
  } catch (error) {
    uni.showToast({
      title: error.message || '网络请求失败，请稍后重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

/**
 * 并行加载角色和推荐数据，各自独立 try/catch 互不影响
 * @param {number|string} id - MyAnimeList 番剧 ID
 */
async function loadDetailExtras(id) {
  try {
    characters.value = await getAnimeCharacters(id)
  } catch (error) {
    characters.value = []
  }

  try {
    recommendations.value = await getAnimeRecommendations(id)
  } catch (error) {
    recommendations.value = []
  }
}

/**
 * 跨端分享番剧信息
 * App 端调用系统分享面板，H5 端使用 Web Share API（不支持时降级为复制链接）
 */
// #ifdef APP-PLUS
function handleShare() {
  if (!anime.value) return

  const url = `https://myanimelist.net/anime/${anime.value.id}`
  uni.shareWithSystem({
    type: 'text',
    summary: `${anime.value.title} — ${url}`,
    href: url,
    success() {
      uni.showToast({ title: '分享成功', icon: 'success' })
    },
    fail() {
      uni.showToast({ title: '分享失败', icon: 'error' })
    }
  })
}
// #endif

// #ifdef H5
function handleShare() {
  if (!anime.value) return

  const url = `https://myanimelist.net/anime/${anime.value.id}`
  if (navigator.share) {
    navigator.share({ title: anime.value.title, url })
      .then(() => uni.showToast({ title: '分享成功', icon: 'success' }))
      .catch(() => {})
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
      .then(() => uni.showToast({ title: '链接已复制', icon: 'success' }))
      .catch(() => uni.showToast({ title: '复制失败', icon: 'error' }))
  }
}
// #endif

// #ifdef MP
import { onShareAppMessage } from '@dcloudio/uni-app'

onShareAppMessage(() => {
  if (!anime.value) return {}
  return {
    title: anime.value.title,
    path: `/pages/detail?id=${anime.value.id}`
  }
})
// #endif

/**
 * 封面大图预览
 */
function previewImage() {
  if (!anime.value?.image) {
    return
  }

  uni.previewImage({
    current: anime.value.image,
    urls: [anime.value.image]
  })
}

/**
 * 切换收藏状态并反馈 toast
 */
function handleFavoriteTap() {
  if (!anime.value) return
  pickerVisible.value = true
}

function handleCategorySelect(category) {
  if (!anime.value) return

  if (favoriteStore.isFavorite(anime.value.id)) {
    favoriteStore.setCategory(anime.value.id, category)
  } else {
    favoriteStore.addFavorite(anime.value, category)
  }

  pickerVisible.value = false

  uni.showToast({ title: '已加入' + WATCH_CATEGORIES[category], icon: 'none' })
}

function handleRemoveFavorite() {
  if (!anime.value) return

  favoriteStore.removeFavorite(anime.value.id)
  pickerVisible.value = false
  uni.showToast({ title: '已取消追番', icon: 'none' })
}

onLoad((options) => {
  currentId.value = options.id
  loadDetail(currentId.value)
})

onPullDownRefresh(() => {
  if (currentId.value) {
    loadDetail(currentId.value)
  }
  uni.stopPullDownRefresh()
})

watch(currentTab, (tab) => {
  if (tab === 'episodes' && currentId.value && !episodes.value.length) {
    loadEpisodes(currentId.value)
  }
  if (tab === 'reviews' && currentId.value && !reviews.value.length) {
    loadReviews(currentId.value)
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg-page);
}

.fade-curtain {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
  background: var(--bg-page);
  opacity: 1;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.fade-curtain.hide {
  opacity: 0;
}

.detail {
  display: flex;
  flex-direction: column;
}

.header-card {
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin: 24rpx 32rpx 0;
  padding: 28rpx;
  background: var(--bg-card);
  border-radius: 16rpx;
  border: 2rpx solid var(--border-color);
}

.header-top {
  display: flex;
  gap: 24rpx;
}

.poster {
  flex-shrink: 0;
  width: 260rpx;
  height: 370rpx;
  border-radius: 14rpx;
  background: var(--bg-secondary);
  overflow: hidden;
}

.header-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.title {
  color: var(--text-primary);
  font-size: 36rpx;
  font-weight: 800;
  line-height: 48rpx;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-label {
  color: var(--text-muted);
  font-size: 24rpx;
}

.info-value {
  color: var(--text-primary);
  font-size: 30rpx;
  line-height: 36rpx;
}

.score-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.score-number {
  color: var(--text-primary);
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1;
}

.share-btn {
  position: absolute;
  top: 28rpx;
  right: 28rpx;
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--border-color);
  color: var(--text-muted);
  z-index: 1;
  transition: transform 0.15s ease;
}

.share-btn:active {
  background: var(--active-bg);
  transform: scale(0.92);
}

button.share-btn {
  padding: 0;
}

button.share-btn::after {
  border: 0;
}

.favorite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 76rpx;
  width: 100%;
  margin-top: auto;
  border-radius: 38rpx;
  background: var(--accent-primary);
  color: var(--text-white);
  font-size: 26rpx;
  font-weight: 700;
  line-height: 1;
  transition: transform 0.15s ease;
}

.favorite-button:active {
  transform: scale(0.96);
  background: var(--accent-deep);
}

.favorite-button::after {
  border: 0;
}

.favorite-btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.favorite-btn-text {
  line-height: 1;
}

.tab-bar {
  flex-shrink: 0;
  background: var(--bg-page);
  padding: 8rpx 0;
  margin-top: 24rpx;
}

.tab-list {
  display: flex;
  justify-content: center;
  padding: 0 20rpx;
  position: relative;
}

.tab-item {
  position: relative;
  padding: 16rpx 28rpx;
  flex-shrink: 0;
}

.tab-text {
  font-size: 28rpx;
  color: var(--text-muted);
  transition: color 0.25s ease, font-weight 0.25s ease;
}

.tab-item.active .tab-text {
  color: var(--text-primary);
  font-weight: 700;
}

.tab-indicator {
  position: absolute;
  bottom: 6rpx;
  left: 50%;
  transform: translateX(-50%) scale(1);
  width: 40rpx;
  height: 4rpx;
  background: var(--accent-lighter);
  border-radius: 2rpx;
  transition: transform 0.25s ease, width 0.25s ease;
}

.tab-content-panel {
}

.tab-content {
  padding: 0 32rpx;
}

.tab-bottom-spacer {
  height: 60rpx;
}

.section {
  margin-top: 48rpx;
}

.section-title {
  display: block;
  color: var(--text-primary);
  font-size: 32rpx;
  font-weight: 800;
  margin-bottom: 24rpx;
  position: relative;
  padding-left: 20rpx;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 28rpx;
  background: var(--accent-lighter);
  border-radius: 3rpx;
}

.genre-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  background: var(--bg-secondary);
  padding: 32rpx;
  border-radius: 16rpx;
  border: 2rpx solid var(--border-color);
}

.genre-tag {
  height: 46rpx;
  padding: 0 18rpx;
  border-radius: 10rpx;
  background: var(--border-color);
  color: var(--accent-lightest);
  font-size: 22rpx;
  line-height: 46rpx;
  font-weight: 600;
}

.intro-box {
  background: var(--bg-secondary);
  padding: 32rpx;
  border-radius: 16rpx;
  border: 2rpx solid var(--border-color);
}

.intro-text {
  color: var(--text-secondary);
  font-size: 28rpx;
  line-height: 44rpx;
  text-align: justify;
  white-space: pre-line;
  word-break: break-word;
}

.studio-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  background: var(--bg-secondary);
  padding: 32rpx;
  border-radius: 16rpx;
  border: 2rpx solid var(--border-color);
}

.studio-tag {
  height: 46rpx;
  padding: 0 18rpx;
  border-radius: 10rpx;
  background: var(--studio-tag-bg);
  color: var(--accent-mid);
  font-size: 22rpx;
  line-height: 46rpx;
  font-weight: 600;
}

.character-list {
  background: var(--bg-secondary);
  border-radius: 16rpx;
  border: 2rpx solid var(--border-color);
  overflow: hidden;
}

.character-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid var(--border-color);
}

.character-item:last-child {
  border-bottom: 0;
}

.character-avatar {
  flex-shrink: 0;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: var(--border-color);
}

.character-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.character-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.character-name {
  color: var(--text-primary);
  font-size: 28rpx;
  font-weight: 600;
  line-height: 36rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.character-voice-actor {
  color: var(--text-muted);
  font-size: 22rpx;
  line-height: 30rpx;
  margin-top: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.character-role {
  flex-shrink: 0;
  margin-left: 16rpx;
  color: var(--text-muted);
  font-size: 22rpx;
  line-height: 30rpx;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.progress-header {
  background: var(--bg-secondary);
  border: 2rpx solid var(--border-color);
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.progress-label {
  color: var(--text-muted);
  font-size: 26rpx;
}

.progress-text {
  color: var(--text-primary);
  font-size: 28rpx;
  font-weight: 700;
}

.progress-bar-bg {
  width: 100%;
  height: 8rpx;
  background: var(--border-color);
  border-radius: 4rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-lighter), var(--accent-gradient-end));
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.progress-actions {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
}

.progress-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: var(--border-color);
  color: var(--text-primary);
  font-size: 36rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.15s ease;
}

.progress-btn:active {
  background: var(--active-bg);
  transform: scale(0.92);
}

.episode-loading {
  text-align: center;
  padding: 48rpx 0;
}

.loading-text {
  color: var(--text-muted);
  font-size: 28rpx;
}

.episode-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 28rpx 24rpx;
  background: var(--bg-secondary);
  border: 2rpx solid var(--border-color);
  border-radius: 14rpx;
  margin-bottom: 12rpx;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.episode-item:active {
  border-color: var(--accent-lighter);
}

.episode-watched {
  background: var(--watched-bg);
  border-color: var(--active-bg);
}

.episode-watched .episode-title {
  color: var(--text-muted);
}

.episode-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.episode-number-wrap {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.episode-number {
  color: var(--accent-lighter);
  font-size: 24rpx;
  font-weight: 700;
}

.episode-badge {
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  line-height: 30rpx;
  font-weight: 600;
}

.filler-badge {
  background: var(--filler-bg);
  color: var(--color-warning);
}

.recap-badge {
  background: var(--recap-bg);
  color: var(--accent-mid);
}

.episode-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.episode-title {
  color: var(--text-primary);
  font-size: 28rpx;
  font-weight: 600;
  line-height: 36rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.episode-aired {
  color: var(--text-muted);
  font-size: 22rpx;
}

.episode-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
  flex-shrink: 0;
}

.episode-score {
  color: var(--color-warning);
  font-size: 24rpx;
  font-weight: 700;
}

.episode-check {
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-off {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  border: 3rpx solid var(--star-empty);
  transition: all 0.2s ease;
}

.check-on {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  background: var(--color-check);
  border: 3rpx solid var(--color-check);
  position: relative;
}

.check-on::after {
  content: '';
  position: absolute;
  top: 3rpx;
  left: 8rpx;
  width: 8rpx;
  height: 14rpx;
  border: solid var(--text-white);
  border-width: 0 3rpx 3rpx 0;
  transform: rotate(45deg);
}

.episode-load-more {
  text-align: center;
  padding: 28rpx 0;
  background: var(--bg-secondary);
  border: 2rpx solid var(--border-color);
  border-radius: 14rpx;
  margin-bottom: 12rpx;
}

.episode-load-more:active {
  border-color: var(--accent-lighter);
}

.load-more-text {
  color: var(--accent-lighter);
  font-size: 28rpx;
  font-weight: 600;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.review-item {
  background: var(--bg-secondary);
  border: 2rpx solid var(--border-color);
  border-radius: 16rpx;
  padding: 28rpx;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.review-avatar {
  flex-shrink: 0;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: var(--border-color);
}

.review-avatar-placeholder {
  background: var(--active-bg);
}

.review-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.review-user {
  color: var(--text-primary);
  font-size: 26rpx;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-date {
  color: var(--text-muted);
  font-size: 22rpx;
}

.review-score-badge {
  flex-shrink: 0;
  width: 56rpx;
  height: 56rpx;
  border-radius: 12rpx;
  background: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-score-text {
  color: var(--color-warning);
  font-size: 24rpx;
  font-weight: 700;
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 16rpx;
}

.review-tag {
  height: 40rpx;
  padding: 0 14rpx;
  border-radius: 8rpx;
  background: var(--studio-tag-bg);
  color: var(--accent-mid);
  font-size: 20rpx;
  line-height: 40rpx;
  font-weight: 600;
}

.review-spoiler-hint {
  color: var(--color-warning);
  font-size: 22rpx;
  margin-bottom: 12rpx;
}

.review-body {
  color: var(--text-secondary);
  font-size: 26rpx;
  line-height: 42rpx;
  text-align: justify;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
