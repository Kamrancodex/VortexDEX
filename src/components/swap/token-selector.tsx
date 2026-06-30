'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Token {
  symbol: string;
  name: string;
  logoURI: string;
  address: string;
  decimals: number;
}

interface TokenSelectorProps {
  token: Token;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
}

const TOKEN_COLORS: Record<string, string> = {
  SOL: 'from-[#9945FF] to-[#14F195]',
  USDC: 'from-[#2775CA] to-[#5B9BD5]',
  USDT: 'from-[#26A17B] to-[#00D4AA]',
  JUP: 'from-[#C7B26A] to-[#FBD26A]',
};

export function TokenSelector({ token, onTokenSelect, tokens }: TokenSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredTokens = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  const colorClass = TOKEN_COLORS[token.symbol] || 'from-[#7c3aed] to-[#ec4899]';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0f0f1a] border border-[#1e1e35] hover:border-[#7c3aed]/40 hover:bg-[#1a1a2e] transition-all duration-200 group">
          <div className="relative flex-shrink-0">
            <Image
              src={token.logoURI}
              alt={token.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                if (next) next.style.display = 'flex';
              }}
            />
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorClass} hidden items-center justify-center text-xs font-bold text-white`}
            >
              {token.symbol.charAt(0)}
            </div>
          </div>
          <span className="text-white font-semibold text-base">{token.symbol}</span>
          <ChevronDown className="w-4 h-4 text-[#6b6b8a] group-hover:text-[#a78bfa] transition-colors" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 border-[#1e1e35] shadow-2xl"
        style={{ background: '#0f0f1a', borderColor: 'rgba(124,58,237,0.2)' }}
      >
        {/* Search */}
        <div className="p-3 border-b border-[#1e1e35]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b8a]" />
            <input
              autoFocus
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-[#6b6b8a] outline-none transition-all"
              style={{
                background: 'rgba(26,26,46,0.8)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)';
              }}
            />
          </div>
        </div>

        {/* Token list */}
        <div className="max-h-60 overflow-y-auto p-1.5">
          {filteredTokens.map((t) => {
            const tc = TOKEN_COLORS[t.symbol] || 'from-[#7c3aed] to-[#ec4899]';
            return (
              <DropdownMenuItem
                key={t.address}
                onClick={() => onTokenSelect(t)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{ color: 'white' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={t.logoURI}
                    alt={t.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const next = e.currentTarget.nextElementSibling as HTMLElement | null;
                      if (next) next.style.display = 'flex';
                    }}
                  />
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${tc} hidden items-center justify-center text-sm font-bold text-white`}
                  >
                    {t.symbol.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">{t.symbol}</div>
                  <div className="text-[#6b6b8a] text-xs truncate">{t.name}</div>
                </div>
                <div className="text-[#6b6b8a] text-xs font-mono">0</div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}