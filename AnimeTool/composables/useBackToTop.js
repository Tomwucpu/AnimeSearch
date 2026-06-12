// 回到顶部 composable — 监听页面滚动位置，自动控制按钮显隐
import { ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

/**
 * @returns {{ backTopVisible: Ref<boolean>, scrollToTop: Function }}
 */
export function useBackToTop() {
  const { windowHeight } = uni.getSystemInfoSync()
  const backTopVisible = ref(false)

  onPageScroll((e) => {
    backTopVisible.value = e.scrollTop > windowHeight
  })

  function scrollToTop() {
    uni.pageScrollTo({ scrollTop: 0, duration: 300 })
  }

  return { backTopVisible, scrollToTop }
}
