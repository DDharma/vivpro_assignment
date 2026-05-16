import { Dashboard } from "@/components/songs/Dashboard"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">Playlist Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Browse, search, rate, and visualize the song catalog.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Dashboard />
      </main>
    </div>
  )
}
