export interface PredictionMarket {
  id: string
  question: string
  options: { label: string; probability: number; color: string }[]
  volume: number
  endDate: string
  category: string
  trending?: boolean
}

export const PREDICTION_MARKETS: PredictionMarket[] = [
  {
    id: '1',
    question: 'Will BTC hit $150,000 before end of 2025?',
    options: [
      { label: 'Yes', probability: 67, color: '#00FF87' },
      { label: 'No', probability: 33, color: '#FF4444' },
    ],
    volume: 2840000,
    endDate: '2025-12-31',
    category: 'Bitcoin',
    trending: true,
  },
  {
    id: '2',
    question: 'Will ETH flip BTC in market cap this year?',
    options: [
      { label: 'Yes', probability: 18, color: '#00FF87' },
      { label: 'No', probability: 82, color: '#FF4444' },
    ],
    volume: 1200000,
    endDate: '2025-12-31',
    category: 'Ethereum',
  },
  {
    id: '3',
    question: 'What will SOL price be on July 1st 2025?',
    options: [
      { label: 'Under $150', probability: 22, color: '#FF4444' },
      { label: '$150–$250', probability: 45, color: '#FFB800' },
      { label: '$250–$350', probability: 28, color: '#00D4FF' },
      { label: 'Over $350', probability: 5, color: '#00FF87' },
    ],
    volume: 890000,
    endDate: '2025-07-01',
    category: 'Solana',
  },
  {
    id: '4',
    question: 'Will the Fed cut rates in Q3 2025?',
    options: [
      { label: 'Yes', probability: 54, color: '#00FF87' },
      { label: 'No', probability: 46, color: '#FF4444' },
    ],
    volume: 3200000,
    endDate: '2025-09-30',
    category: 'Macro',
    trending: true,
  },
  {
    id: '5',
    question: 'Will Ethereum ETF AUM exceed $20B in 2025?',
    options: [
      { label: 'Yes', probability: 71, color: '#00FF87' },
      { label: 'No', probability: 29, color: '#FF4444' },
    ],
    volume: 1670000,
    endDate: '2025-12-31',
    category: 'ETF',
  },
  {
    id: '6',
    question: 'Which L2 will have highest TVL by Q4 2025?',
    options: [
      { label: 'Arbitrum', probability: 34, color: '#00D4FF' },
      { label: 'Base', probability: 28, color: '#0052FF' },
      { label: 'OP Stack', probability: 20, color: '#FF0420' },
      { label: 'Other', probability: 18, color: '#6B7280' },
    ],
    volume: 560000,
    endDate: '2025-10-01',
    category: 'DeFi',
  },
  {
    id: '7',
    question: 'Will XRP win SEC lawsuit by end of 2025?',
    options: [
      { label: 'Full Win', probability: 42, color: '#00FF87' },
      { label: 'Partial Win', probability: 35, color: '#FFB800' },
      { label: 'Loss', probability: 23, color: '#FF4444' },
    ],
    volume: 4100000,
    endDate: '2025-12-31',
    category: 'Regulation',
    trending: true,
  },
  {
    id: '8',
    question: 'Will DOGE reach $1 before 2026?',
    options: [
      { label: 'Yes', probability: 31, color: '#00FF87' },
      { label: 'No', probability: 69, color: '#FF4444' },
    ],
    volume: 2300000,
    endDate: '2025-12-31',
    category: 'Meme',
  },
  {
    id: '9',
    question: 'Will BTC dominance stay above 50% in 2025?',
    options: [
      { label: 'Yes', probability: 58, color: '#00FF87' },
      { label: 'No', probability: 42, color: '#FF4444' },
    ],
    volume: 780000,
    endDate: '2025-12-31',
    category: 'Bitcoin',
  },
  {
    id: '10',
    question: 'Which nation will adopt BTC as legal tender next?',
    options: [
      { label: 'Argentina', probability: 25, color: '#74C0FC' },
      { label: 'Nigeria', probability: 22, color: '#69DB7C' },
      { label: 'Paraguay', probability: 18, color: '#FF6B6B' },
      { label: 'Other', probability: 35, color: '#6B7280' },
    ],
    volume: 340000,
    endDate: '2025-12-31',
    category: 'Adoption',
  },
  {
    id: '11',
    question: 'Will ETH 2.0 staking yield drop below 3% APR?',
    options: [
      { label: 'Yes', probability: 39, color: '#00FF87' },
      { label: 'No', probability: 61, color: '#FF4444' },
    ],
    volume: 420000,
    endDate: '2025-09-01',
    category: 'Ethereum',
  },
  {
    id: '12',
    question: 'Total crypto market cap end of 2025?',
    options: [
      { label: 'Under $2T', probability: 12, color: '#FF4444' },
      { label: '$2T–$4T', probability: 31, color: '#FFB800' },
      { label: '$4T–$6T', probability: 38, color: '#00D4FF' },
      { label: 'Over $6T', probability: 19, color: '#00FF87' },
    ],
    volume: 5600000,
    endDate: '2025-12-31',
    category: 'Macro',
    trending: true,
  },
  {
    id: '13',
    question: 'Will Solana have a major outage in H2 2025?',
    options: [
      { label: 'Yes', probability: 45, color: '#FF4444' },
      { label: 'No', probability: 55, color: '#00FF87' },
    ],
    volume: 280000,
    endDate: '2025-12-31',
    category: 'Solana',
  },
  {
    id: '14',
    question: 'Will a Bitcoin ETF options volume exceed spot ETF?',
    options: [
      { label: 'Yes', probability: 28, color: '#00FF87' },
      { label: 'No', probability: 72, color: '#FF4444' },
    ],
    volume: 1100000,
    endDate: '2025-10-01',
    category: 'ETF',
  },
  {
    id: '15',
    question: 'Which exchange will top spot volume in 2025?',
    options: [
      { label: 'Binance', probability: 52, color: '#F0B90B' },
      { label: 'Coinbase', probability: 20, color: '#0052FF' },
      { label: 'OKX', probability: 18, color: '#FFFFFF' },
      { label: 'Other', probability: 10, color: '#6B7280' },
    ],
    volume: 670000,
    endDate: '2025-12-31',
    category: 'Exchange',
  },
  {
    id: '16',
    question: 'Will on-chain DEX volume surpass $5T in 2025?',
    options: [
      { label: 'Yes', probability: 63, color: '#00FF87' },
      { label: 'No', probability: 37, color: '#FF4444' },
    ],
    volume: 920000,
    endDate: '2025-12-31',
    category: 'DeFi',
  },
  {
    id: '17',
    question: 'Will Reya Network TVL exceed $1B by Q3?',
    options: [
      { label: 'Yes', probability: 74, color: '#00FF87' },
      { label: 'No', probability: 26, color: '#FF4444' },
    ],
    volume: 1800000,
    endDate: '2025-09-30',
    category: 'Reya',
    trending: true,
  },
  {
    id: '18',
    question: 'Will AI tokens outperform BTC in H2 2025?',
    options: [
      { label: 'Yes', probability: 41, color: '#00FF87' },
      { label: 'No', probability: 59, color: '#FF4444' },
    ],
    volume: 760000,
    endDate: '2025-12-31',
    category: 'AI',
  },
  {
    id: '19',
    question: 'Will NFT market see a major revival in 2025?',
    options: [
      { label: 'Strong Revival', probability: 22, color: '#00FF87' },
      { label: 'Moderate', probability: 41, color: '#FFB800' },
      { label: 'Flat', probability: 27, color: '#6B7280' },
      { label: 'Further Decline', probability: 10, color: '#FF4444' },
    ],
    volume: 340000,
    endDate: '2025-12-31',
    category: 'NFT',
  },
  {
    id: '20',
    question: 'Will a CBDC launch in a G7 nation in 2025?',
    options: [
      { label: 'Yes', probability: 33, color: '#00FF87' },
      { label: 'No', probability: 67, color: '#FF4444' },
    ],
    volume: 890000,
    endDate: '2025-12-31',
    category: 'Regulation',
  },
]

