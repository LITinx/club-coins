import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
type Shade = (typeof shades)[number]
const statusPalettes = ['red', 'green', 'blue', 'purple', 'orange', 'yellow'] as const

// Every palette reads from CSS variables so existing gray-*/primary-*/red-* classes follow the theme.
// gray/primary/surface values live in src/styles/globals.css.
const themed = (name: string) =>
  Object.fromEntries(shades.map((s) => [s, `rgb(var(--${name}-${s}) / <alpha-value>)`]))

// Status palettes in dark mode: pale tints become deep tints and dark text becomes light text,
// so "bg-green-100 text-green-800" badges stay readable. Mid shades (300-600) are unchanged.
const DARK_SHADE: Partial<Record<Shade, Shade | 950>> = { 50: 950, 100: 900, 200: 800, 700: 300, 800: 200, 900: 100 }
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ')

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: themed('gray'),
        primary: themed('primary'),
        ...Object.fromEntries(statusPalettes.map((p) => [p, themed(p)])),
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'on-primary': 'rgb(var(--on-primary) / <alpha-value>)',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.03), 0 8px 24px -12px rgb(0 0 0 / 0.12)',
        glow: '0 0 28px -4px rgb(var(--primary-500) / 0.6)',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      const light: Record<string, string> = {}
      const dark: Record<string, string> = {}
      for (const p of statusPalettes) {
        for (const s of shades) {
          light[`--${p}-${s}`] = rgb(colors[p][s])
          dark[`--${p}-${s}`] = rgb(colors[p][DARK_SHADE[s] ?? s])
        }
      }
      addBase({ ':root': light, '.dark': dark })
    }),
  ],
}
export default config
