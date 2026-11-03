# Design system (PlayMate admin)

Source: Figma page "dart me", admin frames (variables "Primary Color", "Title Color", "Paragraph
Color", "Stroke Color", "BG Color", "Input Fild", "Blue/Cyan/Indigo", "FF383C"). Colour values live
ONLY in `src/app/globals.css` (RGB triplets); `tailwind.config.ts` names them. To change the look,
change the variable — never a component. Dark values are derived (the design is light only).

## Colour tokens

| Tailwind name | Light | Used for |
| --- | --- | --- |
| `surface-page` | `#F6F9F8` | app background (BG Color) |
| `surface-card` | `#FFFFFF` | panels, sidebar, top bar |
| `surface-sunken` | `#F6F9F8` | table header row, unread feed rows |
| `surface-muted` | `#F2F2F7` | inputs, inactive pill tabs, icon tiles |
| `surface-tint` | `#E7F0EB` | active nav, selected row |
| `line` / `line-strong` | `#E5E5EA` / `#D1D1D6` | borders |
| `content-primary/secondary/muted` | `#252726` / `#666C68` / `#8E8E93` | text |
| `content-brand` | `#14653C` | active nav, links, brand text |
| `content-link` | `#0088FF` | "Player" type |
| `brand-500/400/300` | `#14653C` / `#1B7A4A` / `#5B9377` | buttons / hover / chart marks |
| `brand-bright` | `#10D04B` | "Mate" in the wordmark |
| `success` + `-soft` | `#34C759` on `#D6F4DE` | Active, Paid, Complete |
| `info` + `-soft` | `#0088FF` on `#CCE7FF` | New |
| `warning` + `-soft` | `#FF8D28` on `#FFE8D4` | Upcoming, Expired |
| `danger` + `-soft` | `#FF383C` on `#FFD7D8` | Blocked, Cancelled, Logout |
| `cyan` + `-soft` | `#00C0E8` | Ready to start, Total Matches |
| `violet` + `-soft` | `#6155F5` | Team Owner, Total Revenue |
| `gold`, `chip` | `#FFC800`, `#6591E6` | alert emoji tile, position chip |
| `.strip-{green,blue,cyan,gold,indigo,red}` | 140° gradients | `StatStrip` headers |

## Type

`font-display` = Outfit (Figma "Primary Text": nav, titles, numbers); `font-sans` = Inter
("Secondary Font": tables, inputs, buttons). Bangla falls back to Hind Siliguri.
Sizes: `heading-xl` 28 (stat values, profile name) · `heading-md` 20 (card titles) · `heading-sm`
16 (nav, section titles) · `body-md` 16 · `body-xs` 14 · `caption` 12.

## Shape

`rounded-card` 16px (panels) · `rounded-input` / `rounded-tile` 10px · pills 22–30px.
`shadow-field` is the Figma toolbar-control shadow. Layout: sidebar 280px, top bar 71px, content
40px side padding; list panel 749 : detail panel 471 at ≥1280px, stacked below.

## Primitives (`@/components/ui`)

| Component | Notes |
| --- | --- |
| `Panel`, `PanelTitle` | white 16px card / 20px title |
| `StatStrip` | gradient header + 28px number cells, tones above |
| `ListTable`, `IdentityCell` | grey rounded header, selectable rows, owns loading/empty/error |
| `SplitLayout`, `DetailHeader`, `SectionLabel`, `PanelState` | list + detail page skeleton |
| `ActionMenu` + `ActionView` / `ActionEdit` / `ActionToggle` / `ActionDelete` | the "Action" ⋮ card |
| `StatusTag` (`StatusPill`, `Chip`) | status word → coloured pill (labels from `commonMessages.status`) |
| `PillTabs`, `UnderlineTabs` | detail tabs / home-away switch |
| `FilterMenu`, `SearchBox`, `DateRangeMenu`, `Pager` | toolbar + pagination |
| `InfoItem`, `InfoBox`, `InfoColumns`, `InfoDivider` | icon-tile fact rows |
| `VersusCard`, `StatRow` | match result cards |
| `EntityAvatar` | picture or initials (circle / square) |
| `Modal`, `AlertModal` | form modal / "Log Out?" style confirm |
| `DesignIcon` | coloured Figma icons in `public/icons` (keeps native aspect ratio) |
| `Button` | primary · outline-brand · outline · muted · ghost · danger |

Older starter primitives (`DataTable`, `StatCard`, `PageHeader`, `FormCard`, …) are unused.

## Rules

- Token classes only; colour literals only in `globals.css`. Icons: lucide (the Figma sidebar /
  info icons are lucide), plus `DesignIcon` for the coloured badges lucide lacks (D-003 still holds
  for everything else).
- Tables scroll sideways inside their panel; the page never scrolls sideways (checked at 360px).
- Charts are hand-made SVG with hover/focus tooltips; single-series charts have no legend, the
  donut has a labelled legend with values + shares.
