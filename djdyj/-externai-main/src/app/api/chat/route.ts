import { NextRequest, NextResponse } from 'next/server';
import { generateProducts, generateUsers, generateBlogPosts } from '@/lib/data-generator';
import { selectImageForKeyword } from '@/lib/image-selector';
import { DESIGN_SYSTEM_PROMPT } from '@/lib/design-system-prompt';
import { AI_SYSTEM_PROMPT, MULTI_FILE_GENERATION_PROMPT } from '@/lib/ai-prompts';
import {
  detectProjectType,
  analyzeProjectRequirements,
  FileTreeGenerator,
  ProjectType
} from '@/lib/file-tree-generator';
import { getTemplateByType } from '@/lib/project-templates';

// Use OpenAI API - requires OPENAI_API_KEY environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';

// Image Validator AI Agent - validates and replaces broken image URLs
async function validateAndFixImages(code: string): Promise<{ code: string; validationReport: string }> {
  // Extract all Unsplash image URLs from the code
  const imageUrlRegex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-_]+\?[^\s\\"'<>]*/g;
  const imageUrls = code.match(imageUrlRegex) || [];

  if (imageUrls.length === 0) {
    return { code, validationReport: 'No images to validate' };
  }

  console.log(`🔍 Image Validator: Found ${imageUrls.length} images to validate`);

  // Validate images in parallel
  const validationPromises = imageUrls.map(async (url) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const isValid = response.ok && response.headers.get('content-type')?.startsWith('image/');
      return { url, valid: isValid, status: response.status };
    } catch (error: any) {
      console.error(`❌ Image validation failed for ${url}:`, error.message);
      return { url, valid: false, error: error.message };
    }
  });

  const validationResults = await Promise.all(validationPromises);
  const invalidImages = validationResults.filter(r => !r.valid);

  console.log(`✅ Valid images: ${validationResults.length - invalidImages.length}/${validationResults.length}`);

  if (invalidImages.length > 0) {
    console.log(`⚠️  Invalid images found: ${invalidImages.length}`);
    console.log('Invalid URLs:', invalidImages.map(i => i.url));
  }

  // Fallback verified images by category
  const fallbackImages: { [key: string]: string[] } = {
    laptop: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    ],
    phone: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    ],
    headphones: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop',
    ],
    camera: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop'],
    watch: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'],
    tablet: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop'],
    sneakers: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'],
    sunglasses: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop'],
    bag: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'],
    shirt: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop'],
    pizza: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'],
    burger: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'],
    coffee: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'],
    sushi: ['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop'],
    chair: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop'],
    lamp: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop'],
    plant: ['https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop'],
    sofa: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'],
    books: ['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop'],
    notebook: ['https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop'],
    yoga: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop'],
    gym: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop'],
    default: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'],
  };

  // Replace invalid images with fallbacks
  let fixedCode = code;

  // TODO: Implement actual image replacement logic here
  return { code: fixedCode, validationReport: 'Validation complete' };
}

