"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Image, Search, Download, Copy } from "lucide-react";

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  description: string;
}

interface ImageGalleryProps {
  onImageSelect?: (imageUrl: string, altText: string) => void;
}

export function ImageGallery({ onImageSelect }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const searchImages = async (query: string = 'web development') => {
    setLoading(true);
    try {
      const searchQuery = query || 'technology';
      
      // Using a mix of reliable image sources
      const fallbackImages: UnsplashImage[] = [
        {
          id: '1',
          urls: {
            small: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
            regular: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
            full: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop'
          },
          alt_description: `${searchQuery} - Computer and Code`,
          user: { name: 'Christopher Gower', username: 'cgower' },
          description: `Professional ${searchQuery} workspace`
        },
        {
          id: '2',
          urls: {
            small: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
            regular: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
            full: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop'
          },
          alt_description: `${searchQuery} - Code Editor`,
          user: { name: 'Ilya Pavlov', username: 'ilyapavlov' },
          description: `Modern ${searchQuery} development`
        },
        {
          id: '3',
          urls: {
            small: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&h=300&fit=crop',
            regular: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=600&fit=crop',
            full: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1200&h=800&fit=crop'
          },
          alt_description: `${searchQuery} - Digital Design`,
          user: { name: 'Hal Gatewood', username: 'halgatewood' },
          description: `Creative ${searchQuery} workspace`
        },
        {
          id: '4',
          urls: {
            small: 'https://picsum.photos/id/0/400/300',
            regular: 'https://picsum.photos/id/0/800/600',
            full: 'https://picsum.photos/id/0/1200/800'
          },
          alt_description: `${searchQuery} - Laptop`,
          user: { name: 'Lorem Picsum', username: 'picsum' },
          description: `Technology and ${searchQuery}`
        },
        {
          id: '5',
          urls: {
            small: 'https://picsum.photos/id/1/400/300',
            regular: 'https://picsum.photos/id/1/800/600',
            full: 'https://picsum.photos/id/1/1200/800'
          },
          alt_description: `${searchQuery} - Work Setup`,
          user: { name: 'Lorem Picsum', username: 'picsum' },
          description: `Professional ${searchQuery} environment`
        },
        {
          id: '6',
          urls: {
            small: 'https://picsum.photos/id/2/400/300',
            regular: 'https://picsum.photos/id/2/800/600',
            full: 'https://picsum.photos/id/2/1200/800'
          },
          alt_description: `${searchQuery} - Digital Tools`,
          user: { name: 'Lorem Picsum', username: 'picsum' },
          description: `Modern ${searchQuery} tools`
        }
      ];
      
      setImages(fallbackImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && images.length === 0) {
      searchImages('web development');
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages(searchTerm);
  };

  const handleImageSelect = (image: UnsplashImage) => {
    if (onImageSelect) {
      onImageSelect(image.urls.regular, image.alt_description || 'Selected image');
    }
    setIsOpen(false);
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Image URL copied to clipboard!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 hover:bg-gray-100"
          title="Browse Images"
        >
          <Image className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle>Browse Images from Unsplash</DialogTitle>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for images (e.g., nature, technology, business)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>

          {/* Image Grid */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="text-gray-500">Loading images...</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
                    onClick={() => handleImageSelect(image)}
                  >
                    <div className="aspect-video">
                      <img
                        src={image.urls.small}
                        alt={image.alt_description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to a different Picsum image if the original fails to load
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('fallback')) {
                            // Use a simple, reliable fallback image
                            target.src = `https://picsum.photos/400/300?fallback=${Date.now()}`;
                          }
                        }}
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white text-black hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageSelect(image);
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white text-black hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyImageUrl(image.urls.regular);
                          }}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    {/* Image Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-white text-xs truncate">
                        Photo by {image.user.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogDescription className="text-xs text-gray-500 mt-4">
            Images provided by Lorem Picsum. Click an image to use it in your project, or copy the URL for external use.
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
