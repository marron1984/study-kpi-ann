'use client'

import { Check, X, Minus } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

interface DayData {
  date: string
  dayOfWeek: string
  studyDone: boolean
  cleared: boolean
}

interface WeekViewProps {
  weekStart: string
  weekEnd: string
  days: DayData[]
  summary: {
    studyDays: number
    zeroDays: number
  }
}

const DAY_LABELS: Record<string, string> = {
  monday: 'M',
  tuesday: 'T',
  wednesday: 'W',
  thursday: 'T',
  friday: 'F',
  saturday: 'S',
  sunday: 'S',
}

export function WeekView({ weekStart, weekEnd, days, summary }: WeekViewProps) {
  return (
    <Card>
      <CardHeader>
        <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Week</p>
        <p className="text-xs text-zinc-600">
          {weekStart} - {weekEnd}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 週間カレンダー */}
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => (
            <div key={day.date} className="text-center">
              <div className="text-[10px] text-zinc-600 mb-1">
                {DAY_LABELS[day.dayOfWeek.toLowerCase()] || day.dayOfWeek}
              </div>
              <div
                className={`w-9 h-9 mx-auto rounded-lg flex items-center justify-center transition-colors ${
                  day.cleared
                    ? 'bg-emerald-500'
                    : day.studyDone
                    ? 'bg-amber-500'
                    : 'bg-zinc-800'
                }`}
              >
                {day.cleared ? (
                  <Check className="w-4 h-4 text-white" />
                ) : day.studyDone ? (
                  <Minus className="w-4 h-4 text-white" />
                ) : (
                  <X className="w-4 h-4 text-zinc-600" />
                )}
              </div>
              <div className="text-[10px] text-zinc-600 mt-1">
                {day.date.split('-')[2]}
              </div>
            </div>
          ))}
        </div>

        {/* 凡例 */}
        <div className="flex justify-center gap-4 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-emerald-500" />
            <span className="text-zinc-500">Clear</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-amber-500" />
            <span className="text-zinc-500">Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-zinc-800" />
            <span className="text-zinc-500">Zero</span>
          </div>
        </div>

        {/* サマリー */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-light text-emerald-400">
              {summary.studyDays}
            </div>
            <div className="text-[10px] text-emerald-500/70 mt-1 tracking-wide uppercase">Study Days</div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 text-center">
            <div className="text-3xl font-light text-zinc-400">
              {summary.zeroDays}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1 tracking-wide uppercase">Zero Days</div>
          </div>
        </div>

        {/* 注記 */}
        <p className="text-[10px] text-zinc-600 text-center">
          事実のみを表示
        </p>
      </CardContent>
    </Card>
  )
}
