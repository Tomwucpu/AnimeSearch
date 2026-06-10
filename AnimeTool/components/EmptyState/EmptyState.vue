<template>
  <view class="empty-state">
    <image class="empty-image" src="/static/logo.png" mode="aspectFit" />
    <text class="empty-text">{{ text }}</text>
  </view>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '暂无内容'
  }
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 96rpx 32rpx;
}

.empty-image {
  width: 132rpx;
  height: 132rpx;
  opacity: 0.42;
}

.empty-text {
  margin-top: 24rpx;
  color: #8b95a5;
  font-size: 28rpx;
  line-height: 40rpx;
}
</style>