export function generateChartData(points = 24, basePrice = 100, volatility = 0.03) {
  const data = []
  let price = basePrice
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.48) * volatility)
    data.push({
      time: `${i}h`,
      price: Math.round(price * 100) / 100,
    })
  }
  return data
}

export function generateTrade() {
  const tokens = ['BTC', 'ETH', 'SOL', 'MATIC', 'ARB']
  const sides = ['BUY', 'SELL']
  const token = tokens[Math.floor(Math.random() * tokens.length)]
  const side = sides[Math.floor(Math.random() * sides.length)]
  const prices: Record<string, number> = {
    BTC: 95000 + Math.random() * 5000,
    ETH: 3200 + Math.random() * 400,
    SOL: 180 + Math.random() * 40,
    MATIC: 0.85 + Math.random() * 0.3,
    ARB: 1.1 + Math.random() * 0.4,
  }
  return {
    id: Math.random().toString(36).substr(2, 8),
    token,
    side,
    price: prices[token],
    amount: (Math.random() * 10 + 0.01).toFixed(4),
    value: Math.floor(Math.random() * 50000 + 100),
    time: new Date().toLocaleTimeString(),
    wallet: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4),
  }
}

export const MOCK_STATS = {
  volume24h: 48_230_000,
  trades: 127_450,
  activeAccounts: 8_934,
  openInterest: 23_100_000,
}
