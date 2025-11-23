/**
 * File Tree Generator
 * Intelligently generates multi-file project structures based on project type and requirements
 */

export type ProjectType =
    | 'single-file'
    | 'react-vite'
    | 'nextjs-app'
    | 'vue3'
    | 'ecommerce'
    | 'dashboard'
    | 'landing'
    | 'blog';

export interface FileTreeNode {
    [path: string]: string; // path -> content
}

export interface ProjectConfig {
    type: ProjectType;
    features: string[];
    hasBackend: boolean;
    hasAuth: boolean;
    hasDatabase: boolean;
    dependencies: string[];
    devDependencies: string[];
}

/**
 * Detects the appropriate project type from user's message
 */
export function detectProjectType(message: string): ProjectType {
    const msg = message.toLowerCase();

    // Single file indicators
    if (msg.includes('simple') || msg.includes('quick') || msg.includes('demo') || msg.includes('prototype')) {
        return 'single-file';
    }

    // E-commerce indicators
    if (msg.includes('shop') || msg.includes('store') || msg.includes('ecommerce') || msg.includes('e-commerce') || msg.includes('product')) {
        return 'ecommerce';
    }

    // Dashboard indicators
    if (msg.includes('dashboard') || msg.includes('admin') || msg.includes('saas') || msg.includes('analytics')) {
        return 'dashboard';
    }

    // Blog indicators
    if (msg.includes('blog') || msg.includes('article') || msg.includes('post') || msg.includes('cms')) {
        return 'blog';
    }

    // Landing page indicators
    if (msg.includes('landing') || msg.includes('marketing') || msg.includes('portfolio') || msg.includes('website')) {
        return 'landing';
    }

    // Next.js indicators
    if (msg.includes('nextjs') || msg.includes('next.js') || msg.includes('full-stack') || msg.includes('fullstack')) {
        return 'nextjs-app';
    }

    // Vue indicators
    if (msg.includes('vue')) {
        return 'vue3';
    }

    // Default to React Vite for modern apps
    return 'react-vite';
}

/**
 * Analyzes message to extract project configuration
 */
export function analyzeProjectRequirements(message: string): ProjectConfig {
    const msg = message.toLowerCase();
    const type = detectProjectType(message);

    const config: ProjectConfig = {
        type,
        features: [],
        hasBackend: false,
        hasAuth: false,
        hasDatabase: false,
        dependencies: [],
        devDependencies: [],
    };

    // Detect features
    if (msg.includes('auth') || msg.includes('login') || msg.includes('signup') || msg.includes('sign up')) {
        config.hasAuth = true;
        config.features.push('authentication');
    }

    if (msg.includes('database') || msg.includes('db') || msg.includes('prisma') || msg.includes('storage')) {
        config.hasDatabase = true;
        config.features.push('database');
    }

    if (msg.includes('api') || msg.includes('backend') || msg.includes('server') || config.hasDatabase) {
        config.hasBackend = true;
        config.features.push('backend');
    }

    if (msg.includes('chart') || msg.includes('graph') || msg.includes('visualization')) {
        config.features.push('charts');
    }

    if (msg.includes('form') || msg.includes('contact')) {
        config.features.push('forms');
    }

    if (msg.includes('animation') || msg.includes('motion')) {
        config.features.push('animations');
    }

    // Set dependencies based on project type and features
    config.dependencies = getDependencies(type, config.features);
    config.devDependencies = getDevDependencies(type);

    return config;
}

/**
 * Gets required dependencies for a project type and features
 */
function getDependencies(type: ProjectType, features: string[]): string[] {
    const deps: string[] = [];

    // Base dependencies by project type
    switch (type) {
        case 'react-vite':
            deps.push('react', 'react-dom');
            break;
        case 'nextjs-app':
            deps.push('next', 'react', 'react-dom');
            break;
        case 'vue3':
            deps.push('vue', 'vue-router', 'pinia');
            break;
    }

    // Common dependencies for multi-file projects
    if (type !== 'single-file') {
        deps.push('lucide-react', 'clsx', 'tailwind-merge');
    }

    // Feature-specific dependencies
    if (features.includes('authentication')) {
        if (type === 'nextjs-app') {
            deps.push('next-auth');
        }
    }

    if (features.includes('database')) {
        deps.push('@prisma/client');
    }

    if (features.includes('charts')) {
        deps.push('recharts');
    }

    if (features.includes('forms')) {
        deps.push('react-hook-form', 'zod', '@hookform/resolvers');
    }

    if (features.includes('animations')) {
        deps.push('framer-motion');
    }

    return [...new Set(deps)]; // Remove duplicates
}

/**
 * Gets required dev dependencies for a project type
 */
