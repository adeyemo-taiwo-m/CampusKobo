# CampusKobo — UI Style Guide
### Professional Design System for BOF OAU's Student Finance App
*Version 1.0 · April 2026*

---

## 0. Design Philosophy

CampusKobo's visual language is built on one principle: **clarity earns trust**. Every pixel serves a purpose. The UI communicates competence and warmth — serious enough to handle real money, approachable enough for a first-year student opening it on a tight budget. The green-forward palette signals growth, not just branding. The typography pairs authority with accessibility. Motion is purposeful, never decorative.

> **Aesthetic Direction:** Refined fintech minimalism with warm organic accents — think Monzo meets a Nigerian campus.

---

## 1. Color System

### 1.1 Primary Palette — Forest Green

| Token | Hex | Usage |
|---|---|---|
| `P950` | `#062d18` | Dark mode cards, deep hero backgrounds |
| `P800` | `#186338` | Dark accents, hover states on dark surfaces |
| `P700` | `#177e42` | Active states, pressed buttons |
| `P600` | `#19a051` | **Primary brand color** — CTAs, active icons, links |
| `P500` | `#2dd673` | Highlight accents, income indicators |
| `P400` | `#4ddb87` | Hover states on light backgrounds |
| `P300` | `#88edb1` | Progress fill (early stage) |
| `P200` | `#bcf6d3` | Subtle tints, chip backgrounds |
| `P100` | `#ddfbe9` | Surface highlights, selected card tint |
| `P50` | `#f0fdf5` | Hover backgrounds, sheet surfaces |
| `P30` | `#E8F5E9` | Page-level tint backgrounds |

**Key rule:** Use `P600` as the single primary action color. Never use more than two green tones in the same component.

---

### 1.2 Neutral Palette

| Token | Hex | Usage |
|---|---|---|
| `N900` | `#1F2223` | Primary text, headings |
| `N800` | `#363939` | Secondary headings, dark labels |
| `N700` | `#57595A` | Body text on light backgrounds |
| `N600` | `#797A7B` | Secondary text, metadata |
| `N500` | `#8E9090` | Placeholder text |
| `N400` | `#B1B2B2` | Disabled text |
| `N300` | `#D2D3D3` | Dividers, light borders |
| `N200` | `#EAEAEA` | Default input borders, card borders |
| `N100` | `#F6F6F6` | Subtle backgrounds, skeleton loaders |
| `white` | `#FFFFFF` | Card surfaces, modals |
| `whiteBg` | `#F8F9FB` | App-level background |

---

### 1.3 Semantic / Feedback Colors

| Token | Hex | Context |
|---|---|---|
| `R500` | `#EF4444` | Errors, expense amounts, delete actions |
| `R300` | `#FCA5A5` | Error borders, light error states |
| `R100` | `#F3E6E7` | Error surface backgrounds |
| `O500` | `#F59E0B` | Warnings (budget 70–90% used) |
| `O300` | `#FCD34D` | Warning highlights |
| `O100` | `#FEF3C7` | Warning surface backgrounds |

### 1.4 Extended Semantic Aliases

```typescript
PRIMARY_GREEN  = P600   // #19a051 — one primary action color, used everywhere
BLACK          = N900   // #1F2223 — near-black for text
TEXT_PRIMARY   = N900   // #1F2223
TEXT_SECONDARY = N600   // #797A7B
BORDER_GRAY    = N200   // #EAEAEA
LIGHT_GRAY     = N100   // #F6F6F6
BACKGROUND     = whiteBg // #F8F9FB
SUCCESS        = P600   // #19a051
ACCENT_GREEN   = #2ECC71 // vivid green for income values, badges
FOREST_GREEN   = #1A7A3C // dark green for high-contrast dark surfaces
DARK_CARD      = P950   // #062d18 — hero card, dashboard header
```

---

### 1.5 Color Usage Rules

**DO:**
- Use `PRIMARY_GREEN` (`P600`) for all tappable primary actions
- Use `R500` exclusively for negative values (expenses) and destructive actions
- Use `DARK_CARD` (`P950`) only for the dashboard hero card and financial summary headers
- Pair `P600` text on `P50`/`P100` backgrounds for selected states
- Use `whiteBg` (`#F8F9FB`) as the global screen background, not pure white

