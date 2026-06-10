<template>
  <view class="rating-badge">
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
  justify-content: center;
  min-width: 96rpx;
  height: 42rpx;
  padding: 0 16rpx;
  border-radius: 6rpx;
  background: #fff3d8;
}

.rating-text {
  color: #9a6400;
  font-size: 24rpx;
  font-weight: 600;
  line-height: 42rpx;
}
</style>
