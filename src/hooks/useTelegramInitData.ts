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
  const [initDataRaw, setInitDataRaw] = useState<string | null>(null);
  const [initDataState, setInitDataState] = useState<TelegramInitData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    const initDataStr = searchParams.get('tgWebAppData');
    
    if (!initDataStr) {
      setError('No Telegram init data found in URL');
      return;
    }

    setInitDataRaw(initDataStr);

    try {
      const parsedData: TelegramInitData = {};
      const pairs = initDataStr.split('&');
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key === 'user') {
          parsedData.user = JSON.parse(decodeURIComponent(value));
        } else {
          parsedData[key as keyof TelegramInitData] = decodeURIComponent(value);
        }
      }
      setInitDataState(parsedData);
    } catch (error) {
      console.error('Failed to parse Telegram init data:', error);
      setError(`Failed to parse Telegram init data: ${(error as Error).message}`);
    }
  }, []);

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
