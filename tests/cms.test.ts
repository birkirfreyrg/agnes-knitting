import 'dotenv/config'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'

const database = process.env.TEST_DATABASE_URL

test('CMS permissions, publishing and uploads', { skip: !database, timeout: 120000 }, async () => {
  assert.match(new URL(database!).pathname, /_test$/, 'Integration tests require a dedicated database ending in _test')
  process.env.DATABASE_URL = database
  Object.assign(process.env, { NODE_ENV: 'production' })
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  await payload.db.migrate()
  let userID: number | undefined
  try {
    const user = await payload.create({ collection: 'users', data: { email: `test-${Date.now()}@example.com`, password: 'Local-test-password-3427!' } })
    userID = user.id
    await assert.rejects(payload.create({ collection: 'users', overrideAccess: false, data: { email: 'unauthorized@example.com', password: 'Test-password-3427!' } }))
    const media = await payload.create({ collection: 'media', data: { alt: 'Test image' }, filePath: path.resolve('public/agnes_logo.jpg') })
    const data = { title: 'Draft test', slug: `test-${Date.now()}`, excerpt: 'Test excerpt', coverImage: media.id, date: '2026-01-01T00:00:00.000Z', readTime: '5 min read', content: 'Draft content', _status: 'draft' as const }
    await assert.rejects(payload.create({ collection: 'posts', overrideAccess: false, data }))
    const post = await payload.create({ collection: 'posts', data })
    const anonymous = () => payload.find({ collection: 'posts', overrideAccess: false, draft: true, where: { id: { equals: post.id } } })
    assert.equal((await anonymous()).totalDocs, 0, 'Draft must not be public')
    const preview = await payload.find({ collection: 'posts', user: { ...user, collection: 'users' }, overrideAccess: false, draft: true, where: { id: { equals: post.id } } })
    assert.equal(preview.docs[0].content, 'Draft content')
    await payload.update({ collection: 'posts', id: post.id, data: { _status: 'published' } })
    assert.equal((await anonymous()).totalDocs, 1)
    await payload.update({ collection: 'posts', id: post.id, draft: true, data: { content: 'Unpublished revision' } })
    const publicPost = await payload.find({ collection: 'posts', overrideAccess: false, draft: false, where: { id: { equals: post.id } } })
    assert.equal(publicPost.docs[0].content, 'Draft content', 'Unpublished revision must not replace public content')
    await payload.update({ collection: 'posts', id: post.id, data: { _status: 'draft' } })
    assert.equal((await anonymous()).totalDocs, 0, 'Unpublish must remove public access')
    await payload.delete({ collection: 'posts', id: post.id })
    await payload.delete({ collection: 'media', id: media.id })

  } finally {
    if (userID) await payload.delete({ collection: 'users', id: userID })
    await payload.destroy()
  }
})
