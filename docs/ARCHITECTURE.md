# Lexora AI — Architecture Overview

## Frontend Architecture

Lexora AI's website is built with **zero dependencies** — pure HTML5, CSS3, and Vanilla JavaScript. This ensures maximum performance, security, and portability.

## Technology Decisions

| Technology | Choice | Rationale |
|---|---|---|
| Framework | None (Vanilla) | Zero bundle size, maximum performance, no CVE surface |
| Styling | CSS Custom Properties | Native theming, no preprocessor needed |
| Animations | CSS Keyframes + rAF | GPU-accelerated, no library overhead |
| Scroll effects | IntersectionObserver API | Performant, no scroll event listeners |
| Fonts | Google Fonts (Inter + Playfair) | Industry-standard type system |
| Icons | Inline SVG | No icon font requests, scalable, styleable |

## File Structure

```
/
├── index.html          ← Entry point, all sections inline
├── css/
│   └── style.css       ← ~1,700 lines, all variables in :root
├── js/
│   └── main.js         ← ~300 lines, no dependencies
└── assets/
    └── favicon.svg     ← Pure SVG, no raster formats
```

## CSS Architecture

All design tokens are defined as CSS custom properties in `:root`:

```css
:root {
  /* Color palette */
  --primary: #6C63FF;          /* Brand purple */
  --accent:  #3ECFCF;          /* Brand teal */
  --bg:      #05050F;          /* Deepest background */

  /* Gradients */
  --gradient: linear-gradient(135deg, #6C63FF 0%, #3ECFCF 100%);

  /* Spacing & shape */
  --radius:    16px;
  --radius-xl: 24px;

  /* Transitions */
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## JavaScript Architecture

`main.js` is organized into self-contained modules:

1. **Navbar** — scroll-triggered glass effect
2. **Mobile menu** — hamburger toggle with body scroll lock
3. **Particle canvas** — Canvas API particle network with connection lines
4. **Scroll reveal** — IntersectionObserver-driven card animations
5. **Counter animation** — cubic eased number counting
6. **Contact form** — validation and success state
7. **Nav active link** — section-based link highlighting
8. **Card tilt** — mouse-tracking 3D perspective transform
9. **Typewriter** — character-by-character text animation
10. **Cursor glow** — RAF-based smooth mouse-following glow

## Performance Targets

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.0s |
| Largest Contentful Paint | < 2.5s |
| Total Blocking Time | < 50ms |
| Cumulative Layout Shift | < 0.05 |
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |

## Browser Support

| Browser | Version |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |
