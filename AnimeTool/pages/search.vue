<template>
  <view class="page">
    <view class="fade-curtain" :class="{ hide: curtainHide }" />
    <view v-if="mode === 'keyword'" class="search-bar">
      <input
        v-model="keyword"
        class="search-input"
        placeholder="输入关键词搜索番剧"
        confirm-type="search"
        @confirm="startSearch"
      />
      <button class="search-button" @tap="startSearch">搜索</button>
    </view>

    <view class="filter-toggle" @tap="togglePanel">
      <view class="filter-toggle-left">
        <text class="filter-toggle-text">筛选条件</text>
        <view v-if="activeFilterCount" class="filter-badge">
          <text>{{ activeFilterCount }}</text>
        </view>
      </view>
      <view class="filter-toggle-arrow" :class="{ open: filterExpanded }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </view>
    </view>

    <view class="filter-panel-wrapper" :class="{ expanded: filterExpanded }">
      <view class="filter-panel">
      <view class="filter-row">
        <text class="filter-label">年份</text>
        <scroll-view class="chip-scroll" scroll-x :show-scrollbar="false">
          <view class="chip-list">
            <view
              class="chip"
              :class="{ active: !filters.year }"
              @tap="setFilter('year', null)"
            >
              <text>全部</text>
            </view>
            <view
              v-for="y in yearOptions"
              :key="y"
              class="chip"
              :class="{ active: filters.year === y }"
              @tap="setFilter('year', y)"
            >
              <text>{{ y }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="filter-row">
        <text class="filter-label">季度</text>
        <view class="chip-list">
          <view
            class="chip"
            :class="{ active: !filters.season }"
            @tap="setFilter('season', null)"
          >
            <text>全部</text>
          </view>
          <view
            v-for="s in seasonOptions"
            :key="s.value"
            class="chip"
            :class="{ active: filters.season === s.value }"
            @tap="setFilter('season', s.value)"
          >
            <text>{{ s.label }}</text>
          </view>
        </view>
      </view>

      <view class="filter-row">
        <text class="filter-label">类型</text>
        <text v-if="filters.genres.length" class="genre-count">最多5个</text>
      </view>
      <view class="genre-grid">
        <view
          v-for="g in visibleGenres"
          :key="g.id"
          class="chip"
          :class="{ active: isGenreSelected(g.id) }"
          @tap="toggleGenre(g.id)"
        >
          <text>{{ g.nameZh }}</text>
        </view>
      </view>
      <view
        v-if="genres.length > 24"
        class="genre-more"
        @tap="genreExpanded = !genreExpanded"
      >
        <text>{{ genreExpanded ? '收起' : `展开更多 (${genres.length - 24})` }}</text>
      </view>

      <view class="filter-row">
        <text class="filter-label">排序</text>
        <view class="chip-list">
          <view
            class="chip"
            :class="{ active: filters.orderBy === 'members' }"
            @tap="setFilter('orderBy', 'members')"
          >
            <text>用户数</text>
          </view>
          <view
            class="chip"
            :class="{ active: filters.orderBy === 'score' }"
            @tap="setFilter('orderBy', 'score')"
          >
            <text>评分</text>
          </view>
        </view>
      </view>
    </view>
    </view>

    <view v-if="loading && !results.length" class="list">
      <SkeletonCard v-for="n in 4" :key="n" />
    </view>

    <view v-else-if="results.length" class="list">
      <AnimeCard
        v-for="item in results"
        :key="item.id"
        :anime="item"
        @click="goDetail(item.id)"
      />
    </view>

    <EmptyState v-if="!hasSearched && !loading && !results.length" text="输入关键词或选择筛选条件" />
    <EmptyState v-else-if="hasSearched && !loading && !results.length" text="没有找到相关番剧" />
    <LoadingMore v-if="results.length" :status="loadStatus" />
    <BackToTop :visible="backTopVisible" @click="scrollToTop" />
    <CustomTabBar current="/pages/search" />
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'

import AnimeCard from '../components/AnimeCard.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingMore from '../components/LoadingMore.vue'
import BackToTop from '../components/BackToTop.vue'
import CustomTabBar from '../components/CustomTabBar.vue'
import { searchAnime, filterAnime, getGenres } from '../api/anime.js'
import { useNavigation } from '../composables/useNavigation.js'
import { usePagedApi } from '../composables/usePagedApi.js'
import { useBackToTop } from '../composables/useBackToTop.js'
import { useFadeIn } from '../composables/useFadeIn.js'

const { goDetail } = useNavigation()
const { backTopVisible, scrollToTop } = useBackToTop()
const { curtainHide } = useFadeIn()

const keyword = ref('')
const mode = ref('keyword')
const hasSearched = ref(false)
const filterExpanded = ref(false)
const genreExpanded = ref(false)
const genres = ref([])

const filters = ref({
  year: null,
  season: null,
  genres: [],
  orderBy: 'members',
  sort: 'desc'
})

const yearOptions = computed(() => {
  const current = new Date().getFullYear()
  const years = []
  for (let y = current; y >= 2020; y--) {
    years.push(y)
  }
  return years
})

const seasonOptions = [
  { value: 'winter', label: '冬' },
  { value: 'spring', label: '春' },
  { value: 'summer', label: '夏' },
  { value: 'fall', label: '秋' }
]

const visibleGenres = computed(() => {
  if (genreExpanded.value) return genres.value
  return genres.value.slice(0, 24)
})

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.year) count++
  if (filters.value.season) count++
  if (filters.value.genres.length) count++
  return count
})

