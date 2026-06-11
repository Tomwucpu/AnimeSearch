// 通用分页加载 composable — 封装 loading 锁、页码管理、状态切换、错误处理等复用逻辑
import { ref } from 'vue'

/**
 * @param {Function} fetchFn - async (page: number) => { list: Array, pagination: Object }
 * @returns {{ list, page, loading, loadStatus, loadData }}
 */
export function usePagedApi(fetchFn) {
  const list = ref([])
  const page = ref(1)
  const loading = ref(false)
  const loadStatus = ref('more')

  /**
   * 加载一页数据
   * @param {boolean} reset - true: 重新从第 1 页加载；false: 加载下一页
   * @returns {Promise<boolean>} 是否实际发起了请求（用于调用方判断是否需要执行后续操作）
   */
  async function loadData(reset = false) {
    if (loading.value) return false
    if (!reset && loadStatus.value === 'noMore') return false

    loading.value = true
    loadStatus.value = reset ? 'more' : 'loading'

    try {
      const nextPage = reset ? 1 : page.value
      const result = await fetchFn(nextPage)
      const nextList = result.list

      if (reset) {
        list.value = nextList
      } else {
        list.value = list.value.concat(nextList)
      }

      page.value = nextPage + 1
      loadStatus.value = result.pagination?.has_next_page === false || nextList.length === 0
        ? 'noMore'
        : 'more'

      return true
    } catch (error) {
      uni.showToast({
        title: error.message || '网络请求失败，请稍后重试',
        icon: 'none'
      })
      loadStatus.value = 'more'
      return true
    } finally {
      loading.value = false
    }
  }

  return { list, page, loading, loadStatus, loadData }
}
