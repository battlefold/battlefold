import { useEffect, useState } from 'react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_bot?: boolean;
  premium?: boolean;
  photo_url?: string;
}

export interface InitData {
  query_id?: string;
  user?: TelegramUser;
  auth_date?: number;
  hash?: string;
  chat_instance?: string;
  chat_type?: 'private' | 'group' | 'supergroup' | 'channel';
  start_param?: string;
}

export function useTelegramInitData(): InitData | null {
  const [initData, setInitData] = useState<InitData | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    const initDataRaw = searchParams.get('tgWebAppData');

    if (initDataRaw) {
      try {
        const decodedInitData = decodeURIComponent(initDataRaw);
        const parsedInitData = Object.fromEntries(new URLSearchParams(decodedInitData));
        
        if (parsedInitData.user) {
          parsedInitData.user = JSON.parse(parsedInitData.user);
        }

        setInitData(parsedInitData as InitData);
      } catch (error) {
        console.error('Failed to parse Telegram init data:', error);
      }
    }
  }, []);

  return initData;
}
