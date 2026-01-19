'use client'

import { AlertTriangle, TrendingUp, Calendar, Flame } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PHASE_LABELS,
  RISK_LABELS,
  type RiskLevelType,
  type PhaseType,
  type RiskFlag,
} from '@/types'

interface OverviewProps {
  studentName: string
  summary: {
    studyDays: number
    zeroDays: number
    clearedDays: number
    englishDays: number
    mathDays: number
    streakCount: number
    freezeCount: number
  }
  phase: PhaseType
  riskLevel: RiskLevelType
  autoFlags: RiskFlag[]
  lastUpdated: string
}

const FLAG_LABELS: Record<RiskFlag, string> = {
  math_underperformed_2w: '数学2週連続未達',
  english_underperformed_2w: '英語2週連続未達',
  zero_day_detected: 'ゼロ日発生',
  consecutive_fail_2: '2日連続未達',
  consecutive_fail_3: '3日連続未達',
  freeze_multiple: '複数回凍結',
}

const RISK_BADGE_VARIANT: Record<RiskLevelType, 'level0' | 'level1' | 'level2' | 'level3'> = {
  LEVEL_0: 'level0',
  LEVEL_1: 'level1',
  LEVEL_2: 'level2',
  LEVEL_3: 'level3',
}

const PHASE_BADGE_VARIANT: Record<PhaseType, 'phase0' | 'phase1' | 'phase2' | 'phase3'> = {
  PHASE_0: 'phase0',
  PHASE_1: 'phase1',
  PHASE_2: 'phase2',
  PHASE_3: 'phase3',
}

export function Overview({
  studentName,
  summary,
  phase,
  riskLevel,
  autoFlags,
  lastUpdated,
}: OverviewProps) {
  return (
    <div className="space-y-4">
      {/* 30秒サマリー */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Student</p>
              <CardTitle className="text-lg font-light">{studentName}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant={PHASE_BADGE_VARIANT[phase]}>
                {PHASE_LABELS[phase]}
              </Badge>
              <Badge variant={RISK_BADGE_VARIANT[riskLevel]}>
                {RISK_LABELS[riskLevel]}
              </Badge>
            </div>
          </div>
          <p className="text-[10px] text-zinc-600">更新: {lastUpdated}</p>
        </CardHeader>
        <CardContent>
          {/* 今週の事実 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="flex items-center gap-1 text-zinc-500 mb-1">
                <Calendar className="w-3 h-3" />
                <span className="text-[10px] tracking-wide uppercase">Study</span>
              </div>
              <div className="text-2xl font-light text-white">{summary.studyDays}/7</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="flex items-center gap-1 text-zinc-500 mb-1">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-[10px] tracking-wide uppercase">Zero</span>
              </div>
              <div className="text-2xl font-light text-red-400">{summary.zeroDays}</div>
            </div>
          </div>

          {/* 科目別 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="border border-zinc-800 rounded-lg p-3">
              <div className="text-[10px] text-zinc-500 tracking-wide uppercase mb-1">English</div>
              <div className="text-xl font-light text-white">{summary.englishDays}日</div>
            </div>
            <div className="border border-zinc-800 rounded-lg p-3">
              <div className="text-[10px] text-zinc-500 tracking-wide uppercase mb-1">Math</div>
              <div className="text-xl font-light text-white">{summary.mathDays}日</div>
            </div>
          </div>

          {/* ストリーク */}
          <div className="flex items-center justify-between bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-orange-400 tracking-wide">Streak</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-light text-orange-400">
                {summary.streakCount}
              </span>
              <span className="text-xs text-zinc-500 ml-1">日</span>
              {summary.freezeCount > 0 && (
                <span className="text-[10px] text-cyan-400 ml-2">
                  (凍結{summary.freezeCount}回)
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto Flags */}
      {autoFlags.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 font-light">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span className="text-amber-400">検出されたトレンド</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {autoFlags.map(flag => (
                <Badge key={flag} variant="warning">
                  {FLAG_LABELS[flag]}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
