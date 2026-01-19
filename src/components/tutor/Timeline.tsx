'use client'

import { Check, X, Minus } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

interface DayData {
  date: string
  dayOfWeek: string
  english: { planned: boolean; done: boolean } | null
  math: { planned: boolean; done: boolean } | null
}

interface TimelineProps {
  weekStart: string
  days: DayData[]
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

function StatusIcon({ planned, done }: { planned: boolean; done: boolean }) {
  if (!planned) {
    return <Minus className="w-3 h-3 text-zinc-700" />
  }
  if (done) {
    return <Check className="w-3 h-3 text-emerald-400" />
  }
  return <X className="w-3 h-3 text-red-400" />
}

function StatusCell({ data }: { data: { planned: boolean; done: boolean } | null }) {
  if (!data) {
    return (
      <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center">
        <Minus className="w-3 h-3 text-zinc-700" />
      </div>
    )
  }

  const bgColor = !data.planned
    ? 'bg-zinc-900'
    : data.done
    ? 'bg-emerald-500/20 border border-emerald-500/30'
    : 'bg-red-500/20 border border-red-500/30'

  return (
    <div className={`w-7 h-7 rounded ${bgColor} flex items-center justify-center`}>
      <StatusIcon planned={data.planned} done={data.done} />
    </div>
  )
}

export function Timeline({ weekStart, days }: TimelineProps) {
  return (
    <Card>
      <CardHeader>
        <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Timeline</p>
        <p className="text-xs text-zinc-600">{weekStart}週</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-2 text-left font-normal text-zinc-500 w-16 tracking-wide uppercase text-[10px]">
                  Subject
                </th>
                {days.map(day => (
                  <th
                    key={day.date}
                    className="py-2 text-center font-normal text-zinc-500 px-1"
                  >
                    <div className="text-[10px]">{DAY_LABELS[day.dayOfWeek.toLowerCase()]}</div>
                    <div className="text-[10px] text-zinc-600">
                      {day.date.split('-')[2]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-3 text-zinc-400 text-[11px]">English</td>
                {days.map(day => (
                  <td key={`${day.date}-en`} className="py-3 text-center px-1">
                    <div className="flex justify-center">
                      <StatusCell data={day.english} />
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 text-zinc-400 text-[11px]">Math</td>
                {days.map(day => (
                  <td key={`${day.date}-ma`} className="py-3 text-center px-1">
                    <div className="flex justify-center">
                      <StatusCell data={day.math} />
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* 凡例 */}
        <div className="flex justify-center gap-4 mt-4 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Check className="w-2 h-2 text-emerald-400" />
            </div>
            <span className="text-zinc-500">Done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <X className="w-2 h-2 text-red-400" />
            </div>
            <span className="text-zinc-500">Miss</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-zinc-900 flex items-center justify-center">
              <Minus className="w-2 h-2 text-zinc-700" />
            </div>
            <span className="text-zinc-500">N/A</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
