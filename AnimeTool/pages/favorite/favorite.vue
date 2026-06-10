<template>
  <view class="page">
    <view v-if="favorites.length" class="list">
      <view v-for="item in favorites" :key="item.id" class="favorite-item">
        <AnimeCard :anime="item" @click="goDetail(item.id)" />
        <button class="remove-button" @tap.stop="removeFavorite(item.id)">取消想看</button>
      </view>
    </view>

    <EmptyState v-else text="还没有想看的番剧" />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

import AnimeCard from '../../components/AnimeCard/AnimeCard.vue'
import EmptyState from '../../components/EmptyState/EmptyState.vue'
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
  favoriteStore.loadFavorites()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  background: #f6f7fb;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
}

.favorite-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.remove-button {
  align-self: flex-end;
  min-width: 160rpx;
  height: 64rpx;
  padding: 0 20rpx;
  border-radius: 8rpx;
  background: #ffffff;
  color: #e85d75;
  font-size: 26rpx;
  line-height: 64rpx;
}

.remove-button::after {
  border-color: #f4b8c4;
  border-radius: 8rpx;
}
</style>
