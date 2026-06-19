// 页面淡入动画 composable — 遮罩淡出方案，onHide 时覆盖遮罩，onShow 时淡出露出内容
import { ref } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'

/**
 * @returns {{ curtainHide: Ref<boolean> }} — 用于模板绑定 :class="{ hide: curtainHide }"
 */
export function useFadeIn() {
  const curtainHide = ref(true)

  onHide(() => {
    curtainHide.value = false
  })

  onShow(() => {
    setTimeout(() => {
      curtainHide.value = true
    }, 16)
  })

  return { curtainHide }
}
