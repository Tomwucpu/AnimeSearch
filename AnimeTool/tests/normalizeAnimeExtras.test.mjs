import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  normalizeCharacterList,
  normalizeRecommendationList
} from '../utils/normalizeAnimeExtras.js'

test('normalizeCharacterList maps character records for detail page', () => {
  const characters = normalizeCharacterList([
    {
      character: {
        mal_id: 1,
        name: 'Frieren',
        images: {
          jpg: {
            image_url: 'https://cdn.example.com/frieren.jpg'
          }
        }
      },
      role: 'Main'
    }
  ])

  assert.deepEqual(characters, [
    {
      id: 1,
      name: 'Frieren',
      image: 'https://cdn.example.com/frieren.jpg',
      role: '主角'
    }
  ])
})

test('normalizeRecommendationList maps recommended anime records', () => {
  const recommendations = normalizeRecommendationList([
    {
      entry: {
        mal_id: 2,
        title: 'Sousou no Frieren',
        images: {
          jpg: {
            image_url: 'https://cdn.example.com/anime.jpg'
          }
        }
      },
      votes: 128
    }
  ])

  assert.deepEqual(recommendations, [
    {
      id: 2,
      title: 'Sousou no Frieren',
      image: 'https://cdn.example.com/anime.jpg',
      score: '推荐 128',
      type: '推荐',
      episodes: '未知'
    }
  ])
})

test('extra normalizers return empty lists for invalid input', () => {
  assert.deepEqual(normalizeCharacterList(null), [])
  assert.deepEqual(normalizeRecommendationList(undefined), [])
})
