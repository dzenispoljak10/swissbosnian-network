import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B3A8C',
          dark: '#132C70',
          light: '#2448B0',
          tint: '#EEF2FF',
          border: '#C7D2FE',
        },
        gold: {
          DEFAULT: '#C9960A',
          bg: '#FEF3C7',
          border: '#FDE68A',
        },
        dark: {
          DEFAULT: '#0F172A',
          card: '#1E293B',
        },
        surface: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['clamp(44px,6.5vw,76px)', { lineHeight: '1.06', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(32px,4vw,48px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(28px,3.5vw,40px)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 24px 48px rgba(27,58,140,0.12)',
        button: '0 4px 12px rgba(27,58,140,0.35)',
        nav: '0 1px 12px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        card: '20px',
        btn: '10px',
        pill: '999px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.4,0,0.2,1) both',
      },
    },
  },
  plugins: [],
}

export default config
