# Lunaire Design System — Tokens

Design tokens extracted from the [Lunaire Figma Design System](https://www.figma.com/design/jzFagp4bblJKr0u7p9UylJ/-Q-_L_Design-System-1.0).

## What's in here

| File | Contents |
|------|----------|
| `tokens/colors.json` | 181 colour tokens across Light / Dark / Wireframe modes |
| `tokens/typography.json` | 72 text styles (Desktop + Mobile, 6 weights) |
| `tokens/spacing.json` | 15 spacing/padding tokens |
| `tokens/effects.json` | 9 shadow + blur effect tokens |
| `dist/css/tokens.css` | CSS custom properties (light mode) |
| `dist/css/tokens-dark.css` | Dark mode overrides + `@media prefers-color-scheme` |
| `dist/css/typography.css` | Typography utility classes |
| `dist/scss/_variables.scss` | SCSS variables |
| `dist/js/tokens.js` | JS/ESM export |
| `dist/js/tokens.d.ts` | TypeScript definitions |

## Usage

### CSS
```html
<link rel="stylesheet" href="node_modules/@lunaire/tokens/dist/css/tokens.css">
<link rel="stylesheet" href="node_modules/@lunaire/tokens/dist/css/typography.css">
```

```css
.button {
  background-color: var(--primary-100);
  color: var(--white);
  box-shadow: var(--card-shadow);
}
```

### SCSS
```scss
@import '@lunaire/tokens/scss';

.button {
  background: $primary-100;
}
```

### JavaScript / TypeScript
```ts
import { colors, spacing, typography } from '@lunaire/tokens';

const brand = colors.light['Primary/100']; // '#7a72905'
```

### Dark mode
Add `data-theme="dark"` to `<html>` or `<body>`, or rely on `@media (prefers-color-scheme: dark)` — both are supported automatically.

## Regenerating tokens from Figma

```bash
FIGMA_TOKEN=your_personal_access_token node build.js
```

Get your token at **Figma → Account Settings → Personal access tokens**.

## Token structure

### Colours
```
Primary/120  Primary/100  Primary/80 … Primary/10
Secondary 1/…  Secondary 2/…
Buttons/…  Semantic/…  Surface/…
```

### Typography
```
Desktop / Mobile
  Header 1–6  Body  Sub-body  Label  Footnote  Link-button  Link-button-small
    × Regular / Medium / Bold
```

### Spacing
Padding tokens for consistent component spacing.

---

*Auto-generated — do not edit `dist/` directly. Run `node build.js` to sync.*
