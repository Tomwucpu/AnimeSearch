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
  background: #f6f7fb;
}

.banner {
  width: 100%;
  height: 420rpx;
  border-radius: 8rpx;
  overflow: hidden;
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
  gap: 8rpx;
  padding: 96rpx 28rpx 36rpx;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(10, 14, 24, 0.82));
}

.banner-title {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 700;
  line-height: 44rpx;
}

.banner-score {
  color: #ffe3a6;
  font-size: 24rpx;
  line-height: 34rpx;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 32rpx 0 18rpx;
}

.section-title {
  color: #23283a;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 46rpx;
}

.section-subtitle {
  color: #8b95a5;
  font-size: 24rpx;
  line-height: 34rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
