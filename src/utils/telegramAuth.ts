import crypto from 'crypto';

const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;

export function verifyTelegramWebAppData(initData: any): boolean {
  if (!BOT_TOKEN) {
    console.error('Telegram bot token is not set');
    return false;
  }

  const { hash, ...data } = initData;

  const dataCheckString = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return calculatedHash === hash;
}
