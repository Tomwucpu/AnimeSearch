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

        <button class="favorite-button" @tap="toggleFavorite">
          {{ isFavorite ? '已想看' : '想看' }}
        </button>

        <view class="intro">
          <text class="intro-title">剧情简介</text>
          <text class="intro-text">{{ anime.synopsis || '暂无简介' }}</text>
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
import { getAnimeDetail } from '../../api/anime.js'
import { useFavoriteStore } from '../../stores/favorite.js'

const anime = ref(null)
const loading = ref(false)
const favoriteStore = useFavoriteStore()

const isFavorite = computed(() => {
  return anime.value ? favoriteStore.isFavorite(anime.value.id) : false
})

async function loadDetail(id) {
  loading.value = true

  try {
    anime.value = await getAnimeDetail(id)
  } catch (error) {
    uni.showToast({
      title: error.message || '网络请求失败，请稍后重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
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
</style>
