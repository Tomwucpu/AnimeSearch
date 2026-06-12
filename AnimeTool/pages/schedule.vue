<template>
  <view class="page">
    <scroll-view class="day-bar" scroll-x :show-scrollbar="false">
      <view class="day-list">
        <view
          v-for="(item, index) in dayTabs"
          :key="item.key"
          class="day-item"
          :class="{ active: currentDay === item.key }"
          @tap="switchDay(item.key)"
        >
          <text class="day-label">{{ item.label }}</text>
          <text v-if="index === todayIndex" class="day-badge">今</text>
        </view>
      </view>
    </scroll-view>

    <view class="list">
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
import EmptyState from '../components/EmptyState.vue'
import LoadingMore from '../components/LoadingMore.vue'
import BackToTop from '../components/BackToTop.vue'
import CustomTabBar from '../components/CustomTabBar.vue'
import { getSchedule } from '../api/anime.js'
import { useNavigation } from '../composables/useNavigation.js'
import { usePagedApi } from '../composables/usePagedApi.js'
import { useBackToTop } from '../composables/useBackToTop.js'

const { goDetail } = useNavigation()
const { backTopVisible, scrollToTop } = useBackToTop()

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
  background: #0F1115;
}

.day-bar {
  margin-bottom: 32rpx;
}

.day-list {
  display: flex;
  gap: 16rpx;
  white-space: nowrap;
}

.day-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  height: 72rpx;
  padding: 0 28rpx;
  border: 2rpx solid #262F43;
  border-radius: 14rpx;
  color: #6B7A99;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.day-item.active {
  background: #1847B1;
  border-color: #1847B1;
  color: #DBE6FF;
}

.day-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #F2C94C;
  color: #0F1115;
  font-size: 20rpx;
  font-weight: 800;
  flex-shrink: 0;
}

.day-item.active .day-badge {
  background: #DBE6FF;
  color: #1847B1;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
