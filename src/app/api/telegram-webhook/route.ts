import { NextResponse } from 'next/server'
import { initBot, bot } from '@/lib/telegram-bot'

export async function POST(request: Request) {
  if (request.method === 'POST') {
    await initBot()
    if (bot) {
      const update = await request.json()
      await bot.handleUpdate(update)
    }
    return NextResponse.json({ ok: true })
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook endpoint' })
}
