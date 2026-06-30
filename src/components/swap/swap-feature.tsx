'use client';

import { useState, useEffect } from 'react';
import { SwapCard } from './swap-card';
import { TokenSelector } from './token-selector';
import { ArrowUpDown, Bell, RefreshCw, Rocket, Settings, Zap, TrendingUp } from 'lucide-react';
import { useJupiterSwap } from '@/hooks/useJupiterSwap';
import { toast } from 'sonner';

interface Token {
  symbol: string;
  name: string;
  logoURI: string;
  address: string;
  decimals: number;
}

const POPULAR_TOKENS: Token[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    logoURI: '/tokens/sol.png',
    address: 'So11111111111111111111111111111111111111112',
    decimals: 9,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    logoURI: '/tokens/usdc.png',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    logoURI: '/tokens/usdt.png',
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    logoURI: '/tokens/jup.png',
    address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
  },
];

type SwapMode = 'instant' | 'trigger' | 'recurring';

const MODES = [
  { id: 'instant' as SwapMode, label: 'Instant', icon: Rocket },
  { id: 'trigger' as SwapMode, label: 'Trigger', icon: Bell },
  { id: 'recurring' as SwapMode, label: 'Recurring', icon: RefreshCw },
];

export function SwapFeature() {
  const [mode, setMode] = useState<SwapMode>('instant');
  const [fromToken, setFromToken] = useState<Token>(POPULAR_TOKENS[1]); // USDC
  const [toToken, setToToken] = useState<Token>(POPULAR_TOKENS[0]); // SOL
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage] = useState('0.5');
  const [isFlipping, setIsFlipping] = useState(false);

  const {
    swapState,
    getQuote,
    executeSwap,
    tokenPrices,
    fetchTokenPrice,
    isWalletConnected,
  } = useJupiterSwap();

  useEffect(() => {
    POPULAR_TOKENS.forEach((token) => {
      fetchTokenPrice(token.address);
    });
  }, [fetchTokenPrice]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (fromAmount && parseFloat(fromAmount) > 0) {
        getQuote(fromToken, toToken, parseFloat(fromAmount), parseFloat(slippage));
      } else {
        setToAmount('');
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [fromAmount, fromToken, toToken, slippage, getQuote]);

  useEffect(() => {
    if (swapState.quote && fromAmount) {
      const outputAmount = formatNumber(
        parseFloat(swapState.quote.outAmount) / Math.pow(10, toToken.decimals)
      );
      setToAmount(outputAmount);
    }
  }, [swapState.quote, fromAmount, toToken.decimals]);

  const handleSwapTokens = () => {
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 400);
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
    setToAmount('');
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (num < 0.000001) return num.toExponential(2);
    if (num < 1) return num.toFixed(8).replace(/\.?0+$/, '');
    if (num < 1000) return num.toFixed(6).replace(/\.?0+$/, '');
    if (num < 1000000) return num.toFixed(2).replace(/\.?0+$/, '');
    return num.toExponential(2);
  };

  const handleSwap = async () => {
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!swapState.quote) {
      toast.error('No quote available');
      return;
    }
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    try {
      const signature = await executeSwap(swapState.quote);
      if (signature) {
        toast.success('Swap completed!', {
          description: `Tx: ${signature.slice(0, 8)}...${signature.slice(-8)}`,
        });
        setFromAmount('');
        setToAmount('');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      if (msg.includes('cancelled by user')) {
        toast.info('Transaction cancelled');
      } else if (msg.includes('Insufficient funds')) {
        toast.error('Insufficient funds');
      } else {
        toast.error('Swap failed — try again');
      }
    }
  };

  const fromUsdValue =
    tokenPrices[fromToken.address] && fromAmount
      ? tokenPrices[fromToken.address] * parseFloat(fromAmount || '0')
      : 0;

  const toUsdValue =
    tokenPrices[toToken.address] && toAmount
      ? tokenPrices[toToken.address] * parseFloat(toAmount || '0')
      : 0;

  return (
    <div className="w-full max-w-[440px] mx-auto">
      {/* Header above card */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl font-bold text-white">Swap Tokens</h2>
          <p className="text-xs text-[#6b6b8a] mt-0.5">Best rates across Solana</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#1e1e35] text-xs text-[#6b6b8a]">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span>0.1% fee</span>
        </div>
      </div>

      <SwapCard>
        <div className="p-5 space-y-3">
          {/* Mode Tabs */}
          <div className="flex bg-[#0a0a14] rounded-2xl p-1 gap-0.5">
            {MODES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  mode === id ? 'tab-active' : 'text-[#6b6b8a] hover:text-[#a0a0bf]'
                }`}
              >
                <Icon className="w-3 h-3 flex-shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Settings Row */}
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0a14] border border-[#1e1e35] hover:border-[#7c3aed]/30 transition-all">
              <Settings className="w-3.5 h-3.5 text-[#6b6b8a]" />
              <span className="text-xs text-[#a0a0bf]">Manual</span>
              <span className="text-xs text-[#6b6b8a]">•</span>
              <span className="text-xs text-[#a78bfa] font-semibold">{slippage}%</span>
            </button>
            <button className="p-1.5 rounded-lg text-[#6b6b8a] hover:text-[#a78bfa] hover:bg-[#7c3aed]/10 transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* From (Selling) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider px-1">
              Selling
            </label>
            <div className="vortex-input-box rounded-2xl p-4 group">
              <div className="flex items-center justify-between gap-3">
                <TokenSelector
                  token={fromToken}
                  onTokenSelect={setFromToken}
                  tokens={POPULAR_TOKENS}
                />
                <div className="text-right flex-1 min-w-0">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="bg-transparent text-right text-2xl font-bold text-white outline-none w-full placeholder-[#3d3d6b]"
                    placeholder="0"
                  />
                  {fromUsdValue > 0 && (
                    <div className="text-xs text-[#6b6b8a] mt-0.5">
                      ≈ ${fromUsdValue.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Flip Button */}
          <div className="flex justify-center -my-1 relative z-10">
            <button
              onClick={handleSwapTokens}
              className={`p-2.5 rounded-full border border-[#1e1e35] bg-[#0f0f1a] hover:border-[#7c3aed]/50 hover:bg-[#7c3aed]/10 transition-all duration-200 ${
                isFlipping ? 'rotate-180' : ''
              }`}
              style={{ transition: 'transform 0.35s ease, border-color 0.2s, background-color 0.2s' }}
            >
              <ArrowUpDown className="w-4 h-4 text-[#6b6b8a] hover:text-[#a78bfa]" />
            </button>
          </div>

          {/* To (Buying) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-wider px-1">
              Buying
            </label>
            <div className="vortex-input-box rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <TokenSelector
                  token={toToken}
                  onTokenSelect={setToToken}
                  tokens={POPULAR_TOKENS}
                />
                <div className="text-right flex-1 min-w-0">
                  <div className="text-2xl font-bold text-white">
                    {swapState.loading ? (
                      <span className="flex items-center justify-end gap-2 text-[#6b6b8a] text-base">
                        <div className="w-4 h-4 rounded-full border-2 border-[#7c3aed] border-t-transparent animate-spin" />
                        Fetching...
                      </span>
                    ) : (
                      <span className={toAmount ? 'text-white' : 'text-[#3d3d6b]'}>
                        {toAmount || '0'}
                      </span>
                    )}
                  </div>
                  {toUsdValue > 0 && (
                    <div className="text-xs text-[#6b6b8a] mt-0.5">
                      ≈ ${toUsdValue.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Route info */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-[#6b6b8a]">
              Route:{' '}
              <span className="text-[#a78bfa] font-medium border-b border-dashed border-[#6b6b8a]/50">
                Auto
              </span>
            </span>
            {swapState.quote && swapState.priceImpact > 0 && (
              <span
                className={`text-xs font-semibold ${
                  swapState.priceImpact > 1 ? 'text-red-400' : 'text-yellow-400'
                }`}
              >
                {swapState.priceImpact.toFixed(2)}% impact
              </span>
            )}
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!isWalletConnected || swapState.loading || !fromAmount || !swapState.quote}
            className="vortex-swap-btn w-full text-white font-bold py-4 rounded-2xl text-base tracking-wide"
          >
            {swapState.loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                {swapState.quote ? 'Swapping...' : 'Getting Quote...'}
              </span>
            ) : !isWalletConnected ? (
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Connect Wallet
              </span>
            ) : !fromAmount ? (
              'Enter Amount'
            ) : !swapState.quote ? (
              'No Quote Available'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" fill="white" />
                Swap Now
              </span>
            )}
          </button>

          {/* Rate info */}
          {swapState.quote && (
            <div className="flex items-center justify-between px-1 py-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#6b6b8a]">Rate</span>
                <span className="text-[#a0a0bf] font-mono">
                  1 {fromToken.symbol} ≈ {swapState.rate.toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#0a0a14] border border-[#1e1e35]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse-glow" />
                <span className="text-[10px] text-[#6b6b8a]">VortexDEX v1</span>
              </div>
            </div>
          )}
        </div>
      </SwapCard>
    </div>
  );
}