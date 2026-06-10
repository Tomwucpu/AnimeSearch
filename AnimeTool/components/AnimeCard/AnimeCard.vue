<template>
  <view class="anime-card" @tap="$emit('click')">
    <image class="poster" :src="anime.image || '/static/logo.png'" mode="aspectFill" />

    <view class="info">
      <text class="title">{{ anime.title || '未命名番剧' }}</text>
      <view class="score-row">
        <RatingBadge :score="anime.score" />
        <text v-if="rankLabel" class="meta rank">{{ rankLabel }}</text>
        <text v-if="membersLabel" class="meta">{{ membersLabel }}</text>
      </view>

      <view class="meta-row">
        <text class="meta">{{ anime.type || '未知' }}</text>
        <text class="meta">{{ anime.episodes || '未知' }} 集</text>
        <text v-if="anime.status" class="meta">状态：{{ anime.status }}</text>
      </view>

      <view v-if="visibleGenres.length" class="genre-list">
        <text v-for="genre in visibleGenres" :key="genre" class="genre-tag">{{ genre }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

import RatingBadge from '../RatingBadge/RatingBadge.vue'
import {
  formatMembers,
  formatRank,
  getVisibleGenres
} from '../../utils/animeCardMeta.js'

const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const rankLabel = computed(() => formatRank(props.anime.rank))
const membersLabel = computed(() => formatMembers(props.anime.members))
const visibleGenres = computed(() => getVisibleGenres(props.anime.genres))
</script>

<style scoped>
.anime-card {
  display: flex;
  gap: 22rpx;
  width: 100%;
  padding: 22rpx;
  box-sizing: border-box;
  border-radius: 16rpx;
  background: #ffffff;
  box-shadow: 0 6rpx 20rpx rgba(35, 40, 58, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.anime-card:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 10rpx rgba(35, 40, 58, 0.04);
}

.poster {
  flex: 0 0 140rpx;
  width: 140rpx;
  height: 188rpx;
  border-radius: 12rpx;
  background: #eef1f5;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.info {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  justify-content: flex-start;
  gap: 12rpx;
}

.title {
  color: #1a1e2b;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 44rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.score-row,
.meta-row,
.genre-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
}

.meta {
  color: #64748b;
  font-size: 24rpx;
  line-height: 34rpx;
}

.rank {
  color: #f43f5e;
  font-weight: 700;
}

.genre-list {
  gap: 12rpx;
}

.genre-tag {
  height: 40rpx;
  padding: 0 16rpx;
  border-radius: 20rpx;
  background: #e0e7ff;
  color: #4338ca;
  font-size: 22rpx;
  line-height: 40rpx;
  font-weight: 500;
}
</style>
