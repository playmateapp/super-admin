'use client';

import { useState } from 'react';

import { cn, formatCount } from '@/lib/utils';

/**
 * Dashboard charts ("Subscription Status", "Revenue Overview", "User, Team & Turf Growth"), drawn as
 * SVG so they follow the theme tokens. Each mark has a hover / focus tooltip; values are also
 * in the legend or the accessible label, so nothing relies on colour alone.
 */

/** Rounded axis maximum + 4 tick values ("0, 50k, 100k, 200k" style). */
function niceScale(max: number) {
  if (max <= 0) return { top: 4, ticks: [0, 1, 2, 3, 4] };
  const raw = max / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((s) => s * pow).find((s) => s >= raw) ?? raw;
  return { top: step * 4, ticks: [0, 1, 2, 3, 4].map((i) => i * step) };
}

const short = (v: number) =>
  v >= 1_000_000
    ? `${+(v / 1_000_000).toFixed(1)}m`
    : v >= 1000
      ? `${+(v / 1000).toFixed(1)}k`
      : `${v}`;

const W = 330;
const H = 190;
const PAD = { top: 10, right: 6, bottom: 26, left: 40 };
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

function Axes({ ticks, top, labels }: { ticks: number[]; top: number; labels: string[] }) {
  return (
    <g className="font-display" fontSize={12}>
      {ticks.map((t) => {
        const y = PAD.top + plotH - (t / top) * plotH;
        return (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y}
              y2={y}
              className="stroke-line"
              strokeWidth={1}
            />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="fill-content-muted">
              {short(t)}
            </text>
          </g>
        );
      })}
      {labels.map((label, i) => (
        <text
          key={label + i}
          x={PAD.left + (plotW / labels.length) * (i + 0.5)}
          y={H - 6}
          textAnchor="middle"
          className="fill-content-muted"
        >
          {label}
        </text>
      ))}
    </g>
  );
}

function Tooltip({ x, y, title, value }: { x: number; y: number; title: string; value: string }) {
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-[8px] border border-line bg-surface-card px-2.5 py-1.5 text-caption shadow-float"
      style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
    >
      <p className="text-content-muted">{title}</p>
      <p className="font-semibold text-content-primary">{value}</p>
    </div>
  );
}

/** Single-series bars (revenue per month). */
export function BarChart({
  data,
  label,
  format,
}: {
  data: { label: string; value: number }[];
  label: string;
  format: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const { top, ticks } = niceScale(Math.max(...data.map((d) => d.value), 0));
  const slot = plotW / Math.max(data.length, 1);
  const barW = Math.min(26, slot * 0.5);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
        <Axes ticks={ticks} top={top} labels={data.map((d) => d.label)} />
        {data.map((d, i) => {
          const h = Math.max((d.value / top) * plotH, d.value > 0 ? 4 : 0);
          const x = PAD.left + slot * i + (slot - barW) / 2;
          const y = PAD.top + plotH - h;
          return (
            <g
              key={d.label + i}
              tabIndex={0}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="outline-none"
            >
              <rect
                x={PAD.left + slot * i}
                y={PAD.top}
                width={slot}
                height={plotH}
                fill="transparent"
              />
              <path
                d={`M${x},${y + h} V${y + Math.min(4, h)} Q${x},${y} ${x + Math.min(4, barW / 2)},${y} H${x + barW - Math.min(4, barW / 2)} Q${x + barW},${y} ${x + barW},${y + Math.min(4, h)} V${y + h} Z`}
                style={{
                  opacity:
                    hover !== null && hover !== i ? 0.35 : 0.35 + (0.65 * (i + 1)) / data.length,
                }}
                className={cn(
                  i === data.length - 1 ? 'fill-brand-500' : 'fill-success',
                  'transition-opacity',
                )}
              />
            </g>
          );
        })}
      </svg>
      {hover !== null && data[hover] ? (
        <Tooltip
          x={PAD.left + slot * hover + slot / 2}
          y={PAD.top + plotH - (data[hover].value / top) * plotH - 6}
          title={data[hover].label}
          value={format(data[hover].value)}
        />
      ) : null}
    </div>
  );
}

export interface LineSeries {
  key: string;
  label: string;
  values: number[];
  /** Tailwind stroke / fill classes from the tokens (`stroke-success`, `fill-success`). */
  stroke: string;
  fill: string;
  /** Shade the area under this series (the first, biggest one). */
  area?: boolean;
}

