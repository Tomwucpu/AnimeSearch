<template>
  <view class="anime-card" @tap="$emit('click')">
    <view class="poster-wrap">
      <image class="poster" :src="anime.image || '/static/logo.png'" mode="aspectFill" lazy-load />
    </view>

    <view class="info">
      <text class="title">{{ anime.title || '未命名番剧' }}</text>

      <view class="meta-row">
        <text v-if="anime.type" class="meta-tag">{{ anime.type }}</text>
        <text v-if="anime.year" class="meta-tag">{{ anime.year }}</text>
        <text v-if="anime.episodes && anime.episodes !== '未知'" class="meta-tag">{{ anime.episodes }} 集</text>
        <text v-if="statusLabel" class="meta-tag status-tag">{{ statusLabel }}</text>
        <text v-if="broadcastLabel" class="meta-tag broadcast-tag">{{ broadcastLabel }}</text>
      </view>

      <view class="rating-row">
        <view class="score">
          <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path fill="currentColor" d="M17.562 21.56a1 1 0 0 1-.465-.116L12 18.764l-5.097 2.68a1 1 0 0 1-1.45-1.053l.973-5.676l-4.124-4.02a1 1 0 0 1 .554-1.705l5.699-.828l2.549-5.164a1.04 1.04 0 0 1 1.793 0l2.548 5.164l5.699.828a1 1 0 0 1 .554 1.705l-4.124 4.02l.974 5.676a1 1 0 0 1-.985 1.169Z" />
          </svg>
          <text class="score-value">{{ scoreLabel }}</text>
        </view>
        <text v-if="membersLabel" class="members">{{ membersLabel }}</text>
        <text v-if="rankValue" class="rank">{{ rankValue }}</text>
      </view>

      <view v-if="visibleGenres.length" class="genre-row">
        <text v-for="genre in visibleGenres" :key="genre" class="genre-tag">{{ genre }}</text>
        <text v-if="extraGenreCount" class="genre-tag genre-more">+{{ extraGenreCount }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
// 番剧卡片组件 — 展示海报、标题、评分、排名、用户数、类型标签
import { computed } from 'vue'

import {
  formatBroadcast,
  formatMembers,
  formatRank,
  formatStatus
} from '../utils/animeCardMeta.js'

const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

// 格式化排名（含 "Ranking #" 前缀）
const rankLabel = computed(() => formatRank(props.anime.rank))
// 去除 "Ranking " 前缀，仅保留序号用于卡片内紧凑展示
const rankValue = computed(() => rankLabel.value.replace(/^Ranking\s*/, ''))
// 格式化用户数（万/亿单位）
const membersLabel = computed(() => formatMembers(props.anime.members))
// 评分显示，空值展示 "暂无"
const scoreLabel = computed(() => props.anime.score || '暂无')
// 播出状态中文标签
const statusLabel = computed(() => formatStatus(props.anime.status))
// 放送时间标签
const broadcastLabel = computed(() => formatBroadcast(props.anime.broadcast))

// 有效类型标签列表
const genreList = computed(() => (
  Array.isArray(props.anime.genres)
    ? props.anime.genres.filter(Boolean)
    : []
))
// 卡片内最多展示 2 个类型标签，超出部分用 "+N" 折叠
const visibleGenres = computed(() => genreList.value.slice(0, 2))
const extraGenreCount = computed(() => Math.max(genreList.value.length - visibleGenres.value.length, 0))
</script>

<style scoped>
.anime-card {
  display: flex;
  gap: 20rpx;
  width: 100%;
  padding: 16rpx;
  box-sizing: border-box;
  border: 2rpx solid var(--border-color);
  border-radius: 22rpx;
  background: var(--bg-card);
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.15s ease;
}

.anime-card:active {
  border-color: var(--accent-lighter);
  transform: scale(0.985);
}

.poster-wrap {
  flex: 0 0 200rpx;
  width: 200rpx;
  height: 280rpx;
  border-radius: 14rpx;
  overflow: hidden;
  background: var(--poster-bg);
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

.title {
  color: var(--text-primary);
  font-size: 32rpx;
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

.meta-tag {
  height: 44rpx;
  padding: 0 16rpx;
  border: 2rpx solid var(--border-color);
  border-radius: 10rpx;
  color: var(--text-secondary);
  font-size: 22rpx;
  line-height: 42rpx;
  font-weight: 600;
  white-space: nowrap;
}

.status-tag {
  color: var(--color-warning);
  border-color: var(--status-border);
}

.broadcast-tag {
  color: var(--color-success);
  border-color: var(--broadcast-border);
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.score {
  display: flex;
  align-items: center;
  gap: 6rpx;
  color: var(--star-filled);
}

.score-star {
  color: var(--star-filled);
  font-size: 28rpx;
}

.score-value {
  color: var(--text-primary);
  font-size: 30rpx;
  font-weight: 700;
}

.members {
  color: var(--text-muted);
  font-size: 22rpx;
  font-weight: 600;
}

.rank {
  color: var(--accent-lightest);
  font-size: 22rpx;
  font-weight: 700;
}

.genre-row {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12rpx;
  margin-top: auto;
}

.genre-tag {
  max-width: 140rpx;
  height: 50rpx;
  padding: 0 18rpx;
  border-radius: 12rpx;
  background: var(--bg-tertiary);
  color: var(--accent-lightest);
  font-size: 22rpx;
  line-height: 50rpx;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.genre-more {
  min-width: 40rpx;
  padding: 0 12rpx;
  text-align: center;
}
</style>
