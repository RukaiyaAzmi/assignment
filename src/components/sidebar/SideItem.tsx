import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MenuItem } from './Sidebar'

interface SideItemProps {
  menu: MenuItem
  open: boolean
}

export default function SideItem({ menu, open }: SideItemProps) {
  const router = useRouter()
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (menu.url === router.pathname) setActive(true)
  }, [])

  const onSideClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    router.push(menu?.url ?? '/admin/dashboard')
  }

  return (
    <div
      onClick={onSideClick}
      className={`flex rounded-md p-2 cursor-pointer hover:bg-purple-100 text-gray-900 text-sm font-semibold items-center gap-x-4 ${
        active && 'bg-slate-200'
      }`}
    >
      <img src={menu.icon} alt="icon" loading="eager" height={20} width={20} />
      <span className={`${!open && 'hidden'} origin-left duration-200`}>{menu.title}</span>
    </div>
  )
}
