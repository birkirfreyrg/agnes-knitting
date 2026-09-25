"use client"
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="max-w-3xl mx-auto px-4 py-24"><h1 className="text-2xl font-bold mb-4">Ekki tókst að sækja efnið</h1><button onClick={reset} className="underline">Reyna aftur</button></main> }
