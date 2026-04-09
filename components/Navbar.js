"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = [
    "breaking","politics","business","tech","sports",
    "entertainment","education","international","health",
    "interview","news bulletins","wedding","ceremonies"
  ];

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    setOpen(false);
  };

  useEffect(() => {
    if (!search.trim()) return setSuggestions([]);

    const delay = setTimeout(async () => {
      const res = await fetch(`/api/posts?search=${search}`);
      const data = await res.json();
      setSuggestions(data.slice(0, 5));
      setShowSuggestions(true);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <>
      {/* TOP BAR */}
      <header className="sticky top-0 z-[300] bg-red-700 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2">

          <span className="font-bold text-lg tracking-wide">
            GLOBELYNKS
          </span>

          <div className="flex items-center gap-2">

            {/* SEARCH */}
            <div className="relative">
              <div className="flex">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search news..."
                  className="px-2 py-1 text-black rounded-l w-32 md:w-64"
                />
                <button
                  onClick={handleSearch}
                  className="bg-black px-3 py-1 rounded-r"
                >
                  🔍
                </button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute bg-white text-black w-full shadow z-[999]">
                  {suggestions.map((p) => (
                    <Link
                      key={p._id}
                      href={`/post/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-100"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* HAMBURGER */}
            <button
              onClick={() => setOpen(true)}
              className="text-2xl px-2"
            >
              ☰
            </button>

          </div>
        </div>
      </header>

      {/* FULL SCREEN MENU (THIS FIXES YOUR SCROLL ISSUE) */}
      {open && (
        <div className="fixed inset-0 bg-white z-[999] overflow-y-auto">

          {/* CLOSE BUTTON */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <span className="font-bold text-lg">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="text-2xl"
            >
              ✕
            </button>
          </div>

          {/* HOME LINK (YOUR TRENDING HEADLINES) */}
          <div className="px-6 py-4 border-b">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-red-600 font-bold text-lg"
            >
              🔥 Trending Headlines
            </Link>
          </div>

          {/* CATEGORIES */}
          <div className="px-6 py-4 grid gap-3">
            {categories.map((cat) => {
              const slug = cat.replace(/\s+/g, "-");

              return (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  onClick={() => setOpen(false)}
                  className="text-gray-700 font-semibold uppercase hover:text-red-600"
                >
                  {cat}
                </Link>
              );
            })}
          </div>

        </div>
      )}
    </>
  );
}