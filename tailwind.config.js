/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0E1012',
          card: '#16181C',
          surface: '#1C1F24',
          subtle: '#22262D',
          border: '#282D36',
          ink: '#F0F2F5',
          muted: '#8A929E',
        },
        paper: {
          DEFAULT: '#F7F6F2',
          card: '#FFFFFF',
          subtle: '#EFECE6',
          tint: '#F2EFE9',
          border: '#E7E5DE',
        },
        ink: {
          DEFAULT: '#20211F',
          soft: '#333431',
          light: '#4C4E49',
        },
        graphite: {
          DEFAULT: '#777872',
          dark: '#585954',
          light: '#A3A49E',
        },
        vermilion: {
          DEFAULT: '#F04B35',
          dark: '#D83824',
          light: '#FFF0EE',
          tint: '#FCE7E4',
          muted: '#E57365',
        },
        sage: {
          DEFAULT: '#879584',
          dark: '#5C6B59',
          light: '#EFF3EE',
          tint: '#F3F6F2',
        },
        stone: {
          DEFAULT: '#E7E5DE',
          dark: '#D3CFCA',
          light: '#F3F1EC',
          line: '#E0DDD5',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        display: ['Instrument Serif', 'Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(32, 33, 31, 0.05)',
        'atlas': '0 2px 10px rgba(32, 33, 31, 0.06)',
        'elevation': '0 8px 30px rgba(32, 33, 31, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
