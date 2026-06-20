<template>
  <view class="page" :class="pageClass">
    <view class="fade-curtain" :class="{ hide: curtainHide }" />
    <view class="day-bar">
      <view class="day-list">
        <view
          v-for="(item, index) in dayTabs"
          :key="item.key"
          class="day-item"
          :class="{ active: currentDay === item.key }"
          @tap="switchDay(item.key)"
        >
          <text class="day-label">{{ item.label }}</text>
          <view v-if="index === todayIndex" class="day-dot" />
        </view>
      </view>
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

    <EmptyState v-if="!loading && !animeList.length" text="暂无该日放送的番剧" />
    <LoadingMore v-if="animeList.length" :status="loadStatus" />
    <BackToTop :visible="backTopVisible" @click="scrollToTop" />
    <CustomTabBar current="/pages/schedule" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

import AnimeCard from '../components/AnimeCard.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingMore from '../components/LoadingMore.vue'
import BackToTop from '../components/BackToTop.vue'
import CustomTabBar from '../components/CustomTabBar.vue'
import { getSchedule } from '../api/anime.js'
import { useNavigation } from '../composables/useNavigation.js'
import { usePagedApi } from '../composables/usePagedApi.js'
import { useBackToTop } from '../composables/useBackToTop.js'
import { useFadeIn } from '../composables/useFadeIn.js'
import { useTheme } from '../composables/useTheme.js'

const { goDetail } = useNavigation()
const { backTopVisible, scrollToTop } = useBackToTop()
const { curtainHide } = useFadeIn()
const { pageClass, themeStore } = useTheme()

const DAY_TABS = [
  { key: 'monday', label: '周一' },
  { key: 'tuesday', label: '周二' },
  { key: 'wednesday', label: '周三' },
  { key: 'thursday', label: '周四' },
  { key: 'friday', label: '周五' },
  { key: 'saturday', label: '周六' },
  { key: 'sunday', label: '周日' }
]

const dayTabs = DAY_TABS

const todayIndex = computed(() => {
  const day = new Date().getDay()
  return day === 0 ? 6 : day - 1
})

const currentDay = ref(DAY_TABS[todayIndex.value].key)

const fetchFn = (page) => getSchedule(currentDay.value, page)
const { list: animeList, loading, loadStatus, loadData } = usePagedApi(fetchFn)

async function loadSchedule(reset = false) {
  await loadData(reset)
  uni.stopPullDownRefresh()
}

async function switchDay(day) {
  if (currentDay.value === day) return
  currentDay.value = day
  await loadSchedule(true)
}

onLoad(() => {
  loadSchedule(true)
})

onShow(() => {
  uni.hideTabBar()
})

onPullDownRefresh(() => {
  loadSchedule(true)
})

onReachBottom(() => {
  loadSchedule(false)
})
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

.day-bar {
  margin-bottom: 32rpx;
}

.day-list {
  display: flex;
  gap: 8rpx;
}

.day-item {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56rpx;
  padding: 0 8rpx;
  border: 2rpx solid var(--border-color);
  border-radius: 14rpx;
  color: var(--text-muted);
  font-size: 22rpx;
  font-weight: 600;
  transition: all 0.2s ease;
}

.day-item.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: var(--text-white);
}

.day-dot {
  position: absolute;
  bottom: 2rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: var(--color-warning);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
