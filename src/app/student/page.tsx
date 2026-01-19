'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { ja } from 'date-fns/locale'
import { TodayCheck } from '@/components/student/TodayCheck'
import { StreakDisplay } from '@/components/student/StreakDisplay'
import { WeekView } from '@/components/student/WeekView'
import { generateMessage } from '@/lib/logic'

// モックデータ生成関数
function createMockData() {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  const demoPattern = [true, true, false, true, true, true, false]

  const days = []
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i)
    const isFuture = date > now
    days.push({
      date: format(date, 'yyyy-MM-dd'),
      dayOfWeek: format(date, 'EEEE'),
      studyDone: !isFuture && demoPattern[i],
      cleared: !isFuture && demoPattern[i],
    })
  }

  return {
    today: {
      date: format(now, 'yyyy年M月d日(E)', { locale: ja }),
      tasks: [
        { subject: 'ENGLISH', planned: true, done: false },
        { subject: 'MATH', planned: true, done: false },
      ],
      mood: null,
      effort: null,
      canEdit: true,
    },
    streak: {
      count: 7,
      maxCount: 14,
      frozenCount: 2,
      lastClearDate: format(addDays(now, -1), 'M月d日', { locale: ja }),
      message: generateMessage('streak', { count: 7 }),
      cheers: [
        { type: 'WATCHING', senderName: 'お母さん', createdAt: format(addDays(now, -1), 'M/d') },
        { type: 'GREAT', senderName: 'お母さん', createdAt: format(addDays(now, -2), 'M/d') },
      ],
    },
    week: {
      weekStart: format(weekStart, 'M/d', { locale: ja }),
      weekEnd: format(weekEnd, 'M/d', { locale: ja }),
      days,
      summary: {
        studyDays: days.filter(d => d.studyDone).length,
        zeroDays: days.filter(d => !d.studyDone && new Date(d.date) <= now).length,
      },
    },
  }
}

type Tab = 'today' | 'streak' | 'week'

export default function StudentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('today')
  const mockData = useMemo(() => createMockData(), [])

  const handleSave = async (data: {
    tasks: { subject: string; done: boolean }[]
    mood: string
    effort: string
  }) => {
    console.log('Saving:', data)
    await new Promise(resolve => setTimeout(resolve, 500))
    alert('記録しました')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ヘッダー */}
      <header className="px-5 pt-12 pb-4 safe-area-inset-top">
        <Link href="/" className="inline-block text-zinc-500 text-xs mb-4 hover:text-zinc-400 transition-colors">
          ← back
        </Link>
        <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase mb-1">
          Student
        </p>
        <h1 className="text-xl font-light">吉田杏</h1>
      </header>

      {/* タブナビゲーション - ミニマル */}
      <nav className="px-5 pb-4">
        <div className="flex gap-1">
          {[
            { id: 'today' as const, label: 'Today' },
            { id: 'streak' as const, label: 'Streak' },
            { id: 'week' as const, label: 'Week' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs tracking-wide rounded-full transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* コンテンツ */}
      <main className="flex-1 px-5 pb-24">
        {activeTab === 'today' && (
          <TodayCheck {...mockData.today} onSave={handleSave} />
        )}
        {activeTab === 'streak' && <StreakDisplay {...mockData.streak} />}
        {activeTab === 'week' && <WeekView {...mockData.week} />}
      </main>

      {/* フッター */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-zinc-900 safe-area-inset-bottom">
        <div className="px-5 py-3">
          <p className="text-[10px] text-zinc-600 text-center">
            30秒で完了
          </p>
        </div>
      </footer>
    </div>
  )
}
