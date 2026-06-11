<template>
  <view class="empty-state">
    <view class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      </view>
    <text class="empty-text">{{ text }}</text>
  </view>
</template>

<script setup>
// 空状态占位组件 — 显示文件夹图标 + 提示文本
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
  padding: 120rpx 32rpx;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  color: #6B7A99;
  opacity: 0.35;
}

.empty-icon :deep(svg) {
  display: block;
}

.empty-text {
  margin-top: 28rpx;
  color: #6B7A99;
  font-size: 26rpx;
  line-height: 40rpx;
}
</style>
