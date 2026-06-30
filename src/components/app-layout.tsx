'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import { JupiterNavbar } from '@/components/jupiter-navbar'
import React from 'react'
import { AppFooter } from '@/components/app-footer'

export function AppLayout({
  children,
}: {
  children: React.ReactNode
  links?: { label: string; path: string }[]
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen bg-[#08080f]">
        <JupiterNavbar />
        <main className="flex-grow">
          {children}
        </main>
        <AppFooter />
      </div>
      <Toaster
        toastOptions={{
          style: {
            background: '#12121f',
            border: '1px solid rgba(124, 58, 237, 0.25)',
            color: '#ffffff',
          },
        }}
      />
    </ThemeProvider>
  )
}
