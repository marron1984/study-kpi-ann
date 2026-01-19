'use client'

import { useState } from 'react'
import { Settings, AlertCircle, Lightbulb } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { RecoveryAction } from '@/types'

interface ControlPanelProps {
  currentThresholds: {
    english: string
    math: string
  }
  weeklyTemplate: {
    [dayOfWeek: string]: string[]
  }
  isHighSchoolMode: boolean
  recommendedActions: RecoveryAction | null
  onUpdateThresholds?: (thresholds: { english: string; math: string }) => Promise<void>
  onToggleHighSchoolMode?: () => Promise<void>
}

const THRESHOLD_OPTIONS = {
  english: [
    '単語20個 or 音読10分',
    '単語10個 or 音読5分',
    '単語5個 or 音読3分',
  ],
  math: [
    '計算5問 or 20分',
    '計算2問 or 10分',
    '計算1問 or 5分',
  ],
}

export function ControlPanel({
  currentThresholds,
  isHighSchoolMode,
  recommendedActions,
  onUpdateThresholds,
  onToggleHighSchoolMode,
}: ControlPanelProps) {
  const [englishThreshold, setEnglishThreshold] = useState(currentThresholds.english)
  const [mathThreshold, setMathThreshold] = useState(currentThresholds.math)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!onUpdateThresholds) return
    setSaving(true)
    try {
      await onUpdateThresholds({
        english: englishThreshold,
        math: mathThreshold,
      })
    } finally {
      setSaving(false)
    }
  }

  const riskBadgeVariant = {
    LEVEL_0: 'level0',
    LEVEL_1: 'level1',
    LEVEL_2: 'level2',
    LEVEL_3: 'level3',
  } as const

  return (
    <div className="space-y-4">
      {/* 推奨アクション */}
      {recommendedActions && recommendedActions.level !== 'LEVEL_0' && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 font-light">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-amber-400">推奨アクション</span>
              <Badge variant={riskBadgeVariant[recommendedActions.level]}>
                {recommendedActions.level.replace('LEVEL_', 'Lv.')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-xs">
              {recommendedActions.actions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-zinc-300">
                  <span className="text-amber-500">-</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-zinc-500 bg-zinc-900 border border-zinc-800 rounded p-2">
              {recommendedActions.tutorMessage}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 完了基準の調整 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-light">
            <Settings className="w-4 h-4 text-zinc-500" />
            <span className="text-sm">完了基準の調整</span>
          </CardTitle>
          <p className="text-[10px] text-zinc-600">
            調整可能なのは「量」と「完了基準」だけ
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 英語 */}
          <div>
            <label className="block text-[10px] tracking-wide uppercase text-zinc-500 mb-2">
              English
            </label>
            <select
              value={englishThreshold}
              onChange={e => setEnglishThreshold(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-600"
            >
              {THRESHOLD_OPTIONS.english.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* 数学 */}
          <div>
            <label className="block text-[10px] tracking-wide uppercase text-zinc-500 mb-2">
              Math
            </label>
            <select
              value={mathThreshold}
              onChange={e => setMathThreshold(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-600"
            >
              {THRESHOLD_OPTIONS.math.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? '保存中...' : '設定を保存'}
          </Button>
        </CardContent>
      </Card>

      {/* 高校移行モード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-light">
            <AlertCircle className="w-4 h-4 text-zinc-500" />
            <span className="text-sm">高校移行設定</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-300">高校移行モード</p>
              <p className="text-[10px] text-zinc-600">
                平日型・週末型テンプレートを有効化
              </p>
            </div>
            <button
              onClick={onToggleHighSchoolMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isHighSchoolMode ? 'bg-white' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                  isHighSchoolMode ? 'translate-x-6 bg-black' : 'translate-x-1 bg-zinc-600'
                }`}
              />
            </button>
          </div>

          {isHighSchoolMode && (
            <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs">
              <p className="font-medium text-indigo-400 mb-2">
                Phase 3: 高校移行期
              </p>
              <ul className="text-[10px] text-indigo-300/70 space-y-1">
                <li>- 完了基準を一段下げてスタート</li>
                <li>- 平日は最小構成（英数のみ）</li>
                <li>- 考える系は週末に集約</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 運用ガイド */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="pt-4">
          <p className="text-[10px] tracking-wide uppercase text-zinc-500 mb-2">
            Tutor Guide
          </p>
          <ul className="text-[10px] text-zinc-600 space-y-1">
            <li>- 面談開始5分は「事実→量調整」だけ</li>
            <li>- 禁止語: なぜ / もっと / 普通は</li>
            <li>- 目的: 行動の再開を最優先</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
