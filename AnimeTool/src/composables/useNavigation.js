// 统一页面跳转 — 封装各页面共用的番剧详情导航
export function useNavigation() {
  /**
   * 跳转到番剧详情页
   * @param {number|string} id - MyAnimeList 番剧 ID
   */
  function goDetail(id) {
    uni.navigateTo({
      url: `/pages/detail?id=${id}`,
      animationType: 'fade-in',
      animationDuration: 300
    })
  }

  return { goDetail }
}
