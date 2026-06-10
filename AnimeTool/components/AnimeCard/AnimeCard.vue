<template>
  <view class="anime-card" @tap="$emit('click')">
    <image class="poster" :src="anime.image || '/static/logo.png'" mode="aspectFill" />

    <view class="info">
      <text class="title">{{ anime.title || '未命名番剧' }}</text>
      <view class="meta-row">
        <RatingBadge :score="anime.score" />
        <text class="meta">{{ anime.type || '未知' }}</text>
        <text class="meta">{{ anime.episodes || '未知' }} 集</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import RatingBadge from '../RatingBadge/RatingBadge.vue'

defineProps({
  anime: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.anime-card {
  display: flex;
  gap: 22rpx;
  width: 100%;
  padding: 22rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 28rpx rgba(35, 40, 58, 0.06);
}

.poster {
  flex: 0 0 132rpx;
  width: 132rpx;
  height: 176rpx;
  border-radius: 6rpx;
  background: #eef1f5;
}

.info {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  color: #23283a;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 42rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
}

.meta {
  color: #667085;
  font-size: 24rpx;
  line-height: 34rpx;
}
</style>
