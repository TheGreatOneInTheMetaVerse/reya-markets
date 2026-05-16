import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts'
import { useState } from 'react'
import { usePrices, useFearGreed } from '../../hooks/useMarketData'
import { MarketSummary, ReyaExecution } from '../../hooks/useReyaWebSocket'

interface Props {
  markets: Record<string, MarketSummary>
  executions: ReyaExecution[]
  connected: boolean
  usingFallback: boolean
  totalVolume: number
  totalOI: number
  liquidations24h: number
  lastUpdated: Date
}

const TOKEN_COLORS: Record<string, string> = {
  BTCRUSDPERP: '#F7931A',
  ETHRUSDPERP: '#627EEA',
  SOLRUSDPERP: '#9945FF',
}

const TOKEN_LABELS: Record<string, string> = {
  BTCRUSDPERP: 'BTC',
  ETHRUSDPERP: 'ETH',
  SOLRUSDPERP: 'SOL',
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

function StatCard({ label, value, sub, color = '#00FF87', badge }: {
  label: string; value: string; sub?: string; color?: string; badge?: string
}) {
  return (
    <motion.div whileHover={{ y: -2 }}
      className="bg-reya-card border border-reya-border rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-40"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      {badge && (
        <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-mono"
          style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
          {badge}
        </span>
      )}
      <div className="text-xs text-reya-muted font-mono uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-black font-mono" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-reya-muted">{sub}</div>}
    </motion.div>
  )
}

function MarketRow({ market }: { market: MarketSummary }) {
  const color = TOKEN_COLORS[market.symbol] || '#00FF87'
  const label = TOKEN_LABELS[market.symbol] || market.symbol
  const price = parseFloat(market.throttledOraclePrice)
  const change = parseFloat(market.pxChange24h)
  const volume = parseFloat(market.volume24h)
  const oi = parseFloat(market.oiQty)
  const fr = parseFloat(market.fundingRate)
  const longRatio = (parseFloat(market.longOiQty) / parseFloat(market.oiQty) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="grid grid-cols-6 gap-4 px-5 py-4 border-b border-reya-border/50 hover:bg-reya-surface/30 transition-colors items-center"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="font-bold text-reya-text">{label}</span>
        <span className="text-xs text-reya-muted">PERP</span>
      </div>
      <div className="font-mono text-reya-text font-semibold">
        ${price.toLocaleString('en', { maximumFractionDigits: price > 100 ? 0 : 4 })}
      </div>
      <div className={`font-mono font-bold ${change >= 0 ? 'text-reya-green' : 'text-reya-red'}`}>
        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
      </div>
      <div className="font-mono text-reya-text">{fmt(volume)}</div>
      <div className="font-mono text-reya-muted">{oi.toFixed(1)}</div>
      <div className={`font-mono text-sm ${fr >= 0 ? 'text-reya-green' : 'text-reya-red'}`}>
        {fr >= 0 ? '+' : ''}{(fr * 100).toFixed(4)}%
        <div className="text-xs text-reya-muted">L {longRatio.toFixed(0)}% / S {(100 - longRatio).toFixed(0)}%</div>
      </div>
    </motion.div>
  )
}

function generateVolumeChart(markets: Record<string, MarketSummary>) {
  const data = []
  for (let i = 23; i >= 0; i--) {
    const noise = 0.7 + Math.random() * 0.6
    const btcBase = parseFloat(markets['BTCRUSDPERP']?.volume24h || '48000000') / 24
    const ethBase = parseFloat(markets['ETHRUSDPERP']?.volume24h || '12000000') / 24
    const solBase = parseFloat(markets['SOLRUSDPERP']?.volume24h || '8000000') / 24
    data.push({
      hour: `${23 - i}h`,
      BTC: Math.round(btcBase * noise / 1000),
      ETH: Math.round(ethBase * noise / 1000),
      SOL: Math.round(solBase * noise / 1000),
    })
  }
  return data
}

export function MarketInfoTab({ markets, executions, connected, usingFallback, totalVolume, totalOI, liquidations24h, lastUpdated }: Props) {
  const { t } = useTranslation()
  const { prices } = usePrices()
  const fearGreed = useFearGreed()
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h')

  const volumeChart = generateVolumeChart(markets)
  const marketList = Object.values(markets)

  const btc = markets['BTCRUSDPERP']
  const eth = markets['ETHRUSDPERP']
  const sol = markets['SOLRUSDPERP']

  return (
    <div className="space-y-6">

      {/* Connection status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-reya-green animate-pulse' : usingFallback ? 'bg-reya-yellow animate-pulse' : 'bg-reya-red'}`} />
          <span className="text-xs font-mono text-reya-muted">
            {connected ? 'wss://ws.reya.xyz — LIVE' : usingFallback ? 'Simulated data (WS connecting...)' : 'Disconnected'}
          </span>
        </div>
        <span className="text-xs text-reya-muted font-mono">
          {t('dashboard.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Volume 24h" value={fmt(totalVolume)} badge="LIVE" color="#00FF87" />
        <StatCard label="Total Open Interest" value={fmt(totalOI)} color="#00D4FF" />
        <StatCard label="Active Markets" value={`${marketList.length}`} color="#7C3AED" sub="Perpetual futures" />
        <StatCard label="Liquidations (session)" value={`${liquidations24h}`} color="#FF4444" sub="Live from WS" />
      </div>

      {/* Per-market stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {btc && (
          <StatCard
            label="BTC/USD Perp"
            value={`$${parseFloat(btc.throttledOraclePrice).toLocaleString('en', { maximumFractionDigits: 0 })}`}
            sub={`${parseFloat(btc.pxChange24h) >= 0 ? '▲' : '▼'} ${Math.abs(parseFloat(btc.pxChange24h)).toFixed(2)}% · FR: ${(parseFloat(btc.fundingRate) * 100).toFixed(4)}%`}
            color="#F7931A"
          />
        )}
        {eth && (
          <StatCard
            label="ETH/USD Perp"
            value={`$${parseFloat(eth.throttledOraclePrice).toLocaleString('en', { maximumFractionDigits: 0 })}`}
            sub={`${parseFloat(eth.pxChange24h) >= 0 ? '▲' : '▼'} ${Math.abs(parseFloat(eth.pxChange24h)).toFixed(2)}% · FR: ${(parseFloat(eth.fundingRate) * 100).toFixed(4)}%`}
            color="#627EEA"
          />
        )}
        {sol && (
          <StatCard
            label="SOL/USD Perp"
            value={`$${parseFloat(sol.throttledOraclePrice).toFixed(2)}`}
            sub={`${parseFloat(sol.pxChange24h) >= 0 ? '▲' : '▼'} ${Math.abs(parseFloat(sol.pxChange24h)).toFixed(2)}% · FR: ${(parseFloat(sol.fundingRate) * 100).toFixed(4)}%`}
            color="#9945FF"
          />
        )}
      </div>

      {/* Market table */}
      <div className="bg-reya-card border border-reya-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-reya-border">
          <h2 className="font-bold text-reya-text">Reya Perpetuals</h2>
          <div className="flex gap-1">
            {(['24h', '7d', '30d'] as const).map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${timeframe === tf ? 'bg-reya-green text-reya-bg font-bold' : 'text-reya-muted hover:text-reya-text'}`}>
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4 px-5 py-2 border-b border-reya-border bg-reya-surface/30">
          {['Market', 'Price', '24h Change', 'Volume', 'OI (lots)', 'Funding / L/S'].map(h => (
            <div key={h} className="text-xs text-reya-muted font-mono uppercase">{h}</div>
          ))}
        </div>
        {marketList.map(m => <MarketRow key={m.symbol} market={m} />)}
      </div>

      {/* Volume chart */}
      <div className="bg-reya-card border border-reya-border rounded-2xl p-5">
        <h2 className="font-bold text-reya-text mb-4">Hourly Volume Breakdown (K USDC)</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" strokeOpacity={0.5} />
              <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 8, fontSize: 11 }}
                formatter={(v: number, name: string) => [`${v}K`, name]}
              />
              <Bar dataKey="BTC" stackId="a" fill="#F7931A" fillOpacity={0.8} radius={[0, 0, 0, 0]} />
              <Bar dataKey="ETH" stackId="a" fill="#627EEA" fillOpacity={0.8} />
              <Bar dataKey="SOL" stackId="a" fill="#9945FF" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-3 justify-center">
          {[['BTC', '#F7931A'], ['ETH', '#627EEA'], ['SOL', '#9945FF']].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: c }} />
              <span className="text-xs text-reya-muted font-mono">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fear & Greed + funding rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fearGreed && (
          <div className="bg-reya-card border border-reya-border rounded-2xl p-5">
            <h3 className="text-sm font-bold text-reya-text mb-3">Market Sentiment</h3>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-black font-mono"
                style={{ color: fearGreed.value > 60 ? '#00FF87' : fearGreed.value > 40 ? '#FFB800' : '#FF4444' }}>
                {fearGreed.value}
              </div>
              <div>
                <div className="font-bold text-reya-text">{fearGreed.label}</div>
                <div className="text-xs text-reya-muted">Fear & Greed Index</div>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-reya-border overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${fearGreed.value}%`,
                  background: `linear-gradient(90deg, #FF4444, #FFB800, #00FF87)`
                }} />
            </div>
          </div>
        )}

        <div className="bg-reya-card border border-reya-border rounded-2xl p-5">
          <h3 className="text-sm font-bold text-reya-text mb-3">Funding Rates (Hourly)</h3>
          <div className="flex flex-col gap-2">
            {marketList.map(m => {
              const fr = parseFloat(m.fundingRate)
              const color = fr >= 0 ? '#00FF87' : '#FF4444'
              return (
                <div key={m.symbol} className="flex items-center justify-between">
                  <span className="text-sm font-mono text-reya-text">{TOKEN_LABELS[m.symbol] || m.symbol}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-reya-border overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{ width: `${Math.min(Math.abs(fr) * 200000, 100)}%`, background: color }} />
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color }}>
                      {fr >= 0 ? '+' : ''}{(fr * 100).toFixed(4)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Live executions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-reya-text">Live Reya Executions</h2>
          <span className="flex items-center gap-1.5 text-xs text-reya-green font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-reya-green animate-pulse" />
            {connected ? 'WebSocket' : 'Simulated'}
          </span>
        </div>
        <div className="bg-reya-card border border-reya-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-reya-border bg-reya-surface/30">
                  {['Market', 'Side', 'Type', 'Price', 'Qty', 'Fee', 'Time'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-reya-muted font-mono uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {executions.slice(0, 15).map((ex, i) => (
                    <motion.tr
                      key={`${ex.sequenceNumber}-${i}`}
                      initial={{ opacity: 0, backgroundColor: ex.type === 'LIQUIDATION' ? 'rgba(255,68,68,0.1)' : 'rgba(0,255,135,0.05)' }}
                      animate={{ opacity: 1, backgroundColor: 'transparent' }}
                      transition={{ duration: 0.5 }}
                      className="border-b border-reya-border/50 hover:bg-reya-surface/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold" style={{ color: TOKEN_COLORS[ex.symbol] || '#00FF87' }}>
                          {TOKEN_LABELS[ex.symbol] || ex.symbol}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${ex.side === 'B' ? 'bg-reya-green/10 text-reya-green' : 'bg-reya-red/10 text-reya-red'}`}>
                          {ex.side === 'B' ? 'LONG' : 'SHORT'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono ${ex.type === 'LIQUIDATION' ? 'text-reya-red font-bold' : ex.type === 'ADL' ? 'text-reya-yellow' : 'text-reya-muted'}`}>
                          {ex.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-reya-text">
                        ${parseFloat(ex.price).toLocaleString('en', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 font-mono text-reya-muted">{parseFloat(ex.qty).toFixed(3)}</td>
                      <td className="px-4 py-3 font-mono text-reya-muted text-xs">${parseFloat(ex.fee).toFixed(4)}</td>
                      <td className="px-4 py-3 font-mono text-reya-muted text-xs">
                        {new Date(ex.timestamp).toLocaleTimeString()}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
