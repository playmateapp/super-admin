import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * Tailwind ↔ design-token bridge. Colour VALUES live in `src/app/globals.css` as CSS
 * variables; this file only gives them Tailwind names. Components must use these names
 * (`bg-surface-card`, `text-content-secondary`, `border-line`, `bg-brand-500`, ...) —
 * never raw hex. See `docs/DESIGN_SYSTEM.md`.
 */

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          page: token('surface-page'),
          card: token('surface-card'),
          sunken: token('surface-sunken'),
          muted: token('surface-muted'),
          inverse: token('surface-inverse'),
          tint: token('surface-tint'),
        },
        line: {
          DEFAULT: token('line'),
          strong: token('line-strong'),
          brand: token('line-brand'),
        },
        content: {
          primary: token('content-primary'),
          secondary: token('content-secondary'),
          muted: token('content-muted'),
          nav: token('content-nav'),
          brand: token('content-brand'),
          link: token('content-link'),
          danger: token('content-danger'),
          'on-brand': token('content-on-brand'),
          'on-inverse': token('content-on-inverse'),
        },
        brand: {
          300: token('brand-300'),
          400: token('brand-400'),
          500: token('brand-500'),
          bright: token('brand-bright'),
        },
        navy: token('navy'),
        success: { DEFAULT: token('success'), soft: token('success-soft') },
        warning: { DEFAULT: token('warning'), soft: token('warning-soft') },
        danger: { DEFAULT: token('danger'), soft: token('danger-soft') },
        info: { DEFAULT: token('info'), soft: token('info-soft') },
        violet: { DEFAULT: token('violet'), soft: token('violet-soft') },
        cyan: { DEFAULT: token('cyan'), soft: token('cyan-soft') },
        gold: token('gold'),
        chip: token('chip'),
        ink: token('shadow-ink'),
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-bengali)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'var(--font-bengali)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Headings (Outfit) — Figma "H1 Regular" 28/1, "H3 Semibold" 20/1.2, "H4" 16/1.3
        'heading-xl': ['1.75rem', { lineHeight: '1' }], // 28 stat value, profile name
        'heading-lg': ['1.5rem', { lineHeight: '1.3' }], // 24 auth titles (mobile)
        'heading-md': ['1.25rem', { lineHeight: '1.2' }], // 20 card title
        'heading-sm': ['1rem', { lineHeight: '1.3' }], // 16 nav, section title
        // Body (Inter)
        'body-md': ['1rem', { lineHeight: '1.5rem' }], // 16/24 buttons, info tiles
        'body-sm': ['0.9375rem', { lineHeight: '1.25rem' }], // 15/20 field labels
        'body-xs': ['0.875rem', { lineHeight: '1.25rem' }], // 14/20 table cells, inputs, nav
        caption: ['0.75rem', { lineHeight: '1.125rem' }], // 12/18 table header, stat label
        micro: ['0.6875rem', { lineHeight: '0.875rem' }], // 11/14 status pills
      },
      borderRadius: {
        card: '16px',
        input: '10px',
        tile: '10px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(var(--shadow-ink) / 0.04)',
        sidebar: '1px 0 0 rgb(var(--shadow-ink) / 0.06)',
        field: '0 1px 3px 0 rgb(0 0 0 / 0.15), 0 1px 2px 0 rgb(var(--shadow-ink) / 0.1)',
        float: '0 12px 32px rgb(var(--shadow-ink) / 0.16)',
      },
      spacing: {
        sidebar: '17.5rem', // 280px
        topbar: '4.4375rem', // 71px
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up 240ms ease-out both',
      },
    },
  },
  plugins: [animate],
};

export default config;
