import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { code, userId, title } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Generate a unique ID for the published site
    const publishedSite = await addDoc(collection(db, 'publishedSites'), {
      code,
      userId: userId || 'anonymous',
      title: title || 'Untitled Project',
      createdAt: serverTimestamp(),
      views: 0,
    });

    // Return the shareable URL
    const shareableUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/view/${publishedSite.id}`;

    return NextResponse.json({ 
      success: true,
      id: publishedSite.id,
      url: shareableUrl
    });
  } catch (error) {
    console.error('Error publishing site:', error);
    return NextResponse.json(
      { error: 'Failed to publish site' },
      { status: 500 }
    );
  }
}
