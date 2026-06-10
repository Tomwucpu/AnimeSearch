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
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onReachBottom } from '@dcloudio/uni-app'

import AnimeCard from '../../components/AnimeCard/AnimeCard.vue'
import EmptyState from '../../components/EmptyState/EmptyState.vue'
import LoadingMore from '../../components/LoadingMore/LoadingMore.vue'
import { searchAnime } from '../../api/anime.js'

const keyword = ref('')
const results = ref([])
const page = ref(1)
const loading = ref(false)
const searched = ref(false)
const loadStatus = ref('more')

function goDetail(id) {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

async function loadSearch(reset = false) {
  if (loading.value) {
    return
  }

  const value = keyword.value.trim()
  if (!value) {
    searched.value = false
    results.value = []
    loadStatus.value = 'more'
    return
  }

  if (!reset && loadStatus.value === 'noMore') {
    return
  }

  loading.value = true
  searched.value = true
  loadStatus.value = reset ? 'more' : 'loading'

  try {
    const nextPage = reset ? 1 : page.value
    const result = await searchAnime(value, nextPage)

    results.value = reset ? result.list : results.value.concat(result.list)
    page.value = nextPage + 1
    loadStatus.value = result.pagination?.has_next_page === false || result.list.length === 0
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
  }
}

function startSearch() {
  page.value = 1
  loadSearch(true)
}

onReachBottom(() => {
  loadSearch(false)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #f0f4f8 0%, #f6f7fb 100%);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
  padding: 4rpx;
}

.search-input {
  flex: 1;
  height: 88rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
  border-radius: 44rpx;
  background: #ffffff;
  color: #1e293b;
  font-size: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
}

.search-button {
  width: 140rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 88rpx;
  box-shadow: 0 8rpx 24rpx rgba(79, 70, 229, 0.3);
  transition: transform 0.2s ease;
}

.search-button:active {
  transform: scale(0.95);
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
