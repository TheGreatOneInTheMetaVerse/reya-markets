import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { useAccount } from 'wagmi'
import { ReyaPrediction } from '../../lib/reyaMarkets'
import { MarketSummary } from '../../hooks/useReyaWebSocket'
import { useToast } from '../ui/Toast'

function generateSparkline(seed: number, points = 24) {
  const data = []
  let v = 50 + seed % 30
  for (let i = 0; i < points; i++) {
    v = Math.max(5, Math.min(95, v + (Math.random() - 0.48) * 4))
    data.push({ t: i, v: Math.round(v * 10) / 10 })
  }
  return data
}

interface Props {
  prediction: ReyaPrediction
  markets: Record<string, MarketSummary>
  liquidations: number
  totalVolume: number
  totalOI: number
}

const CATEGORY_COLORS: Record<string, string> = {
  Volume: '#00D4FF',
  Funding: '#FFB800',
  'Open Interest': '#7C3AED',
  Price: '#00FF87',
  Sentiment: '#FF6B6B',
  Risk: '#FF4444',
  Correlation: '#A78BFA',
  'Market Health': '#34D399',
}

export function PredictionCard({ prediction, markets, liquidations, totalVolume, totalOI }: Props) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { isConnected } = useAccount()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const options = prediction.getOptions(markets, liquidations, totalVolume, totalOI)
  const sparkline = useMemo(() => generateSparkline(parseInt(prediction.id.replace('r', ''))), [prediction.id])

  const daysLeft = Math.ceil(
    (new Date(prediction.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 1000)
  )
  const timeLabel = daysLeft < 24 ? `${daysLeft}h` : `${Math.ceil(daysLeft / 24)}d`

  const catColor = CATEGORY_COLORS[prediction.category] || '#00FF87'

  const handleBet = async () => {
    if (!isConnected) { toast(t('dashboard.connectFirst'), 'error'); return }
    if (selectedOption === null) { toast('Select an option', 'error'); return }
    if (!betAmount || parseFloat(betAmount) <= 0) { toast('Enter a valid amount', 'error'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    toast(`${t('dashboard.betPlaced')} ${options[selectedOption].label} · ${betAmount} USDC`, 'success')
    setBetAmount('')
    setSelectedOption(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-reya-card border border-reya-border rounded-2xl p-5 flex flex-col gap-4 hover:border-reya-green/20 transition-all relative overflow-hidden"
    >
      {/* Live indicator */}
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${catColor}, transparent)` }} />

      {prediction.trending && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-reya-green/10 border border-reya-green/20">
          <span className="w-1.5 h-1.5 rounded-full bg-reya-green animate-pulse" />
          <span className="text-reya-green text-xs font-mono">LIVE</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full border"
            style={{ color: catColor, borderColor: `${catColor}40`, background: `${catColor}10` }}>
            {prediction.category}
          </span>
          <span className="text-xs text-reya-muted ml-auto">⏱ {timeLabel}</span>
        </div>
        <h3 className="font-semibold text-reya-text text-sm leading-snug">{prediction.question}</h3>
        <p className="text-xs text-reya-muted mt-1 leading-relaxed">{prediction.description}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelectedOption(i === selectedOption ? null : i)}
            className="relative flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-sm overflow-hidden"
            style={{
              borderColor: selectedOption === i ? opt.color : '#1F2937',
              background: selectedOption === i ? `${opt.color}15` : 'transparent',
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 opacity-10 rounded-xl transition-all"
              style={{ width: `${opt.probability}%`, background: opt.color }} />
            <div className="relative flex flex-col items-start">
              <span className="font-medium text-reya-text">{opt.label}</span>
              {opt.currentValue && (
                <span className="text-xs text-reya-muted font-mono">{opt.currentValue}</span>
              )}
            </div>
            <span className="relative font-mono font-bold text-sm" style={{ color: opt.color }}>
              {opt.probability}%
            </span>
          </button>
        ))}
      </div>

      {/* Sparkline */}
      <div className="h-14 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkline}>
            <Line type="monotone" dataKey="v" stroke={catColor} strokeWidth={1.5} dot={false} strokeOpacity={0.5} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 8, fontSize: 10 }}
              formatter={(v: number) => [`${v.toFixed(1)}%`, 'probability']}
              labelFormatter={() => ''}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bet input */}
      <div className="flex gap-2">
        <input
          type="number"
          placeholder={t('dashboard.betAmount')}
          value={betAmount}
          onChange={e => setBetAmount(e.target.value)}
          className="flex-1 bg-reya-surface border border-reya-border rounded-xl px-3 py-2 text-sm text-reya-text placeholder-reya-muted focus:border-reya-green/40 focus:outline-none font-mono"
          min="0"
        />
        <button
          onClick={handleBet}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-reya-green text-reya-bg font-semibold text-sm hover:bg-reya-green-dim transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? '...' : t('dashboard.placeBet')}
        </button>
      </div>

      {/* Metric badge */}
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: catColor }} />
        <span className="text-xs text-reya-muted font-mono">Reya DEX · live data</span>
      </div>
    </motion.div>
  )
}
