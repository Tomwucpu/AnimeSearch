import assert from 'node:assert/strict'
import { test } from 'node:test'

import { normalizeAnime, normalizeAnimeList } from '../src/utils/normalizeAnime.js'

test('normalizeAnime maps common Jikan fields for list cards', () => {
  const anime = normalizeAnime({
    mal_id: 5114,
    title: 'Fullmetal Alchemist: Brotherhood',
    title_english: 'Fullmetal Alchemist: Brotherhood',
    images: {
      jpg: {
        image_url: 'https://cdn.example.com/small.jpg',
        large_image_url: 'https://cdn.example.com/large.jpg'
      }
    },
    score: 9.1,
    type: 'TV',
    episodes: 64,
    rank: 1,
    members: 3600000,
    genres: [
      { name: 'Action' },
      { name: 'Adventure' }
    ],
    status: 'Finished Airing'
  })

  assert.deepEqual(anime, {
    id: 5114,
    title: 'Fullmetal Alchemist: Brotherhood',
    image: 'https://cdn.example.com/large.jpg',
    score: 9.1,
    type: 'TV',
    episodes: 64,
    rank: 1,
    members: 3600000,
    genres: ['Action', 'Adventure'],
    synopsis: '',
    status: 'Finished Airing',
    year: '',
    rating: '',
    broadcast: null,
    airedFrom: ''
  })
})

test('normalizeAnime falls back to English title, small image, and Chinese score text', () => {
  const anime = normalizeAnime({
    mal_id: 1,
    title: '',
    title_english: 'Cowboy Bebop',
    images: {
      jpg: {
        image_url: 'https://cdn.example.com/cowboy.jpg'
      }
    },
    score: null,
    episodes: null
  })

  assert.equal(anime.title, 'Cowboy Bebop')
  assert.equal(anime.image, 'https://cdn.example.com/cowboy.jpg')
  assert.equal(anime.score, '暂无评分')
  assert.equal(anime.episodes, '未知')
})

test('normalizeAnime cleans HTML tags and MAL metadata from synopsis', () => {
  const anime = normalizeAnime({
    mal_id: 1,
    title: 'Test',
    images: { jpg: {} },
    synopsis: 'A great anime.<br><br><i>Source: Manga</i> [Written by MAL Rewrite]'
  })

  assert.equal(anime.synopsis, 'A great anime.\n\nSource: Manga')
})

test('normalizeAnimeList returns normalized list and ignores invalid input', () => {
  assert.deepEqual(normalizeAnimeList(null), [])

  const list = normalizeAnimeList([
    { mal_id: 21, title: 'One Piece', images: { jpg: {} }, score: 8.7 },
    { mal_id: 20, title: 'Naruto', images: { jpg: {} }, score: 8 }
  ])

  assert.equal(list.length, 2)
  assert.equal(list[0].id, 21)
  assert.equal(list[1].title, 'Naruto')
})
