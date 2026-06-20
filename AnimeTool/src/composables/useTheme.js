// 主题 composable — 在页面/组件中获取响应式主题状态并绑定到根元素 class
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { onLoad, onShow } from '@dcloudio/uni-app'

/**
 * 在页面/组件中使用主题
 * 返回响应式的 pageClass（绑定到页面根 view）和 theme store 引用
 * 自动在页面加载和显示时同步导航栏颜色
 *
 * 用法：
 *   const { pageClass, themeStore } = useTheme()
 *   <view :class="pageClass">...</view>
 */
export function useTheme() {
  const themeStore = useThemeStore()

  const pageClass = computed(() => themeStore.pageClass)

  // 页面加载时同步导航栏颜色
  onLoad(() => {
    themeStore._updateNavBar()
  })

  // 页面显示时同步导航栏颜色（处理从其他页面返回的情况）
  onShow(() => {
    themeStore._updateNavBar()
  })

  return { pageClass, themeStore }
}
