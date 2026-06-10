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
  background: #f6f7fb;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.search-input {
  flex: 1;
  height: 80rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
  background: #ffffff;
  color: #23283a;
  font-size: 28rpx;
}

.search-button {
  width: 132rpx;
  height: 80rpx;
  border-radius: 8rpx;
  background: #e85d75;
  color: #ffffff;
  font-size: 28rpx;
  line-height: 80rpx;
}

.search-button::after {
  border: 0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