**DON'T:**
- Mix warning orange with primary green in the same card
- Use `P950` as a text color on white (contrast insufficient)
- Use more than 3 color families in a single screen section
- Use pure `#000000` black anywhere — always `N900`

---

## 2. Typography

### 2.1 Font Stack

**Primary (UI, Body):** `Geist` or `Plus Jakarta Sans`
**Numeric / Financial Data:** `Geist Mono` (for amounts — monospaced alignment)
**Fallback:** `system-ui, -apple-system, sans-serif`

> Install via Expo: `@expo-google-fonts/plus-jakarta-sans` and `@expo-google-fonts/geist-mono`

---

### 2.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display` | 40px | 700 Bold | 1.1 | Onboarding hero headlines |
| `h1` | 32px | 700 Bold | 1.2 | Screen titles (large cards) |
| `h2` | 24px | 700 Bold | 1.25 | Section headers |
| `h3` | 20px | 600 SemiBold | 1.3 | Card titles, subsection headers |
| `h4` | 18px | 600 SemiBold | 1.35 | List group labels |
| `body-lg` | 16px | 400 Regular | 1.5 | Primary body copy |
| `body-md` | 14px | 400 Regular | 1.5 | Secondary body, descriptions |
| `body-sm` | 12px | 400 Regular | 1.5 | Captions, metadata, timestamps |
| `label` | 13px | 500 Medium | 1.4 | Form labels, input labels |
| `caption` | 11px | 400 Regular | 1.4 | Footnotes, legal copy |
| `amount-xl` | 40px | 700 Bold | 1.0 | Dashboard balance figure |
| `amount-lg` | 32px | 700 Bold | 1.0 | Card financial totals |
| `amount-md` | 24px | 600 SemiBold | 1.1 | Inline amounts |
| `amount-sm` | 16px | 500 Medium | 1.2 | Transaction row amounts |
| `tag` | 11px | 600 SemiBold | 1 | Category chips, badges |

**Rule for financial values:** Always use `Geist Mono` or its equivalent monospaced variant for ₦ amounts to ensure digit alignment in lists.

---

### 2.3 Typography Rules

- **Headings**: Never exceed 2 heading levels in a single scrollable card
- **Line length**: Cap body text at ~60 characters per line for readability
- **Amount display**: Income values in `ACCENT_GREEN`, expense values in `R500`, balance in `white` on dark cards or `N900` on light
- **Letter spacing**: Headings `h1–h2` use `letterSpacing: -0.5` for a refined, confident feel. Body copy: 0.
- **Never** use all-caps for amounts — it reduces scannability. All-caps is reserved for `TAG` and badge text only.

---

## 3. Spacing System

All spacing derives from a **4px base unit**.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon padding, tight internal gaps |
| `space-2` | 8px | Between label and input, icon margins |
| `space-3` | 12px | Card inner padding (compact mode) |
| `space-4` | 16px | Default content padding, list item height |
| `space-5` | 20px | Between card sections |
| `space-6` | 24px | Horizontal screen padding |
| `space-8` | 32px | Between major sections on a screen |
| `space-10` | 40px | Top of screen from header to first content |
| `space-12` | 48px | Bottom spacing above FAB |
| `space-16` | 64px | Large section dividers, onboarding hero space |

**Screen horizontal padding**: `24px` on all screens consistently. Never drop below `16px`.

**Card inner padding**: `20px` horizontal, `16px` vertical for standard cards. `24px` all sides for hero/dark cards.

---

## 4. Border Radius

| Context | Radius | Notes |
|---|---|---|
| Screen-edge cards | `20px` | Dashboard hero cards, full-width sheets |
| Standard cards | `16px` | Transaction cards, budget cards |
| Compact cards | `12px` | Category chips, small info cards |
| Buttons (large) | `14px` | Primary and secondary buttons |
| Buttons (small/chip) | `99px` | Pill shape for filter chips, tags |
| Input fields | `12px` | All form inputs |
| Icons (background circle) | `50%` | Category icon circles |
| Bottom sheets | `24px` top corners only | |
| Modals | `20px` | |
| Badges / Tags | `6px` | Small label badges |

---

## 5. Elevation & Shadow System

CampusKobo uses a **four-level shadow system**. Shadows are warm-tinted (not cold gray) to complement the green palette.

