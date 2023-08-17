import React, { useEffect, useState } from 'react'
import SideItem from './SideItem'
import { MenuItem } from './Sidebar'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'

interface SideDropdownProps {
  menu: MenuItem
  open: boolean
}

export default function SideDropdown({ menu, open }: SideDropdownProps) {
  const router = useRouter()
  const [toggle, setToggle] = useState(false)
  const features = useSelector((state: RootState) => state.user.features)

  useEffect(() => {
    menu.children?.forEach((subMenu: MenuItem) => {
      if (subMenu.url === router.pathname) setToggle(true)
    })
  }, [])

  const menuGuard = (menuItem: MenuItem): boolean => {
    if (!features) return false
    if (menuItem.code === '#') return true
    const code = features.find((value) => new RegExp(`^${menuItem.code}`).test(value))
    const found = code ? true : false
    return found && menuItem.showable
  }

  return (
    <>
      <div
        className="flex relative rounded-md p-2 cursor-pointer hover:bg-purple-100 text-gray-900 text-sm font-semibold items-center gap-x-4"
        onClick={() => setToggle(!toggle)}
      >
        <img src={menu.icon} alt="icon" loading="eager" height={20} width={20} />
        <span className={`${!open && 'hidden'} origin-left duration-200`}>{menu.title}</span>
        <span className={`${!open && 'hidden'} absolute right-3`}>
          <img
            src="/icon/icon_awesome_angle_right.svg"
            alt="icon arrow"
            loading="eager"
            className={`${toggle && 'rotate-90'} transition delay-150`}
          />
        </span>
      </div>
      {/** Sub Menus */}
      <ul className={`pl-2 ${toggle ? 'block' : 'hidden'} animate__animated animate__fadeIn`}>
        {menu.children?.map(
          (subMenu, index) =>
            menuGuard(subMenu) && (
              <li key={index} className={`${menu.gap ? 'mt-9' : 'mt-2'} `}>
                <SideItem menu={subMenu} open={open} />
              </li>
            ),
        )}
      </ul>
    </>
  )
}
