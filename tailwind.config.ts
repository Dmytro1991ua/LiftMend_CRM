import type { Config } from 'tailwindcss';

const baseFontSize = 10;

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './shared/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      spacing: () => ({
        ...Array.from({ length: 96 }, (_, index) => index * 0.5)
          .filter((i) => i)
          .reduce((acc, i) => ({ ...acc, [i]: `${i / (baseFontSize / 4)}rem` }), {}),
      }),
      fontSize: {
        xs: [
          `${(16 * 0.75) / baseFontSize}rem`, // 12px
          {
            lineHeight: `${(16 * 1) / baseFontSize}rem`, // 16px
          },
        ],
        sm: [
          `${(16 * 0.875) / baseFontSize}rem`, // 14px
          {
            lineHeight: `${(16 * 1.25) / baseFontSize}rem`, // 20px
          },
        ],
        base: [
          `${(16 * 1) / baseFontSize}rem`, // 16px
          {
            lineHeight: `${(16 * 1.5) / baseFontSize}rem`, // 24px
          },
        ],
        lg: [
          `${(16 * 1.125) / baseFontSize}rem`, // 18px
          {
            lineHeight: `${(16 * 1.75) / baseFontSize}rem`, // 28px
          },
        ],
        xl: [
          `${(16 * 1.25) / baseFontSize}rem`, // 20px
          {
            lineHeight: `${(16 * 1.75) / baseFontSize}rem`, // 28px
          },
        ],
        '2xl': [
          `${(16 * 1.5) / baseFontSize}rem`, // 24px
          {
            lineHeight: `${(16 * 2) / baseFontSize}rem`, // 32px
          },
        ],
        '3xl': [
          `${(16 * 1.875) / baseFontSize}rem`, // 30px
          {
            lineHeight: `${(16 * 2.25) / baseFontSize}rem`, // 36px
          },
        ],
        '4xl': [
          `${(16 * 2.25) / baseFontSize}rem`, // 36px
          {
            lineHeight: `${(16 * 2.5) / baseFontSize}rem`, // 40px
          },
        ],
        '5xl': [
          `${(16 * 3) / baseFontSize}rem`, // 48px
          {
            lineHeight: `${(16 * 3) / baseFontSize}rem`, // 48px
          },
        ],
        '6xl': [
          `${(16 * 3.75) / baseFontSize}rem`, // 60px
          {
            lineHeight: `${(16 * 3.75) / baseFontSize}rem`, // 60px
          },
        ],
        '7xl': [
          `${(16 * 4.5) / baseFontSize}rem`, // 72px
          {
            lineHeight: `${(16 * 5) / baseFontSize}rem`, // Adjusted for 7xl
          },
        ],
        '8xl': [
          `${(16 * 6) / baseFontSize}rem`, // 96px
          {
            lineHeight: `${(16 * 6.5) / baseFontSize}rem`, // Adjusted for 8xl
          },
        ],
        '9xl': [
          `${(16 * 8) / baseFontSize}rem`, // 128px
          {
            lineHeight: `${(16 * 8.5) / baseFontSize}rem`, // Adjusted for 9xl
          },
        ],
      },
      fontFamily: {
        nunito: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