```typescript
export const Shadows = {
  none: { elevation: 0 },

  sm: {
    shadowColor: "#1F2223",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  md: {
    shadowColor: "#1F2223",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },

  lg: {
    shadowColor: "#062d18",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },

  xl: {
    shadowColor: "#062d18",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 16,
  },
};
```

**Usage map:**
- `sm` — Transaction cards, list items
- `md` — Budget cards, savings goal cards, standard modals
- `lg` — Dark hero card, bottom sheets
- `xl` — FAB button, primary CTA buttons in onboarding

---

## 6. Component Standards

### 6.1 Buttons

```
Primary Button
  Background: PRIMARY_GREEN (#19a051)
  Text: White, 16px, SemiBold
  Height: 52px
  Border Radius: 14px
  Shadow: xl (when on light bg) / none (when inside dark card)
  Pressed state: background → P700 (#177e42), scale → 0.97
  Disabled: background → N200, text → N400

Secondary Button
  Background: P50 (#f0fdf5)
  Text: P600, 16px, SemiBold
  Border: 1.5px P200
  Height: 52px
  Border Radius: 14px

Outline Button
  Background: transparent
  Border: 1.5px N200
  Text: N900, 16px, Medium
  Height: 52px

Danger Button
  Background: R100 (#F3E6E7)
  Text: R500, 16px, SemiBold
  Border: 1px R300
  Height: 52px

Ghost Button (text-only link)
  No background, no border
  Text: P600, 14px, Medium
  Underline: none by default, on press: light underline

Chip / Filter Button (selected)
  Background: P600
  Text: white, 12px, SemiBold
  Height: 32px, Padding: 0 14px
  Border Radius: 99px

Chip / Filter Button (unselected)
  Background: white
  Border: 1.5px N200
  Text: N700, 12px, Medium
```

---

### 6.2 Input Fields

```
Default State
  Background: white
  Border: 1.5px N200 (#EAEAEA)
  Border Radius: 12px
  Height: 52px
  Padding: 0 16px
  Text: N900, 16px Regular
  Placeholder: N400, 16px Regular

Focused State
  Border: 2px P600 (#19a051)
  Shadow: 0 0 0 3px rgba(25, 160, 81, 0.12) (focus ring)

Error State
  Border: 2px R500 (#EF4444)
  Background: R100 (#F3E6E7)
  Shadow: 0 0 0 3px rgba(239, 68, 68, 0.10)

Disabled State
  Background: N100
  Border: 1.5px N200
  Text: N400

Label (above input)
  Font: 13px, Medium, N700
  Margin-bottom: 6px

Error Message (below input)
  Font: 12px, Regular, R500
  Icon: ⚠ before text
  Margin-top: 4px

Helper Text (below input, non-error)
  Font: 12px, Regular, N500
  Margin-top: 4px

Large Amount Input (AddTransaction, Onboarding)
  Font: 40px, Bold, Geist Mono, N900
  Text alignment: center
  Border: none, only bottom border 2px N200
  Focused: bottom border 2px P600
  Background: transparent
```

---

### 6.3 Cards

**Standard Card**
```
Background: white
Border Radius: 16px
Shadow: md
Padding: 16px horizontal, 14px vertical
Border: 1px N200 (optional — use only if on whiteBg background)
```

**Dark Hero Card (Dashboard, Expenses Header)**
```
Background: P950 (#062d18)
Border Radius: 20px
Padding: 24px
Shadow: xl
Text: white
Subtext: P300 (#88edb1) — NOT gray, use a green tint
Progress bar background: rgba(255,255,255,0.12)
Progress bar fill: P400 (#4ddb87)
```

**Selection Card (Goal selection, Category setup)**
```
Default: white bg, 1.5px N200 border, 16px radius
Selected: P50 bg (#f0fdf5), 2px P600 border
  — Icon circle: P600 bg, white icon
  — Checkmark: P600, positioned top-right
  — Transition: 150ms ease
```

**Transaction List Item**
```
Background: white
Border Radius: 12px
Padding: 12px 16px
Shadow: sm
Min Height: 64px
Icon circle: 40px diameter, colored per category
Category color map — see Section 9
```

---

### 6.4 Progress Bars

```
Track (background)
  Height: 8px (standard) / 6px (compact) / 12px (hero card)
  Background: N200 on light / rgba(255,255,255,0.15) on dark
  Border Radius: 99px

Fill colors
  Under 70%:   P500 (#2dd673)
  70% – 90%:   O500 (#F59E0B)
  Over 90%:    R500 (#EF4444)
  100%:        P600 with subtle glow effect

Animated fill: 600ms ease-out on mount / data change
```

