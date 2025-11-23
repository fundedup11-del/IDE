"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export default function ViewPublishedSite() {
  const params = useParams();
  const id = params.id as string;
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const siteDoc = await getDoc(doc(db, 'publishedSites', id));
        
        if (siteDoc.exists()) {
          const data = siteDoc.data();
          setCode(data.code);
          setTitle(data.title || 'Untitled Project');
          
          // Increment view count
          await updateDoc(doc(db, 'publishedSites', id), {
            views: increment(1)
          });
        } else {
          setError('Site not found');
        }
      } catch (err) {
        console.error('Error fetching site:', err);
        setError('Failed to load site');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSite();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500">Built with ExternAI</p>
            </div>
          </div>
          <a 
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your own →
          </a>
        </div>
      </header>

      {/* Preview */}
      <div className="flex-1">
        <iframe
          srcDoc={code}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          title={title}
        />
      </div>
    </div>
  );
}
