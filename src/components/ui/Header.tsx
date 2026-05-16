import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { WalletButton } from '../wallet/WalletButton'
import { LanguageSelector } from '../ui/LanguageSelector'

export function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const isApp = location.pathname === '/app'

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-30 border-b border-reya-border"
      style={{ background: 'rgba(8,11,18,0.85)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-reya-green flex items-center justify-center text-reya-bg font-black text-sm">
            R
          </div>
          <span className="font-bold text-lg text-reya-text group-hover:text-reya-green transition-colors">
            Reya <span className="text-reya-green">Markets</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          {isApp ? (
            <WalletButton />
          ) : (
            <Link
              to="/app"
              className="px-4 py-2 rounded-xl bg-reya-green text-reya-bg font-semibold text-sm hover:bg-reya-green-dim transition-all hover:shadow-[0_0_20px_#00FF8740] active:scale-95"
            >
              {t('nav.launch')}
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  )
}
