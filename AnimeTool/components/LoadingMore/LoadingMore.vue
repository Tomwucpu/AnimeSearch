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
  min-height: 88rpx;
}

.loading-text {
  color: #8b95a5;
  font-size: 24rpx;
}
</style>
