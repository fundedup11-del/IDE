const https = require('https');
const fs = require('fs');
const path = require('path');

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // You'll need to get this from https://unsplash.com/developers

// Categories to fetch images for
const CATEGORIES = [
  // Business & Technology
  { query: 'laptop computer', count: 30, category: 'Technology' },
  { query: 'smartphone mobile', count: 30, category: 'Technology' },
  { query: 'office workspace', count: 30, category: 'Business' },
  { query: 'team meeting', count: 20, category: 'Business' },
  { query: 'data analytics', count: 20, category: 'Technology' },
  { query: 'software developer', count: 20, category: 'Technology' },
  
  // E-commerce & Products
  { query: 'fashion clothing', count: 30, category: 'Fashion' },
  { query: 'shoes sneakers', count: 25, category: 'Fashion' },
  { query: 'jewelry accessories', count: 25, category: 'Fashion' },
  { query: 'watch timepiece', count: 20, category: 'Fashion' },
  { query: 'handbag purse', count: 20, category: 'Fashion' },
  { query: 'cosmetics beauty', count: 25, category: 'Beauty' },
  
  // Food & Restaurant
  { query: 'restaurant food', count: 30, category: 'Food' },
  { query: 'pizza', count: 20, category: 'Food' },
  { query: 'burger', count: 20, category: 'Food' },
  { query: 'sushi', count: 20, category: 'Food' },
  { query: 'coffee cafe', count: 25, category: 'Food' },
  { query: 'dessert cake', count: 20, category: 'Food' },
  { query: 'healthy salad', count: 20, category: 'Food' },
  
  // Fitness & Health
  { query: 'gym fitness', count: 30, category: 'Fitness' },
  { query: 'yoga', count: 25, category: 'Fitness' },
  { query: 'running exercise', count: 20, category: 'Fitness' },
  { query: 'meditation wellness', count: 20, category: 'Health' },
  
  // Real Estate & Home
  { query: 'modern house', count: 30, category: 'RealEstate' },
  { query: 'apartment interior', count: 30, category: 'RealEstate' },
  { query: 'living room', count: 25, category: 'Home' },
  { query: 'bedroom', count: 20, category: 'Home' },
  { query: 'kitchen', count: 25, category: 'Home' },
  { query: 'bathroom', count: 20, category: 'Home' },
  { query: 'furniture', count: 25, category: 'Home' },
  
  // Travel & Tourism
  { query: 'travel destination', count: 30, category: 'Travel' },
  { query: 'hotel luxury', count: 25, category: 'Travel' },
  { query: 'beach resort', count: 25, category: 'Travel' },
  { query: 'mountain nature', count: 20, category: 'Travel' },
  { query: 'city skyline', count: 20, category: 'Travel' },
  
  // Education & Learning
  { query: 'student studying', count: 25, category: 'Education' },
  { query: 'books library', count: 25, category: 'Education' },
  { query: 'classroom', count: 20, category: 'Education' },
  { query: 'online learning', count: 20, category: 'Education' },
  
  // Creative & Portfolio
  { query: 'artist creative', count: 25, category: 'Creative' },
  { query: 'photography camera', count: 25, category: 'Creative' },
  { query: 'design graphic', count: 20, category: 'Creative' },
  { query: 'music instrument', count: 20, category: 'Creative' },
  
  // People & Portraits
  { query: 'professional portrait', count: 30, category: 'People' },
  { query: 'happy person', count: 25, category: 'People' },
  { query: 'team collaboration', count: 20, category: 'People' },
  
  // Nature & Environment
  { query: 'nature landscape', count: 25, category: 'Nature' },
  { query: 'flowers plants', count: 20, category: 'Nature' },
  { query: 'animals pets', count: 20, category: 'Nature' },
  
  // Events & Social
  { query: 'wedding celebration', count: 20, category: 'Events' },
  { query: 'party event', count: 20, category: 'Events' },
  { query: 'concert music', count: 20, category: 'Events' },
  
  // Automotive
  { query: 'car automobile', count: 25, category: 'Automotive' },
  { query: 'motorcycle', count: 15, category: 'Automotive' },
  
  // Abstract & Background
  { query: 'abstract pattern', count: 20, category: 'Abstract' },
  { query: 'gradient background', count: 20, category: 'Abstract' },
  { query: 'texture', count: 15, category: 'Abstract' },
];

