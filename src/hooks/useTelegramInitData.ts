import { useState, useEffect, useMemo } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  auth_date?: number;
  hash?: string;
  start_param?: string;
  chat_type?: string;
  chat_instance?: string;
  can_send_after?: number;
}

export function useTelegramInitData() {
  const [initDataRaw, setInitDataRaw] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('telegramInitData');
    }
    return null;
  });
  const [initDataState, setInitDataState] = useState<TelegramInitData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initDataRaw) {
      // If we already have initDataRaw in localStorage, use it
      parseInitData(initDataRaw);
    } else {
      // Otherwise, try to get it from the URL
      const searchParams = new URLSearchParams(window.location.hash.slice(1));
      const initDataStr = searchParams.get('tgWebAppData');
      
      if (initDataStr) {
        setInitDataRaw(initDataStr);
        localStorage.setItem('telegramInitData', initDataStr);
        parseInitData(initDataStr);
      } else {
        setError('No Telegram init data found');
      }
    }
  }, []);

  function parseInitData(initDataStr: string) {
    try {
      const parsedData: Partial<TelegramInitData> = {};
      const pairs = initDataStr.split('&');
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key === 'user') {
          parsedData.user = JSON.parse(decodeURIComponent(value));
        } else {
          const decodedValue = decodeURIComponent(value);
          switch (key) {
            case 'auth_date':
            case 'can_send_after':
              parsedData[key] = parseInt(decodedValue, 10);
              break;
            default:
              (parsedData as any)[key] = decodedValue;
          }
        }
      }
      setInitDataState(parsedData as TelegramInitData);
    } catch (error) {
      console.error('Failed to parse Telegram init data:', error);
      setError(`Failed to parse Telegram init data: ${(error as Error).message}`);
    }
  }

  const initDataRows = useMemo(() => {
    if (!initDataState || !initDataRaw) {
      return undefined;
    }
    return Object.entries(initDataState).map(([key, value]) => ({
      title: key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value),
    }));
  }, [initDataState, initDataRaw]);

  const userRows = useMemo(() => {
    if (!initDataState?.user) {
      return undefined;
    }
    return Object.entries(initDataState.user).map(([key, value]) => ({
      title: key,
      value: String(value),
    }));
  }, [initDataState]);

  return { initDataRaw, initDataState, initDataRows, userRows, error };
}
