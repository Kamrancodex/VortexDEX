import React from 'react'
import { Zap } from 'lucide-react'

export function AppFooter() {
  return (
    <footer className="border-t border-[#1e1e35] bg-[#08080f]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-[#7c3aed] to-[#ec4899] rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" fill="white" />
            </div>
            <span className="text-sm font-semibold">
              <span className="text-white">Vortex</span>
              <span className="gradient-text">DEX</span>
            </span>
          </div>

          {/* Center */}
          <p className="text-xs text-[#4a4a6a]">
            Powered by Jupiter Aggregator on Solana
          </p>

          {/* Right */}
          <div className="flex items-center gap-1 text-xs text-[#4a4a6a]">
            <span>Built by</span>
            <a
              href="https://github.com/SauceFoong"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-medium"
            >
              SauceFoong
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
