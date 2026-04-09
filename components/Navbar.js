"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const categories = [
    "breaking","politics","business","tech","sports",
    "entertainment","education","international","health",
    "interview","news bulletins","wedding","ceremonies"
  ]

  // close menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const toggleDark = () => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark")
    }
  }

  // SEARCH HANDLER
  const handleSearch = () => {
    if (!search.trim()) return
    router.push(`/search?q=${encodeURIComponent(search)}`)
    setSearch("")
    setSuggestions([])
    setOpen(false)
  }

  // ENTER KEY SEARCH
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch()
  }

  // LIVE SUGGESTIONS
  const handleSearchChange = (value) => {
    setSearch(value)

    if (!value.trim()) {
      setSuggestions([])
      return
    }

    const filtered = categories.filter((c) =>
      c.toLowerCase().includes(value.toLowerCase())
    )

    setSuggestions(filtered)
  }

  return (
    <header className="sticky top-0 z-[200]">

      {/* TOP BAR */}
      <div className="bg-red-700 text-white text-sm py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <span className="font-bold text-lg tracking-wide">
            GLOBELYNKS
          </span>

          <div className="flex items-center gap-2 md:gap-3 relative">

            {/* SEARCH */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="px-2 py-1 rounded text-sm text-black w-32 sm:w-40 md:w-56"
              />

              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-9 left-0 bg-white text-black w-full shadow-md rounded z-[300]">
                  {suggestions.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        router.push(`/category/${item}`)
                        setSearch("")
                        setSuggestions([])
                        setOpen(false)
                      }}
                      className="px-2 py-1 hover:bg-gray-200 cursor-pointer text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DARK MODE */}
            <button
              onClick={toggleDark}
              className="bg-gray-200 text-black px-2 py-1 rounded text-sm"
            >
              🌙
            </button>

            {/* HAMBURGER */}
            <button
              className="md:hidden text-2xl px-2 py-1"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>

          </div>
        </div>
      </div>

      {/* NAV MENU */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`font-semibold ${
                pathname === "/" ? "text-red-600 border-b-2 border-red-600" : "text-gray-700"
              }`}
            >
              HOME
            </Link>

            {categories.map((cat) => {
              const slug = cat.toLowerCase().replace(/\s+/g, "-")
              const isActive = pathname === `/category/${slug}`

              return (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className={`uppercase text-sm font-semibold pb-1 ${
                    isActive
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-700 hover:text-red-600"
                  }`}
                >
                  {cat}
                </Link>
              )
            })}
          </div>

          {/* MOBILE MENU */}
          {open && (
            <div className="md:hidden flex flex-col gap-3 mt-3 bg-white p-3 rounded shadow">
              <Link href="/" onClick={() => setOpen(false)} className="font-semibold">
                HOME
              </Link>

              {categories.map((cat) => {
                const slug = cat.toLowerCase().replace(/\s+/g, "-")

                return (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    onClick={() => setOpen(false)}   // ✅ FIX: closes menu
                    className="text-sm text-gray-700"
                  >
                    {cat}
                  </Link>
                )
              })}
            </div>
          )}

        </div>
      </nav>
    </header>
  )
}