<template>
  <view class="page">
    <view v-if="favorites.length" class="list">
      <view v-for="item in favorites" :key="item.id" class="favorite-item">
        <SwipeAction
          :open="currentOpenId === item.id"
          @update:open="(val) => onSwipeOpen(item.id, val)"
          @action="removeFavorite(item.id)"
        >
          <AnimeCard :anime="item" @click="onCardClick(item.id)" />
        </SwipeAction>
      </view>
    </view>

    <EmptyState v-else text="还没有想看的番剧" />
    <CustomTabBar current="/pages/favorite/favorite" />
  </view>
</template>

<script setup>
// 收藏页：展示已收藏番剧列表，支持左滑取消收藏
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

import AnimeCard from '../../components/AnimeCard/AnimeCard.vue'
import EmptyState from '../../components/EmptyState/EmptyState.vue'
import CustomTabBar from '../../components/CustomTabBar/CustomTabBar.vue'
import SwipeAction from '../../components/SwipeAction/SwipeAction.vue'
import { useFavoriteStore } from '../../stores/favorite.js'

const favoriteStore = useFavoriteStore()
// 通过 computed 绑定 store 响应式状态，自动同步持久化数据
const favorites = computed(() => favoriteStore.favorites)

const currentOpenId = ref(null)

function onSwipeOpen(id, val) {
  currentOpenId.value = val ? id : null
}

function onCardClick(id) {
  if (currentOpenId.value) {
    currentOpenId.value = null
    return
  }
  goDetail(id)
}

function goDetail(id) {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

function removeFavorite(id) {
  favoriteStore.removeFavorite(id)
  currentOpenId.value = null
  uni.showToast({
    title: '已取消想看',
    icon: 'none'
  })
}

onShow(() => {
  uni.hideTabBar()
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

.list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
</style>
