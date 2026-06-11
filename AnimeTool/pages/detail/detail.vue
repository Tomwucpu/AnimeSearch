<template>
  <view class="page">
    <view v-if="anime" class="detail">
      <image class="cover" :src="anime.image || '/static/logo.png'" mode="aspectFill" @tap="previewImage" />

      <view class="content">
        <view class="title-row">
          <text class="title">{{ anime.title }}</text>
          <RatingBadge :score="anime.score" />
        </view>

        <view class="meta-grid">
          <view class="meta-item">
            <text class="meta-label">类型</text>
            <text class="meta-value">{{ anime.type }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">集数</text>
            <text class="meta-value">{{ anime.episodes }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">状态</text>
            <text class="meta-value">{{ anime.status || '未知' }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">年份</text>
            <text class="meta-value">{{ anime.year || '未知' }}</text>
          </view>
        </view>

        <view v-if="anime.genres && anime.genres.length" class="section">
          <text class="section-title">分类</text>
          <view class="genre-list">
            <text v-for="genre in anime.genres" :key="genre" class="genre-tag">{{ genre }}</text>
          </view>
        </view>

        <view class="section">
          <text class="section-title">剧情简介</text>
          <view class="intro-box">
            <text class="intro-text">{{ anime.synopsis || '暂无简介' }}</text>
          </view>
        </view>

        <button class="favorite-button" @tap="toggleFavorite">
          {{ isFavorite ? '已想看' : '加入想看' }}
        </button>

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
    </view>

    <EmptyState v-else-if="!loading" text="没有找到番剧详情" />
  </view>
</template>

<script setup>
// 番剧详情页：封面、元信息、简介、角色列表、相关推荐、收藏切换
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import EmptyState from '../../components/EmptyState/EmptyState.vue'
import RatingBadge from '../../components/RatingBadge/RatingBadge.vue'
import AnimeCard from '../../components/AnimeCard/AnimeCard.vue'
import {
  getAnimeCharacters,
  getAnimeDetail,
  getAnimeRecommendations
} from '../../api/anime.js'
import { useFavoriteStore } from '../../stores/favorite.js'

const anime = ref(null)
const characters = ref([])
const recommendations = ref([])
const loading = ref(false)
const favoriteStore = useFavoriteStore()

// 当前番剧是否已收藏，依赖于 store 响应式状态自动更新
const isFavorite = computed(() => {
  return anime.value ? favoriteStore.isFavorite(anime.value.id) : false
})

/**
 * 加载番剧详情主数据，触发后立即返回（不阻塞渲染）
 */
async function loadDetail(id) {
  loading.value = true
  characters.value = []
  recommendations.value = []

  try {
    anime.value = await getAnimeDetail(id)
    // 角色和推荐数据异步并行加载，不阻塞详情主内容展示
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

function goDetail(id) {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

function previewImage() {
  if (!anime.value?.image) {
    return
  }

  uni.previewImage({
    current: anime.value.image,
    urls: [anime.value.image]
  })
}

function toggleFavorite() {
  if (!anime.value) {
    return
  }

  const added = favoriteStore.toggleFavorite(anime.value)
  uni.showToast({
    title: added ? '已加入想看' : '已取消想看',
    icon: 'none'
  })
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

.cover {
  width: 100%;
  height: 680rpx;
  background: #161922;
}

.content {
  position: relative;
  margin-top: -60rpx;
  border-radius: 40rpx 40rpx 0 0;
  background: #121419;
  padding: 48rpx 32rpx;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.title {
  flex: 1;
  min-width: 0;
  color: #DBE6FF;
  font-size: 42rpx;
  font-weight: 800;
  line-height: 56rpx;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
  margin-top: 36rpx;
  background: #161922;
  padding: 24rpx;
  border-radius: 16rpx;
  border: 2rpx solid #1F2635;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.meta-label {
  color: #6B7A99;
  font-size: 22rpx;
}

.meta-value {
  color: #DBE6FF;
  font-size: 28rpx;
  font-weight: 600;
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

.genre-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.genre-tag {
  height: 52rpx;
  padding: 0 24rpx;
  border-radius: 12rpx;
  background: #1F2635;
  color: #A1C4F7;
  font-size: 24rpx;
  line-height: 52rpx;
  font-weight: 600;
}

.favorite-button {
  margin: 48rpx 0;
  height: 96rpx;
  border-radius: 48rpx;
  background: #1847B1;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 96rpx;
  transition: transform 0.15s ease;
}

.favorite-button:active {
  transform: scale(0.96);
  background: #0C287F;
}

.favorite-button::after {
  border: 0;
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