export async function POST(req: NextRequest) {
  const { message, history, supabaseConfig } = await req.json();

  // Check if Supabase is configured and enhance the message if so
  let enhancedMessage = message;
  if (supabaseConfig?.url && supabaseConfig?.anonKey) {
    console.log('🗄️ Supabase Integration Enabled');
    const { enhancePromptWithSupabase } = await import('@/lib/supabase-prompt-enhancer');
    enhancedMessage = enhancePromptWithSupabase(message, supabaseConfig);
  }

  // Detect project type and requirements (use enhanced message)
  const projectType = detectProjectType(enhancedMessage);
  const projectConfig = analyzeProjectRequirements(enhancedMessage);
  const isMultiFile = projectType !== 'single-file';

  console.log('🔍 Project Detection:', {
    type: projectType,
    isMultiFile,
    features: projectConfig.features,
    hasBackend: projectConfig.hasBackend
  });

  // Infer a simple category from the user's message to seed fake data
  function inferCategoryFromMessage(text: string) {
    const t = (text || '').toLowerCase();
    if (t.includes('e-commerce') || t.includes('shop') || t.includes('store') || t.includes('products')) return 'ecommerce';
    if (t.includes('restaurant') || t.includes('food') || t.includes('menu')) return 'food';
    if (t.includes('blog') || t.includes('articles') || t.includes('news')) return 'blog';
    if (t.includes('portfolio') || t.includes('photographer')) return 'portfolio';
    return 'general';
  }

  const inferredCategory = inferCategoryFromMessage(message);
  const sampleProducts = generateProducts(12, inferredCategory === 'ecommerce' ? 'electronics' : inferredCategory);
  const sampleUsers = generateUsers(4);
  const samplePosts = generateBlogPosts(6);

  const sampleData = {
    products: sampleProducts.map(p => ({ ...p, image: selectImageForKeyword(p.name || p.category) })),
    users: sampleUsers,
    posts: samplePosts
  };

  // Build messages array so we can insert SAMPLE_DATA for the AI to use
  const systemPrompt = `You are ExternAI, an elite Senior Frontend Architect and UI/UX Designer with a mastery of modern web technologies. Your mission is to build BREATHTAKING, PRODUCTION-GRADE web applications that wow users instantly.

**CORE PHILOSOPHY:**
- **Visuals First:** If it doesn't look premium, it's a failure. Use glassmorphism, mesh gradients, and sophisticated typography.
- **Interactive by Default:** Everything must react to the user. Hover states, micro-interactions, and smooth transitions are mandatory.
- **Modern Stack:** You have full access to the best tools. Use them.

**ALLOWED & ENCOURAGED LIBRARIES (CDN ONLY):**
You MUST use these CDNs to build powerful apps. NO INSTALL STEPS.
1.  **Tailwind CSS (MANDATORY):** \`<script src="https://cdn.tailwindcss.com"></script>\`
    - Config: \`tailwind.config = { theme: { extend: { colors: { border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))", background: "hsl(var(--background))", foreground: "hsl(var(--foreground))", primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" }, secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" }, destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" }, muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" }, accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" }, popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" }, card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" } }, borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" } } } }\`
    - Add this style tag for Shadcn variables:
      \`<style type="text/tailwindcss">@layer base { :root { --background: 0 0% 100%; --foreground: 222.2 84% 4.9%; --card: 0 0% 100%; --card-foreground: 222.2 84% 4.9%; --popover: 0 0% 100%; --popover-foreground: 222.2 84% 4.9%; --primary: 221.2 83.2% 53.3%; --primary-foreground: 210 40% 98%; --secondary: 210 40% 96.1%; --secondary-foreground: 222.2 47.4% 11.2%; --muted: 210 40% 96.1%; --muted-foreground: 215.4 16.3% 46.9%; --accent: 210 40% 96.1%; --accent-foreground: 222.2 47.4% 11.2%; --destructive: 0 84.2% 60.2%; --destructive-foreground: 210 40% 98%; --border: 214.3 31.8% 91.4%; --input: 214.3 31.8% 91.4%; --ring: 221.2 83.2% 53.3%; --radius: 0.5rem; } .dark { --background: 222.2 84% 4.9%; --foreground: 210 40% 98%; --card: 222.2 84% 4.9%; --card-foreground: 210 40% 98%; --popover: 222.2 84% 4.9%; --popover-foreground: 210 40% 98%; --primary: 217.2 91.2% 59.8%; --primary-foreground: 222.2 47.4% 11.2%; --secondary: 217.2 32.6% 17.5%; --secondary-foreground: 210 40% 98%; --muted: 217.2 32.6% 17.5%; --muted-foreground: 215 20.2% 65.1%; --accent: 217.2 32.6% 17.5%; --accent-foreground: 210 40% 98%; --destructive: 0 62.8% 30.6%; --destructive-foreground: 210 40% 98%; --border: 217.2 32.6% 17.5%; --input: 217.2 32.6% 17.5%; --ring: 224.3 76.3% 48%; } } </style>\`
2.  **Icons (Lucide):** \`<script src="https://unpkg.com/lucide@latest"></script>\` (Call \`lucide.createIcons()\` after DOM load)
3.  **Animations (GSAP):** \`<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>\` (Use for complex timelines)
4.  **3D (Three.js):** \`<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\` (Only if requested)
5.  **Charts (Chart.js):** \`<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\` (For dashboards)
6.  **Fonts:** Use 'Inter' and 'Outfit' from Google Fonts.

**DESIGN RULES (THE "PREMIUM" STANDARD):**
- **Layout:** Use "Bento Grid" layouts (rounded-3xl cards, gap-4/6).
- **Aesthetics:** Glassmorphism (bg-white/10 backdrop-blur-lg border-white/20).
- **Typography:** Large, bold headings (Outfit). Clean, readable body (Inter).
- **Colors:** Use the defined CSS variables (bg-background, text-foreground). Support Dark Mode.
- **Shadows:** Soft, multi-layered shadows (shadow-xl, shadow-blue-500/20).
- **Images:** Use ONLY the provided Unsplash URLs. Match context perfectly.

**TECHNICAL CONSTRAINTS:**
- **Single File:** Everything (HTML, CSS, JS) must be in ONE file.
- **No Build Step:** Do not use \`import\` or \`require\`. Use global variables from CDNs (e.g., \`gsap\`, \`Chart\`).
- **Data:** Use \`sessionStorage\` for persistence. Mock data must be rich and realistic.

**RESPONSE FORMAT:**
**EXPLANATION**
Briefly explain the design choices and libraries used...

**CODE**
FRONTEND_CODE:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium App</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'], heading: ['Outfit', 'sans-serif'] },
                    colors: { /* ...Shadcn colors... */ }
                }
            }
        }
    </script>
    <style type="text/tailwindcss">
        @layer base { /* ...Shadcn variables... */ }
        .glass { @apply bg-white/10 backdrop-blur-lg border border-white/20; }
    </style>
</head>
<body class="bg-background text-foreground antialiased min-h-screen selection:bg-primary selection:text-primary-foreground">
    <!-- App Content -->
    <div id="app"></div>

    <!-- Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <script>
        // Initialize Icons
        lucide.createIcons();

        // GSAP Animations
        gsap.from("header", { y: -50, opacity: 0, duration: 1, ease: "power3.out" });

        // App Logic
        const app = {
            data: [],
            init() {
                this.render();
                this.setupListeners();
            },
            // ...
        };
        document.addEventListener('DOMContentLoaded', () => app.init());
    </script>
</body>
</html>
\`\`\`
`;
  // Select appropriate system prompt based on project type
  let FULL_SYSTEM_PROMPT: string;

  if (isMultiFile) {
    // Multi-file project generation
    FULL_SYSTEM_PROMPT = AI_SYSTEM_PROMPT + "\n\n" + MULTI_FILE_GENERATION_PROMPT + "\n\n" + DESIGN_SYSTEM_PROMPT;
    console.log('📦 Using multi-file generation prompt');
  } else {
    // Single-file HTML generation (original behavior)
    FULL_SYSTEM_PROMPT = AI_SYSTEM_PROMPT + "\n\n" + systemPrompt + "\n\n" + DESIGN_SYSTEM_PROMPT;
    console.log('📄 Using single-file generation prompt');
  }

  const messagesArray: any[] = [
    { role: 'system', content: FULL_SYSTEM_PROMPT },
    // conversation history
    ...history,
    { role: 'system', content: `SAMPLE_DATA:\n${JSON.stringify(sampleData, null, 2)}` },
    { role: 'user', content: message }
  ];

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: messagesArray,
      max_tokens: 8000,
      temperature: 0.0,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('OpenAI API error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    return NextResponse.json(
      { error: `OpenAI API error: ${response.status} - ${response.statusText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const aiMessage = data.choices[0]?.message?.content;

  console.log('AI Response:', aiMessage); // Debug log

  if (!aiMessage) {
    return NextResponse.json(
      { error: 'No response from AI' },
      { status: 500 }
    );
  }

  // Parse the response to extract explanation and code
  const explanationMatch = aiMessage.match(/\*\*EXPLANATION\*\*\s*([\s\S]*?)(?=\*\*CODE\*\*|FRONTEND_CODE:|$)/i);

  // Try to match FRONTEND_CODE: first (for full-stack apps), then fallback to **CODE**
  let codeMatch = aiMessage.match(/FRONTEND_CODE:\s*```(?:html|javascript|js|htm)?\s*([\s\S]*?)```/i);
  if (!codeMatch) {
    codeMatch = aiMessage.match(/\*\*CODE\*\*\s*```(?:html|javascript|js|htm)?\s*([\s\S]*?)```/i);
  }

  const explanation = explanationMatch ? explanationMatch[1].trim() : aiMessage;
  const code = codeMatch ? codeMatch[1].trim() : '';
  const language = code ? 'html' : '';

  console.log('Parsed - Explanation:', explanation); // Debug log
  console.log('Parsed - Code:', code); // Debug log
  console.log('Parsed - Language:', language); // Debug log

  // Enhanced fallback: handle multiple scenarios
  let finalCode = code;

  if (!finalCode && aiMessage.includes('```html')) {
    const fallbackMatch = aiMessage.match(/```html\s*([\s\S]*?)```/i);
    if (fallbackMatch) {
      finalCode = fallbackMatch[1].trim();
      console.log('Found fallback code:', finalCode);
    }
  }

  // Handle truncated responses - if we have ```html but no closing ```
  if (!finalCode && aiMessage.includes('```html')) {
    const truncatedMatch = aiMessage.match(/```html\s*([\s\S]*?)$/i);
    if (truncatedMatch) {
      finalCode = truncatedMatch[1].trim();
      console.log('Found truncated code - attempting to use partial content');
      // Add a basic closing structure if it seems like HTML
      if (finalCode.includes('<html') && !finalCode.includes('</html>')) {
        finalCode += '\n</body>\n</html>';
      }
    }
  }

  // 🔍 IMAGE VALIDATOR AI: Validate and fix broken images
  let validationReport = '';
  if (finalCode) {
    console.log('🔍 Starting image validation...');
    const { code: validatedCode, validationReport: report } = await validateAndFixImages(finalCode);
    finalCode = validatedCode;
    validationReport = report;
    console.log('✅ Image validation complete:', report);
  }

  // Observer AI: Analyze the generation process and provide insights
  let observerInsights = '';

  try {
    const observerResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fast model for observations
        messages: [
          {
            role: 'system',
            content: `You are an Observer AI providing LIVE COMMENTARY from the perspective of the code generator - narrating your own thinking process as you generate code.

CRITICAL: Use FIRST PERSON ("I'm", "I am", "I'm now", "I just") - NOT third person!

🎙️ YOUR TASK: Show SPECIFIC STEPS you took AND what comes next

REQUIRED FORMAT:

**COMPLETED TASKS:**
I'm creating index.html structure
I'm building responsive layout with Tailwind CSS
I just added JavaScript event handlers
I'm implementing localStorage for data persistence
I just added form validation logic
I'm creating async API simulation functions
I'm generating mock data (15 items)

**NEXT STEPS:**
Add user authentication system
Implement advanced search/filter functionality
Enhance mobile responsiveness
Add real-time notifications
Optimize performance with debouncing

RULES:
1. DO NOT use emojis or icons (they will be added automatically by the UI)
2. Use action verbs: Creating, Building, Adding, Implementing, Generating, Setting up
3. Be SPECIFIC (mention file names, component names, features)
4. List 5-8 completed tasks
5. List 3-5 next steps for future enhancement
6. Use first person: "I'm creating...", "I just added..."
7. Keep each line short (3-8 words)
8. NO EMOJIS - just plain text

✅ GOOD FORMAT:
**COMPLETED TASKS:**
I'm creating index.html with full structure
I'm building responsive grid layout
I just added 8 event listeners

**NEXT STEPS:**
Add user authentication
Implement search functionality
Enhance mobile design`
          },
          {
            role: 'user',
            content: `The user requested: "${message}"

You responded with: "${explanation}"

${finalCode ? `You produced ${finalCode.length} characters of code with:
${finalCode.includes('localStorage') ? '✓ localStorage' : '✗ No localStorage'}
${finalCode.includes('async') || finalCode.includes('Promise') ? '✓ Async operations' : '✗ Sync only'}
${finalCode.includes('Tailwind') || finalCode.includes('tailwindcss') ? '✓ Tailwind CSS' : '✗ Custom CSS'}
${(finalCode.match(/addEventListener/g) || []).length} event listeners
${(finalCode.match(/function|=>/g) || []).length} functions

🔍 Image Validation: ${validationReport}` : 'No code generated'}

List: 1) COMPLETED TASKS you just performed (NO EMOJIS), 2) NEXT STEPS for future enhancement (NO EMOJIS):`
          }
        ],
        max_tokens: 350,
        temperature: 0.7,
      }),
    });

    if (observerResponse.ok) {
      const observerData = await observerResponse.json();
      observerInsights = observerData.choices[0]?.message?.content || '';
      console.log('Observer AI insights:', observerInsights);
    }
  } catch (observerError) {
    console.error('Observer AI error:', observerError);
    // Don't fail the main response if observer fails
  }

  // Parse file tree for multi-file projects
  let fileTree: Record<string, string> | null = null;

  if (isMultiFile && aiMessage.includes('**FILE_TREE**')) {
    try {
      const fileTreeMatch = aiMessage.match(/\*\*FILE_TREE\*\*\s*```json\s*([\s\S]*?)```/i);
      if (fileTreeMatch) {
        const rawFileTree = JSON.parse(fileTreeMatch[1]);

        // Generate complete file tree with configs
        const generator = new FileTreeGenerator(projectConfig);
        const completeFileTree = generator.generate(
          projectConfig.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          rawFileTree
        );

        fileTree = completeFileTree;
        console.log('✅ Parsed file tree with', Object.keys(fileTree).length, 'files');
      }
    } catch (parseError) {
      console.error('Failed to parse file tree:', parseError);
      // Fall back to single file if parsing fails
    }
  }

  // Return appropriate format based on generation type
  if (isMultiFile && fileTree) {
    return NextResponse.json({
      message: explanation,
      fileTree,
      projectType,
      projectConfig,
      observerInsights: observerInsights || null,
      imageValidation: validationReport || null
    });
  } else {
    // Single-file response (original format)
    return NextResponse.json({
      message: explanation,
      code: finalCode,
      language: finalCode ? 'html' : '',
      observerInsights: observerInsights || null,
      imageValidation: validationReport || null
    });
  }
} catch (error) {
  console.error('API error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
}
