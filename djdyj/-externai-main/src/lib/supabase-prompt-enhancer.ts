import { SupabaseConfig } from '@/hooks/useSupabaseConfig';

/**
 * Enhances the AI prompt with Supabase integration instructions
 * when the user has configured Supabase credentials
 */
export function enhancePromptWithSupabase(
    userPrompt: string,
    supabaseConfig: SupabaseConfig | null
): string {
    if (!supabaseConfig || !supabaseConfig.url || !supabaseConfig.anonKey) {
        return userPrompt;
    }

    const supabaseInstructions = `

IMPORTANT - SUPABASE INTEGRATION ENABLED:
This user has connected their Supabase project. You MUST include Supabase in the generated application.

**1. Add Supabase Dependency:**
In package.json:
"@supabase/supabase-js": "^2.39.0"

**2. Create Supabase Client:**
File: src/lib/supabase.ts
\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
\`\`\`

**3. Create .env File:**
\`\`\`
VITE_SUPABASE_URL=${supabaseConfig.url}
VITE_SUPABASE_ANON_KEY=${supabaseConfig.anonKey}
\`\`\`

**4. Analyze Data Needs:**
Based on the user's prompt, identify ALL data entities/tables needed.
Examples:
- "blog with posts" → posts, comments tables
- "task manager" → tasks, projects tables
- "e-commerce" → products, orders, cart_items tables

**5. Generate Complete Database Schema:**
Create schema.sql with:
- UUID primary keys (DEFAULT uuid_generate_v4())
- Foreign key relationships
- created_at/updated_at timestamps
- Row Level Security (RLS) policies
- Appropriate indexes

Example schema.sql:
\`\`\`sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE INDEX posts_author_id_idx ON posts(author_id);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
\`\`\`

**6. Use Supabase in Components:**
\`\`\`typescript
import { supabase } from '@/lib/supabase'

// Fetch data
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .order('created_at', { ascending: false })

// Insert
await supabase.from('table_name').insert({ ...data })

// Update
await supabase.from('table_name').update({ ...data }).eq('id', id)

// Delete  
await supabase.from('table_name').delete().eq('id', id)
\`\`\`

**7. Create Data Hooks (Recommended):**
File: src/hooks/useDataName.ts - Custom hooks for data fetching

**8. Include Setup Instructions:**
File: README-SUPABASE.md
\`\`\`markdown
# Supabase Setup

## 1. Run Database Migration
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of \`schema.sql\`
3. Paste and execute

## 2. Environment is Pre-Configured
The .env file is already set up with your Supabase credentials.

## 3. Start Development
\`\`\`bash
npm install
npm run dev
\`\`\`
\`\`\`

CRITICAL: Generate complete, working schema.sql for ALL identified tables. Use realistic column names. Always enable RLS for security.
`;

    return userPrompt + supabaseInstructions;
}

/**
 * Helper function to check if Supabase is configured
 */
export function isSupabaseConfigured(config: SupabaseConfig | null): boolean {
    return !!(config?.url && config?.anonKey);
}
