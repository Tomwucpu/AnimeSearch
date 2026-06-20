<template>
  <view class="back-top" :class="{ visible }" @tap="onTap">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  </view>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

function onTap() {
  emit('click')
}
</script>

<style scoped>
.back-top {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
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
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.back-top.visible {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}
</style>
