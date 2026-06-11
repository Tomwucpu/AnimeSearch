import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  formatMembers,
  formatRank,
  formatStatus,
  getVisibleGenres
} from '../utils/animeCardMeta.js'

test('formatRank returns a ranking label only when rank exists', () => {
  assert.equal(formatRank(1), 'Ranking #1')
  assert.equal(formatRank(''), '')
})

test('formatMembers compacts MAL member counts for card display', () => {
  assert.equal(formatMembers(3600000), '用户 360万')
  assert.equal(formatMembers(12800), '用户 1.3万')
  assert.equal(formatMembers(860), '用户 860')
  assert.equal(formatMembers(null), '')
})

test('formatStatus translates Jikan status to Chinese', () => {
  assert.equal(formatStatus('Currently Airing'), '连载中')
  assert.equal(formatStatus('Finished Airing'), '已完结')
  assert.equal(formatStatus('Not yet aired'), '未开播')
  assert.equal(formatStatus(''), '')
  assert.equal(formatStatus(null), '')
  assert.equal(formatStatus(undefined), '')
  assert.equal(formatStatus('Unknown Status'), 'Unknown Status')
})

test('getVisibleGenres keeps the first three valid genres', () => {
  assert.deepEqual(getVisibleGenres(['动作', '', '冒险', '剧情', '奇幻']), ['动作', '冒险', '剧情'])
  assert.deepEqual(getVisibleGenres(null), [])
})
