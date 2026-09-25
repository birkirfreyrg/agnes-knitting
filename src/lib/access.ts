import type { Access } from 'payload'
export const editorsOnly: Access = ({ req }) => Boolean(req.user)
export const publishedOrEditor: Access = ({ req }) => req.user ? true : { _status: { equals: 'published' } }