---

### 6.5 Bottom Sheets

```
Background: white
Top border radius: 24px
Drag handle: 4px x 36px, N200, centered, margin-top 12px
Padding: 0 24px 40px
Shadow: xl
Overlay: rgba(0, 0, 0, 0.45)
Animation: slide up 350ms cubic-bezier(0.32, 0.72, 0, 1)
```

---

### 6.6 Category Icon Circles

Each category uses a fixed color pair (background tint + icon color):

| Category | Circle BG | Icon Color |
|---|---|---|
| Food | `#FEF3C7` | `#D97706` |
| Transport | `#DBEAFE` | `#2563EB` |
| Data/Internet | `#EDE9FE` | `#7C3AED` |
| Entertainment | `#FFEDD5` | `#EA580C` |
| Shopping | `#FCE7F3` | `#DB2777` |
| Health | `#DCFCE7` | `#16A34A` |
| Education | `#E0F2FE` | `#0284C7` |
| Salary/Income | `#D1FAE5` | `#059669` |
| Freelance | `#FEF9C3` | `#CA8A04` |
| Savings | `#F0FDF4` | `#19a051` |
| Bills | `#FEE2E2` | `#DC2626` |
| Transfer | `#F1F5F9` | `#475569` |
| Others | `#F3F4F6` | `#6B7280` |

Icon circle dimensions: **44px** (standard list) / **56px** (detail screens) / **72px** (hero on detail page)

---

### 6.7 Badges & Tags

```
Category Tag (on content cards, learning hub)
  Background: P100 (#ddfbe9)
  Text: P800 (#186338), 11px, SemiBold, uppercase, letterSpacing: 0.5px
  Padding: 3px 8px
  Border Radius: 6px

Status Badge — Active
  Background: P100
  Text: P700, 11px, SemiBold
  Dot: 6px circle P500

Status Badge — Paused
  Background: N100
  Text: N600, 11px, SemiBold
  Dot: 6px circle N400

Status Badge — Warning
  Background: O100 (#FEF3C7)
  Text: #92400E, 11px, SemiBold

Status Badge — Error / Over Budget
  Background: R100 (#F3E6E7)
  Text: R500, 11px, SemiBold

Income Tag
  Background: P100
  Text: P700, 12px, Medium

Expense Tag
  Background: R100
  Text: R500, 12px, Medium
```

---

## 7. Navigation & Layout

### 7.1 Screen Layout

```
Status Bar:          Dark content on light screens / Light on DARK_CARD screens
Header Height:       56px
Tab Bar Height:      65px (including bottom safe area inset)
Screen H-Padding:    24px
Max content width:   100% (no max-width constraint on mobile)
```

### 7.2 Header Bar

```
Background: whiteBg / transparent (over dark hero card)
Bottom border: 1px N200 (when over white content only)
Title: 17px, SemiBold, N900, centered
Back arrow: Ionicons chevron-back, 24px, N900
Right icons: 24px, N900, spaced 16px apart
Avatar circle: 34px, P600 bg, white initials, 14px SemiBold
```

### 7.3 Bottom Tab Bar

```
Background: white
Top border: 1px N200
Height: 65px
Padding bottom: 8px (+ safe area)

Active tab:
  Icon: P600 (#19a051), filled variant
  Label: P600, 10px, SemiBold

Inactive tab:
  Icon: N400 (#B1B2B2)
  Label: N400, 10px, Regular

Active indicator: 3px wide pill, P600, top edge of icon
No tab bar shadow — rely on border only
```

### 7.4 Floating Action Button (FAB)

```
Size: 56px diameter
Background: P600 (#19a051)
Icon: + (Ionicons add), 28px, white
Shadow: xl with green tint
  shadowColor: "#062d18"
  shadowOffset: { width: 0, height: 4 }
  shadowOpacity: 0.30
  shadowRadius: 12
Position: bottom 24px + tab bar height, right 24px
Pressed: scale 0.92, 120ms spring
```

---

## 8. Motion & Animation

### 8.1 Principles
- Animations should **confirm actions**, not decorate them
- Duration range: **120ms** (micro) → **400ms** (page transitions)
- Always use **ease-out** for elements entering; **ease-in** for elements leaving
- Spring physics for interactive elements (buttons, cards, FAB)

