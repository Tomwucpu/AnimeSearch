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
}

.cover {
  width: 100%;
  height: 620rpx;
  background: #e8ecf2;
}

.content {
  padding: 28rpx 24rpx 48rpx;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.title {
  flex: 1;
  min-width: 0;
  color: #23283a;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 50rpx;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 28rpx;
}

.meta {
  color: #667085;
  font-size: 26rpx;
  line-height: 38rpx;
}

.section {
  margin-top: 34rpx;
}

.section-title {
  display: block;
  color: #23283a;
  font-size: 32rpx;
  font-weight: 800;
  line-height: 44rpx;
  margin-bottom: 18rpx;
}

.genre-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.genre-tag {
  height: 48rpx;
  padding: 0 18rpx;
  border-radius: 8rpx;
  background: #eef2ff;
  color: #4054b2;
  font-size: 24rpx;
  line-height: 48rpx;
}

.favorite-button {
  height: 88rpx;
  margin: 34rpx 0;
  border-radius: 8rpx;
  background: #e85d75;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 88rpx;
}

.favorite-button::after {
  border: 0;
}

.intro {
  padding-top: 6rpx;
}

.intro-title {
  display: block;
  color: #23283a;
  font-size: 32rpx;
  font-weight: 800;
  line-height: 44rpx;
  margin-bottom: 16rpx;
}

.intro-text {
  color: #4b5565;
  font-size: 28rpx;
  line-height: 46rpx;
}

.character-scroll {
  width: 100%;
  white-space: nowrap;
}

.character-list {
  display: flex;
  gap: 18rpx;
}

.character-card {
  display: inline-flex;
  width: 168rpx;
  padding: 14rpx;
  box-sizing: border-box;
  flex-direction: column;
  border-radius: 8rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 28rpx rgba(35, 40, 58, 0.06);
}

.character-image {
  width: 140rpx;
  height: 176rpx;
  border-radius: 6rpx;
  background: #e8ecf2;
}

.character-name {
  width: 100%;
  margin-top: 12rpx;
  color: #23283a;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 32rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.character-role {
  margin-top: 4rpx;
  color: #8b95a5;
  font-size: 22rpx;
  line-height: 30rpx;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
</style>
