import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function verifyTelegramWebAppData(initData: any): boolean {
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const initData = req.body;
    const isValid = verifyTelegramWebAppData(initData);
    res.status(200).json({ isValid });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
