import { useState, useEffect } from 'react';

interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Array<{
    name: string;
    type: number;
    details?: string;
    state?: string;
    timestamps?: {
      start?: number;
      end?: number;
    };
    assets?: {
      large_image?: string;
      large_text?: string;
    };
  }>;
  kv?: Record<string, string>;
}

/**
 * Hook to fetch Discord presence data from Lanyard API
 * 
 * To use:
 * 1. Get your Discord User ID
 * 2. Join the Lanyard Discord server: https://discord.gg/lanyard
 * 3. Replace the userId parameter with your Discord User ID
 * 
 * @param userId - Your Discord User ID
 */
export function useLanyard(userId: string) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // For demonstration, we're using REST API
    // For production, consider using WebSocket for real-time updates
    
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch Lanyard data');
        }

        const result = await response.json();
        setData(result.data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();

    // Poll every 30 seconds for updates
    // For real-time updates, use WebSocket instead
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  return { data, loading, error };
}
