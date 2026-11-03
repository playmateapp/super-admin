import { Hind_Siliguri, Inter, Outfit } from 'next/font/google';

/**
 * Type families from the Figma file: Outfit ("Primary Text": navigation, titles, numbers —
 * `font-display`) and Inter ("Secondary Font": tables, inputs, buttons — `font-sans`).
 * Hind Siliguri is the fallback both use for Bangla glyphs.
 */
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

export const bengali = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bengali',
  display: 'swap',
});