### 8.2 Standard Durations

| Type | Duration | Easing |
|---|---|---|
| Micro (toggle, tap feedback) | 120ms | ease |
| Short (chip select, badge appear) | 200ms | ease-out |
| Medium (bottom sheet, modal) | 320ms | cubic-bezier(0.32, 0.72, 0, 1) |
| Long (screen transition, progress bar fill) | 400ms | ease-out |
| Extra (confetti, onboarding) | 600–800ms | spring |

### 8.3 Key Animation Patterns

**Screen mount — staggered card entrance**
```
Each card fades in (0→1) and translates up (+16px→0)
Stagger: 60ms per card
Duration: 320ms ease-out
```

**Button press**
```
Scale: 1 → 0.96 on press-in (100ms)
Scale: 0.96 → 1 on press-out (150ms spring)
```

**Skeleton loader pulse**
```
Opacity: 0.4 → 0.85 → 0.4
Duration: 1200ms, loop
Color: N200 (#EAEAEA)
```

**Progress bar fill on mount**
```
Width: 0% → target%
Duration: 600ms ease-out
Delay: 200ms after card enters
```

**PIN dot fill (SetPIN screen)**
```
Scale: 0 → 1 per dot on keypad tap
Duration: 150ms spring
Color transition: N200 → P600
```

**Error shake (PIN mismatch)**
```
translateX: 0 → -8 → 8 → -6 → 6 → -4 → 0
Duration: 400ms
Color: briefly flash R500 on the 4 dots
```

**Toast slide-in**
```
translateY: 100 → 0
Duration: 280ms cubic-bezier(0.32, 0.72, 0, 1)
Auto dismiss: after 2000ms
Slide-out: 200ms ease-in
```

---

## 9. Iconography

**Library:** `@expo/vector-icons` — Ionicons set (filled variants for active states, outline for inactive)

**Sizing rules:**
- Navigation icons: `24px`
- In-content icons: `20px`
- Category icon inside circle: `22px` (within 44px circle)
- Large hero icons (detail screens): `32px` (within 72px circle)
- Badge/tag inline icons: `12px`
- FAB icon: `28px`

**Tab bar icon map:**
```
Home:     home (inactive) / home (active)
Expenses: receipt-outline / receipt
Budget:   bar-chart-outline / bar-chart
Savings:  wallet-outline / wallet
```

**Common screen icons:**
```
Add transaction:  add-circle-outline
Back navigation:  chevron-back
Bell:             notifications-outline / notifications
Learning:         school-outline / school
Edit:             pencil-outline
Delete:           trash-outline (R500 tint)
Search:           search-outline
Export:           share-outline
Settings:         settings-outline
Eye show:         eye-outline
Eye hide:         eye-off-outline
Recurring:        repeat-outline
Bookmark:         bookmark-outline / bookmark
```

---

## 10. Data Visualization

### 10.1 Progress Rings (Budget & Savings)

```
Track stroke: N200
Fill stroke: P500 / O500 / R500 (based on percentage)
Stroke width: 8px (compact) / 12px (detail screen ring)
Background circle: N100
Animated: strokeDashoffset transitions on mount (600ms ease-out)
```

### 10.2 Spending Category Breakdown (Dashboard — future)

```
Use horizontal stacked bar (not pie chart — easier to read on mobile)
Height: 12px
Each segment is a category color (from Section 6.6)
Legend: horizontal scroll of color-dot + label pairs below bar
```

---

## 11. Empty States

```
Icon: 56px, N300 color (muted, not the category color)
Title: 18px, SemiBold, N800
Subtitle: 14px, Regular, N500, centered, max-width 260px
Spacing between icon → title: 16px
Spacing between title → subtitle: 8px
Spacing between subtitle → button: 24px
CTA button: Secondary variant, auto-width (not full-width)
```

---

## 12. Feedback States

### 12.1 Toast Notification

```
Success: P800 background, P200 text, checkmark-circle icon (P400)
Error:   R500 background, white text, alert-circle icon (white)
Info:    N800 background, white text, information-circle icon (N300)

Padding: 14px 18px
Border Radius: 12px
Shadow: lg
Max width: screen width − 32px
Min height: 48px
```

### 12.2 Loading Spinner

