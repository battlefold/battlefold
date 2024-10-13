import { useState, useEffect, useMemo } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  // Add other properties as needed
}

interface TelegramInitData {
  query_id?: string;
  user: TelegramUser;
  auth_date: number;
  hash: string;
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
      const decodedData = JSON.parse(decodeURIComponent(initDataStr));
      setInitDataState(decodedData);
    } catch (error) {
      console.error('Failed to parse Telegram init data:', error);
      setError(`Failed to parse Telegram init data: ${(error as Error).message}`);
    }
  }, []);

  const initDataRows = useMemo(() => {
    if (!initDataState || !initDataRaw) {
      return undefined;
    }
    const {
      auth_date,
      hash,
      query_id,
      chat_type,
      chat_instance,
      can_send_after,
      start_param,
    } = initDataState;
    return [
      { title: 'raw', value: initDataRaw },
      { title: 'auth_date', value: new Date(auth_date * 1000).toLocaleString() },
      { title: 'auth_date (raw)', value: auth_date },
      { title: 'hash', value: hash },
      { title: 'can_send_after', value: can_send_after ? new Date(can_send_after * 1000).toISOString() : undefined },
      { title: 'can_send_after (raw)', value: can_send_after },
      { title: 'query_id', value: query_id },
      { title: 'start_param', value: start_param },
      { title: 'chat_type', value: chat_type },
      { title: 'chat_instance', value: chat_instance },
    ];
  }, [initDataState, initDataRaw]);

  const userRows = useMemo(() => {
    if (!initDataState?.user) {
      return undefined;
    }
    const user = initDataState.user;
    return [
      { title: 'id', value: user.id.toString() },
      { title: 'username', value: user.username },
      { title: 'last_name', value: user.last_name },
      { title: 'first_name', value: user.first_name },
      { title: 'language_code', value: user.language_code },
      { title: 'is_premium', value: user.is_premium },
    ];
  }, [initDataState]);

  return { initDataRaw, initDataState, initDataRows, userRows, error };
}
