<template>
  <view class="custom-tab-bar">
    <view class="tab-item" :class="{ active: current === '/pages/index' }" @tap="switchTab('/pages/index')">
      <view class="tab-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 10 12 2l10 8"/>
          <path d="M4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10"/>
          <path d="M9 22V13h6v9"/>
        </svg>
      </view>
      <text class="tab-text">首页</text>
    </view>

    <view class="tab-item" :class="{ active: current === '/pages/schedule' }" @tap="switchTab('/pages/schedule')">
      <view class="tab-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4"/>
          <path d="M8 2v4"/>
          <path d="M3 10h18"/>
        </svg>
      </view>
      <text class="tab-text">放送表</text>
    </view>

    <view class="tab-item" :class="{ active: current === '/pages/search' }" @tap="switchTab('/pages/search')">
      <view class="tab-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="10.5" cy="10.5" r="7"/>
          <path d="M15.5 15.5 22 22"/>
        </svg>
      </view>
      <text class="tab-text">搜索</text>
    </view>

    <view class="tab-item" :class="{ active: current === '/pages/favorite' }" @tap="switchTab('/pages/favorite')">
      <view class="tab-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </view>
      <text class="tab-text">追番</text>
    </view>
  </view>
</template>

<script setup>
// 纯 CSS 自定义标签栏 — SVG 内联图标替代图片资源，减少网络请求
// 使用 uni.switchTab 切换页面，不支持重定向参数
const props = defineProps({
  current: {
    type: String,
    required: true
  }
})

function switchTab(path) {
  if (props.current === path) return
  uni.switchTab({ url: path })
}
</script>

<style scoped>
.custom-tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: calc(110rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  background: #121419;
  border-top: 2rpx solid #262F43;
  z-index: 999;
}

.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  flex: 1;
  height: 100%;
  color: #6B7A99;
  transition: color 0.2s ease;
}

.tab-item.active {
  color: #4976D0;
}

.tab-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #4976D0;
  border-radius: 0 0 4rpx 4rpx;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52rpx;
  height: 52rpx;
}

.tab-icon :deep(svg) {
  display: block;
}

.tab-text {
  font-size: 20rpx;
  font-weight: 600;
  line-height: 1;
}
</style>
