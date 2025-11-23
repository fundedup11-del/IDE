import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface PromptData {
  count: number;
  lastReset: string; // Date in YYYY-MM-DD format
}

const DAILY_LIMIT = 5;

export function usePromptLimit() {
  const { user } = useAuth();
  const [promptsRemaining, setPromptsRemaining] = useState<number>(DAILY_LIMIT);
  const [loading, setLoading] = useState(false); // Start as false to not block render
  const [canPrompt, setCanPrompt] = useState(true);

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Load user's prompt count from Firestore
  const loadPromptCount = async () => {
    if (!user) {
      setPromptsRemaining(DAILY_LIMIT);
      setCanPrompt(true);
      setLoading(false);
      return;
    }

    // Don't block with loading state
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const today = getTodayString();

      if (userDoc.exists()) {
        const data = userDoc.data() as PromptData;
        
        // Check if we need to reset the counter (new day)
        if (data.lastReset !== today) {
          // New day - reset counter
          await updateDoc(userDocRef, {
            count: 0,
            lastReset: today
          });
          setPromptsRemaining(DAILY_LIMIT);
          setCanPrompt(true);
        } else {
          // Same day - use existing count
          const remaining = Math.max(0, DAILY_LIMIT - data.count);
          setPromptsRemaining(remaining);
          setCanPrompt(remaining > 0);
        }
      } else {
        // First time user - create document
        await setDoc(userDocRef, {
          count: 0,
          lastReset: today
        });
        setPromptsRemaining(DAILY_LIMIT);
        setCanPrompt(true);
      }
    } catch (error: any) {
      console.error('Error loading prompt count:', error);
      
      // If offline, use cached/default values
      if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
        console.warn('Firestore offline - using default values');
      }
      
      // On error, allow prompts (fail open)
      setPromptsRemaining(DAILY_LIMIT);
      setCanPrompt(true);
    } finally {
      setLoading(false);
    }
  };

  // Increment the prompt count
  const incrementPromptCount = async () => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const today = getTodayString();

      if (userDoc.exists()) {
        const data = userDoc.data() as PromptData;
        
        // Check if we need to reset (shouldn't happen, but just in case)
        if (data.lastReset !== today) {
          await updateDoc(userDocRef, {
            count: 1,
            lastReset: today
          });
          setPromptsRemaining(DAILY_LIMIT - 1);
          setCanPrompt(true);
        } else {
          const newCount = data.count + 1;
          await updateDoc(userDocRef, {
            count: newCount
          });
          const remaining = Math.max(0, DAILY_LIMIT - newCount);
          setPromptsRemaining(remaining);
          setCanPrompt(remaining > 0);
        }
      }
    } catch (error: any) {
      console.error('Error incrementing prompt count:', error);
      
      // If offline, just update local state
      if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
        console.warn('Firestore offline - updating local state only');
        const newRemaining = Math.max(0, promptsRemaining - 1);
        setPromptsRemaining(newRemaining);
        setCanPrompt(newRemaining > 0);
      }
    }
  };

  // Load count when user changes
  useEffect(() => {
    loadPromptCount();
  }, [user?.uid]);

  return {
    promptsRemaining,
    canPrompt,
    loading,
    incrementPromptCount,
    dailyLimit: DAILY_LIMIT
  };
}
