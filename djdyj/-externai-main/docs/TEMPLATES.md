Templates & Generation Helpers

Overview
- This folder contains a reusable HTML template and helpers that ExternAI uses to generate high-quality websites.
- The generator injects realistic `SAMPLE_DATA` (products, users, posts) into the prompt so the AI produces finished pages with realistic content and matching images.

Files added
- `src/templates/next-template.html` - Example product-style template (mobile-first, Tailwind-friendly structure). Contains placeholders: `{{TITLE}}`, `{{SUBTITLE}}`, `{{HERO_IMAGE}}`, and `{{SAMPLE_DATA}}`.
- `src/lib/data-generator.ts` - Generates realistic fake data using `@faker-js/faker` (products, users, blog posts).
- `src/lib/image-selector.ts` - Maps keywords to verified Unsplash image URLs.

How it works
1. When a user asks the AI to generate a site, the API route (`/api/chat`) infers a target site category from the prompt.
2. It generates sample data (products/users/posts) and selects images for each product.
3. The API includes a `SAMPLE_DATA` system message in the prompt with JSON payload so the AI can use real-looking content and specific image URLs.
4. The AI returns production-ready frontend code that can plug the `SAMPLE_DATA` into the template or inline the mocked data.

Best practices for templates
- Use semantic HTML and CSS custom properties for theming.
- Respect the design rules in the system prompt (Google Fonts, 60-30-10 color rule, spacing scale, accessibility).
- Include placeholders for `SAMPLE_DATA` so the runtime template can mount dynamic content.

Next steps
- Create React/Next starter templates that import and render `SAMPLE_DATA` using Chakra or shadcn/ui components.
- Add test suites that validate image links, color contrast, and accessibility.