function getDevDependencies(type: ProjectType): string[] {
    const devDeps: string[] = [];

    switch (type) {
        case 'react-vite':
            devDeps.push(
                '@vitejs/plugin-react',
                'vite',
                'typescript',
                '@types/react',
                '@types/react-dom',
                'tailwindcss',
                'postcss',
                'autoprefixer'
            );
            break;
        case 'nextjs-app':
            devDeps.push(
                'typescript',
                '@types/node',
                '@types/react',
                '@types/react-dom',
                'tailwindcss',
                'postcss',
                'autoprefixer'
            );
            break;
        case 'vue3':
            devDeps.push(
                '@vitejs/plugin-vue',
                'vite',
                'typescript',
                'vue-tsc',
                'tailwindcss',
                'postcss',
                'autoprefixer'
            );
            break;
    }

    return [...new Set(devDeps)];
}

/**
 * Generates package.json content
 */
export function generatePackageJson(
    projectName: string,
    config: ProjectConfig
): string {
    const scripts: Record<string, string> = {};

    // Set scripts based on project type
    switch (config.type) {
        case 'react-vite':
        case 'vue3':
            scripts.dev = 'vite';
            scripts.build = 'vite build';
            scripts.preview = 'vite preview';
            break;
        case 'nextjs-app':
            scripts.dev = 'next dev';
            scripts.build = 'next build';
            scripts.start = 'next start';
            scripts.lint = 'next lint';
            break;
    }

    // Add database scripts if needed
    if (config.hasDatabase) {
        scripts['db:push'] = 'prisma db push';
        scripts['db:studio'] = 'prisma studio';
    }

    const pkg = {
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        private: true,
        version: '0.1.0',
        type: 'module',
        scripts,
        dependencies: config.dependencies.reduce((acc, dep) => {
            acc[dep] = 'latest';
            return acc;
        }, {} as Record<string, string>),
        devDependencies: config.devDependencies.reduce((acc, dep) => {
            acc[dep] = 'latest';
            return acc;
        }, {} as Record<string, string>),
    };

    return JSON.stringify(pkg, null, 2);
}

/**
 * Generates TypeScript config
 */
export function generateTsConfig(type: ProjectType): string {
    const baseConfig = {
        compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx' as const,
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
            baseUrl: '.',
            paths: {
                '@/*': ['./src/*'],
            },
        },
        include: ['src'],
    };

    if (type === 'nextjs-app') {
        return JSON.stringify({
            compilerOptions: {
                ...baseConfig.compilerOptions,
                lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                allowJs: true,
                noEmit: true,
                incremental: true,
                esModuleInterop: true,
                moduleResolution: 'bundler',
                resolveJsonModule: true,
                isolatedModules: true,
                jsx: 'preserve',
                plugins: [{ name: 'next' }],
            },
            include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
            exclude: ['node_modules'],
        }, null, 2);
    }

    return JSON.stringify(baseConfig, null, 2);
}

/**
 * Generates Tailwind config
 */
export function generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};`;
}

/**
 * Generates PostCSS config
 */
export function generatePostCssConfig(): string {
    return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
}

/**
 * Generates Vite config for React
 */
export function generateViteConfig(type: 'react' | 'vue'): string {
    const plugin = type === 'react' ? '@vitejs/plugin-react' : '@vitejs/plugin-vue';
    const pluginName = type === 'react' ? 'react' : 'vue';

    return `import { defineConfig } from 'vite';
import ${pluginName} from '${plugin}';
import path from 'path';

export default defineConfig({
  plugins: [${pluginName}()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});`;
}

/**
 * Main file tree generator
 */
export class FileTreeGenerator {
    private config: ProjectConfig;

    constructor(config: ProjectConfig) {
        this.config = config;
    }

    /**
     * Generates the complete file tree
     */
    generate(projectName: string, aiGeneratedFiles: FileTreeNode = {}): FileTreeNode {
        const tree: FileTreeNode = {};

        // Add config files
        tree['package.json'] = generatePackageJson(projectName, this.config);
        tree['tsconfig.json'] = generateTsConfig(this.config.type);

        if (this.config.type !== 'single-file') {
            tree['tailwind.config.js'] = generateTailwindConfig();
            tree['postcss.config.js'] = generatePostCssConfig();

            if (this.config.type === 'react-vite') {
                tree['vite.config.ts'] = generateViteConfig('react');
            } else if (this.config.type === 'vue3') {
                tree['vite.config.ts'] = generateViteConfig('vue');
            }
        }

        // Add .gitignore
        tree['.gitignore'] = `node_modules
dist
.env
.env.local
.next
.turbo
*.log`;

        // Add README
        tree['README.md'] = `# ${projectName}

Generated by ExternAI

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`
`;

        // Merge AI-generated files
        Object.assign(tree, aiGeneratedFiles);

        return tree;
    }
}
