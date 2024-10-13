import { useState, useEffect } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  // Add other properties as needed
}

interface TelegramInitData {
  user: TelegramUser;
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
    
    if (!initDataStr) {
      setError('No Telegram init data found in URL');
      return;
    }

    try {
      const decodedInitData = JSON.parse(decodeURIComponent(initDataStr));
      
      if (!decodedInitData || typeof decodedInitData !== 'object') {
        setError('Invalid Telegram init data format');
        return;
      }

      fetch('/api/verify-telegram-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(decodedInitData),
      })
      .then(response => response.json())
      .then(data => {
        if (data.isValid) {
          setInitData(decodedInitData as TelegramInitData);
        } else {
          setError('Invalid Telegram init data signature');
        }
      })
      .catch(error => {
        console.error('Failed to verify Telegram init data:', error);
        setError(`Failed to verify Telegram init data: ${error.message}`);
      });
    } catch (error) {
      console.error('Failed to parse Telegram init data:', error);
      setError(`Failed to parse Telegram init data: ${(error as Error).message}`);
    }
  }, []);

  return { initData, error };
}
