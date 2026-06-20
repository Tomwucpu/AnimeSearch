<template>
  <view class="star-rating">
    <view class="star-bg">
      <svg v-for="i in 5" :key="'bg-' + i" class="star-icon" viewBox="0 0 24 24">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="var(--star-empty)"
        />
      </svg>
    </view>
    <view class="star-fg" :style="{ width: fillPercent + '%' }">
      <svg v-for="i in 5" :key="'fg-' + i" class="star-icon" viewBox="0 0 24 24">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="var(--star-filled)"
        />
      </svg>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: [Number, String],
    default: 0
  }
})

const fillPercent = computed(() => {
  const num = Number(props.score)
  if (!num || num <= 0) return 0
  return Math.min(num / 10 * 100, 100)
})
</script>

<style scoped>
.star-rating {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  line-height: 1;
}

.star-bg {
  display: inline-flex;
  gap: 4rpx;
}

.star-fg {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-flex;
  gap: 4rpx;
  overflow: hidden;
  white-space: nowrap;
}

.star-icon {
  width: 30rpx;
  height: 30rpx;
  flex-shrink: 0;
}
</style>
