<template>
  <view class="skeleton-card">
    <view class="poster-wrap">
      <view class="poster shimmer" />
    </view>

    <view class="info">
      <view class="title-line shimmer" style="width: 85%" />
      <view class="title-line shimmer" style="width: 55%" />

      <view class="meta-row">
        <view class="meta-chip shimmer" style="width: 80rpx" />
        <view class="meta-chip shimmer" style="width: 100rpx" />
        <view class="meta-chip shimmer" style="width: 90rpx" />
      </view>

      <view class="rating-row">
        <view class="score-bar shimmer" style="width: 120rpx" />
        <view class="members-bar shimmer" style="width: 100rpx" />
        <view class="rank-bar shimmer" style="width: 80rpx" />
      </view>

      <view class="genre-row">
        <view class="genre-chip shimmer" style="width: 100rpx" />
        <view class="genre-chip shimmer" style="width: 80rpx" />
      </view>
    </view>
  </view>
</template>

<script setup>
// 骨架卡片组件 — 模拟 AnimeCard 占位布局，用于列表初始加载时的骨架屏
</script>

<style scoped>
.skeleton-card {
  display: flex;
  gap: 20rpx;
  width: 100%;
  padding: 16rpx;
  box-sizing: border-box;
  border: 2rpx solid #262F43;
  border-radius: 22rpx;
  background: #121419;
  overflow: hidden;
}

.poster-wrap {
  flex: 0 0 200rpx;
  width: 200rpx;
  height: 280rpx;
  border-radius: 14rpx;
  overflow: hidden;
}

.poster {
  width: 100%;
  height: 100%;
}

.info {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16rpx;
  padding: 6rpx 0;
}

.title-line {
  height: 30rpx;
  border-radius: 8rpx;
}

.title-line:first-child {
  margin-top: 6rpx;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.meta-chip {
  height: 44rpx;
  border-radius: 10rpx;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.score-bar,
.members-bar,
.rank-bar {
  height: 26rpx;
  border-radius: 8rpx;
}

.genre-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: auto;
}

.genre-chip {
  height: 50rpx;
  border-radius: 12rpx;
}

.shimmer {
  background: linear-gradient(90deg, #1a1f2e 25%, #262f43 50%, #1a1f2e 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
