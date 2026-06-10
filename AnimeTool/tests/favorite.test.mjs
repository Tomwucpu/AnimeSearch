import assert from 'node:assert/strict'
import { test } from 'node:test'

import { toFavoriteItem } from '../stores/favorite.js'

test('toFavoriteItem keeps metadata used by anime cards', () => {
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
    status: 'Finished Airing'
  })
})
