import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import { Users, Media, Posts, Recommendations } from './collections'

const dirname = path.dirname(fileURLToPath(import.meta.url))
if (!process.env.PAYLOAD_SECRET) throw new Error('Set PAYLOAD_SECRET in .env or the deployment environment.')
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL to a PostgreSQL database.')
if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Vercel deployments require BLOB_READ_WRITE_TOKEN for persistent media.')

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  // Keep admin API requests on the current origin, including Vercel aliases.
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', ...[process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter(Boolean).map((host) => `https://${host}`)],
  admin: { user: 'users', importMap: { baseDir: dirname }, meta: { titleSuffix: '— Agnes Knitting' } },
  collections: [Users, Media, Posts, Recommendations],
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL }, migrationDir: path.resolve(dirname, 'migrations'), push: process.env.NODE_ENV !== 'production' }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  plugins: [vercelBlobStorage({ alwaysInsertFields: true, addRandomSuffix: true, enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN), collections: { media: true }, token: process.env.BLOB_READ_WRITE_TOKEN || '', clientUploads: { access: ({ req }) => Boolean(req.user) } })],
  ...(process.env.SMTP_HOST ? { email: nodemailerAdapter({ defaultFromAddress: process.env.EMAIL_FROM || 'hello@agnesknitting.is', defaultFromName: 'Agnes Knitting', transportOptions: { host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_PORT === '465', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } } }) } : {}),
})
