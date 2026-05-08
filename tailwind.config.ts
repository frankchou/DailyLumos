import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif TC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans TC"', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      colors: {
        warm: {
          bg: '#FDF8F0',
          cream: '#FAF3E8',
          dark: '#2C1F14',
        },
        gold: {
          DEFAULT: '#D4A853',
          light: '#F0D08A',
          dark: '#A8782A',
        },
        amber: '#E8924A',
        'text-primary': '#3D2B1F',
        'text-secondary': '#8B6E5A',
        'text-light': '#C4A882',
      },
      boxShadow: {
        glow: '0 0 20px rgba(212, 168, 83, 0.4)',
        'glow-lg': '0 0 40px rgba(212, 168, 83, 0.5)',
        card: '0 8px 32px rgba(61, 43, 31, 0.15)',
        'card-hover': '0 16px 48px rgba(61, 43, 31, 0.25)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(212, 168, 83, 0.3)' },
          '50%': { boxShadow: '0 0 35px rgba(212, 168, 83, 0.7), 0 0 60px rgba(212, 168, 83, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
