<template>
  <view class="rating-badge">
    <text class="rating-star">★</text>
    <text class="rating-text">{{ displayScore }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: [Number, String],
    default: '暂无评分'
  }
})

const displayScore = computed(() => props.score || '暂无评分')
</script>

<style scoped>
.rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  min-width: 100rpx;
  height: 48rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background: #1F2635;
}

.rating-star {
  color: #f2c94c;
  font-size: 24rpx;
}

.rating-text {
  color: #DBE6FF;
  font-size: 26rpx;
  font-weight: 700;
}
</style>
