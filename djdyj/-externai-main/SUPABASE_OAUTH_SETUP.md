# Supabase OAuth Integration - Setup Instructions

## Overview
This implementation adds OAuth-like Supabase connection to ExternAI, similar to how Lovable.dev handles integrations. Users can now click "Connect with Supabase" instead of manually copying credentials.

## Prerequisites

### 1. Install Supabase CLI

The OAuth integration uses the Supabase CLI to authenticate and fetch project credentials.

**Windows:**
```powershell
scoop install supabase
```

**macOS:**
```bash
brew install supabase/tap/supabase
```

**Linux / Alternative:**
```bash
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

### 2. Install Node.js Dependencies

Install the required packages:

```bash
npm install
```

This will install the necessary types for:
- `next/server` - Next.js server functions
- `child_process` - Node.js built-in for CLI execution
- `util` - Node.js built-in utilities
- `react` - React types
- `lucide-react` - Icon library

## How It Works

### User Flow

1. **User clicks "Connect with Supabase"**
   - Frontend calls `/api/supabase/connect` (POST)
   - Backend runs `supabase login`
   - Browser opens for Supabase authentication

2. **User logs in to Supabase**
   - Supabase CLI receives access token
   - Token stored locally by CLI

3. **Fetch Projects**
   - Frontend calls `/api/supabase/projects` (GET)
   - Backend runs `supabase projects list`
   - Returns list of user's projects

4. **User selects project**
   - Frontend calls `/api/supabase/projects` (POST) with project ref
   - Backend runs `supabase projects api-keys --project-ref <ref>`
   - Returns API keys and URL

5. **Auto-configuration**
   - Credentials automatically populate
   - Configuration saved to localStorage
   - Modal closes

### Architecture

```
┌─────────────────────────────────────────┐
│  SupabaseSettingsModal.tsx              │
│  ┌───────────────────────────────────┐  │
│  │ "Connect with Supabase" Button    │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│                  ▼                       │
│  ┌───────────────────────────────────┐  │
│  │   useSupabaseOAuth Hook           │  │
│  │   - connectSupabase()             │  │
│  │   - fetchProjects()               │  │
│  │   - getProjectCredentials()       │  │
│  └───────────────┬───────────────────┘  │
└──────────────────┼───────────────────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │   API Routes        │
         ├─────────────────────┤
         │ /api/supabase/      │
         │   connect           │
         │   projects          │
         └─────────┬───────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  Supabase CLI       │
         │  - login            │
         │  - projects list    │
         │  - api-keys         │
         └─────────────────────┘
```

## Files Modified / Created

### Created Files

1. **`src/app/api/supabase/connect/route.ts`**
   - POST: Initiates Supabase CLI login
   - GET: Checks authentication status

2. **`src/app/api/supabase/projects/route.ts`**
   - GET: Fetches list of user's projects
   - POST: Gets API keys for specific project

3. **`src/types/supabase-oauth.ts`**
   - TypeScript interfaces for OAuth responses

4. **`src/hooks/use-supabase-oauth.ts`**
   - React hook for managing OAuth state and API calls

### Modified Files

1. **`src/components/SupabaseSettingsModal.tsx`**
   - Added "Connect with Supabase" button
   - Added project selection UI
   - Integrated OAuth flow

## Testing

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test OAuth Flow

1. Open the application
2. Click the Settings/Database icon
3. Click "Connect with Supabase"
4. Browser should open for Supabase login
5. After login, projects should appear
6. Click a project to auto-configure

### 3. Fallback to Manual Configuration

If CLI is not installed or OAuth fails:
- User sees error message with installation instructions
- Can still use "or enter manually" option
- Manual input fields remain available

## Troubleshooting

### "Supabase CLI not installed"

**Solution**: Install Supabase CLI following instructions above

### "Not authenticated"

**Solution**: Run manually:
```bash
supabase login
```

### Lint Errors (Cannot find module...)

**Solution**: These are expected during development. Run:
```bash
npm install
```

### Projects not appearing

**Solution**: Check if you have projects in your Supabase account at https://supabase.com/dashboard

## Security Notes

- Only the **anon/public key** is stored (not service role key)
- Credentials stored in browser localStorage
- Supabase CLI token stored locally by CLI (not in app)
- All API routes run server-side for security

## Next Steps

- [ ] Test the complete OAuth flow
- [ ] Verify build succeeds (`npm run build`)
- [ ] Add error handling for edge cases
- [ ] Consider adding project search/filter for users with many projects
