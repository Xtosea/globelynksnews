"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const toggleDark = () => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark")
    }
  }

  const categories = [
    "breaking","politics","business","tech","sports",
    "entertainment","education","international","health",
    "interview","news bulletins","wedding","ceremonies"
  ]

  return (
    <header className="sticky top-0 z-[200]"> {/* high z-index */}
      {/* Top Red Bar */}
      <div className="bg-red-700 text-white text-sm py-2 px-6 relative z-[200]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-lg tracking-wide">GLOBELYNKS</span>

          {/* Search + Dark + Hamburger */}
          <div className="flex items-center gap-2 md:gap-3">
            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-shrink px-2 py-1 rounded text-sm text-black w-24 sm:w-32 md:w-48 lg:w-64"
            />
            <button
              onClick={toggleDark}
              className="bg-gray-200 text-black px-2 py-1 rounded text-sm z-[300]"
            >
              🌙
            </button>
            <button
              className="md:hidden text-2xl px-2 py-1 z-[300]"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Category Menu */}
      <nav className={`bg-white border-b relative z-[200]`}>
        <div
          className={`max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6 px-6 py-3 overflow-x-auto transition-all duration-300 ${
            open ? "flex" : "hidden md:flex"
          }`}
        >
          <Link
            href="/"
            className={`font-semibold ${pathname === "/" ? "text-red-600 border-b-2 border-red-600" : "text-gray-700"}`}
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
                className={`uppercase text-sm font-semibold pb-1 transition ${
                  isActive ? "text-red-600 border-b-2 border-red-600" : "text-gray-700 hover:text-red-600"
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}