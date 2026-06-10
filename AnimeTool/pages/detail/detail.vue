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
          <text class="meta">类型：{{ anime.type }}</text>
          <text class="meta">集数：{{ anime.episodes }}</text>
          <text class="meta">状态：{{ anime.status || '未知' }}</text>
          <text class="meta">年份：{{ anime.year || '未知' }}</text>
        </view>

        <view v-if="anime.genres && anime.genres.length" class="section">
          <text class="section-title">所属分类</text>
          <view class="genre-list">
            <text v-for="genre in anime.genres" :key="genre" class="genre-tag">{{ genre }}</text>
          </view>
        </view>

        <button class="favorite-button" @tap="toggleFavorite">
          {{ isFavorite ? '已想看' : '想看' }}
        </button>

        <view class="intro">
          <text class="intro-title">剧情简介</text>
          <text class="intro-text">{{ anime.synopsis || '暂无简介' }}</text>
        </view>

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

const isFavorite = computed(() => {
  return anime.value ? favoriteStore.isFavorite(anime.value.id) : false
})

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
  favoriteStore.loadFavorites()
  loadDetail(options.id)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f6f7fb;
  padding-bottom: 60rpx;
}

.cover {
  width: 100%;
  height: 680rpx;
  background: #e8ecf2;
}

.content {
  position: relative;
  margin-top: -60rpx;
  border-radius: 48rpx 48rpx 0 0;
  background: #ffffff;
  padding: 48rpx 32rpx;
  box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.05);
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
  color: #1e293b;
  font-size: 42rpx;
  font-weight: 800;
  line-height: 56rpx;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
  margin-top: 36rpx;
  background: #f8fafc;
  padding: 24rpx;
  border-radius: 20rpx;
}

.meta {
  color: #64748b;
  font-size: 26rpx;
  line-height: 38rpx;
}

.section {
  margin-top: 48rpx;
}

.section-title {
  display: block;
  color: #1e293b;
  font-size: 34rpx;
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
  width: 8rpx;
  height: 32rpx;
  background: #4f46e5;
  border-radius: 4rpx;
}

.genre-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.genre-tag {
  height: 48rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: #e0e7ff;
  color: #4338ca;
  font-size: 24rpx;
  line-height: 48rpx;
  font-weight: 500;
}

.favorite-button {
  margin: 48rpx 0;
  height: 96rpx;
  border-radius: 48rpx;
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 96rpx;
  box-shadow: 0 12rpx 28rpx rgba(244, 63, 94, 0.3);
  transition: transform 0.2s ease;
}

.favorite-button:active {
  transform: scale(0.96);
}

.favorite-button::after {
  border: 0;
}

.intro {
  margin-top: 48rpx;
  background: #f8fafc;
  padding: 32rpx;
  border-radius: 24rpx;
}

.intro-title {
  display: block;
  color: #1e293b;
  font-size: 32rpx;
  font-weight: 800;
  margin-bottom: 16rpx;
}

.intro-text {
  color: #475569;
  font-size: 28rpx;
  line-height: 44rpx;
  text-align: justify;
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
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
}

.character-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: #e8ecf2;
}

.character-name {
  width: 100%;
  margin-top: 16rpx;
  color: #1e293b;
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
  color: #64748b;
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
