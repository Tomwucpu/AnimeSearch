<template>
  <view class="page">
    <view class="search-bar">
      <input
        v-model="keyword"
        class="search-input"
        placeholder="输入关键词搜索番剧"
        confirm-type="search"
        @confirm="startSearch"
      />
      <button class="search-button" @tap="startSearch">搜索</button>
    </view>

    <view class="list">
      <AnimeCard
        v-for="item in results"
        :key="item.id"
        :anime="item"
        @click="goDetail(item.id)"
      />
    </view>

    <EmptyState v-if="!searched" text="输入关键词搜索番剧" />
    <EmptyState v-else-if="!loading && !results.length" text="没有找到相关番剧" />
    <LoadingMore v-if="results.length" :status="loadStatus" />
    <CustomTabBar current="/pages/search/search" />
  </view>
</template>

<script setup>
// 搜索页：关键词搜索 + 结果分页列表
import { ref } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'

import AnimeCard from '../../components/AnimeCard/AnimeCard.vue'
import EmptyState from '../../components/EmptyState/EmptyState.vue'
import LoadingMore from '../../components/LoadingMore/LoadingMore.vue'
import CustomTabBar from '../../components/CustomTabBar/CustomTabBar.vue'
import { searchAnime } from '../../api/anime.js'
import { useNavigation } from '../../composables/useNavigation.js'
import { usePagedApi } from '../../composables/usePagedApi.js'

const { goDetail } = useNavigation()

const keyword = ref('')
const searched = ref(false)

const { list: results, loading, loadStatus, loadData } = usePagedApi(
  (page) => searchAnime(keyword.value.trim(), page)
)

/**
 * 执行搜索或加载下一页
 * @param {boolean} reset - true: 新搜索；false: 加载下一页
 */
async function loadSearch(reset = false) {
  const value = keyword.value.trim()
  if (!value) {
    searched.value = false
    results.value = []
    loadStatus.value = 'more'
    return
  }

  searched.value = true
  await loadData(reset)
}

/**
 * 点击搜索按钮或键盘确认 → 重新搜索
 */
function startSearch() {
  loadSearch(true)
}

onShow(() => {
  uni.hideTabBar()
})

onReachBottom(() => {
  loadSearch(false)
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

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.search-input {
  flex: 1;
  height: 88rpx;
  padding: 0 36rpx;
  box-sizing: border-box;
  border-radius: 44rpx;
  background: #161922;
  color: #DBE6FF;
  font-size: 28rpx;
  border: 2rpx solid #262F43;
}

.search-input:focus {
  border-color: #4976D0;
}

.search-button {
  width: 140rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #1847B1;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 88rpx;
  transition: transform 0.15s ease;
}

.search-button:active {
  transform: scale(0.95);
  background: #0C287F;
}

.search-button::after {
  border: 0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
