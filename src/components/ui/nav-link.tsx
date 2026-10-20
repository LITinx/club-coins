'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  exact?: boolean
  className?: string
  children: React.ReactNode
}

// Sets aria-current="page" on the active route; style it with aria-[current=page]: classes
export function NavLink({ href, exact, className, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link href={href} prefetch className={className} aria-current={isActive ? 'page' : undefined}>
      {children}
    </Link>
  )
}
