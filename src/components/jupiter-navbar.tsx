'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Settings, Menu, X, ChevronDown, Activity } from 'lucide-react'
import { WalletButton } from '@/components/solana/solana-provider'

export function JupiterNavbar() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { label: 'Swap', href: '/', active: pathname === '/' },
    { label: 'Pro', href: '/pro', active: pathname === '/pro' },
    {
      label: 'Perps',
      href: '/perps',
      active: pathname === '/perps',
      badge: 'NEW',
    },
    { label: 'Limit', href: '/limit', active: pathname === '/limit' },
    { label: 'Portfolio', href: '/portfolio', active: pathname === '/portfolio' },
    { label: 'More', href: '/more', active: pathname === '/more', hasDropdown: true },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08080f]/95 backdrop-blur-xl border-b border-[#1e1e35]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left — Logo + Nav */}
          <div className="flex items-center gap-8">
            {/* VortexDEX Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" fill="white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-lg opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                <span className="text-white">Vortex</span>
                <span className="gradient-text">DEX</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? 'text-[#a78bfa] bg-[#7c3aed]/15 border border-[#7c3aed]/25'
                      : 'text-[#6b6b8a] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-60" />}
                  {item.active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#a78bfa]" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right — Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f1a0f] border border-[#1a3a1a]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </div>

            <button className="p-2 rounded-lg text-[#6b6b8a] hover:text-[#a78bfa] hover:bg-[#7c3aed]/10 transition-all">
              <Activity className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-[#6b6b8a] hover:text-[#a78bfa] hover:bg-[#7c3aed]/10 transition-all">
              <Settings className="w-4 h-4" />
            </button>
            <WalletButton />
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg text-[#6b6b8a] hover:text-white hover:bg-white/5 transition-all"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-[#1e1e35] bg-[#08080f]/98 backdrop-blur-xl">
            <div className="px-2 pt-3 pb-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? 'text-[#a78bfa] bg-[#7c3aed]/15 border border-[#7c3aed]/20'
                      : 'text-[#6b6b8a] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-[#1e1e35] flex flex-col gap-3 px-2">
                <WalletButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}