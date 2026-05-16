/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        reya: {
          bg: '#080B12',
          surface: '#0D1117',
          card: '#111827',
          border: '#1F2937',
          green: '#00FF87',
          'green-dim': '#00CC6A',
          cyan: '#00D4FF',
          purple: '#7C3AED',
          red: '#FF4444',
          yellow: '#FFB800',
          text: '#E2E8F0',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'ticker': 'ticker 20s linear infinite',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 10px #00FF8740' },
          '50%': { boxShadow: '0 0 30px #00FF8780' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 10px #00FF8760' },
          '50%': { textShadow: '0 0 30px #00FF87, 0 0 60px #00FF8740' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
