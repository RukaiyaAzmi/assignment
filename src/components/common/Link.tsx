import React from 'react'
import Link from 'next/link'

export type IFontSize = 'sm' | 'md' | 'lg'

interface LinkProps {
  href: string
  children: string
  size: IFontSize
}

export default function link({ href, children, size }: LinkProps) {
  return (
    <div className={`py-2 flex flex-col relative hover:font-semibold underline text-${size}`}>
      <Link href={href}>{children}</Link>
    </div>
  )
}
