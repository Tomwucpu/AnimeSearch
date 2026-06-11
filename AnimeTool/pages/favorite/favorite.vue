<template>
  <view class="page">
    <view v-if="favorites.length" class="list">
      <view v-for="item in favorites" :key="item.id" class="favorite-item">
        <AnimeCard :anime="item" @click="goDetail(item.id)" />
        <button class="remove-button" @tap.stop="removeFavorite(item.id)">取消想看</button>
      </view>
    </view>

    <EmptyState v-else text="还没有想看的番剧" />
    <CustomTabBar current="/pages/favorite/favorite" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

import AnimeCard from '../../components/AnimeCard/AnimeCard.vue'
import EmptyState from '../../components/EmptyState/EmptyState.vue'
import CustomTabBar from '../../components/CustomTabBar/CustomTabBar.vue'
import { useFavoriteStore } from '../../stores/favorite.js'

const favoriteStore = useFavoriteStore()
const favorites = computed(() => favoriteStore.favorites)

function goDetail(id) {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

function removeFavorite(id) {
  favoriteStore.removeFavorite(id)
  uni.showToast({
    title: '已取消想看',
    icon: 'none'
  })
}

onShow(() => {
  uni.hideTabBar()
  favoriteStore.loadFavorites()
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

.favorite-item {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.remove-button {
  align-self: flex-end;
  min-width: 180rpx;
  height: 72rpx;
  padding: 0 32rpx;
  border-radius: 36rpx;
  background: transparent;
  color: #eb5757;
  font-size: 26rpx;
  font-weight: 600;
  line-height: 72rpx;
  border: 2rpx solid #eb5757;
  transition: all 0.15s ease;
}

.remove-button:active {
  background: #eb5757;
  color: #ffffff;
  transform: scale(0.95);
}

.remove-button::after {
  border: 0;
}
</style>
