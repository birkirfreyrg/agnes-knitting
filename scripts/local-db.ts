import EmbeddedPostgres from 'embedded-postgres'
// Development-only PostgreSQL, bound to loopback. Keep this process running.
const pg = new EmbeddedPostgres({ databaseDir: '.local-db', user: 'postgres', password: 'postgres', port: 54329, persistent: true, initdbFlags: ['--encoding=UTF8', '--locale=C'] })
await pg.initialise()
await pg.start()
try { await pg.createDatabase('agnes_fresh') } catch (error) { if (!(error instanceof Error) || !error.message.includes('already exists')) throw error }
console.log('Local PostgreSQL: postgresql://postgres:postgres@127.0.0.1:54329/agnes_fresh')
async function stop() { await pg.stop(); process.exit(0) }
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
setInterval(() => {}, 60000)
