export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-sm font-medium tracking-widest uppercase">terrace.global</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <span>Fan map</span>
          <span>Clubs</span>
          <span>Matchday</span>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-full">
          Join the terrace
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-4 py-1.5 text-red-400 text-xs mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          Launching pre-season 2026 · Arsenal first
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Football fans,<br />
          <span className="text-red-500">everywhere on earth.</span>
        </h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12">
          The global home for football supporters. Find your people, follow your club, and never watch alone — wherever you are in the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-medium">
            Pin your location
          </button>
          <button className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-full text-lg">
            Explore the fan map
          </button>
        </div>
      </section>

      {/* Clubs */}
      <section className="border-t border-white/10 px-8 py-16">
        <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-8">Launching with · expanding to every club</p>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {["Arsenal", "Liverpool", "Man United", "Chelsea", "Man City", "Tottenham", "Barcelona", "Real Madrid", "Bayern Munich", "PSG"].map((club) => (
            <span key={club} className={`px-4 py-2 rounded-full text-sm border ${club === "Arsenal" ? "bg-red-600 border-red-600 text-white" : "border-white/10 text-white/40"}`}>
              {club}
            </span>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section className="border-t border-white/10 px-8 py-24 text-center">
        <h2 className="text-3xl font-bold mb-3">Be first on the terrace</h2>
        <p className="text-white/50 mb-8">Arsenal fans — register now and get founding member status at launch.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-white/30 outline-none focus:border-red-500"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium">
            Join waitlist
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 text-center text-white/20 text-xs">
        terrace.global — the global home for football fans
      </footer>
    </main>
  )
}
