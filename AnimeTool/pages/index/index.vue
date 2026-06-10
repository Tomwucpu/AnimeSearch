<template>
  <view class="page">
    <swiper
      v-if="banners.length"
      class="banner"
      circular
      autoplay
      indicator-dots
      indicator-color="rgba(255,255,255,.45)"
      indicator-active-color="#ffffff"
    >
      <swiper-item v-for="item in banners" :key="item.id">
        <view class="banner-item" @tap="goDetail(item.id)">
          <image class="banner-image" :src="item.image" mode="aspectFill" />
          <view class="banner-mask">
            <text class="banner-title">{{ item.title }}</text>
            <text class="banner-score">评分 {{ item.score }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view class="section-head">
      <text class="section-title">热门番剧</text>
      <text class="section-subtitle">实时热门数据</text>
    </view>

    <view class="list">
      <AnimeCard
        v-for="item in animeList"
        :key="item.id"
        :anime="item"
        @click="goDetail(item.id)"
      />
    </view>

    <EmptyState v-if="!loading && !animeList.length" text="暂时没有番剧数据" />
    <LoadingMore v-if="animeList.length" :status="loadStatus" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

import AnimeCard from '../../components/AnimeCard/AnimeCard.vue'
import EmptyState from '../../components/EmptyState/EmptyState.vue'
import LoadingMore from '../../components/LoadingMore/LoadingMore.vue'
import { getTopAnime } from '../../api/anime.js'

const banners = ref([])
const animeList = ref([])
const page = ref(1)
const loading = ref(false)
const loadStatus = ref('more')

function goDetail(id) {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

async function loadAnime(reset = false) {
  if (loading.value) {
    return
  }

  if (!reset && loadStatus.value === 'noMore') {
    return
  }

  loading.value = true
  loadStatus.value = reset ? 'more' : 'loading'

  try {
    const nextPage = reset ? 1 : page.value
    const result = await getTopAnime(nextPage)
    const nextList = result.list

    if (reset) {
      animeList.value = nextList
      banners.value = nextList.slice(0, 5)
    } else {
      animeList.value = animeList.value.concat(nextList)
    }

    page.value = nextPage + 1
    loadStatus.value = result.pagination?.has_next_page === false || nextList.length === 0
      ? 'noMore'
      : 'more'
  } catch (error) {
    uni.showToast({
      title: error.message || '网络请求失败，请稍后重试',
      icon: 'none'
    })
    loadStatus.value = 'more'
  } finally {
    loading.value = false
    uni.stopPullDownRefresh()
  }
}

onLoad(() => {
  loadAnime(true)
})

onPullDownRefresh(() => {
  loadAnime(true)
})

onReachBottom(() => {
  loadAnime(false)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #f0f4f8 0%, #f6f7fb 100%);
}

.banner {
  width: 100%;
  height: 420rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.1);
}

.banner-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  background: #e8ecf2;
}

.banner-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 120rpx 32rpx 36rpx;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.85));
}

.banner-title {
  color: #ffffff;
  font-size: 36rpx;
  font-weight: 800;
  line-height: 48rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.4);
}

.banner-score {
  color: #fbbf24;
  font-size: 26rpx;
  line-height: 36rpx;
  font-weight: 600;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 40rpx 8rpx 20rpx;
}

.section-title {
  color: #1e293b;
  font-size: 36rpx;
  font-weight: 800;
  line-height: 48rpx;
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

.section-subtitle {
  color: #94a3b8;
  font-size: 24rpx;
  line-height: 34rpx;
  font-weight: 500;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
