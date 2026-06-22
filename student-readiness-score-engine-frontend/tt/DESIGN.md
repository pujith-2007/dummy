# SkillSync AI - Design System (2026 Edition)

This document specifies the typography, color palette, shadows, spacing variables, and micro-interaction guidelines for the overalled **SkillSync AI** web application. All stylesheets and component styles must strictly conform to these rules.

---

## 1. Typography & Hierarchy

- **Base Font Family**: [Inter](https://fonts.google.com/specimen/Inter) — Clean, professional, and optimized for data density.
- **Heading Font Family**: [Outfit](https://fonts.google.com/specimen/Outfit) — Modern, geometric, high-tech aesthetic.
- **Font Import**:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  ```

| Element | Font Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | Outfit | `3.75rem` (60px) | `800` (Extra Bold) | `1.15` | `-0.03em` |
| **Section Title**| Outfit | `2.25rem` (36px) | `700` (Bold) | `1.2` | `-0.02em` |
| **Card Header** | Outfit | `1.125rem` (18px) | `600` (Semi Bold) | `1.3` | `-0.01em` |
| **Body Large** | Inter | `1.0rem` (16px) | `400` (Regular) | `1.6` | `0` |
| **Body Base** | Inter | `0.875rem` (14px) | `400` (Regular) | `1.5` | `0` |
| **Label/Badge** | Inter | `0.75rem` (12px) | `600` (Semi Bold) | `1.0` | `0.05em` |

---

## 2. Color Palette (HSL & HEX)

A curated, light-mode palette incorporating high-tech accents and clear alerts.

```
       #FFFFFF (Base White Canvas)
          │
       #F8FAFC (Subtle Canvas Backdrop)
          │
  ┌───────┼───────┬──────────────┐
  ▼       ▼       ▼              ▼
Sapphire Indigo Cyan           Coral
#0F172A #4F46E5 #06B6D4        #F43F5E
(Accent) (Interaction) (Data Focus) (Alerts)
```

- **Canvas Backgrounds**:
  - `Base Canvas`: `#FFFFFF` (pure white, standard panels/cards)
  - `Backdrop Canvas`: `#F8FAFC` (cool gray-slate backdrop)
- **Primary / Typography**:
  - `Slate Primary`: `#0F172A` (deep dark slate for headings)
  - `Slate Medium`: `#475569` (neutral slate for body readability)
  - `Slate Muted`: `#94A3B8` (cool silver-gray for placeholder/secondary labels)
- **Accents & Brand (The Sapphire-Indigo Range)**:
  - `Sapphire Brand`: `#1E3A8A` (Deep sapphire, primary actions)
  - `Electric Indigo`: `#4F46E5` (Active menu hover states, dynamic tags)
  - `Neon Cyan`: `#06B6D4` (High-tech progress indicators, interactive charts)
- **Feedback & Alerts**:
  - `Coral Alert`: `#F43F5E` (Curated red-pink alert tone, critical gaps)
  - `Amber Alert`: `#D97706` (Amber tone, warning/medium gaps)
  - `Emerald Success`: `#059669` (Rich green, mastered competencies)

---

## 3. Shadows & Visual Depth

Instead of heavy borders, visual hierarchy is defined through silver, low-opacity shadows mimicking natural illumination.

- **Subtle border**: `border: 1px solid rgba(226, 232, 240, 0.8)` (`border-slate-200/80`)
- **Soft Shadow (Small - Cards)**:
  `box-shadow: 0 4px 20px -2px rgba(148, 163, 184, 0.08), 0 2px 8px -1px rgba(148, 163, 184, 0.04)`
- **Sleek Hover Glow (Indigo)**:
  `box-shadow: 0 12px 30px -4px rgba(79, 70, 229, 0.08), 0 4px 12px -2px rgba(79, 70, 229, 0.03)`
- **Glassmorphic nav panel**:
  `background-color: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(226, 232, 240, 0.6)`

---

## 4. Spacing System

Strict adherence to a **4px base unit grid** for all paddings, margins, and layouts to ensure neat visual flow.

- `xs`: `4px` / `0.25rem`
- `sm`: `8px` / `0.5rem`
- `md`: `16px` / `1.0rem`
- `lg`: `24px` / `1.5rem`
- `xl`: `32px` / `2.0rem`
- `2xl`: `48px` / `3.0rem`
- `3xl`: `64px` / `4.0rem`

---

## 5. Micro-Interactions

- **Hover Scaling**: Buttons and card triggers scale smoothly by `scale(1.02)` or `scale(1.01)` on pointer hover.
- **Color Transitions**: Border and background colors use a standard `duration-300` ease transition.
- **Active state feedback**: Clicks have an immediate `scale(0.98)` feedback transition.
