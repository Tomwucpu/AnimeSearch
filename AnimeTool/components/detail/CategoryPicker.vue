<template>
  <view v-if="visible" class="category-picker-overlay" @tap="close">
    <view class="category-picker" @tap.stop>
      <text class="picker-title">选择追番状态</text>
      <view class="picker-options">
        <view
          v-for="cat in categoryOptions"
          :key="cat.key"
          class="picker-option"
          :class="{ active: currentCategory === cat.key }"
          :style="getOptionStyle(cat.key)"
          @tap="select(cat.key)"
        >
          <view class="option-icon">
            <svg v-if="cat.key === 'watching'" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z" />
            </svg>
            <svg v-else-if="cat.key === 'want_to_watch'" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="currentColor" d="M17.562 21.56a1 1 0 0 1-.465-.116L12 18.764l-5.097 2.68a1 1 0 0 1-1.45-1.053l.973-5.676l-4.124-4.02a1 1 0 0 1 .554-1.705l5.699-.828l2.549-5.164a1.04 1.04 0 0 1 1.793 0l2.548 5.164l5.699.828a1 1 0 0 1 .554 1.705l-4.124 4.02l.974 5.676a1 1 0 0 1-.985 1.169Z" />
            </svg>
            <svg v-else-if="cat.key === 'watched'" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16">
              <path d="M0 0h16v16H0z" fill="none" />
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                <path d="m14.25 8.75c-.5 2.5-2.3849 4.85363-5.03069 5.37991-2.64578.5263-5.33066-.7044-6.65903-3.0523-1.32837-2.34784-1.00043-5.28307.81336-7.27989 1.81379-1.99683 4.87636-2.54771 7.37636-1.54771" />
                <polyline points="5.75 7.75 8.25 10.25 14.25 3.75" />
              </g>
            </svg>
          </view>
          <text class="option-label">{{ cat.label }}</text>
          <view v-if="currentCategory === cat.key" class="option-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </view>
        </view>
      </view>
      <view v-if="currentCategory" class="picker-remove" @tap="remove">
        <text class="remove-text">取消追番</text>
      </view>
    </view>
  </view>
</template>

<script setup>
// 追番分类选择底部弹窗 — 展示在看/想看/看过三个选项，支持取消追番
import { WATCH_CATEGORIES, CATEGORY_COLORS } from '../../stores/favorite.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentCategory: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'select', 'remove'])

const categoryOptions = [
  { key: 'watching', label: WATCH_CATEGORIES.watching },
  { key: 'want_to_watch', label: WATCH_CATEGORIES.want_to_watch },
  { key: 'watched', label: WATCH_CATEGORIES.watched }
]

function close() {
  emit('close')
}

function select(key) {
  emit('select', key)
}

function remove() {
  emit('remove')
}

function getOptionStyle(key) {
  if (props.currentCategory !== key) return {}
  const colors = CATEGORY_COLORS[key]
  if (!colors) return {}
  return { borderColor: colors.bg, color: colors.bg }
}
</script>

<style scoped>
.category-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.category-picker {
  width: 100%;
  background: #161922;
  border-radius: 40rpx 40rpx 0 0;
  padding: 48rpx 32rpx;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
  animation: slideUp 0.25s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.picker-title {
  display: block;
  color: #DBE6FF;
  font-size: 34rpx;
  font-weight: 800;
  text-align: center;
  margin-bottom: 40rpx;
}

.picker-options {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.picker-option {
  display: flex;
  align-items: center;
  gap: 24rpx;
  height: 104rpx;
  padding: 0 32rpx;
  border-radius: 22rpx;
  background: #1F2635;
  color: #A1C4F7;
  transition: all 0.15s ease;
}

.picker-option.active {
  background: rgba(73, 118, 208, 0.15);
  border: 2rpx solid;
}

.picker-option:active {
  transform: scale(0.98);
}

.option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  flex-shrink: 0;
}

.option-label {
  flex: 1;
  font-size: 30rpx;
  font-weight: 600;
}

.option-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
}

.picker-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96rpx;
  margin-top: 24rpx;
  border-radius: 48rpx;
  background: rgba(235, 87, 87, 0.1);
  border: 2rpx solid rgba(235, 87, 87, 0.3);
}

.picker-remove:active {
  background: rgba(235, 87, 87, 0.2);
}

.remove-text {
  color: #EB5757;
  font-size: 30rpx;
  font-weight: 700;
}
</style>
