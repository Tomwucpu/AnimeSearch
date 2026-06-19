// uni-app 入口文件，通过条件编译同时兼容 Vue 2 / Vue 3
import App from './App'

// #ifndef VUE3
// Vue 2 编译入口（HBuilderX 旧版兼容）
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
// Vue 3 编译入口，注册 Pinia 及持久化插件
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  // pinia-plugin-persistedstate：store 状态变更时自动写入 storage，初始化时自动读取
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)

  return {
    app
  }
}
// #endif
