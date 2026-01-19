'use client'

import { Calendar, Flame, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

interface WeeklySummaryProps {
  studentName: string
  studyDays: number
  zeroDays: number
  streakCount: number
  riskColor: 'green' | 'yellow' | 'red'
}

const RISK_STYLES = {
  green: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: '順調',
  },
  yellow: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    label: '注意',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
    label: '要確認',
  },
}

export function WeeklySummary({
  studentName,
  studyDays,
  zeroDays,
  streakCount,
  riskColor,
}: WeeklySummaryProps) {
  const riskStyle = RISK_STYLES[riskColor]

  return (
    <Card>
      <CardHeader>
        <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">This Week</p>
        <p className="text-base font-light text-white">{studentName}の今週</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 状態インジケーター */}
        <div
          className={`${riskStyle.bg} ${riskStyle.border} border rounded-lg p-4 text-center`}
        >
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className={`w-4 h-4 ${riskStyle.text}`} />
            <span className={`text-sm font-light ${riskStyle.text}`}>
              {riskStyle.label}
            </span>
          </div>
        </div>

        {/* シンプルな数値表示 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-zinc-500 mb-1">
              <Calendar className="w-3 h-3" />
            </div>
            <div className="text-xl font-light text-white">{studyDays}</div>
            <div className="text-[10px] text-zinc-600">勉強日/7</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
            <div className="text-xl font-light text-white">{zeroDays}</div>
            <div className="text-[10px] text-zinc-600">ゼロ日</div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
              <Flame className="w-3 h-3" />
            </div>
            <div className="text-xl font-light text-orange-400">{streakCount}</div>
            <div className="text-[10px] text-zinc-600">連続日</div>
          </div>
        </div>

        {/* 注記 */}
        <p className="text-[10px] text-zinc-600 text-center">
          詳細は家庭教師（安藤紗弥香）が管理
        </p>
      </CardContent>
    </Card>
  )
}
