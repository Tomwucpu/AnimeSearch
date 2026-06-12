<template>
  <view class="page">
    <view class="fade-curtain" :class="{ hide: curtainHide }" />
    <view v-if="anime" class="detail">
      <view class="header-card">
        <text class="title">{{ anime.title }}</text>

        <view class="header-top">
          <image class="poster" :src="anime.image || '/static/logo.png'" mode="aspectFill" @tap="previewImage" />
          <view class="header-info">
            <view class="info-block">
              <text class="info-label">开播时间</text>
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
              <text class="info-label">放送状态</text>
              <text class="info-value">{{ statusText }}</text>
            </view>

            <button class="favorite-button" @tap="handleFavoriteTap">
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

      <view class="section">
        <text class="section-title">简介</text>
        <view class="intro-box">
          <text class="intro-text">{{ anime.synopsis || '暂无简介' }}</text>
        </view>
      </view>

      <view v-if="anime.genres && anime.genres.length" class="section">
        <text class="section-title">分类</text>
        <view class="genre-box">
          <text v-for="genre in anime.genres" :key="genre" class="genre-tag">{{ genre }}</text>
        </view>
      </view>

      <CategoryPicker
        :visible="pickerVisible"
        :current-category="favoriteCategory"
        @close="pickerVisible = false"
        @select="handleCategorySelect"
        @remove="handleRemoveFavorite"
      />

      <view v-if="characters.length" class="section">
        <text class="section-title">角色列表</text>
        <scroll-view class="character-scroll" scroll-x>
          <view class="character-list">
            <view v-for="item in characters" :key="item.id" class="character-card">
              <image class="character-image" :src="item.image || '/static/logo.png'" mode="aspectFill" />
              <text class="character-name">{{ item.name }}</text>
              <text class="character-role">{{ item.role }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

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
    </view>

    <EmptyState v-else-if="!loading" text="没有找到番剧详情" />
    <BackToTop :visible="backTopVisible" @click="scrollToTop" />
  </view>
</template>

<script setup>
// 番剧详情页：封面、元信息、简介、角色列表、相关推荐、收藏切换
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import EmptyState from '../components/EmptyState.vue'
import StarRating from '../components/detail/StarRating.vue'
import CategoryPicker from '../components/detail/CategoryPicker.vue'
import AnimeCard from '../components/AnimeCard.vue'
import BackToTop from '../components/BackToTop.vue'
import {
  getAnimeCharacters,
  getAnimeDetail,
  getAnimeRecommendations
} from '../api/anime.js'
import { useFavoriteStore, WATCH_CATEGORIES } from '../stores/favorite.js'
import { formatStatus } from '../utils/animeCardMeta.js'
import { useNavigation } from '../composables/useNavigation.js'
import { useBackToTop } from '../composables/useBackToTop.js'
import { useFadeIn } from '../composables/useFadeIn.js'

const { goDetail } = useNavigation()
const { backTopVisible, scrollToTop } = useBackToTop()
const { curtainHide } = useFadeIn()

const anime = ref(null)
const characters = ref([])
const recommendations = ref([])
const loading = ref(false)
const favoriteStore = useFavoriteStore()

const favoriteCategory = computed(() => {
  return anime.value ? favoriteStore.getCategory(anime.value.id) : null
})

const pickerVisible = ref(false)

const categoryLabel = computed(() => {
  return favoriteCategory.value ? WATCH_CATEGORIES[favoriteCategory.value] : ''
})

const broadcastText = computed(() => {
  const from = anime.value?.airedFrom
  if (!from) return '暂无信息'
  return from.slice(0, 10)
})

const statusText = computed(() => {
  return anime.value?.status ? formatStatus(anime.value.status) : '未知'
})

/**
 * 加载番剧详情主数据，触发后立即返回（不阻塞渲染）
 * @param {number|string} id - MyAnimeList 番剧 ID
 */
async function loadDetail(id) {
  loading.value = true
  characters.value = []
  recommendations.value = []

  try {
    anime.value = await getAnimeDetail(id)
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
  loadDetail(options.id)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #0F1115;
  padding-bottom: 60rpx;
}

.fade-curtain {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
  background: #0F1115;
  opacity: 1;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.fade-curtain.hide {
  opacity: 0;
}

.detail {
  padding: 24rpx 32rpx 0;
}

.header-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 28rpx;
  background: #121419;
  border-radius: 16rpx;
  border: 2rpx solid #1F2635;
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
  background: #161922;
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
  color: #DBE6FF;
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
  color: #6B7A99;
  font-size: 24rpx;
}

.info-value {
  color: #DBE6FF;
  font-size: 30rpx;
  line-height: 36rpx;
}

.score-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.score-number {
  color: #DBE6FF;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1;
}

.genre-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  background: #161922;
  padding: 32rpx;
  border-radius: 16rpx;
  border: 2rpx solid #1F2635;
}

.genre-tag {
  height: 46rpx;
  padding: 0 18rpx;
  border-radius: 10rpx;
  background: #1F2635;
  color: #A1C4F7;
  font-size: 22rpx;
  line-height: 46rpx;
  font-weight: 600;
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
  background: #1847B1;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 700;
  line-height: 1;
  transition: transform 0.15s ease;
}

.favorite-button:active {
  transform: scale(0.96);
  background: #0C287F;
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

.section {
  margin-top: 48rpx;
}

.section-title {
  display: block;
  color: #DBE6FF;
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
  background: #4976D0;
  border-radius: 3rpx;
}

.intro-box {
  background: #161922;
  padding: 32rpx;
  border-radius: 16rpx;
  border: 2rpx solid #1F2635;
}

.intro-text {
  color: #99A8C9;
  font-size: 28rpx;
  line-height: 44rpx;
  text-align: justify;
  white-space: pre-line;
  word-break: break-word;
}

.character-scroll {
  width: 100%;
  white-space: nowrap;
}

.character-list {
  display: inline-flex;
  gap: 24rpx;
  padding: 8rpx 8rpx 24rpx;
}

.character-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 180rpx;
  padding: 20rpx;
  box-sizing: border-box;
  border-radius: 16rpx;
  background: #161922;
  border: 2rpx solid #1F2635;
}

.character-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #1F2635;
}

.character-name {
  width: 100%;
  margin-top: 16rpx;
  color: #DBE6FF;
  font-size: 26rpx;
  font-weight: 600;
  line-height: 34rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.character-role {
  margin-top: 6rpx;
  color: #6B7A99;
  font-size: 22rpx;
  line-height: 30rpx;
  text-align: center;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
