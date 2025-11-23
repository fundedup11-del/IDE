export const DESIGN_SYSTEM_PROMPT = `DESIGN SYSTEM SETUP:
Create a comprehensive design system with:

COLORS:
- Primary palette: Blue scale (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
- Gray palette: Neutral colors for text and backgrounds
- Semantic colors: Green (success), Red (error), Yellow (warning), Blue (info)
- Surface colors: White, light gray backgrounds, card backgrounds

TYPOGRAPHY:
- Headings: Use font-family with lighter weights (300-400)
- Body: Medium weight (400-500) for readability  
- Labels: Semibold (600) for form labels and UI elements
- Scale: text-xs(12px), text-sm(14px), text-base(16px), text-lg(18px), text-xl(20px), text-2xl(24px), text-3xl(30px)

SHADOWS:
- sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
- lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
- xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)

BORDERS:
- Radius: rounded-sm(2px), rounded-md(6px), rounded-lg(8px), rounded-xl(12px)
- Width: border(1px), border-2(2px) for emphasis
- Colors: border-gray-200 for subtle, border-gray-300 for defined

Use this prompt to enforce consistent, production-ready design tokens for generated frontends. Include these tokens as CSS custom properties in generated CSS and prefer semantic token names (e.g. --color-primary, --text-base, --radius-md, --shadow-md). Ensure generated UIs follow the 60-30-10 color rule and meet WCAG AA contrast ratios for normal text.`
