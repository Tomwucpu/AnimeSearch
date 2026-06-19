import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  normalizeCharacterList,
  normalizeEpisodeList,
  normalizeRecommendationList
} from '../src/utils/normalizeAnimeExtras.js'

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
      role: 'Main',
      voice_actors: [
        {
          person: { name: 'Tanezaki, Atsumi' },
          language: 'Japanese'
        }
      ]
    }
  ])

  assert.deepEqual(characters, [
    {
      id: 1,
      name: 'Frieren',
      image: 'https://cdn.example.com/frieren.jpg',
      role: '主角',
      voiceActor: 'Tanezaki, Atsumi'
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

test('normalizeEpisodeList maps episode records', () => {
  const episodes = normalizeEpisodeList([
    {
      mal_id: 1,
      title: 'Asteroid Blues',
      title_japanese: 'アステロイド・ブルース',
      score: 4.32,
      aired: '1998-10-24T00:00:00+00:00',
      filler: false,
      recap: false
    },
    {
      mal_id: 2,
      title: 'Stray Dog Strut',
      score: 4.18,
      aired: '1998-04-03T00:00:00+00:00',
      filler: false,
      recap: false
    }
  ])

  assert.deepEqual(episodes, [
    {
      number: 1,
      title: 'Asteroid Blues',
      titleJapanese: 'アステロイド・ブルース',
      score: 4.32,
      aired: '1998-10-24',
      filler: false,
      recap: false
    },
    {
      number: 2,
      title: 'Stray Dog Strut',
      titleJapanese: '',
      score: 4.18,
      aired: '1998-04-03',
      filler: false,
      recap: false
    }
  ])
})

test('normalizeEpisodeList handles filler and recap flags', () => {
  const episodes = normalizeEpisodeList([
    {
      mal_id: 100,
      title: 'Filler Episode',
      filler: true,
      recap: false
    },
    {
      mal_id: 101,
      title: 'Recap Episode',
      filler: false,
      recap: true
    }
  ])

  assert.equal(episodes[0].filler, true)
  assert.equal(episodes[0].recap, false)
  assert.equal(episodes[1].filler, false)
  assert.equal(episodes[1].recap, true)
})

test('normalizeEpisodeList returns empty array for invalid input', () => {
  assert.deepEqual(normalizeEpisodeList(null), [])
  assert.deepEqual(normalizeEpisodeList(undefined), [])
  assert.deepEqual(normalizeEpisodeList({}), [])
})

test('extra normalizers return empty lists for invalid input', () => {
  assert.deepEqual(normalizeCharacterList(null), [])
  assert.deepEqual(normalizeRecommendationList(undefined), [])
})
