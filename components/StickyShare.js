"use client"

import { useEffect, useState } from "react"
import { Facebook, Twitter, MessageCircle } from "lucide-react"

export default function StickyShare() {
  const [pageUrl, setPageUrl] = useState("")
  const [pageTitle, setPageTitle] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(encodeURIComponent(window.location.href))
      setPageTitle(encodeURIComponent(document.title))
    }
  }, [])

  if (!pageUrl) return null

  const shares = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
      icon: <Facebook size={18} />,
      bg: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
      icon: <Twitter size={18} />,
      bg: "bg-sky-500 hover:bg-sky-600"
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`,
      icon: <MessageCircle size={18} />,
      bg: "bg-green-600 hover:bg-green-700"
    }
  ]

  return (
    <div className="fixed left-0 top-1/3 flex flex-col z-50">
      {shares.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex items-center ${item.bg} text-white transition-all duration-300`}
        >
          <div className="p-3">
            {item.icon}
          </div>

          {/* Slide-out label */}
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:px-3 whitespace-nowrap transition-all duration-300">
            {item.name}
          </span>
        </a>
      ))}
    </div>
  )
}