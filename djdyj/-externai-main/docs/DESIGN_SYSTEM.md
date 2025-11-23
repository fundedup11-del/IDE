# Design System

This project includes a canonical design system expressed as CSS custom properties and a set of AI prompts to ensure generated frontends follow these tokens.

Location:
- Tokens: `src/app/globals.css`
- AI design prompt: `src/lib/design-system-prompt.ts`
- Example page: `src/app/examples/page.tsx`

Key tokens (use semantic names in generated CSS):
- Colors: `--blue-500`, `--blue-600`, `--text-default`, `--text-muted`, `--card-background`, `--surface-foreground`
- Typography: `--font-sans`, `--text-base`, `--text-lg`, `--text-2xl`, `--text-3xl`
- Spacing: `--space-1` (4px) → `--space-16` (64px)
- Radii: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`

Usage notes:
- Generated code should reference semantic tokens like `--color-primary` or `--text-default` rather than hard-coded hex values.
- Follow the 60-30-10 rule: 60% neutral backgrounds, 30% primary usage, 10% accent.
- Ensure accessible contrast (WCAG AA) for body text — see `scripts/contrast-checker.js` for a tool.

Example:
```
body { font-family: var(--font-sans); color: var(--text-default); background: var(--surface-muted); }
.btn-primary { background: var(--primary); color: var(--primary-foreground); }
```
