import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../ui/Toast'

interface Props {
  open: boolean
  onClose: () => void
}

export function CreateMarketModal({ open, onClose }: Props) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [settlement, setSettlement] = useState('')

  const addOption = () => {
    if (options.length < 6) setOptions(o => [...o, ''])
  }

  const updateOption = (i: number, val: string) => {
    setOptions(o => o.map((v, idx) => idx === i ? val : v))
  }

  const removeOption = (i: number) => {
    if (options.length > 2) setOptions(o => o.filter((_, idx) => idx !== i))
  }

  const handleCreate = () => {
    if (!question.trim()) { toast('Enter a market question', 'error'); return }
    if (options.some(o => !o.trim())) { toast('Fill all option fields', 'error'); return }
    if (!settlement) { toast('Select settlement date', 'error'); return }
    toast('Market created! (demo mode)', 'success')
    setQuestion(''); setOptions(['', '']); setSettlement('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(8,11,18,0.9)', backdropFilter: 'blur(12px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-reya-surface border border-reya-border rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-reya-text">{t('market.createTitle')}</h2>
              <button onClick={onClose} className="text-reya-muted hover:text-reya-text text-xl">✕</button>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-reya-muted mb-2 block">{t('market.question')}</label>
                <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Will BTC reach $200k before 2026?"
                  rows={3}
                  className="w-full bg-reya-card border border-reya-border rounded-xl px-4 py-3 text-sm text-reya-text placeholder-reya-muted focus:border-reya-green/40 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-reya-muted mb-2 block">{t('market.options')}</label>
                <div className="flex flex-col gap-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={opt}
                        onChange={e => updateOption(i, e.target.value)}
                        placeholder={t('market.optionPlaceholder', { n: i + 1 })}
                        className="flex-1 bg-reya-card border border-reya-border rounded-xl px-3 py-2 text-sm text-reya-text placeholder-reya-muted focus:border-reya-green/40 focus:outline-none"
                      />
                      {options.length > 2 && (
                        <button onClick={() => removeOption(i)}
                          className="px-3 py-2 rounded-xl border border-reya-border text-reya-muted hover:text-reya-red hover:border-reya-red/40 transition-all text-sm">
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {options.length < 6 && (
                  <button onClick={addOption}
                    className="mt-2 text-sm text-reya-green hover:text-reya-green-dim transition-colors font-mono">
                    {t('market.addOption')}
                  </button>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-reya-muted mb-2 block">{t('market.settlement')}</label>
                <input
                  type="date"
                  value={settlement}
                  onChange={e => setSettlement(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-reya-card border border-reya-border rounded-xl px-4 py-3 text-sm text-reya-text focus:border-reya-green/40 focus:outline-none [color-scheme:dark]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-reya-border text-reya-muted hover:text-reya-text hover:border-reya-text/20 transition-all font-medium">
                  {t('market.cancel')}
                </button>
                <button onClick={handleCreate}
                  className="flex-1 px-4 py-3 rounded-xl bg-reya-green text-reya-bg font-bold hover:bg-reya-green-dim transition-all hover:shadow-[0_0_20px_#00FF8740]">
                  {t('market.create')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
