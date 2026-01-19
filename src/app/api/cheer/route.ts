import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser, requirePermission, canAccessStudent } from '@/lib/auth'
import { startOfWeek, endOfWeek } from 'date-fns'

// GET: 今週の応援を取得
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser()
    requirePermission(user, 'task:read')

    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json({ error: 'studentId が必要です' }, { status: 400 })
    }

    // アクセス権チェック
    if (!(await canAccessStudent(user!, studentId))) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 })
    }

    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

    // 今週の応援を取得
    const cheers = await prisma.cheer.findMany({
      where: {
        receiverId: studentId,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 今週送った応援数（保護者向け）
    const sentCount = user!.role === 'PARENT'
      ? await prisma.cheer.count({
          where: {
            senderId: user!.id,
            receiverId: studentId,
            createdAt: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
        })
      : 0

    return NextResponse.json({
      cheers: cheers.map((c: typeof cheers[number]) => ({
        id: c.id,
        type: c.type,
        senderName: c.sender.name,
        createdAt: c.createdAt,
      })),
      sentCount,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '取得に失敗しました'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

// POST: 応援を送信（保護者のみ）
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser()
    requirePermission(user, 'cheer:write')

    const body = await request.json()
    const { studentId, type } = body

    // バリデーション
    const validTypes = ['WATCHING', 'GREAT', 'KEEP_GOING', 'PROUD', 'SUPPORT']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: '無効な応援タイプです' }, { status: 400 })
    }

    // アクセス権チェック
    if (!(await canAccessStudent(user!, studentId))) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 })
    }

    // 応援を作成
    const cheer = await prisma.cheer.create({
      data: {
        senderId: user!.id,
        receiverId: studentId,
        type,
      },
    })

    return NextResponse.json({
      success: true,
      cheer: {
        id: cheer.id,
        type: cheer.type,
        createdAt: cheer.createdAt,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '送信に失敗しました'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
