import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PredictionCard } from '../components/markets/PredictionCard'
import { MarketInfoTab } from '../components/markets/MarketInfoTab'
import { CreateMarketModal } from '../components/markets/CreateMarketModal'
import { useReyaWebSocket } from '../hooks/useReyaWebSocket'
import { REYA_PREDICTIONS } from '../lib/reyaMarkets'

const CATEGORIES = ['All', 'Price', 'Volume', 'Funding', 'Open Interest', 'Sentiment', 'Risk', 'Correlation', 'Market Health']

export function DashboardPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'predictions' | 'market'>('predictions')
  const [createOpen, setCreateOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  const {
    markets,
    executions,
    connected,
    usingFallback,
    liquidations24h,
    totalVolume24h,
    totalOI,
  } = useReyaWebSocket()

  const filtered = activeCategory === 'All'
    ? REYA_PREDICTIONS
    : REYA_PREDICTIONS.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-reya-bg pt-16">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-5"
          style={{ background: 'radial-gradient(ellipse, #00FF87, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative">

        {/* WS status bar */}
        <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl bg-reya-card border border-reya-border w-fit">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-reya-green animate-pulse' : 'bg-reya-yellow animate-pulse'}`} />
          <span className="text-xs font-mono text-reya-muted">
            {connected ? '🟢 Reya WebSocket — Live' : '🟡 Connecting to wss://ws.reya.xyz...'}
          </span>
          {Object.keys(markets).length > 0 && (
            <span className="text-xs font-mono text-reya-green ml-2">
              {Object.keys(markets).length} markets
            </span>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1 p-1 bg-reya-card border border-reya-border rounded-xl">
            {(['predictions', 'market'] as const).map(t2 => (
              <button
                key={t2}
                onClick={() => setTab(t2)}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t2 ? 'text-reya-bg' : 'text-reya-muted hover:text-reya-text'}`}
              >
                {tab === t2 && (
                  <motion.div layoutId="tabBg" className="absolute inset-0 bg-reya-green rounded-lg" />
                )}
                <span className="relative">
                  {t2 === 'predictions' ? t('dashboard.predictions') : t('dashboard.marketInfo')}
                </span>
              </button>
            ))}
          </div>

          {tab === 'predictions' && (
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-reya-green/10 border border-reya-green/30 text-reya-green hover:bg-reya-green/20 transition-all text-sm font-medium"
            >
              {t('dashboard.newMarket')}
            </button>
          )}
        </div>

        {tab === 'predictions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                    activeCategory === cat
                      ? 'bg-reya-green text-reya-bg border-reya-green'
                      : 'border-reya-border text-reya-muted hover:border-reya-green/30 hover:text-reya-text'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Live summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Total Volume 24h', value: `$${(totalVolume24h / 1e6).toFixed(2)}M`, color: '#00FF87' },
                { label: 'Total Open Interest', value: `$${(totalOI / 1e6).toFixed(1)}M`, color: '#00D4FF' },
                { label: 'Liquidations', value: `${liquidations24h}`, color: '#FF4444' },
              ].map(s => (
                <div key={s.label} className="bg-reya-card border border-reya-border rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-reya-muted">{s.label}</span>
                  <span className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filtered.map((prediction, i) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <PredictionCard
                    prediction={prediction}
                    markets={markets}
                    liquidations={liquidations24h}
                    totalVolume={totalVolume24h}
                    totalOI={totalOI}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'market' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <MarketInfoTab
              markets={markets}
              executions={executions}
              connected={connected}
              usingFallback={usingFallback}
              totalVolume={totalVolume24h}
              totalOI={totalOI}
              liquidations24h={liquidations24h}
              lastUpdated={new Date()}
            />
          </motion.div>
        )}
      </div>

      <CreateMarketModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
