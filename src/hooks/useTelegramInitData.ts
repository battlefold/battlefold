import { useState, useEffect } from 'react';
import { verifyTelegramWebAppData } from '@/utils/telegramAuth'; // You'll need to implement this function

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  // Add other properties as needed
}

interface TelegramInitData {
  user?: TelegramUser;
  auth_date: number;
  hash: string;
  // Add other properties as needed
}

export function useTelegramInitData() {
  const [initData, setInitData] = useState<TelegramInitData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    const initDataStr = searchParams.get('tgWebAppData');
    
    if (initDataStr) {
      try {
        const decodedInitData = JSON.parse(decodeURIComponent(initDataStr)) as TelegramInitData;
        
        // Verify the init data (you need to implement this function)
        if (verifyTelegramWebAppData(decodedInitData)) {
          setInitData(decodedInitData);
        } else {
          setError('Invalid Telegram init data');
        }
      } catch (error) {
        console.error('Failed to parse Telegram init data:', error);
        setError('Failed to parse Telegram init data');
      }
    } else {
      setError('No Telegram init data found');
    }
  }, []);

  return { initData, error };
}
