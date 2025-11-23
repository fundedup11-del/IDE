// Simple image selector / matcher for generated content
// Uses verified Unsplash fallback images when a direct match isn't available

const IMAGE_MAP: Record<string, string[]> = {
  laptop: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
  ],
  smartphone: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
  ],
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
  ],
  pizza: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
  ],
  burger: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
  ],
  coffee: [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  ],
};

export function selectImageForKeyword(keyword: string) {
  const key = (keyword || '').toLowerCase();
  for (const k of Object.keys(IMAGE_MAP)) {
    if (key.includes(k)) {
      const images = IMAGE_MAP[k];
      return images[Math.floor(Math.random() * images.length)];
    }
  }
  const def = IMAGE_MAP.default;
  return def[Math.floor(Math.random() * def.length)];
}
