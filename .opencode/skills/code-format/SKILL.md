---
name: code-format
description: Use when writing or editing code in the AnimeTool uni-app project. Enforces decoupling, reuse, single responsibility, and comment conventions. Applies to all .vue, .js, and .mjs files.
---

# AnimeTool 代码格式规范

## 一、解耦 — 单向依赖、接口明确

### 数据流方向（不可逆）

```
Page (pages/*.vue)
  → API (api/anime.js)
    → Utils (utils/normalize*.js)
      → request.js
  → Store (stores/favorite.js)
  → Components (components/*.vue)
```

### 硬性规则

- **组件不调 API**：Components 接收 props，emit 事件。禁止在组件内 `import` api 模块或调用 `uni.request`。
- **页面不直接存**：页面不调用 `uni.setStorageSync` / `uni.getStorageSync`，一律通过 Pinia store。
- **页面不直接请求**：页面不调用 `uni.request`，一律通过 `api/anime.js` 导出的函数。
- **Utils 零依赖**：`utils/` 下的模块不依赖 `api/`、`stores/`、`components/`。每个 util 文件是纯函数集合。
- **API 返回统一结构**：列表接口返回 `{ list: Array, pagination: Object }`，详情接口返回单个对象。

### 依赖检查清单（写代码前自查）

| 如果要在... | 加入依赖... | 是否合规 |
|-------------|-------------|----------|
| Component 中 | `import ... from '../../api/anime.js'` | ❌ 违规 |
| Page 中 | `uni.request(...)` | ❌ 违规 |
| Page 中 | `uni.setStorageSync(...)` | ❌ 违规 |
| Util 中 | 导入另一个 util | ✓（仅在二者无相互导入时） |
| Store 中 | 导入 api 模块 | ❌ 违规 |

---

## 二、复用 — 同类逻辑只写一次

### 写新代码前必须做的事

1. **grep 搜索**：确认项目中不存在同类逻辑。
2. **检查现有组件**：`components/` 下是否有可复用的组件（AnimeCard、EmptyState、LoadingMore 等）。
3. **检查现有工具函数**：`utils/` 下是否有可用的格式化/转换函数。

### 可抽取为 composable 的场景

当以下模式在 ≥2 个页面中出现时，必须抽取为 `composables/use*.js`（目前尚未建立，出现时创建）：

```js
// goDetail() 出现在 3 个页面中 → 抽取为 composables/useNavigation.js
export function useNavigation() {
  function goDetail(id) {
    uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  }
  return { goDetail }
}
```

```js
// loadData(reset) 模式在 index/search 近乎一致 → 抽取为 composables/usePagedApi.js
export function usePagedApi(apiFn) {
  const list = ref([])
  const page = ref(1)
  const loading = ref(false)
  const loadStatus = ref('more')
  
  async function loadData(reset = false) { /* ... */ }
  
  return { list, page, loading, loadStatus, loadData }
}
```

### 防重复清单

- `goDetail(id)` — 只能出现在一个地方（composable 或共享 util）。
- `loadData(reset)` 模式 — 同上。
- AnimeCard 展示逻辑 — `animeCardMeta.js` 已集中管理，禁止在组件内重复实现 `formatRank` / `formatMembers`。
- Jikan 字段映射 — 只存在于 `normalizeAnime.js` / `normalizeAnimeExtras.js`。

---

## 三、合理拆分 — 单一职责、文件粒度、目录层级

### 文件粒度标准

```
单文件行数         评价         处理方式
< 30 行           过于零碎     考虑是否可合并到相关模块
30 ~ 200 行       理想范围     —
> 200 行          需要拆分     检查是否承担了多个职责
> 400 行          严重超标     必须拆分
```

### 目录结构与职责

```
AnimeTool/
  api/               ← API 调用层，每个文件一个 Jikan 端点集合
  utils/             ← 纯函数工具，零外部依赖（uni 全局除外）
  stores/            ← Pinia store，管理持久化状态
  composables/       ← Vue 3 composables（跨页面共享的有状态逻辑）
  components/        ← 纯展示组件，PascalCase 目录 + 同名 .vue 文件
  pages/             ← 页面，一个路由一个 .vue
  tests/             ← 测试，文件名 <module>.test.mjs
```

### 新模块放置决策

| 功能类型 | 放在哪里 | 依据 |
|---------|---------|------|
| API 端点调用 | `api/` | 已有 anime.js，新增放同目录 |
| 数据规范化/格式化 | `utils/` | 纯函数，无副作用 |
| 响应式共享状态 | `composables/`（Vue 3 hook） | 封装 ref/computed/watch |
| 持久化状态 | `stores/` | Pinia defineStore |
| UI 组件 | `components/ComponentName/` | 目录 PascalCase，文件同名 |
| 新页面 | `pages/pageName/` | 目录 + 文件均小写 |

### 组件目录规范

```
components/AnimeCard/AnimeCard.vue   ← ✓ 正确
components/animeCard.vue             ← ✗ 错误：缺少目录层级
components/anime-card/anime-card.vue ← ✗ 错误：命名风格不一致
```

---

## 四、注释 — 合理、不过度

### 必须写注释的场合

**文件首行**：一句描述文件用途

```js
// 对接 Jikan v4 API（api.jikan.moe），所有数据经 normalize 后返回统一的应用数据模型
```

**导出函数**：JSDoc（描述 + @param + @returns）

```js
/**
 * 获取热门番剧列表（按人气排序）
 * @param {number} page - 页码，默认第 1 页
 * @returns {{ list: Array, pagination: Object }}
 */
export async function getTopAnime(page = 1) { ... }
```

**非显而易见逻辑**：解释为什么这么做，而非描述做了什么

```js
// ✓ 好 — 解释原因
// 角色数据量较大，取前 12 个以控制详情页渲染开销
return normalizeCharacterList(result.data).slice(0, 12)

// ✗ 坏 — 描述代码本身
// 取前 12 个角色
return normalizeCharacterList(result.data).slice(0, 12)
```

**内部函数**：简短单行注释即可

```js
// 清理 MAL 简介文本：移除 HTML 标签、MAL 元数据标记、解码 HTML 实体
function cleanSynopsis(text) { ... }
```

### 不必写注释的场合

- 变量名自解释时：`const loading = ref(false)` 不注释
- 简单的数据赋值、解构
- Vue 模板中的 `v-if` / `v-for` — 结构已自描述
- Getter/setter、简单的 computed
- 标准生命周期钩子调用

### 注释语言与风格

- **使用中文**注释，UI 文本也用中文
- 注释写在前一行，不写在行尾
- 不用 `/* */` 风格块注释（JSDoc 除外）
- 不写 `// TODO`、`// FIXME` 等临时标记（如有需要，创建 issue 跟踪）
- 不保留注释掉的代码（用 git 回溯历史）

---

## 五、快速检查清单（写完后自检）

- [ ] 组件没有 import api 或 store 模块
- [ ] 页面没有调用 uni.request / uni.setStorageSync
- [ ] 新写逻辑已 grep 确认未重复
- [ ] 文件行数在 30~200 之间（页面可稍宽松）
- [ ] 文件放在正确的目录下
- [ ] 导出函数有 JSDoc
- [ ] 非显而易见逻辑有注释说明原因
- [ ] 没有注释掉的代码块
- [ ] 没有 console.log（错误日志除外）
