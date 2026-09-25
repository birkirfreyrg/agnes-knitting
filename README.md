# Agnes Knitting

Next.js 16 + Payload 3, deployed on Vercel. The site starts with an empty content library and retains the Agnes Knitting design and logo. The previous Strapi/Vite application and GitHub Pages workflow have been removed; their history remains available in Git.

## Development

Use Node 24. Run `npm ci`, copy `.env.example` to `.env`, and generate a secret with `openssl rand -hex 32` for `PAYLOAD_SECRET`.

Run `npm run db:local` in one terminal (optional local PostgreSQL helper), then `npm run dev` in another. The helper creates `agnes_fresh` at localhost:54329 and keeps data in ignored `.local-db/`. Alternatively, set `DATABASE_URL` for your own development database. Open `/admin` to create the first local editor.

## Production

- Vercel team: `birkir-freyr-gudbjartssons-projects`
- Project: `agnes-knitting`
- GitHub: `birkirfreyrg/agnes-knitting`, production branch `master`
- Framework: Next.js; root directory: repository root; Node: 24.x
- Public domain: `agnesknitting.is`; `www.agnesknitting.is` redirects to it
- Database: Neon `agnes-knitting-db`, free plan, London
- Images: public Vercel Blob store `agnes-knitting-media`, Dublin
- Initial editor: `birkirgudbjartsson@gmail.com`

Production secrets are stored in Vercel. Required: `DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_SITE_URL`. Preview deployments must use their own database and Blob store before being enabled; production credentials are deliberately scoped only to production.

Apply committed database migrations as a controlled release step before deploying code that depends on them:

```sh
# After loading the intended environment variables securely:
NODE_ENV=production npm run db:migrate
npm run build
```

Builds do not automatically mutate the database. Development schema push is disabled in production. Use a disposable database for tests and do not mix development schema push with production migrations.

`INITIAL_EDITOR_EMAIL=... NODE_ENV=production npm run bootstrap:editor` creates the first editor only when no users exist. It writes a randomly generated temporary password to `.vercel/editor-credentials.txt` with owner-only permissions. That file is ignored by Git. Sign in at `/admin`, change the password in account settings, then remove the credentials file. No public signup is allowed after the initial account exists.

Public pages query published content on each request; publishing and unpublishing need no redeployment. `/preview/[slug]` requires an authenticated editor. Media is public, including files associated with drafts.

## DNS at Cloudflare

Keep Cloudflare nameservers. Use the project-specific records shown in Vercel → agnes-knitting → Settings → Domains. Replace only the existing website records for `@` and `www`; remove conflicting website A/AAAA/CNAME records for those names. Use DNS-only (gray cloud) while Vercel verifies the domain and provisions HTTPS. Keep MX, mail-related TXT, and unrelated records unchanged.

The existing GitHub Pages deployment can stay online until DNS is switched; its deployment workflow is removed, so it will receive no further updates. After the DNS switch, GitHub Pages can be disabled in repository Settings → Pages. The repo has no Strapi connection or dependency; any remaining provider-side Strapi GitHub integration must be removed through that provider/account.

## Optional integrations

Instagram is a profile link until `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_USER_ID` are configured. Credentials remain server-only. If configured, the feed is cached for one hour and gracefully falls back to the link.

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `EMAIL_FROM` for password-reset delivery. Until then, email password resets are unavailable; signed-in editors can change their password from account settings. No messages are sent during bootstrap.

## Validation

```sh
npm run generate:types
npm run generate:importmap
npm run typecheck
TEST_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54329/agnes_fresh_test npm test
npm run build
```

The test database must already exist and its name must end in `_test`. Database tests apply migrations and verify uploads, editor preview access, publishing/unpublishing, and denied anonymous writes. Without `TEST_DATABASE_URL`, they are skipped.

The dependency audit currently reports five moderate entries in the upstream Drizzle/esbuild toolchain without a compatible automatic fix. No high or critical entries were reported during setup.
