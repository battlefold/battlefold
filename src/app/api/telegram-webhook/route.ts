import { NextResponse } from 'next/server'
import { initBot, bot } from '@/lib/telegram-bot'

export async function POST(request: Request) {
  await initBot()
  if (bot) {
    const update = await request.json()
    await bot.handleUpdate(update)
  }
  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook endpoint' })
}