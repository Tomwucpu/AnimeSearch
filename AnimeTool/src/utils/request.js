// Jikan v4 API 基础地址
const BASE_URL = 'https://api.jikan.moe/v4'

/**
 * uni.request Promise 封装，统一错误处理与状态码校验
 * @param {Object} options - { url, method, data }
 * @returns {Promise<Object>} res.data（Jikan 响应体，含 data 和 pagination）
 */
export function request(options = {}) {
  const { url, method = 'GET', data = {} } = options

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }

        reject(new Error('网络请求失败，请稍后重试'))
      },
      fail: () => {
        reject(new Error('网络请求失败，请稍后重试'))
      }
    })
  })
}
