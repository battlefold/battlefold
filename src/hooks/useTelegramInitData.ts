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

    console.log('Raw initDataStr:', initDataStr); // Debug log

    try {
      // Try parsing without decoding first
      let decodedInitData = JSON.parse(initDataStr);
      
      // If parsing succeeds without decoding, log and proceed
      console.log('Parsed without decoding:', decodedInitData);

      if (!decodedInitData || typeof decodedInitData !== 'object') {
        // If parsing without decoding doesn't yield an object, try decoding
        decodedInitData = JSON.parse(decodeURIComponent(initDataStr));
        console.log('Parsed after decoding:', decodedInitData);
      }

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
      console.error('initDataStr:', initDataStr); // Log the raw string for debugging
      setError(`Failed to parse Telegram init data: ${(error as Error).message}`);
    }
  }, []);

  return { initData, error };
}
