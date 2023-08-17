import useDevice, { Devices } from '@hooks/useDevice'
import React, { useEffect, useState } from 'react'
import SideDropdown from './SideDropdown'
import SideItem from './SideItem'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
// import getIcon from "./icons";

export interface MenuItem {
  title: string
  icon: string
  code: string
  showable: boolean
  url?: string
  children?: MenuItem[]
  gap?: boolean
}

interface SidebarProps {
  menus: MenuItem[]
  brandName: string
  children: JSX.Element
}

export default function Sidebar({ menus, children }: SidebarProps) {
  const device = useDevice()
  const [open, setOpen] = useState(true)
  const features = useSelector((state: RootState) => state.user.features)

  useEffect(() => {
    if (device === Devices.MOBILE) setOpen(false)
  }, [device])

  const toggleOpen = () => {
    setOpen(!open)
  }

  const menuGuard = (menuItem: MenuItem): boolean => {
    if (!features) return false
    const code = features.find((value) => new RegExp(`^${menuItem.code}`).test(value))
    return code ? true : false
  }

  return (
    <div className="flex">
      {/** Sidebar section */}
      <div
        className={`relative min-h-screen bg-white ${
          open ? 'w-64' : 'w-20'
        } duration-300 p-5 border-r-2 border-r-gray-200`}
      >
        {/**Control button */}
        <img
          src="/img/control.png"
          alt="Control"
          className={`absolute cursor-pointer z-40 w-7 border-2 border-blue-400 -right-3 top-9 rounded-full ${
            !open && 'rotate-180'
          }`}
          onClick={toggleOpen}
        />

        {/**Brand Area */}
        <div className="flex justify-start items-center gap-x-2">
          <img src="/logo@2x.png" alt="Logo" className={`cursor-pointer duration-500`} width="150" height="75" />
        </div>

        {/** Menus */}
        <ul className="pt-2">
          {menus.map(
            (menu, index) =>
              menuGuard(menu) && (
                <li key={index} className={`${menu.gap ? 'mt-9' : 'mt-2'} `}>
                  {menu.children ? <SideDropdown menu={menu} open={open} /> : <SideItem menu={menu} open={open} />}
                </li>
              ),
          )}
        </ul>
      </div>
      {/** Right Panel */}
      <div className="flex-1 relative overflow-x-auto bg-slate-100">{children}</div>
    </div>
  )
}
