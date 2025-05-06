"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  BanknoteIcon,
  CalendarDaysIcon,
  Settings,
  HelpCircle,
  Menu,
  X,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  submenu?: NavItem[]
  isOpen?: boolean
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [companyName, setCompanyName] = useState<string>("Company")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [navItems, setNavItems] = useState<NavItem[]>([
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Payroll",
      href: "#",
      icon: BanknoteIcon,
      isOpen: false,
      submenu: [
        { name: "Overview", href: "/payroll", icon: BanknoteIcon },
        { name: "Reports", href: "/payroll/reports", icon: BanknoteIcon },
      ],
    },
    {
      name: "Leave",
      href: "#",
      icon: CalendarDaysIcon,
      isOpen: false,
      submenu: [
        { name: "Leave Management", href: "/leave", icon: CalendarDaysIcon },
        { name: "Leave Balances", href: "/leave/balances", icon: CalendarDaysIcon },
      ],
    },
    { name: "Employees", href: "/employees", icon: Users },
  ])

  const bottomNavItems = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help", href: "/help", icon: HelpCircle },
  ]

  useEffect(() => {
    // Extract company name from subdomain
    const hostname = window.location.hostname
    const isLocalhost = hostname === "localhost"

    if (isLocalhost) {
      // For local development, use a default company or query param
      const urlParams = new URLSearchParams(window.location.search)
      const company = urlParams.get("company") || "demo"
      setCompanyName(company)
    } else {
      // Extract subdomain from production URL
      const subdomain = hostname.split(".")[0]
      if (subdomain !== "syntarihr" && subdomain !== "www") {
        setCompanyName(subdomain)
      } else {
        // Handle case when accessed via main domain
        setCompanyName("Company")
      }
    }
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleSubmenu = (index: number) => {
    setNavItems(
      navItems.map((item, i) => {
        if (i === index) {
          return { ...item, isOpen: !item.isOpen }
        }
        return item
      }),
    )
  }

  const isActive = (href: string) => {
    if (typeof window !== "undefined") {
      return window.location.pathname === href || window.location.pathname.startsWith(`${href}/`)
    }
    return false
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col w-64">
        <div className="p-8 flex flex-col items-center justify-center bg-white">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 shadow-md">
            <Image
              src="/default-organisation.png"
              alt={`${companyName} logo`}
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
        </div>
        <nav className="flex-1 pt-6 flex flex-col justify-between bg-gradient-to-b from-white via-[#a5a69c] to-[#454636]">
          <ul className="space-y-1 px-3">
            {navItems.map((item, index) => (
              <li key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-gray-800 rounded-lg hover:bg-white/20 ${
                        item.submenu.some((subItem) => isActive(subItem.href)) ? "bg-white/20 font-medium" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3 text-gray-700" />
                        {item.name}
                      </div>
                      {item.isOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-700" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-700" />
                      )}
                    </button>
                    {item.isOpen && (
                      <ul className="mt-1 ml-6 space-y-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={`flex items-center px-4 py-2 text-sm text-gray-800 rounded-lg hover:bg-white/20 ${
                                isActive(subItem.href) ? "bg-white/20 font-medium" : ""
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-gray-800 rounded-lg hover:bg-white/20 ${
                      isActive(item.href) ? "bg-white/20 font-medium" : ""
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3 text-gray-700" />
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <ul className="space-y-1 px-3 mb-6">
            {bottomNavItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/20 ${
                    isActive(item.href) ? "bg-white/20" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3 text-white/80" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-3 text-center text-[0.6rem] text-white bg-[#454636]">
          © {new Date().getFullYear()} Syntari HR
        </div>
      </aside>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={toggleMobileMenu}></div>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50">
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 shadow-md">
                <Image
                  src="/default-organisation.png"
                  alt={`${companyName} logo`}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
            </div>
            <nav className="flex-1 pt-6 flex flex-col justify-between bg-gradient-to-b from-white via-[#a5a69c] to-[#454636] h-full">
              <ul className="space-y-1 px-3">
                {navItems.map((item, index) => (
                  <li key={item.name}>
                    {item.submenu ? (
                      <div>
                        <button
                          onClick={() => toggleSubmenu(index)}
                          className={`flex items-center justify-between w-full px-4 py-3 text-gray-800 rounded-lg hover:bg-white/20 ${
                            item.submenu.some((subItem) => isActive(subItem.href)) ? "bg-white/20 font-medium" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon className="h-5 w-5 mr-3 text-gray-700" />
                            {item.name}
                          </div>
                          {item.isOpen ? (
                            <ChevronDown className="h-4 w-4 text-gray-700" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-700" />
                          )}
                        </button>
                        {item.isOpen && (
                          <ul className="mt-1 ml-6 space-y-1">
                            {item.submenu.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className={`flex items-center px-4 py-2 text-sm text-gray-800 rounded-lg hover:bg-white/20 ${
                                    isActive(subItem.href) ? "bg-white/20 font-medium" : ""
                                  }`}
                                  onClick={toggleMobileMenu}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-gray-800 rounded-lg hover:bg-white/20 ${
                          isActive(item.href) ? "bg-white/20 font-medium" : ""
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        <item.icon className="h-5 w-5 mr-3 text-gray-700" />
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              <ul className="space-y-1 px-3 mb-6">
                {bottomNavItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center px-4 py-3 text-white rounded-lg hover:bg-white/20"
                      onClick={toggleMobileMenu}
                    >
                      <item.icon className="h-5 w-5 mr-3 text-white/80" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-3 text-center text-[0.6rem] text-white bg-[#454636]">
              © {new Date().getFullYear()} Syntari HR
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
