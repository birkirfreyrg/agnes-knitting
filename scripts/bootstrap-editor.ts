import 'dotenv/config'
import fs from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const email = process.env.INITIAL_EDITOR_EMAIL
if (!email) throw new Error('Set INITIAL_EDITOR_EMAIL before bootstrapping the editor.')
const payload = await getPayload({ config })
try {
  const existing = await payload.find({ collection: 'users', limit: 1 })
  if (existing.totalDocs) {
    console.log('An editor already exists. No account or password was changed.')
  } else {
    const password = randomBytes(24).toString('base64url')
    await fs.mkdir('.vercel', { recursive: true })
    // Write first so the credentials cannot be lost if the process is interrupted.
    await fs.writeFile('.vercel/editor-credentials.txt', `Email: ${email}\nTemporary password: ${password}\n\nSign in at /admin and change the password in your account settings.\n`, { mode: 0o600, flag: 'wx' })
    await payload.create({ collection: 'users', data: { email, password, name: 'Birkir' } })
    console.log('Editor created. Temporary credentials are in the ignored .vercel/editor-credentials.txt file.')
  }
} finally { await payload.destroy() }
process.exit(0)
