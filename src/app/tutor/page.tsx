'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { format, startOfWeek, addDays } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Overview } from '@/components/tutor/Overview'
import { Timeline } from '@/components/tutor/Timeline'
import { ControlPanel } from '@/components/tutor/ControlPanel'
import { generateRecoveryAction } from '@/lib/logic'
import type { RiskFlag } from '@/types'

// モックデータ生成関数
function createMockData() {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })

  const englishPattern = [true, true, true, false, true, true, true]
  const mathPattern = [true, false, true, true, false, true, false]

  const days = []
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i)
    const isFuture = date > now
    days.push({
      date: format(date, 'yyyy-MM-dd'),
      dayOfWeek: format(date, 'EEEE'),
      english: isFuture ? null : { planned: true, done: englishPattern[i] },
      math: isFuture ? null : { planned: true, done: mathPattern[i] },
    })
  }

  return {
    overview: {
      studentName: '吉田杏',
      summary: {
        studyDays: 5,
        zeroDays: 1,
        clearedDays: 4,
        englishDays: 5,
        mathDays: 3,
        streakCount: 7,
        freezeCount: 2,
      },
      phase: 'PHASE_1' as const,
      riskLevel: 'LEVEL_1' as const,
      autoFlags: ['math_underperformed_2w'] as RiskFlag[],
      lastUpdated: format(now, 'M/d HH:mm', { locale: ja }),
    },
    timeline: {
      weekStart: format(weekStart, 'M/d', { locale: ja }),
      days,
    },
    control: {
      currentThresholds: {
        english: '単語20個 or 音読10分',
        math: '計算5問 or 20分',
      },
      weeklyTemplate: {
        monday: ['ENGLISH', 'MATH'],
        tuesday: ['ENGLISH', 'MATH'],
        wednesday: ['ENGLISH', 'MATH'],
        thursday: ['ENGLISH', 'MATH'],
        friday: ['ENGLISH', 'MATH'],
        saturday: ['ENGLISH', 'MATH'],
        sunday: ['ENGLISH'],
      },
      isHighSchoolMode: false,
      recommendedActions: generateRecoveryAction('LEVEL_1'),
    },
  }
}

type Tab = 'overview' | 'timeline' | 'control'

export default function TutorPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const mockData = useMemo(() => createMockData(), [])
  const [controlState, setControlState] = useState(mockData.control)

  const handleUpdateThresholds = async (thresholds: {
    english: string
    math: string
  }) => {
    console.log('Updating thresholds:', thresholds)
    await new Promise(resolve => setTimeout(resolve, 500))
    setControlState(prev => ({
      ...prev,
      currentThresholds: thresholds,
    }))
    alert('設定を保存しました')
  }

  const handleToggleHighSchoolMode = async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setControlState(prev => ({
      ...prev,
      isHighSchoolMode: !prev.isHighSchoolMode,
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ヘッダー */}
      <header className="px-5 pt-12 pb-4 safe-area-inset-top">
        <Link href="/" className="inline-block text-zinc-500 text-xs mb-4 hover:text-zinc-400 transition-colors">
          ← back
        </Link>
        <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase mb-1">
          Tutor
        </p>
        <h1 className="text-xl font-light">安藤紗弥香</h1>
        <p className="text-[11px] text-zinc-600 mt-1">30秒で状況判断</p>
      </header>

      {/* タブナビゲーション */}
      <nav className="px-5 pb-4">
        <div className="flex gap-1">
          {[
            { id: 'overview' as const, label: 'Overview' },
            { id: 'timeline' as const, label: 'Timeline' },
            { id: 'control' as const, label: 'Control' },
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
      <main className="flex-1 px-5 pb-8">
        {activeTab === 'overview' && <Overview {...mockData.overview} />}
        {activeTab === 'timeline' && <Timeline {...mockData.timeline} />}
        {activeTab === 'control' && (
          <ControlPanel
            {...controlState}
            onUpdateThresholds={handleUpdateThresholds}
            onToggleHighSchoolMode={handleToggleHighSchoolMode}
          />
        )}
      </main>
    </div>
  )
}
