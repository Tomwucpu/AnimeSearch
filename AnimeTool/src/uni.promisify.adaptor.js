// uni-app Promise 适配器 — 为 uni.callback API 添加 .then/.catch 支持（Vue 2 兼容层）
uni.addInterceptor({
  returnValue (res) {
    if (!(!!res && (typeof res === "object" || typeof res === "function") && typeof res.then === "function")) {
      return res;
    }
    return new Promise((resolve, reject) => {
      res.then((res) => {
        if (!res) return resolve(res) 
        return res[0] ? reject(res[0]) : resolve(res[1])
      });
    });
  },
});