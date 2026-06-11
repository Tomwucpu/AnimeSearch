<template>
  <view class="loading-more">
    <text class="loading-text">{{ text }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'more'
  }
})

const text = computed(() => {
  const map = {
    more: '上拉加载更多',
    loading: '加载中...',
    noMore: '没有更多了'
  }

  return map[props.status] || map.more
})
</script>

<style scoped>
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100rpx;
  padding: 16rpx 0;
}

.loading-text {
  color: #6B7A99;
  font-size: 24rpx;
}
</style>
