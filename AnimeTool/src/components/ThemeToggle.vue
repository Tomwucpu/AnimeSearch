<template>
  <view class="theme-toggle" :class="{ shifted: shiftUp }" @tap="onTap">
    <!-- 暗色模式：月亮 -->
    <svg v-if="mode === 'dark'" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
    <!-- 亮色模式：太阳 -->
    <svg v-else-if="mode === 'light'" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <!-- 跟随系统：显示器 -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme.js'

const props = defineProps({
  shiftUp: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])
const { themeStore } = useTheme()

const mode = computed(() => themeStore.mode)

function onTap() {
  const order = ['dark', 'light', 'system']
  const idx = order.indexOf(themeStore.mode)
  const next = order[(idx + 1) % order.length]
  themeStore.setMode(next)
  emit('change', next)
}
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  right: 30rpx;
  bottom: 210rpx;
  z-index: 900;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: var(--bg-float);
  border: 2rpx solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b92a8;
  transition: bottom 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
}

.theme-toggle.shifted {
  bottom: 300rpx;
}
</style>
