# Publish Feature Documentation

## Overview
The Publish feature allows users to share their AI-generated websites with others via a unique, shareable link.

## How It Works

### For Users:
1. **Create a website** using the AI chat interface
2. **Click the "Publish" button** in the header
3. **Enter a project title** (optional)
4. **Click "Publish"** to generate a shareable link
5. **Copy and share** the link with anyone

### Technical Flow:
1. User clicks "Publish" button
2. `PublishModal` component opens
3. On publish, code is sent to `/api/publish` endpoint
4. Code is stored in Firestore `publishedSites` collection
5. Unique ID is generated and shareable URL is returned
6. User can copy the URL and share it

## Database Structure

### Firestore Collection: `publishedSites`
```javascript
{
  id: string (auto-generated),
  code: string (HTML/CSS/JS code),
  userId: string (Firebase UID or 'anonymous'),
  title: string (project title),
  createdAt: timestamp,
  views: number (increments on each view)
}
```

## API Endpoints

### POST `/api/publish`
Publishes a website and returns a shareable URL.

**Request Body:**
```json
{
  "code": "<html>...</html>",
  "userId": "firebase-uid-or-anonymous",
  "title": "My Awesome Website"
}
```

**Response:**
```json
{
  "success": true,
  "id": "unique-site-id",
  "url": "https://your-domain.com/view/unique-site-id"
}
```

## View Page

### Route: `/view/[id]`
Displays a published website in a clean, distraction-free interface.

**Features:**
- Full-screen preview
- View counter (increments on each visit)
- "Built with ExternAI" branding
- Link back to create your own

## Environment Variables

Add to your `.env.local` or Vercel environment variables:

```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

This is used to generate the shareable URLs.

## Firestore Security Rules

Add these rules to your Firebase project:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Published sites - anyone can read, authenticated users can create
    match /publishedSites/{siteId} {
      allow read: if true;
      allow create: if request.auth != null || true; // Allow anonymous publishing
      allow update: if request.auth.uid == resource.data.userId;
      allow delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## Components

### `PublishModal.tsx`
- Modal component for publishing
- Handles title input
- Shows success state with shareable link
- Copy-to-clipboard functionality

### `header.tsx`
- Added "Publish" button
- Manages modal state
- Validates code exists before publishing

### `/app/view/[id]/page.tsx`
- Dynamic route for viewing published sites
- Fetches site data from Firestore
- Displays code in iframe
- Increments view count

## Usage Example

```typescript
// In your component
import { PublishModal } from '@/components/PublishModal';

const [showPublish, setShowPublish] = useState(false);
const [currentCode, setCurrentCode] = useState('<html>...</html>');

<Button onClick={() => setShowPublish(true)}>
  Publish
</Button>

{showPublish && (
  <PublishModal 
    code={currentCode}
    onClose={() => setShowPublish(false)}
  />
)}
```

## Features

- ✅ One-click publishing
- ✅ Unique shareable links
- ✅ View counter
- ✅ Copy-to-clipboard
- ✅ Anonymous publishing support
- ✅ Clean viewer interface
- ✅ Responsive design
- ✅ "Built with ExternAI" branding

## Future Enhancements

- [ ] Edit published sites
- [ ] Delete published sites
- [ ] Analytics dashboard
- [ ] Custom domains
- [ ] Password protection
- [ ] Expiry dates
- [ ] Published sites gallery
- [ ] Search published sites
