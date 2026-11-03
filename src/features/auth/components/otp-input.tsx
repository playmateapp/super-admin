'use client';

import { useRef } from 'react';

import { cn, interpolate } from '@/lib/utils';
import { useMessages } from '@/providers/i18n-provider';

import { authMessages } from '../i18n/auth.messages';

/**
 * One box per digit (Figma "Verify Your Mobile Number"). Typing moves forward, Backspace
 * moves back, pasting fills every box. `value` is the joined code.
 */
export function OtpInput({
  length,
  value,
  onChange,
  invalid,
}: {
  length: number;
  value: string;
  onChange: (code: string) => void;
  invalid?: boolean;
}) {
  const m = useMessages(authMessages).verify;
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setAt = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  };

  return (
    <div className="flex justify-center gap-2" dir="ltr">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digit}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={interpolate(m.digit, { n: i + 1 })}
          aria-invalid={invalid || undefined}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, '').slice(-1);
            setAt(i, d);
            if (d && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !digit && i > 0) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
            if (!pasted) return;
            e.preventDefault();
            onChange(pasted);
            refs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
          className={cn(
            'size-[42px] rounded-[8px] border bg-surface-card text-center font-display text-heading-sm text-content-primary outline-none focus:border-line-brand focus:ring-[3px] focus:ring-brand-500/15',
            invalid ? 'border-danger' : digit ? 'border-content-secondary' : 'border-line',
          )}
        />
      ))}
    </div>
  );
}
