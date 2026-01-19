import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendStudyReminder } from '@/lib/line'

// Vercel Cronからのリクエストを処理
export async function GET(request: NextRequest) {
  // Cron認証（Vercelからのリクエストのみ許可）
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // 開発環境では認証をスキップ
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${Math.floor(currentMinute / 30) * 30 === 0 ? '00' : '30'}`

    // 現在の時刻に通知設定のある生徒を取得
    const studentsToNotify = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        lineUserId: { not: null },
      },
      include: {
        dailyLogs: {
          where: {
            date: {
              gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
              lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
            },
          },
        },
      },
    })

    // 今日まだ記録していない生徒にリマインダーを送信
    const results = await Promise.all(
      studentsToNotify
        .filter(student => student.dailyLogs.length === 0)
        .map(async student => {
          const sent = await sendStudyReminder(student.id)
          return { userId: student.id, sent }
        })
    )

    return NextResponse.json({
      success: true,
      time: currentTime,
      notified: results.filter(r => r.sent).length,
      total: results.length,
    })
  } catch (error) {
    console.error('[Cron Reminder] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
