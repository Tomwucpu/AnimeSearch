<template>
  <view class="swipe-container">
    <view class="swipe-actions" :style="actionAreaStyle">
      <view
        v-for="(action, index) in actions"
        :key="index"
        class="swipe-action-btn"
        :class="action.class"
        @tap.stop="onAction(index)"
      >
        {{ action.text }}
      </view>
    </view>
    <view
      class="swipe-content"
      :style="contentStyle"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <slot />
    </view>
  </view>
</template>

<script setup>
// 左滑操作组件 — 包裹内容区域，左滑露出操作按钮，松手吸附展开/收起
import { ref, computed, watch } from 'vue'

const props = defineProps({
  // 是否展开（受控），父组件通过当前展开 ID 实现单条互斥
  open: {
    type: Boolean,
    default: false
  },
  // 操作按钮列表，每项包含 text 和 class
  actions: {
    type: Array,
    default: () => [{ text: '取消想看', class: 'danger' }]
  },
  // 操作区域宽度，单位 rpx
  actionWidth: {
    type: Number,
    default: 160
  }
})

const emit = defineEmits(['update:open', 'action'])

// 将 rpx 设计稿尺寸换算为实际像素，供 touch 事件计算使用
const { windowWidth } = uni.getSystemInfoSync()
const rpxRatio = windowWidth / 750
const actionWidthPx = props.actionWidth * rpxRatio

// 内容区域当前水平偏移（px），取负值表示左移
const translateX = ref(0)
// 触摸起始坐标和偏移量
const startX = ref(0)
const startY = ref(0)
const startTranslate = ref(0)
// 是否正在跟随手指移动（移动期间禁用 transition 动画）
const isMoving = ref(false)
// 判定滑动方向，null 表示尚未判定
const moveDirection = ref(null)

const actionAreaStyle = computed(() => ({
  width: `${props.actionWidth}rpx`
}))

const contentStyle = computed(() => ({
  transform: `translateX(${translateX.value}px)`,
  transition: isMoving.value ? 'none' : 'transform 0.25s ease'
}))

// 同步外部 open 状态，自动执行吸附动画
watch(() => props.open, (val) => {
  translateX.value = val ? -actionWidthPx : 0
}, { immediate: true })

// 记录触摸起始点，重置方向判定
function onTouchStart(e) {
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
  startTranslate.value = translateX.value
  moveDirection.value = null
}

// 首次明显移动后锁定为横向或纵向，横向滑动时跟随手指偏移
function onTouchMove(e) {
  const deltaX = e.touches[0].clientX - startX.value
  const deltaY = e.touches[0].clientY - startY.value

  if (moveDirection.value === null) {
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      moveDirection.value = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
    }
  }

  if (moveDirection.value !== 'horizontal') return

  isMoving.value = true

  let newTranslate = startTranslate.value + deltaX
  newTranslate = Math.max(-actionWidthPx, Math.min(0, newTranslate))
  translateX.value = newTranslate
}

// 松手后根据阈值判断吸附到展开或收起位置
function onTouchEnd() {
  isMoving.value = false
  moveDirection.value = null

  const threshold = actionWidthPx / 3

  if (startTranslate.value === 0) {
    if (translateX.value < -threshold) {
      translateX.value = -actionWidthPx
      emit('update:open', true)
    } else {
      translateX.value = 0
    }
  } else {
    if (translateX.value > -actionWidthPx + threshold) {
      translateX.value = 0
      emit('update:open', false)
    } else {
      translateX.value = -actionWidthPx
    }
  }
}

// 点击操作按钮后通知父组件并自动收起
function onAction(index) {
  emit('action', index)
  emit('update:open', false)
}
</script>

<style scoped>
.swipe-container {
  position: relative;
  overflow: hidden;
  border-radius: 22rpx;
}

.swipe-actions {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: stretch;
}

.swipe-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eb5757;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
  border-radius: 0 22rpx 22rpx 0;
}

.swipe-content {
  position: relative;
  z-index: 1;
  background: #0F1115;
}
</style>
