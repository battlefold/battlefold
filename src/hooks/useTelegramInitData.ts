import { useState, useEffect } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  // Add other properties as needed
}

interface TelegramInitData {
  user?: TelegramUser;
  // Add other properties as needed
}

export function useTelegramInitData() {
  const [initData, setInitData] = useState<TelegramInitData | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    const initDataStr = searchParams.get('tgWebAppData');
    
    if (initDataStr) {
      try {
        const decodedInitData = JSON.parse(decodeURIComponent(initDataStr));
        setInitData(decodedInitData);
      } catch (error) {
        console.error('Failed to parse Telegram init data:', error);
      }
    }
  }, []);

  return initData;
}