/** Multi-series lines with dots (players / teams / turfs over time), crosshair tooltip. */
export function LineChart({
  labels,
  series,
  label,
  format,
}: {
  labels: string[];
  series: LineSeries[];
  label: string;
  format: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const { top, ticks } = niceScale(Math.max(...series.flatMap((s) => s.values), 0));
  const slot = plotW / Math.max(labels.length, 1);
  const base = PAD.top + plotH;
  const x = (i: number) => PAD.left + slot * (i + 0.5);
  const y = (v: number) => base - (v / top) * plotH;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
        <defs>
          <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:rgb(var(--success))] [stop-opacity:0.3]" />
            <stop offset="100%" className="[stop-color:rgb(var(--success))] [stop-opacity:0.02]" />
          </linearGradient>
        </defs>
        <Axes ticks={ticks} top={top} labels={labels} />
        {hover !== null ? (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={PAD.top}
            y2={base}
            className="stroke-content-muted"
            strokeDasharray="3 3"
          />
        ) : null}
        {series.map((s) => {
          const line = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
          const area =
            s.area && s.values.length
              ? `${line} L${x(s.values.length - 1)},${base} L${x(0)},${base} Z`
              : '';
          return (
            <g key={s.key}>
              {area ? <path d={area} fill="url(#growth-fill)" /> : null}
              <path
                d={line}
                fill="none"
                strokeWidth={2}
                strokeLinejoin="round"
                className={s.stroke}
              />
              {s.values.map((v, i) => (
                <circle
                  key={i}
                  cx={x(i)}
                  cy={y(v)}
                  r={hover === i ? 4.5 : 3.5}
                  strokeWidth={2}
                  className={cn('fill-surface-card', s.stroke)}
                />
              ))}
            </g>
          );
        })}
        {labels.map((l, i) => (
          <rect
            key={l + i}
            x={PAD.left + slot * i}
            y={PAD.top}
            width={slot}
            height={plotH}
            fill="transparent"
            tabIndex={0}
            className="outline-none"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
          />
        ))}
      </svg>
      {hover !== null && labels[hover] ? (
        <div
          role="presentation"
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-[8px] border border-line bg-surface-card px-2.5 py-1.5 text-caption shadow-float"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <p className="text-content-muted">{labels[hover]}</p>
          {series.map((s) => (
            <p key={s.key} className="flex items-center gap-1.5 text-content-primary">
              <span aria-hidden className={cn('size-2 rounded-full', s.fill)} />
              {s.label}: <span className="font-semibold">{format(s.values[hover] ?? 0)}</span>
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export interface DonutSlice {
  key: string;
  label: string;
  value: number;
  /** Tailwind stroke + fill classes from the status tokens. */
  stroke: string;
  swatch: string;
}

/** Donut with a centre total and a legend (value + share) beside it. */
export function DonutChart({
  slices,
  centreValue,
  centreLabel,
  label,
}: {
  slices: DonutSlice[];
  centreValue: number;
  centreLabel: string;
  label: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const r = 70;
  const sw = 34;
  const circ = 2 * Math.PI * r;
  const gap = total > 0 && slices.filter((s) => s.value > 0).length > 1 ? 2 : 0;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <svg
        viewBox="0 0 184 184"
        role="img"
        aria-label={label}
        className="size-[184px] shrink-0 -rotate-90"
      >
        <circle
          cx={92}
          cy={92}
          r={r}
          fill="none"
          strokeWidth={sw}
          className="stroke-surface-muted"
        />
        {total > 0
          ? slices.map((s) => {
              const len = (s.value / total) * circ;
              const dash = Math.max(len - gap, 0);
              const el = (
                <circle
                  key={s.key}
                  cx={92}
                  cy={92}
                  r={r}
                  fill="none"
                  strokeWidth={hover === s.key ? sw + 4 : sw}
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeDashoffset={-offset}
                  className={cn(s.stroke, 'transition-[stroke-width]')}
                  onMouseEnter={() => setHover(s.key)}
                  onMouseLeave={() => setHover(null)}
                >
                  <title>{`${s.label}: ${formatCount(s.value)}`}</title>
                </circle>
              );
              offset += len;
              return el;
            })
          : null}
        <g className="rotate-90 [transform-origin:92px_92px]">
          <text
            x={92}
            y={90}
            textAnchor="middle"
            className="fill-content-primary font-display"
            fontSize={26}
          >
            {formatCount(centreValue)}
          </text>
          <text
            x={92}
            y={114}
            textAnchor="middle"
            className="fill-content-secondary font-display"
            fontSize={16}
          >
            {centreLabel}
          </text>
        </g>
      </svg>
      <ul className="flex w-full min-w-0 flex-col">
        {slices.map((s) => (
          <li
            key={s.key}
            onMouseEnter={() => setHover(s.key)}
            onMouseLeave={() => setHover(null)}
            className="flex flex-col gap-1.5 border-b border-line py-2 last:border-b-0"
          >
            <span className="flex items-center gap-2 font-display text-heading-sm text-content-secondary">
              <span aria-hidden className={cn('size-[18px] rounded-[4px]', s.swatch)} />
              {s.label}
            </span>
            <span className="flex items-baseline justify-between font-display">
              <span className="text-heading-sm font-medium text-content-primary">
                {formatCount(s.value)}
              </span>
              <span className="text-caption text-content-muted">
                ({total ? Math.round((s.value / total) * 100) : 0}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
