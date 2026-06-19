import assert from 'node:assert/strict'
import { test } from 'node:test'

import { getGenreChinese } from '../src/utils/genreMap.js'

test('getGenreChinese maps known English genres to Chinese', () => {
  assert.equal(getGenreChinese({ name: 'Action' }), '动作')
  assert.equal(getGenreChinese({ name: 'Comedy' }), '喜剧')
  assert.equal(getGenreChinese({ name: 'Sci-Fi' }), '科幻')
  assert.equal(getGenreChinese({ name: 'Romance' }), '恋爱')
  assert.equal(getGenreChinese({ name: 'Isekai' }), '异世界')
  assert.equal(getGenreChinese({ name: 'School' }), '校园')
})

test('getGenreChinese falls back to English for unknown genres', () => {
  assert.equal(getGenreChinese({ name: 'SomeWeirdGenre' }), 'SomeWeirdGenre')
})

test('getGenreChinese handles invalid input', () => {
  assert.equal(getGenreChinese(null), '')
  assert.equal(getGenreChinese(undefined), '')
  assert.equal(getGenreChinese({}), '')
  assert.equal(getGenreChinese({ name: '' }), '')
})
