import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { usePrices, useFearGreed } from '../hooks/useMarketData'

const FEATURES = [
  { icon: '⚡', key: 'live', color: '#00FF87' },
  { icon: '🎯', key: 'multi', color: '#00D4FF' },
  { icon: '🔗', key: 'wallet', color: '#7C3AED' },
  { icon: '📈', key: 'charts', color: '#FFB800' },
]

function PriceTag({ symbol, price, change }: { symbol: string; price: number; change: number }) {
  const up = change >= 0
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-reya-border bg-reya-card/50 backdrop-blur-sm">
      <span className="font-mono font-bold text-reya-text text-sm">{symbol}</span>
      <span className="font-mono text-reya-text text-sm">${price.toLocaleString('en', { maximumFractionDigits: 0 })}</span>
      <span className={`text-xs font-mono ${up ? 'text-reya-green' : 'text-reya-red'}`}>
        {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
      </span>
    </div>
  )
}

export function LandingPage() {
  const { t } = useTranslation()
  const { prices } = usePrices()
  const fearGreed = useFearGreed()

  const stagger = {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.1 } } },
    item: { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } },
  }

  return (
    <div className="min-h-screen bg-reya-bg overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #00FF87, transparent 70%)' }} />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-3"
          style={{ background: 'radial-gradient(circle, #00D4FF, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-3"
          style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#00FF87 1px, transparent 1px), linear-gradient(90deg, #00FF87 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
      </div>

      {/* Live price ticker */}
      <div className="fixed top-16 left-0 right-0 z-20 overflow-hidden border-b border-reya-border/30"
        style={{ background: 'rgba(8,11,18,0.6)', backdropFilter: 'blur(8px)' }}>
        <div className="flex gap-6 px-4 py-2 overflow-x-auto scrollbar-hide">
          {Object.values(prices).map(p => (
            <PriceTag key={p.symbol} symbol={p.symbol} price={p.price} change={p.change24h} />
          ))}
          {fearGreed && (
            <div className="flex items-center gap-2 px-4 py-1 rounded-full border border-reya-border bg-reya-card/50 whitespace-nowrap">
              <span className="text-xs text-reya-muted">Fear & Greed</span>
              <span className={`text-sm font-mono font-bold ${fearGreed.value > 60 ? 'text-reya-green' : fearGreed.value > 40 ? 'text-reya-yellow' : 'text-reya-red'}`}>
                {fearGreed.value} · {fearGreed.label}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative pt-36 pb-20 px-4 max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="text-center mb-24"
        >
          <motion.div variants={stagger.item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-reya-green/30 bg-reya-green/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-reya-green animate-pulse" />
            <span className="text-reya-green text-sm font-mono">{t('landing.tagline')}</span>
          </motion.div>

          <motion.h1 variants={stagger.item} className="text-6xl md:text-8xl font-black text-reya-text mb-6 leading-none tracking-tight">
            {t('landing.headline').split('. ').map((part, i) => (
              <span key={i} className={i === 1 ? 'text-reya-green animate-glow block' : 'block'}>
                {part}{i < 2 ? '.' : ''}
              </span>
            ))}
          </motion.h1>

          <motion.p variants={stagger.item} className="text-reya-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('landing.subheadline')}
          </motion.p>

          <motion.div variants={stagger.item}>
            <Link
              to="/app"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-reya-green text-reya-bg font-bold text-lg hover:bg-reya-green-dim transition-all hover:shadow-[0_0_40px_#00FF8760] active:scale-95 group"
            >
              {t('landing.cta')}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-24 max-w-2xl mx-auto"
        >
          {[
            { label: t('landing.stats.volume'), value: '$48.2M' },
            { label: t('landing.stats.traders'), value: '8,934' },
            { label: t('landing.stats.markets'), value: '20+' },
          ].map(s => (
            <div key={s.label} className="text-center p-4 rounded-2xl border border-reya-border bg-reya-card/50">
              <div className="text-2xl font-black text-reya-green font-mono">{s.value}</div>
              <div className="text-xs text-reya-muted mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {FEATURES.map(f => (
            <motion.div
              key={f.key}
              variants={stagger.item}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-2xl border border-reya-border bg-reya-card/80 backdrop-blur-sm hover:border-opacity-60 transition-all group"
              style={{ '--accent': f.color } as React.CSSProperties}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-reya-text text-lg mb-2 group-hover:transition-colors"
                style={{ color: f.color }}>
                {t(`landing.features.${f.key}.title`)}
              </h3>
              <p className="text-reya-muted text-sm leading-relaxed">
                {t(`landing.features.${f.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <div className="inline-block p-px rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #00FF87, #00D4FF, #7C3AED)' }}>
            <div className="px-8 py-6 rounded-2xl bg-reya-bg text-center">
              <div className="text-reya-text font-bold text-xl mb-2">Ready to predict the future?</div>
              <div className="text-reya-muted text-sm mb-4">Join 8,000+ traders on Reya Network</div>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-reya-green text-reya-bg font-bold hover:bg-reya-green-dim transition-all"
              >
                {t('landing.cta')} →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
