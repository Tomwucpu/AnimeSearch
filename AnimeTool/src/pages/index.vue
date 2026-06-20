<template>
  <view class="page" :class="pageClass">
    <view class="fade-curtain" :class="{ hide: curtainHide }" />
    <swiper
      v-if="banners.length"
      class="banner"
      circular
      autoplay
      indicator-dots
      indicator-color="rgba(255,255,255,.2)"
      :indicator-active-color="indicatorColor"
    >
      <swiper-item v-for="item in banners" :key="item.id">
        <view class="banner-item" @tap="goDetail(item.id)">
          <image class="banner-image" :src="item.image" mode="aspectFill" lazy-load />
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

    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ active: currentTab === 0 }"
        @tap="switchTab(0)"
      >
        <text>热门排行</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: currentTab === 1 }"
        @tap="switchTab(1)"
      >
        <text>当季新番</text>
      </view>
    </view>

    <view class="section-head">
      <text class="section-title">{{ currentTab === 0 ? '热门番剧' : '当季新番' }}</text>
    </view>

    <view v-if="loading && !animeList.length" class="list">
      <SkeletonCard v-for="n in 4" :key="n" />
    </view>

    <view v-else-if="animeList.length" class="list">
      <AnimeCard
        v-for="item in animeList"
        :key="item.id"
        :anime="item"
        @click="goDetail(item.id)"
      />
    </view>

    <EmptyState v-if="!loading && !animeList.length" text="暂时没有番剧数据" />
    <LoadingMore v-if="animeList.length" :status="loadStatus" />
    <ThemeToggle :shiftUp="backTopVisible" />
    <RandomRecommend :shiftUp="backTopVisible" @click="goRandom" />
    <BackToTop :visible="backTopVisible" @click="scrollToTop" />
    <CustomTabBar current="/pages/index" />
  </view>
</template>

<script setup>
// 首页：Banner 轮播（取热门前5条）+ 热门番剧无限列表
import { ref, computed } from 'vue'
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

import AnimeCard from '../components/AnimeCard.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingMore from '../components/LoadingMore.vue'
import BackToTop from '../components/BackToTop.vue'
import RandomRecommend from '../components/RandomRecommend.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import CustomTabBar from '../components/CustomTabBar.vue'
import { getTopAnime, getSeasonNow, getRandomAnime } from '../api/anime.js'
import { useNavigation } from '../composables/useNavigation.js'
import { usePagedApi } from '../composables/usePagedApi.js'
import { useBackToTop } from '../composables/useBackToTop.js'
import { useFadeIn } from '../composables/useFadeIn.js'
import { useTheme } from '../composables/useTheme.js'

const { goDetail } = useNavigation()
const { backTopVisible, scrollToTop } = useBackToTop()
const { curtainHide } = useFadeIn()
const { pageClass, themeStore } = useTheme()

// swiper indicator 颜色需通过 prop 传入，无法使用 CSS 变量
const indicatorColor = computed(() => themeStore.isDark ? '#A1C4F7' : '#2B5CA8')

const currentTab = ref(0)
const banners = ref([])

const fetchFn = (page) => currentTab.value === 0 ? getTopAnime(page) : getSeasonNow(page)
const { list: animeList, loading, loadStatus, loadData } = usePagedApi(fetchFn)

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

async function switchTab(index) {
  if (currentTab.value === index) return
  currentTab.value = index
  await loadAnime(true)
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

async function goRandom() {
  uni.showLoading({ title: '随机推荐中...' })
  try {
    const anime = await getRandomAnime()
    uni.hideLoading()
    goDetail(anime.id)
  } catch {
    uni.hideLoading()
    uni.showToast({ title: '获取失败，请重试', icon: 'none' })
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  padding-bottom: calc(110rpx + env(safe-area-inset-bottom) + 24rpx);
  box-sizing: border-box;
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

.banner {
  width: 100%;
  height: 400rpx;
  border-radius: 22rpx;
  overflow: hidden;
  background: var(--bg-secondary);
}

.banner-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  background: var(--poster-bg);
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
  background: linear-gradient(180deg, transparent, var(--bg-mask));
}

.banner-title {
  color: var(--text-white);
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
  color: var(--star-filled);
  font-size: 24rpx;
}

.banner-score {
  color: var(--accent-lightest);
  font-size: 26rpx;
  font-weight: 700;
}

.tab-bar {
  display: flex;
  margin: 32rpx 0 0;
  padding: 8rpx;
  background: var(--bg-secondary);
  border: 2rpx solid var(--border-color);
  border-radius: 14rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72rpx;
  border-radius: 10rpx;
  color: var(--text-muted);
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.2s ease;
}

.tab-item.active {
  background: var(--accent-primary);
  color: var(--text-white);
}

.section-head {
  margin: 40rpx 8rpx 24rpx;
}

.section-title {
  color: var(--text-primary);
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
  background: var(--accent-lighter);
  border-radius: 3rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