```
Color: P600 (#19a051)
Size: 24px (inline) / 36px (full-screen)
Full-screen loader: centered, white overlay, P600 spinner
```

### 12.3 Success Screens

```
Checkmark circle: 80px diameter, P600 background, white icon 40px
Title: h1 (32px Bold), N900 (or white if on dark)
Subtitle: body-lg (16px), N600
Button: Primary, full-width, margin-top 40px
```

---

## 13. Accessibility

- **Minimum contrast ratio:** 4.5:1 for body text, 3:1 for large text and UI components
- **Touch target minimum:** 44×44px for all interactive elements
- **Focus indicators:** 2px outline in P600 with 3px offset for keyboard/screen reader navigation
- **Font scaling:** Support system font size changes — use relative units where possible
- **Color never alone:** Status (error, warning, success) must be communicated by both color AND icon/text
- **Reduced motion:** Check `AccessibilityInfo.isReduceMotionEnabled()` — skip all non-essential animations if true

### Contrast Quick Reference

| Combination | Ratio | Pass? |
|---|---|---|
| N900 on whiteBg | 16.9:1 | ✅ AAA |
| P600 on white | 4.6:1 | ✅ AA |
| white on P600 | 4.6:1 | ✅ AA |
| white on P950 | 19.2:1 | ✅ AAA |
| N600 on white | 4.5:1 | ✅ AA |
| P500 on white | 2.8:1 | ⚠ Large text only |
| R500 on white | 4.9:1 | ✅ AA |

---

## 14. Screen-Specific Design Checklist

Before finalizing any screen, verify:

- [ ] Horizontal padding is exactly `24px` on all sides
- [ ] Background is `whiteBg` (#F8F9FB), not pure white
- [ ] No more than 2 typeface weights used in a single card
- [ ] All ₦ amounts use `Geist Mono` / monospaced variant
- [ ] Income amounts in `ACCENT_GREEN`, expense amounts in `R500`
- [ ] Dark hero card uses `P950` background — no other dark bg color
- [ ] All buttons meet `52px` height minimum
- [ ] Progress bars animate on screen enter (600ms ease-out)
- [ ] Empty states use muted `N300` icon, not colored icons
- [ ] Bottom sheets have `24px` top border radius
- [ ] FAB sits `24px` from the right edge and `24px` above the tab bar
- [ ] Skeleton loaders present when `isLoading` is true
- [ ] No transition takes longer than `400ms` (except confetti/celebration)

---

## 15. Quick Token Reference Card

```typescript
// PASTE INTO /src/constants/theme.ts

export const Theme = {
  // Background
  bg: "#F8F9FB",          // Screen background
  surface: "#FFFFFF",     // Cards, modals
  overlay: "rgba(0,0,0,0.45)", // Sheet overlays

  // Brand
  primary: "#19a051",     // P600 — main CTA color
  primaryDark: "#186338", // P800 — hover/pressed
  primaryDeep: "#062d18", // P950 — hero cards
  primaryLight: "#f0fdf5",// P50  — selected backgrounds
  primaryTint: "#ddfbe9", // P100 — tint surfaces

  // Text
  textPrimary: "#1F2223",   // N900
  textSecondary: "#797A7B", // N600
  textDisabled: "#B1B2B2",  // N400
  textPlaceholder: "#8E9090",// N500
  textInverse: "#FFFFFF",

  // Feedback
  success: "#19a051",       // P600
  successLight: "#ddfbe9",  // P100
  warning: "#F59E0B",       // O500
  warningLight: "#FEF3C7",  // O100
  error: "#EF4444",         // R500
  errorLight: "#F3E6E7",    // R100

  // Borders & Dividers
  border: "#EAEAEA",        // N200 — default
  borderFocus: "#19a051",   // P600 — focused input
  borderError: "#EF4444",   // R500

  // Spacing
  screenPadding: 24,
  cardRadius: 16,
  buttonRadius: 14,
  inputRadius: 12,
  chipRadius: 99,

  // Typography scale (px)
  fontDisplay: 40,
  fontH1: 32,
  fontH2: 24,
  fontH3: 20,
  fontBody: 16,
  fontBodySm: 14,
  fontCaption: 12,
  fontTag: 11,
};
```

---

*CampusKobo Style Guide v1.0 — Bureau of Finance OAU*
*Maintain consistency. Every screen is a reflection of financial trust.*
