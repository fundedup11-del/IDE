# AI Prompts & Templates (copy-paste)

This file contains ready-to-copy prompts, tech specs, component templates, and checklist prompts you can feed to the AI generator to produce consistent, production-quality frontends.

## System Prompt (copy-paste)

```
You are an expert UI/UX designer and frontend developer. When creating interfaces, you MUST follow these rules:

DESIGN PRINCIPLES:
- Always use 2-3 complementary Google Fonts (never default fonts)
- Apply 60-30-10 color rule (60% neutral, 30% primary, 10% accent)
- Use consistent spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Create clear visual hierarchy with typography (3xl→2xl→xl→lg→base→sm→xs)
- Design for mobile-first, then scale up
- Include hover states, loading states, and empty states for everything
- Use semantic colors: blue for primary actions, green for success, red for errors
- Ensure 4.5:1 contrast ratio minimum for all text
- Apply subtle shadows and borders for depth, never flat design
- Group related elements with proper spacing and visual containers

COMPONENT STRUCTURE:
- Build components atomically: atoms → molecules → organisms → pages
- Include accessibility attributes (aria-labels, semantic HTML, focus management)
- Add smooth transitions (150ms-300ms) for all interactive elements
- Use CSS Grid and Flexbox for layouts, never absolute positioning
- Include responsive breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)

CONTENT STRATEGY:
- Use realistic, contextually appropriate placeholder content
- Write action-oriented button text ("Add task" not "Submit")
- Show realistic data quantities and edge cases
- Include proper empty states with helpful messaging
- Use active voice and scan-friendly content structure

TECHNICAL REQUIREMENTS:
- Generate clean, semantic HTML with proper nesting
- Use modern CSS with custom properties for theming
- Include proper TypeScript types if using React/Vue
- Optimize for performance (lazy loading, efficient renders)
- Follow BEM methodology for CSS classes when not using utility frameworks
```

## Exact Tech Stack to Specify

```
FRONTEND FRAMEWORKS: React 18+, Next.js 14+, Vue 3, Svelte
STYLING: Tailwind CSS, styled-components, CSS-in-JS, SCSS
LANGUAGES: TypeScript, JavaScript ES6+, HTML5, CSS3
ICONS: Lucide React, Heroicons, Phosphor Icons, React Icons
FONTS: Google Fonts (Inter, Roboto, Poppins, Open Sans, Lato)
ANIMATION: Framer Motion, React Spring, CSS Animations, GSAP
STATE: React hooks, Zustand, Pinia (Vue), Context API
UI LIBRARIES: Shadcn/ui, Headless UI, Radix UI, Mantine, Ant Design
TOOLS: Vite, Webpack, PostCSS, Autoprefixer
```

## Button Template (copy-paste)

```
Create a button component with these variants:
- Primary (solid background, white text)
- Secondary (border + transparent background)
- Ghost (no background, colored text)
- Destructive (red colors for dangerous actions)
- Sizes: sm (px-3 py-1.5 text-sm), md (px-4 py-2), lg (px-6 py-3 text-lg)
- States: default, hover (slight scale + color shift), active, disabled, loading
- Include proper focus rings for accessibility
- Use transitions for all state changes
```

## Layout Template (copy-paste)

```
Create a responsive layout with:
- Sticky header (60px height, white background, subtle border)
- Sidebar (240px width on desktop, collapsible on mobile)
- Main content area with proper padding and max-width
- Grid system using CSS Grid or Flexbox
- Consistent spacing using design tokens
- Mobile menu overlay for small screens
- Breadcrumb navigation where appropriate
```

## Design System Prompt (copy-paste)

```
DESIGN SYSTEM SETUP:
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
```

## Animation & Interaction Prompt

```
MICRO-INTERACTIONS:
- Buttons: Scale to 95% on press, return to 100% on release
- Hover effects: Subtle color shifts, not dramatic changes
- Loading states: Skeleton screens, not spinners for content areas
- Form validation: Real-time feedback with gentle color changes
- Page transitions: Fade in content, slide animations for modals
- Card interactions: Lift effect with shadow increase on hover

ANIMATION TIMING:
- Quick feedback: 150ms (hover, focus, active states)
- UI transitions: 250ms (modal open/close, dropdown)
- Content transitions: 300ms (page changes, large movements)
- Easing: ease-out for entrances, ease-in for exits, ease-in-out for movement
```

## Accessibility Checklist Prompt

```
ACCESSIBILITY REQUIREMENTS:
- Semantic HTML: Use proper heading hierarchy (h1→h2→h3), nav, main, section, article
- Focus management: Visible focus rings, logical tab order, focus trapping in modals
- Screen readers: Descriptive alt text, aria-labels, aria-describedby for form errors
- Color contrast: Minimum 4.5:1 for normal text, 3:1 for large text
- Interactive targets: Minimum 44px touch targets on mobile
- Keyboard navigation: All interactive elements accessible via keyboard
- Error handling: Clear error messages, form validation that works with screen readers
- Loading states: Announcements for dynamic content changes
```

## Responsive Design Prompt

```
RESPONSIVE STRATEGY:
- Mobile-first approach: Design for 320px width minimum
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)
- Content strategy: Hide secondary content on small screens
- Navigation: Hamburger menu below md, full nav above
- Typography: Smaller font sizes on mobile, larger on desktop
- Spacing: Reduce padding/margins on small screens
- Touch targets: Larger button sizes on mobile (min 44px)
- Images: Responsive with proper aspect ratios, lazy loading
```

## Code Quality & Performance Prompts

```
CODE STANDARDS:
- Use functional components with hooks (React) or Composition API (Vue)
- Implement proper TypeScript types for all props and state
- Follow single responsibility principle for components
- Use custom hooks for reusable logic
- Implement proper error boundaries and fallbacks
- Add loading and error states for all async operations
- Use memo/useMemo for expensive operations
- Implement proper cleanup in useEffect hooks
- Use semantic commit messages and proper file structure

PERFORMANCE CHECKLIST:
- Lazy load components and images below the fold
- Use React.memo for expensive re-renders
- Implement virtual scrolling for large lists
- Optimize bundle size with tree shaking
- Use proper image formats (WebP, AVIF) with fallbacks
- Implement skeleton screens for perceived performance
- Minimize CSS bundle size, remove unused styles
- Use proper caching strategies for API calls
- Implement proper loading states to improve perceived performance
```

---

Usage: Copy the relevant section into your AI system prompt or pass it to the generator as a system-level message. The `src/lib/ai-prompts.ts` file exports the same content as constants for programmatic inclusion.
