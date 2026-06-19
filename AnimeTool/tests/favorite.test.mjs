import assert from 'node:assert/strict'
import { test } from 'node:test'

import { toFavoriteItem, DEFAULT_CATEGORY } from '../src/stores/favorite.js'

test('toFavoriteItem 默认分类为 want_to_watch', () => {
  const favorite = toFavoriteItem({
    id: 5114,
    title: 'Fullmetal Alchemist: Brotherhood',
    image: 'https://cdn.example.com/fma.jpg',
    score: 9.1,
    type: 'TV',
    episodes: 64,
    rank: 1,
    members: 3600000,
    genres: ['动作', '冒险'],
    status: 'Finished Airing',
    synopsis: 'Long text that is not needed in a card'
  })

  assert.deepEqual(favorite, {
    id: 5114,
    title: 'Fullmetal Alchemist: Brotherhood',
    image: 'https://cdn.example.com/fma.jpg',
    score: 9.1,
    type: 'TV',
    episodes: 64,
    rank: 1,
    members: 3600000,
    genres: ['动作', '冒险'],
    status: 'Finished Airing',
    category: 'want_to_watch',
    progress: 0
  })
})

test('toFavoriteItem 支持指定分类', () => {
  const favorite = toFavoriteItem({
    id: 1,
    title: 'Test',
    image: '',
    score: 8,
    type: 'Movie',
    episodes: 1,
    rank: 100,
    members: 5000,
    genres: [],
    status: 'Finished Airing'
  }, 'watched')

  assert.equal(favorite.category, 'watched')
})

test('toFavoriteItem 使用默认分类当未指定时', () => {
  const favorite = toFavoriteItem({
    id: 2,
    title: 'Test 2',
    image: '',
    score: 7,
    type: 'TV',
    episodes: 12,
    rank: 200,
    members: 1000,
    genres: ['喜剧'],
    status: 'Finished Airing'
  })

  assert.equal(favorite.category, DEFAULT_CATEGORY)
  assert.equal(favorite.category, 'want_to_watch')
})
