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
    "breaking", "politics", "business", "tech", "sports",
    "entertainment", "education", "international", "health",
    "interview", "news bulletins", "wedding", "ceremonies"
  ];

  const toggleDark = () => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  const handleLinkClick = () => {
    setOpen(false);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    setShowSuggestions(false);
    setOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/posts?search=${search}`);
        const data = await res.json();
        setSuggestions(data.slice(0, 5));
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search suggestion error:", err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      {/* Top Bar */}
      <div className="bg-red-700 text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-lg tracking-wide">GLOBELYNKS</span>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyPress}
                  className="px-2 py-1 rounded-l text-black w-24 sm:w-32 md:w-48 lg:w-64"
                />
                <button
                  onClick={handleSearch}
                  className="bg-black text-white px-3 py-1 rounded-r"
                >
                  🔍
                </button>
              </div>

              {/* Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded mt-1 z-50">
                  {suggestions.map((post) => (
                    <Link
                      key={post._id}
                      href={`/post/${post.slug}`}
                      onClick={handleLinkClick}
                      className="block px-4 py-2 hover:bg-gray-100 text-black text-sm"
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              )}

              {showSuggestions && search && suggestions.length === 0 && (
                <div className="absolute bg-white shadow-lg px-4 py-2 text-sm text-gray-500 w-full">
                  No results found
                </div>
              )}
            </div>

            {/* Dark Mode */}
            <button onClick={toggleDark} className="bg-gray-200 text-black px-2 py-1 rounded">
              🌙
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden text-2xl px-2 py-1"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Menu Categories */}
      <nav className={`bg-white border-b md:hidden ${open ? "block" : "hidden"}`}>
        <div className="px-6 py-2 flex flex-col gap-2">
          <Link
            href="/"
            onClick={handleLinkClick}
            className={`font-semibold text-sm ${pathname === "/" ? "text-red-600" : "text-gray-700"}`}
          >
            HOME
          </Link>
          {categories.map((cat) => {
            const slug = cat.toLowerCase().replace(/\s+/g, "-");
            const isActive = pathname === `/category/${slug}`;
            return (
              <Link
                key={slug}
                href={`/category/${slug}`}
                onClick={handleLinkClick}
                className={`uppercase text-sm font-semibold ${isActive ? "text-red-600" : "text-gray-700 hover:text-red-600"}`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}