<template>
  <view class="page">
    <swiper
      v-if="banners.length"
      class="banner"
      circular
      autoplay
      indicator-dots
      indicator-color="rgba(255,255,255,.2)"
      indicator-active-color="#A1C4F7"
    >
      <swiper-item v-for="item in banners" :key="item.id">
        <view class="banner-item" @tap="goDetail(item.id)">
          <image class="banner-image" :src="item.image" mode="aspectFill" />
          <view class="banner-mask">
            <text class="banner-title">{{ item.title }}</text>
            <view class="banner-meta">
              <text class="banner-star">★</text>
              <text class="banner-score">{{ item.score }}</text>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view class="section-head">
      <text class="section-title">热门番剧</text>
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
    <CustomTabBar current="/pages/index/index" />
  </view>
</template>

<script setup>
// 首页：Banner 轮播（取热门前5条）+ 热门番剧无限列表
import { ref } from 'vue'
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

import AnimeCard from '../../components/AnimeCard/AnimeCard.vue'
import EmptyState from '../../components/EmptyState/EmptyState.vue'
import LoadingMore from '../../components/LoadingMore/LoadingMore.vue'
import CustomTabBar from '../../components/CustomTabBar/CustomTabBar.vue'
import { getTopAnime } from '../../api/anime.js'
import { useNavigation } from '../../composables/useNavigation.js'
import { usePagedApi } from '../../composables/usePagedApi.js'

const { goDetail } = useNavigation()

const banners = ref([])
const { list: animeList, loading, loadStatus, loadData } = usePagedApi(getTopAnime)

/**
 * 加载番剧列表（封装 composable，附加 Banner 更新和下拉刷新收尾）
 * @param {boolean} reset - true: 下拉刷新（重置列表）；false: 上拉加载更多（追加数据）
 */
async function loadAnime(reset = false) {
  const ok = await loadData(reset)
  if (!ok) return

  if (reset) {
    banners.value = animeList.value.slice(0, 5)
  }
  uni.stopPullDownRefresh()
}

onLoad(() => {
  loadAnime(true)
})

onShow(() => {
  uni.hideTabBar()
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
  padding-bottom: calc(110rpx + env(safe-area-inset-bottom) + 24rpx);
  box-sizing: border-box;
  background: #0F1115;
}

.banner {
  width: 100%;
  height: 400rpx;
  border-radius: 22rpx;
  overflow: hidden;
  background: #161922;
}

.banner-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  background: #1a1f2e;
}

.banner-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 100rpx 32rpx 36rpx;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.9));
}

.banner-title {
  color: #ffffff;
  font-size: 36rpx;
  font-weight: 800;
  line-height: 48rpx;
}

.banner-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.banner-star {
  color: #f2c94c;
  font-size: 24rpx;
}

.banner-score {
  color: #A1C4F7;
  font-size: 26rpx;
  font-weight: 700;
}

.section-head {
  margin: 40rpx 8rpx 24rpx;
}

.section-title {
  color: #DBE6FF;
  font-size: 34rpx;
  font-weight: 800;
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

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
