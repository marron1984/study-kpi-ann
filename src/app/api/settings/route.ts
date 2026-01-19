import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionUser, requirePermission, canAccessStudent } from '@/lib/auth'
import { generateHighSchoolSettings } from '@/lib/logic'

// GET: 設定を取得
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser()
    requirePermission(user, 'task:read')

    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId') || user!.id

    // アクセス権チェック
    if (!(await canAccessStudent(user!, studentId))) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 })
    }

    const settings = await prisma.settings.findUnique({
      where: { userId: studentId },
    })

    if (!settings) {
      // デフォルト設定を返す
      return NextResponse.json({
        weeklyTemplate: {
          monday: ['ENGLISH', 'MATH'],
          tuesday: ['ENGLISH', 'MATH'],
          wednesday: ['ENGLISH', 'MATH'],
          thursday: ['ENGLISH', 'MATH'],
          friday: ['ENGLISH', 'MATH'],
          saturday: ['ENGLISH', 'MATH'],
          sunday: ['ENGLISH'],
        },
        completionThresholds: {
          ENGLISH: '単語20個 or 音読10分',
          MATH: '計算5問 or 20分',
        },
        isHighSchoolMode: false,
      })
    }

    return NextResponse.json({
      weeklyTemplate: JSON.parse(settings.weeklyTemplate || '{}'),
      completionThresholds: JSON.parse(settings.completionThresholds || '{}'),
      isHighSchoolMode: settings.isHighSchoolMode,
      weekdayTemplate: JSON.parse(settings.weekdayTemplate || '{}'),
      weekendTemplate: JSON.parse(settings.weekendTemplate || '{}'),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '取得に失敗しました'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

// PUT: 設定を更新（家庭教師のみ）
export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser()
    requirePermission(user, 'threshold:write')

    const body = await request.json()
    const { studentId, completionThresholds, isHighSchoolMode } = body

    // アクセス権チェック
    if (!(await canAccessStudent(user!, studentId))) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 })
    }

    // 高校移行モードの場合、テンプレートを自動生成
    let updateData: {
      completionThresholds: string
      isHighSchoolMode: boolean
      weekdayTemplate?: string
      weekendTemplate?: string
    } = {
      completionThresholds: JSON.stringify(completionThresholds),
      isHighSchoolMode,
    }

    if (isHighSchoolMode) {
      const currentSettings = await prisma.settings.findUnique({
        where: { userId: studentId },
      })

      const highSchoolSettings = generateHighSchoolSettings({
        currentSettings: {
          weeklyTemplate: currentSettings?.weeklyTemplate
            ? JSON.parse(currentSettings.weeklyTemplate)
            : {},
          completionThresholds: currentSettings?.completionThresholds
            ? JSON.parse(currentSettings.completionThresholds)
            : {},
        },
      })

      updateData = {
        ...updateData,
        completionThresholds: JSON.stringify(highSchoolSettings.completionThresholds),
        weekdayTemplate: JSON.stringify(highSchoolSettings.weekdayTemplate),
        weekendTemplate: JSON.stringify(highSchoolSettings.weekendTemplate),
      }

      // フェーズもPhase 3に更新
      await prisma.phaseState.upsert({
        where: { userId: studentId },
        create: {
          userId: studentId,
          phase: 'PHASE_3',
          sinceDate: new Date(),
        },
        update: {
          phase: 'PHASE_3',
          sinceDate: new Date(),
        },
      })
    }

    const settings = await prisma.settings.upsert({
      where: { userId: studentId },
      create: {
        userId: studentId,
        ...updateData,
      },
      update: updateData,
    })

    return NextResponse.json({
      success: true,
      settings: {
        completionThresholds: JSON.parse(settings.completionThresholds),
        isHighSchoolMode: settings.isHighSchoolMode,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '更新に失敗しました'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