const fetchFn = (page) => {
  if (mode.value === 'keyword') {
    return searchAnime(keyword.value.trim(), page)
  }
  if (mode.value === 'filter') {
    return filterAnime(filters.value, page)
  }
  return Promise.resolve({ list: [], pagination: {} })
}

const { list: results, loading, loadStatus, loadData } = usePagedApi(fetchFn)

let debounceTimer = null

function debounceLoad(reset) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loadSearch(reset)
  }, 200)
}

async function loadSearch(reset = false) {
  hasSearched.value = true
  await loadData(reset)
}

function startSearch() {
  mode.value = 'keyword'
  filterExpanded.value = false
  loadSearch(true)
}

function togglePanel() {
  if (filterExpanded.value) {
    filterExpanded.value = false
    genreExpanded.value = false
    mode.value = 'keyword'
    return
  }
  filterExpanded.value = true
  mode.value = 'filter'
  keyword.value = ''
  if (!filters.value.year && !filters.value.season && !filters.value.genres.length) {
    results.value = []
    hasSearched.value = false
    loadStatus.value = 'more'
  }
}

function setFilter(key, value) {
  if (filters.value[key] === value) return
  filters.value[key] = value
  mode.value = 'filter'
  keyword.value = ''
  debounceLoad(true)
}

function isGenreSelected(id) {
  return filters.value.genres.includes(id)
}

function toggleGenre(id) {
  const list = filters.value.genres
  const idx = list.indexOf(id)
  if (idx > -1) {
    list.splice(idx, 1)
  } else if (list.length < 5) {
    list.push(id)
  }
  filters.value.genres = [...list]
  mode.value = 'filter'
  keyword.value = ''
  debounceLoad(true)
}

watch(() => filters.value.year, () => {
  if (filters.value.year === null && filters.value.season) {
    filters.value.season = null
  }
})

onLoad(async () => {
  try {
    genres.value = await getGenres()
  } catch {
    genres.value = []
  }
})

onShow(() => {
  uni.hideTabBar()
})

onReachBottom(() => {
  if (mode.value !== 'none') {
    loadSearch(false)
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  padding-bottom: calc(110rpx + env(safe-area-inset-bottom) + 24rpx);
  box-sizing: border-box;
  background: #0F1115;
}

.fade-curtain {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
  background: #0F1115;
  opacity: 1;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.fade-curtain.hide {
  opacity: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.search-input {
  flex: 1;
  height: 88rpx;
  padding: 0 36rpx;
  box-sizing: border-box;
  border-radius: 44rpx;
  background: #161922;
  color: #DBE6FF;
  font-size: 28rpx;
  border: 2rpx solid #262F43;
}

.search-input:focus {
  border-color: #4976D0;
}

.search-button {
  width: 140rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #1847B1;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 88rpx;
  transition: transform 0.15s ease;
}

.search-button:active {
  transform: scale(0.95);
  background: #0C287F;
}

.search-button::after {
  border: 0;
}

.filter-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 24rpx;
  margin-bottom: 8rpx;
  background: #161922;
  border: 2rpx solid #262F43;
  border-radius: 14rpx;
}

.filter-toggle-left {
  display: flex;
  align-items: center;
}

.filter-toggle-text {
  color: #A1C4F7;
  font-size: 28rpx;
  font-weight: 600;
}

.filter-badge {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #1847B1;
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12rpx;
}

.filter-toggle-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  color: #6B7A99;
  transition: transform 0.25s ease;
}

.filter-toggle-arrow :deep(svg) {
  display: block;
}

.filter-toggle-arrow.open {
  transform: rotate(180deg);
  color: #4976D0;
}

.filter-panel-wrapper {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.35s ease, opacity 0.25s ease;
}

.filter-panel-wrapper.expanded {
  max-height: 3000rpx;
  opacity: 1;
}

.filter-panel {
  margin-bottom: 24rpx;
  padding: 24rpx;
  background: #161922;
  border: 2rpx solid #262F43;
  border-radius: 14rpx;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.filter-label {
  flex-shrink: 0;
  width: 80rpx;
  color: #DBE6FF;
  font-size: 26rpx;
  font-weight: 700;
}

.genre-count {
  color: #6B7A99;
  font-size: 22rpx;
}

.chip-scroll {
  flex: 1;
  min-width: 0;
}

.chip-list {
  display: flex;
  gap: 14rpx;
  flex-wrap: wrap;
}

.chip {
  display: flex;
  align-items: center;
  height: 60rpx;
  padding: 0 22rpx;
  border: 2rpx solid #262F43;
  border-radius: 12rpx;
  color: #99A8C9;
  font-size: 24rpx;
  font-weight: 600;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.chip.active {
  background: #1847B1;
  border-color: #1847B1;
  color: #ffffff;
}

.genre-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-bottom: 16rpx;
}

.genre-more {
  display: flex;
  justify-content: center;
  padding: 12rpx 0;
  margin-bottom: 8rpx;
  color: #4976D0;
  font-size: 24rpx;
  font-weight: 600;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
