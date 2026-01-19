'use client'

import { useState } from 'react'
import Link from 'next/link'
import { WeeklySummary } from '@/components/parent/WeeklySummary'
import { CheerButton } from '@/components/parent/CheerButton'

const MOCK_SUMMARY = {
  studentName: '杏',
  studyDays: 5,
  zeroDays: 1,
  streakCount: 7,
  riskColor: 'green' as const,
}

export default function ParentPage() {
  const [cheersThisWeek, setCheersThisWeek] = useState(2)

  const handleSendCheer = async (type: string, senderName: string) => {
    console.log('Sending cheer:', type, 'from:', senderName)
    await new Promise(resolve => setTimeout(resolve, 500))
    setCheersThisWeek(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ヘッダー */}
      <header className="px-5 pt-12 pb-4 safe-area-inset-top">
        <Link href="/" className="inline-block text-zinc-500 text-xs mb-4 hover:text-zinc-400 transition-colors">
          ← back
        </Link>
        <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase mb-1">
          Parent
        </p>
        <h1 className="text-xl font-light">保護者</h1>
        <p className="text-[11px] text-zinc-600 mt-1">週次サマリー</p>
      </header>

      {/* コンテンツ */}
      <main className="flex-1 px-5 pb-8 space-y-4">
        <WeeklySummary {...MOCK_SUMMARY} />
        <CheerButton
          cheersThisWeek={cheersThisWeek}
          onSendCheer={handleSendCheer}
        />

        {/* 説明セクション - ミニマル */}
        <div className="border border-zinc-800 rounded-lg p-4 mt-6">
          <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase mb-3">
            About this view
          </p>
          <ul className="text-[11px] text-zinc-600 space-y-2">
            <li>週1回の簡易サマリーのみ</li>
            <li>詳細な失敗ログは非表示</li>
            <li>調整は家庭教師（安藤紗弥香）が対応</li>
            <li>応援は定型文のみ送信可</li>
          </ul>
        </div>

        {/* 設定リンク */}
        <div className="pt-4">
          <button className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">
            通知設定を変更 →
          </button>
        </div>
      </main>
    </div>
  )
}
