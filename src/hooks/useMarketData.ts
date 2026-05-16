import { useState, useEffect, useCallback } from 'react'
import { generateTrade, MOCK_STATS } from '../lib/mockData'

export interface PriceData {
  symbol: string
  price: number
  change24h: number
  high24h: number
  low24h: number
  history: { time: string; price: number }[]
}

const COINGECKO_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
}

function generateHistory(basePrice: number, points = 48) {
  const data = []
  let p = basePrice * 0.92
  for (let i = 0; i < points; i++) {
    p = p * (1 + (Math.random() - 0.47) * 0.03)
    data.push({ time: `${i}`, price: Math.round(p * 100) / 100 })
  }
  return data
}

export function usePrices() {
  const [prices, setPrices] = useState<Record<string, PriceData>>({
    BTC: { symbol: 'BTC', price: 97420, change24h: 2.4, high24h: 98100, low24h: 94200, history: generateHistory(97420) },
    ETH: { symbol: 'ETH', price: 3380, change24h: -1.2, high24h: 3450, low24h: 3240, history: generateHistory(3380) },
    SOL: { symbol: 'SOL', price: 198, change24h: 4.8, high24h: 205, low24h: 188, history: generateHistory(198) },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchPrices = useCallback(async () => {
    try {
      const ids = Object.values(COINGECKO_IDS).join(',')
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
        { signal: AbortSignal.timeout(8000) }
      )
      if (!res.ok) throw new Error('API error')
      const data = await res.json()

      const map: Record<string, string> = {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        solana: 'SOL',
      }

      const updated: Record<string, PriceData> = {}
      data.forEach((coin: Record<string, number | string>) => {
        const sym = map[coin.id as string]
        if (sym) {
          updated[sym] = {
            symbol: sym,
            price: coin.current_price as number,
            change24h: coin.price_change_percentage_24h as number,
            high24h: coin.high_24h as number,
            low24h: coin.low_24h as number,
            history: generateHistory(coin.current_price as number),
          }
        }
      })
      setPrices(prev => ({ ...prev, ...updated }))
      setError(null)
      setLastUpdated(new Date())
    } catch {
      // silently use existing mock data, just mark error
      setError('Using cached data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30_000)
    return () => clearInterval(interval)
  }, [fetchPrices])

  // Animate prices slightly every 3s for live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(sym => {
          const drift = (Math.random() - 0.5) * 0.002
          const newPrice = next[sym].price * (1 + drift)
          const newHistory = [...next[sym].history.slice(1), { time: Date.now().toString(), price: newPrice }]
          next[sym] = { ...next[sym], price: newPrice, history: newHistory }
        })
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return { prices, loading, error, lastUpdated, refetch: fetchPrices }
}

export function useLiveTrades() {
  const [trades, setTrades] = useState(() => Array.from({ length: 10 }, generateTrade))

  useEffect(() => {
    const interval = setInterval(() => {
      setTrades(prev => [generateTrade(), ...prev.slice(0, 19)])
    }, 2000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])

  return trades
}

export function useMarketStats() {
  const [stats, setStats] = useState(MOCK_STATS)

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        volume24h: prev.volume24h + Math.floor(Math.random() * 50000),
        trades: prev.trades + Math.floor(Math.random() * 5),
        activeAccounts: prev.activeAccounts + Math.floor(Math.random() * 3 - 1),
        openInterest: prev.openInterest + Math.floor(Math.random() * 100000 - 50000),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return stats
}

export function useFearGreed() {
  const [data, setData] = useState<{ value: number; label: string } | null>(null)

  useEffect(() => {
    fetch('https://api.alternative.me/fng/?limit=1')
      .then(r => r.json())
      .then(d => {
        const v = parseInt(d.data[0].value)
        setData({ value: v, label: d.data[0].value_classification })
      })
      .catch(() => setData({ value: 72, label: 'Greed' }))
  }, [])

  return data
}
