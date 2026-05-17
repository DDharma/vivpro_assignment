import { Dashboard } from "@/components/songs/Dashboard"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="flex w-full flex-col gap-1 px-4 py-4 sm:px-6 sm:py-6">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Playlist Dashboard</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Browse, search, and rate the song catalog.
          </p>
        </div>
      </header>
      <main className="w-full flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <Dashboard />
      </main>
    </div>
  )
}