// Validate URL returns 200
function validateUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Fetch images from Unsplash API
async function fetchUnsplashImages(query, perPage = 30) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.unsplash.com',
      path: `/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.results || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Build image library
async function buildLibrary() {
  console.log('🚀 Starting image library build...\n');
  
  const library = {};
  let totalImages = 0;
  let validImages = 0;

  for (const cat of CATEGORIES) {
    console.log(`📸 Fetching ${cat.count} images for: ${cat.query} (${cat.category})`);
    
    try {
      const images = await fetchUnsplashImages(cat.query, cat.count);
      
      if (!library[cat.category]) {
        library[cat.category] = [];
      }

      for (const img of images) {
        totalImages++;
        
        // Create optimized URL (400x300)
        const url = `${img.urls.raw}&w=400&h=300&fit=crop`;
        
        // Validate URL
        const isValid = await validateUrl(url);
        
        if (isValid) {
          validImages++;
          library[cat.category].push({
            url: url,
            description: img.description || img.alt_description || cat.query,
            tags: cat.query.split(' '),
            photographer: img.user.name,
            id: img.id
          });
          process.stdout.write('✓');
        } else {
          process.stdout.write('✗');
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`\n✅ ${cat.category}: ${library[cat.category].length} valid images\n`);
      
    } catch (error) {
      console.error(`❌ Error fetching ${cat.query}:`, error.message);
    }
    
    // Pause between categories to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Total fetched: ${totalImages}`);
  console.log(`   Valid images: ${validImages}`);
  console.log(`   Categories: ${Object.keys(library).length}\n`);

  // Save to file
  const outputPath = path.join(__dirname, '../src/lib/image-library.json');
  fs.writeFileSync(outputPath, JSON.stringify(library, null, 2));
  console.log(`💾 Library saved to: ${outputPath}`);

  // Generate TypeScript constants file
  generateTypeScriptFile(library);
  
  return library;
}

// Generate TypeScript file with image library
function generateTypeScriptFile(library) {
  let tsContent = `// Auto-generated image library - DO NOT EDIT MANUALLY
// Generated on: ${new Date().toISOString()}
// Total images: ${Object.values(library).flat().length}

export interface ImageData {
  url: string;
  description: string;
  tags: string[];
  photographer: string;
  id: string;
}

export interface ImageLibrary {
  [category: string]: ImageData[];
}

export const IMAGE_LIBRARY: ImageLibrary = `;

  tsContent += JSON.stringify(library, null, 2);
  tsContent += ';\n\n';

  // Add helper function
  tsContent += `
// Helper function to find images by keywords
export function findImagesByKeywords(keywords: string[]): ImageData[] {
  const results: ImageData[] = [];
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  
  for (const category in IMAGE_LIBRARY) {
    for (const image of IMAGE_LIBRARY[category]) {
      const imageText = (image.description + ' ' + image.tags.join(' ')).toLowerCase();
      if (lowerKeywords.some(keyword => imageText.includes(keyword))) {
        results.push(image);
      }
    }
  }
  
  return results;
}

// Helper function to get random image from category
export function getRandomImageFromCategory(category: string): ImageData | null {
  const images = IMAGE_LIBRARY[category];
  if (!images || images.length === 0) return null;
  return images[Math.floor(Math.random() * images.length)];
}

// Get all categories
export function getAllCategories(): string[] {
  return Object.keys(IMAGE_LIBRARY);
}

// Get total image count
export function getTotalImageCount(): number {
  return Object.values(IMAGE_LIBRARY).flat().length;
}
`;

  const tsPath = path.join(__dirname, '../src/lib/image-library.ts');
  fs.writeFileSync(tsPath, tsContent);
  console.log(`📝 TypeScript file generated: ${tsPath}\n`);
}

// Main execution
if (require.main === module) {
  if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
    console.error('❌ ERROR: Please set your Unsplash API key!');
    console.error('   1. Go to https://unsplash.com/developers');
    console.error('   2. Create a new app');
    console.error('   3. Copy your Access Key');
    console.error('   4. Replace UNSPLASH_ACCESS_KEY in this file\n');
    process.exit(1);
  }
  
  buildLibrary().catch(console.error);
}

module.exports = { buildLibrary, validateUrl };
