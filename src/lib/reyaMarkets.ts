import { MarketSummary } from '../hooks/useReyaWebSocket'

export interface ReyaPrediction {
  id: string
  question: string
  metric: string
  description: string
  category: string
  endDate: string
  trending?: boolean
  getOptions: (markets: Record<string, MarketSummary>, liquidations: number, totalVolume: number, totalOI: number) => {
    label: string
    probability: number
    color: string
    currentValue?: string
  }[]
}

function clamp(n: number, min = 5, max = 95) {
  return Math.min(max, Math.max(min, Math.round(n)))
}

export const REYA_PREDICTIONS: ReyaPrediction[] = [
  {
    id: 'r1',
    question: 'Will Reya total 24h trading volume exceed $60M today?',
    metric: 'volume24h',
    description: 'Based on live Reya DEX volume across all perp markets',
    category: 'Volume',
    endDate: new Date(Date.now() + 86400000).toISOString(),
    trending: true,
    getOptions: (_, __, totalVolume) => {
      const pct = Math.min(totalVolume / 60_000_000, 1)
      const yes = clamp(pct * 100)
      return [
        { label: 'Yes', probability: yes, color: '#00FF87', currentValue: `$${(totalVolume / 1e6).toFixed(2)}M` },
        { label: 'No', probability: 100 - yes, color: '#FF4444' },
      ]
    },
  },
  {
    id: 'r2',
    question: 'Will BTC funding rate on Reya stay negative this session?',
    metric: 'fundingRate',
    description: 'Funding rate shows long/short sentiment on Reya perps',
    category: 'Funding',
    endDate: new Date(Date.now() + 28800000).toISOString(),
    trending: true,
    getOptions: (markets) => {
      const btc = markets['BTCRUSDPERP']
      const rate = btc ? parseFloat(btc.fundingRate) : -0.0005
      const isNeg = rate < 0
      const confidence = clamp(Math.abs(rate) * 100000)
      return [
        { label: 'Stays Negative', probability: isNeg ? clamp(50 + confidence) : clamp(50 - confidence), color: '#FF4444', currentValue: rate.toFixed(6) },
        { label: 'Turns Positive', probability: isNeg ? clamp(50 - confidence) : clamp(50 + confidence), color: '#00FF87' },
      ]
    },
  },
  {
    id: 'r3',
    question: 'Will ETH Open Interest on Reya increase in next 24h?',
    metric: 'oiQty',
    description: 'ETH perpetual open interest tracks market participation',
    category: 'Open Interest',
    endDate: new Date(Date.now() + 86400000).toISOString(),
    getOptions: (markets) => {
      const eth = markets['ETHRUSDPERP']
      const change = eth ? parseFloat(eth.pxChange24h) : 0
      const yes = clamp(50 + change * 3)
      return [
        { label: 'Increases', probability: yes, color: '#00FF87', currentValue: eth ? `${parseFloat(eth.oiQty).toFixed(0)} lots` : '—' },
        { label: 'Decreases', probability: 100 - yes, color: '#FF4444' },
      ]
    },
  },
  {
    id: 'r4',
    question: 'What direction will BTC move on Reya in next 8 hours?',
    metric: 'pxChange24h',
    description: 'Based on Reya oracle price and funding rate velocity',
    category: 'Price',
    endDate: new Date(Date.now() + 28800000).toISOString(),
    trending: true,
    getOptions: (markets) => {
      const btc = markets['BTCRUSDPERP']
      const vel = btc ? parseFloat(btc.fundingRateVelocity) : 0
      const change = btc ? parseFloat(btc.pxChange24h) : 0
      const upBias = clamp(50 + change * 2 + vel * 1000000)
      const price = btc ? parseFloat(btc.throttledOraclePrice).toLocaleString('en', { maximumFractionDigits: 0 }) : '—'
      return [
        { label: '📈 Up', probability: upBias, color: '#00FF87', currentValue: `$${price}` },
        { label: '📉 Down', probability: 100 - upBias, color: '#FF4444' },
      ]
    },
  },
  {
    id: 'r5',
    question: 'Will Long/Short ratio stay above 1.0 for ETH on Reya?',
    metric: 'longOiQty/shortOiQty',
    description: 'Ratio of long to short open interest on ETH perp',
    category: 'Sentiment',
    endDate: new Date(Date.now() + 86400000).toISOString(),
    getOptions: (markets) => {
      const eth = markets['ETHRUSDPERP']
      const long = eth ? parseFloat(eth.longOiQty) : 2841
      const short = eth ? parseFloat(eth.shortOiQty) : 2839
      const ratio = long / short
      const yes = clamp(ratio > 1 ? 50 + (ratio - 1) * 200 : 50 - (1 - ratio) * 200)
      return [
        { label: 'Longs Dominant', probability: yes, color: '#00FF87', currentValue: `${ratio.toFixed(3)}x` },
        { label: 'Shorts Dominant', probability: 100 - yes, color: '#FF4444' },
      ]
    },
  },
  {
    id: 'r6',
    question: 'Will Reya Total Open Interest exceed $50M today?',
    metric: 'totalOI',
    description: 'Total USD value of open interest across all Reya perp markets',
    category: 'Open Interest',
    endDate: new Date(Date.now() + 86400000).toISOString(),
    getOptions: (_, __, ___, totalOI) => {
      const pct = Math.min(totalOI / 50_000_000, 1)
      const yes = clamp(pct * 100)
      return [
        { label: 'Yes >$50M', probability: yes, color: '#00FF87', currentValue: `$${(totalOI / 1e6).toFixed(1)}M` },
        { label: 'No <$50M', probability: 100 - yes, color: '#FF4444' },
      ]
    },
  },
  {
    id: 'r7',
    question: 'Will SOL price on Reya be above $200 at end of day?',
    metric: 'price',
    description: 'SOL oracle price feed from Reya DEX',
    category: 'Price',
    endDate: new Date(Date.now() + 86400000).toISOString(),
    getOptions: (markets) => {
      const sol = markets['SOLRUSDPERP']
      const price = sol ? parseFloat(sol.throttledOraclePrice) : 198
      const yes = clamp(50 + (price - 200) * 2)
      return [
        { label: 'Above $200', probability: yes, color: '#00FF87', currentValue: `$${price.toFixed(2)}` },
        { label: 'Below $200', probability: 100 - yes, color: '#FF4444' },
      ]
    },
  },
  {
    id: 'r8',
    question: 'How many liquidations will occur on Reya this session?',
    metric: 'liquidations',
    description: 'Count of LIQUIDATION type executions from Reya WebSocket',
    category: 'Risk',
    endDate: new Date(Date.now() + 28800000).toISOString(),
    trending: true,
    getOptions: (_, liquidations) => {
      const l = liquidations
      return [
        { label: '0–5', probability: clamp(l < 3 ? 60 : 20), color: '#00FF87', currentValue: `${l} so far` },
        { label: '6–20', probability: clamp(l >= 3 && l < 15 ? 55 : 25), color: '#FFB800' },
        { label: '20+', probability: clamp(l >= 15 ? 60 : 15), color: '#FF4444' },
      ]
    },
  },
  {
    id: 'r9',
    question: 'Will BTC–ETH price correlation hold above 0.8 today?',
    metric: 'correlation',
    description: 'BTC and ETH 24h price change direction on Reya',
    category: 'Correlation',
    endDate: new Date(Date.now() + 86400000).toISOString(),
    getOptions: (markets) => {
      const btc = markets['BTCRUSDPERP']
      const eth = markets['ETHRUSDPERP']
      const btcChange = btc ? parseFloat(btc.pxChange24h) : 0
      const ethChange = eth ? parseFloat(eth.pxChange24h) : 0
      const sameDir = (btcChange > 0 && ethChange > 0) || (btcChange < 0 && ethChange < 0)
      const yes = clamp(sameDir ? 65 : 35)
      return [
        { label: 'Correlated', probability: yes, color: '#00FF87', currentValue: `BTC ${btcChange > 0 ? '+' : ''}${btcChange.toFixed(1)}% / ETH ${ethChange > 0 ? '+' : ''}${ethChange.toFixed(1)}%` },
        { label: 'Diverges', probability: 100 - yes, color: '#FF4444' },
      ]
    },
  },
  {
    id: 'r10',
    question: 'Will ETH funding rate on Reya turn negative this week?',
    metric: 'fundingRate',
    description: 'ETH funding rate and velocity indicate potential direction shift',
    category: 'Funding',
    endDate: new Date(Date.now() + 604800000).toISOString(),
    getOptions: (markets) => {
      const eth = markets['ETHRUSDPERP']
      const rate = eth ? parseFloat(eth.fundingRate) : 0.0003
      const vel = eth ? parseFloat(eth.fundingRateVelocity) : 0
      const turningNeg = rate > 0 && vel < 0
      const alreadyNeg = rate < 0
      const yes = alreadyNeg ? clamp(75 + Math.abs(rate) * 10000) : turningNeg ? clamp(55) : clamp(30)
      return [
        { label: 'Yes (Negative)', probability: yes, color: '#FF4444', currentValue: rate.toFixed(6) },
        { label: 'No (Stays +)', probability: 100 - yes, color: '#00FF87' },
      ]
    },
  },
  {
    id: 'r11',
    question: 'Which Reya market will have highest volume today?',
    metric: 'volume24h',
    description: 'Comparing BTC, ETH, SOL trading volume on Reya DEX',
    category: 'Volume',
    endDate: new Date(Date.now() + 86400000).toISOString(),
    getOptions: (markets) => {
      const btcVol = parseFloat(markets['BTCRUSDPERP']?.volume24h || '48000000')
      const ethVol = parseFloat(markets['ETHRUSDPERP']?.volume24h || '12000000')
      const solVol = parseFloat(markets['SOLRUSDPERP']?.volume24h || '8000000')
      const total = btcVol + ethVol + solVol
      return [
        { label: 'BTC', probability: clamp((btcVol / total) * 100), color: '#F7931A', currentValue: `$${(btcVol / 1e6).toFixed(1)}M` },
        { label: 'ETH', probability: clamp((ethVol / total) * 100), color: '#627EEA', currentValue: `$${(ethVol / 1e6).toFixed(1)}M` },
        { label: 'SOL', probability: clamp((solVol / total) * 100), color: '#9945FF', currentValue: `$${(solVol / 1e6).toFixed(1)}M` },
      ]
    },
  },
  {
    id: 'r12',
    question: 'Will BTC pool price deviate more than 0.1% from oracle?',
    metric: 'priceDeviation',
    description: 'Pool vs oracle price spread indicates market efficiency on Reya',
    category: 'Market Health',
    endDate: new Date(Date.now() + 28800000).toISOString(),
    getOptions: (markets) => {
      const btc = markets['BTCRUSDPERP']
      const oracle = btc ? parseFloat(btc.throttledOraclePrice) : 97420
      const pool = btc ? parseFloat(btc.throttledPoolPrice) : 97418
      const deviation = Math.abs((pool - oracle) / oracle) * 100
      const yes = clamp(deviation * 500)
      return [
        { label: 'Yes >0.1%', probability: yes, color: '#FFB800', currentValue: `${deviation.toFixed(4)}%` },
        { label: 'No ≤0.1%', probability: 100 - yes, color: '#00FF87' },
      ]
    },
  },
]
