import type { CollectionConfig } from 'payload'
import { editorsOnly, publishedOrEditor } from '../lib/access'

const editorialAccess = { read: publishedOrEditor, create: editorsOnly, update: editorsOnly, delete: editorsOnly }
export const Users: CollectionConfig = {
  slug: 'users', auth: true, admin: { useAsTitle: 'email' },
  access: { read: editorsOnly, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  fields: [{ name: 'name', type: 'text' }],
}
export const Media: CollectionConfig = {
  slug: 'media', access: { read: () => true, create: editorsOnly, update: editorsOnly, delete: editorsOnly },
  upload: { staticDir: 'media', mimeTypes: ['image/*', 'application/pdf'] },
  fields: [{ name: 'alt', type: 'text' }, { name: 'caption', type: 'textarea' }],
}
export const Posts: CollectionConfig = {
  slug: 'posts', admin: { useAsTitle: 'title', defaultColumns: ['title', 'date', '_status'],
    preview: (doc) => `/preview/${encodeURIComponent(String(doc.slug))}` },
  access: editorialAccess, versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'Permanent URL: /post/your-slug. Keep the slug unchanged after publishing.' },
      validate: (value: unknown) => typeof value === 'string' && /^[^\s/?#]+$/.test(value) ? true : 'Use a URL slug without spaces, /, ? or #.',
      hooks: { beforeValidate: [({ value, data }) => value || String(data?.title || '').normalize('NFKC').toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')] } },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'date', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
    { name: 'readTime', type: 'text', required: true, defaultValue: '5 min read' },
    { name: 'content', type: 'textarea', required: true, admin: { description: 'Markdown supported: headings, links, lists and images.' } },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text', required: true }] },
    { name: 'publishedAt', type: 'date' },
  ],
}
export const Recommendations: CollectionConfig = {
  slug: 'recommendations', admin: { useAsTitle: 'name' }, access: editorialAccess, versions: { drafts: true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'type', type: 'select', required: true, defaultValue: 'Vara', options: ['Vörumerki', 'Búð', 'Vara'] },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'link', type: 'text', required: true },
    { name: 'publishedAt', type: 'date' },
  ],
}
