import { useState, useEffect } from 'react';

export function useTelegramInitData() {
  const [initDataRaw, setInitDataRaw] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tgWebApp = (window as any).Telegram?.WebApp;
    if (tgWebApp) {
      setInitDataRaw(tgWebApp.initData);
    } else {
      const searchParams = new URLSearchParams(window.location.hash.slice(1));
      const initDataStr = searchParams.get('tgWebAppData');
      
      if (initDataStr) {
        setInitDataRaw(initDataStr);
      } else {
        setError('No Telegram init data found');
      }
    }
  }, []);

  return { initDataRaw, error };
}
