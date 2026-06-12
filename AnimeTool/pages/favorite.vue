<template>
  <view class="page">
    <view class="fade-curtain" :class="{ hide: curtainHide }" />

    <view v-if="favorites.length" class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @tap="activeTab = tab.key"
      >
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>

    <view v-if="filteredFavorites.length" class="list">
      <view v-for="item in filteredFavorites" :key="item.id" class="favorite-item">
        <SwipeAction
          :open="currentOpenId === item.id"
          :actions="swipeActions"
          @update:open="(val) => onSwipeOpen(item.id, val)"
          @action="removeFavorite(item.id)"
        >
          <view class="card-wrapper">
            <AnimeCard :anime="item" @click="onCardClick(item.id)" />
            <text class="category-tag">{{ getCategoryLabel(item.category) }}</text>
          </view>
        </SwipeAction>
      </view>
    </view>

    <EmptyState v-else :text="emptyText" />
    <BackToTop :visible="backTopVisible" @click="scrollToTop" />
    <CustomTabBar current="/pages/favorite" />
  </view>
</template>

<script setup>
// 追番页：分类 Tab 筛选 + 左滑取消追番
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

import AnimeCard from '../components/AnimeCard.vue'
import EmptyState from '../components/EmptyState.vue'
import BackToTop from '../components/BackToTop.vue'
import CustomTabBar from '../components/CustomTabBar.vue'
import SwipeAction from '../components/favorite/SwipeAction.vue'
import { useFavoriteStore, WATCH_CATEGORIES } from '../stores/favorite.js'
import { useNavigation } from '../composables/useNavigation.js'
import { useBackToTop } from '../composables/useBackToTop.js'
import { useFadeIn } from '../composables/useFadeIn.js'

const { goDetail } = useNavigation()
const { backTopVisible, scrollToTop } = useBackToTop()
const { curtainHide } = useFadeIn()

const favoriteStore = useFavoriteStore()
const favorites = computed(() => favoriteStore.favorites)

const tabs = [
  { key: null, label: '全部' },
  { key: 'watching', label: WATCH_CATEGORIES.watching },
  { key: 'want_to_watch', label: WATCH_CATEGORIES.want_to_watch },
  { key: 'watched', label: WATCH_CATEGORIES.watched }
]

const activeTab = ref(null)
const currentOpenId = ref(null)

const swipeActions = [{ text: '取消追番', class: 'danger' }]

const filteredFavorites = computed(() => favoriteStore.byCategory(activeTab.value))

const emptyText = computed(() => {
  if (!favorites.value.length) return '还没有追番记录'
  return '该分类下暂无番剧'
})

function getCategoryLabel(category) {
  return WATCH_CATEGORIES[category] || ''
}

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

function removeFavorite(id) {
  favoriteStore.removeFavorite(id)
  currentOpenId.value = null
  uni.showToast({
    title: '已取消追番',
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

.fade-curtain {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
  background: #0F1115;
  opacity: 1;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.fade-curtain.hide {
  opacity: 0;
}

.tab-bar {
  display: flex;
  gap: 12rpx;
  margin-bottom: 32rpx;
}

.tab-item {
  flex: 1;
  height: 60rpx;
  padding: 0;
  border-radius: 30rpx;
  background: #1F2635;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.tab-item.active {
  background: #1847B1;
}

.tab-text {
  color: #A1C4F7;
  font-size: 26rpx;
  font-weight: 600;
}

.tab-item.active .tab-text {
  color: #ffffff;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.card-wrapper {
  position: relative;
}

.category-tag {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  height: 40rpx;
  padding: 0 16rpx;
  border-radius: 8rpx;
  background: rgba(73, 118, 208, 0.85);
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 600;
  line-height: 40rpx;
  backdrop-filter: blur(10rpx);
}
</style>
