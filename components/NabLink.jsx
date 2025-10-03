"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavItem({ href, label }) {
    const pathname = usePathname()
    const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href)
  
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={[
          "group relative text-sm font-medium transition-colors",
          isActive ? "text-foreground" : "text-muted-fortext-foreground hover:text-foreground",
        ].join(" ")}
      >
        {label}
        <span
          aria-hidden="true"
          className={[
            "pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 rounded bg-fortext-foreground/70 transition-all duration-200",
            "group-hover:w-full",
            isActive ? "w-full" : "w-0",
          ].join(" ")}
        />
      </Link>
    )
  }