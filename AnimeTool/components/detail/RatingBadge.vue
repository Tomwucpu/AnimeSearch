<template>
  <view class="rating-badge">
    <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="#f2c94c" d="M17.562 21.56a1 1 0 0 1-.465-.116L12 18.764l-5.097 2.68a1 1 0 0 1-1.45-1.053l.973-5.676l-4.124-4.02a1 1 0 0 1 .554-1.705l5.699-.828l2.549-5.164a1.04 1.04 0 0 1 1.793 0l2.548 5.164l5.699.828a1 1 0 0 1 .554 1.705l-4.124 4.02l.974 5.676a1 1 0 0 1-.985 1.169Z" />
    </svg>
    <text class="rating-text">{{ displayScore }}</text>
  </view>
</template>

<script setup>
// 评分徽章组件 — 星标 + 评分数字
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
