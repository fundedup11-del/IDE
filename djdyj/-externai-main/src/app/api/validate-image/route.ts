import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Validate if an image URL is accessible and returns a valid image
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate Unsplash URL format
    if (!url.includes('images.unsplash.com')) {
      return NextResponse.json(
        { valid: false, error: 'Only Unsplash URLs are supported' },
        { status: 400 }
      );
    }

    // Check if the image is accessible
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(url, {
        method: 'HEAD', // Only fetch headers, not the full image
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
        return NextResponse.json({
          valid: true,
          url: url,
          contentType: response.headers.get('content-type'),
        });
      } else {
        return NextResponse.json({
          valid: false,
          error: `Invalid response: ${response.status}`,
          statusCode: response.status,
        });
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          valid: false,
          error: 'Request timeout',
        });
      }
      
      return NextResponse.json({
        valid: false,
        error: fetchError.message || 'Failed to fetch image',
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// Batch validate multiple image URLs
export async function PUT(request: NextRequest) {
  try {
    const { urls } = await request.json();

    if (!Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    // Validate all URLs in parallel (max 10 at a time to avoid overwhelming)
    const batchSize = 10;
    const results: Array<{ url: string; valid: boolean; error?: string }> = [];

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (url: string) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(url, {
              method: 'HEAD',
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            return {
              url,
              valid: response.ok && response.headers.get('content-type')?.startsWith('image/') || false,
              statusCode: response.status,
            };
          } catch (error: any) {
            return {
              url,
              valid: false,
              error: error.message,
            };
          }
        })
      );

      results.push(...batchResults);
    }

    const validUrls = results.filter(r => r.valid);
    const invalidUrls = results.filter(r => !r.valid);

    return NextResponse.json({
      total: urls.length,
      valid: validUrls.length,
      invalid: invalidUrls.length,
      validUrls: validUrls.map(r => r.url),
      invalidUrls: invalidUrls.map(r => ({ url: r.url, error: r.error })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
