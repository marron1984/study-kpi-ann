// 学習継続KPI可視化システム - 判定ロジック
// 目的: 学力評価を排除し、行動の有無だけで判定する

import { startOfWeek, endOfWeek, subWeeks, format, differenceInDays, isToday, parseISO } from 'date-fns'
import type {
  DailyClearResult,
  PhaseTransitionResult,
  RiskLevelType,
  RiskFlag,
  PhaseType,
  WeeklySummary,
  RecoveryAction,
} from '@/types'

// ============================================
// 日次クリア判定
// ============================================

interface TaskData {
  planned: boolean
  done: boolean
}

/**
 * 日次クリア判定
 * planned科目が全てdone → クリア
 */
export function calculateDailyClear(tasks: TaskData[]): DailyClearResult {
  const plannedTasks = tasks.filter(t => t.planned)
  const doneTasks = plannedTasks.filter(t => t.done)

  return {
    cleared: plannedTasks.length > 0 && plannedTasks.length === doneTasks.length,
    plannedCount: plannedTasks.length,
    doneCount: doneTasks.length,
  }
}

// ============================================
// 週次サマリー計算
// ============================================

interface DayLog {
  date: Date
  tasks: { subject: string; planned: boolean; done: boolean }[]
  hasAnyDone: boolean
}

/**
 * 週次サマリーを計算
 */
export function calculateWeeklySummary(
  logs: DayLog[],
  streakCount: number,
  freezeCount: number
): Omit<WeeklySummary, 'riskLevel' | 'flags'> {
  let studyDays = 0
  let zeroDays = 0
  let clearedDays = 0
  let englishDays = 0
  let mathDays = 0

  // 今週の7日分をチェック
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // 月曜始まり

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(weekStart)
    targetDate.setDate(weekStart.getDate() + i)

    // 未来の日付はスキップ
    if (targetDate > today) continue

    const log = logs.find(l =>
      format(l.date, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
    )

    if (!log || !log.hasAnyDone) {
      zeroDays++
    } else {
      studyDays++

      const clearResult = calculateDailyClear(log.tasks)
      if (clearResult.cleared) {
        clearedDays++
      }

      // 科目別カウント
      const english = log.tasks.find(t => t.subject === 'ENGLISH')
      const math = log.tasks.find(t => t.subject === 'MATH')

      if (english?.done) englishDays++
      if (math?.done) mathDays++
    }
  }

  return {
    studyDays,
    zeroDays,
    clearedDays,
    englishDays,
    mathDays,
    streakCount,
    freezeCount,
  }
}

// ============================================
// リスクレベル判定
// ============================================

interface RiskInput {
  zeroDays: number
  consecutiveFailDays: number
  freezeThisWeek: number
  mathUnderperformed2Weeks: boolean
  englishUnderperformed2Weeks: boolean
}

/**
 * リスクレベルを判定
 *
 * Level 0（正常）: ゼロ日なし、Freeze少
 * Level 1（軽微）: 特定科目未達が週3以上（2週トレンド）
 * Level 2（要注意）: 連続2日未達 or Freeze週2
 * Level 3（崩壊前兆）: ゼロ日発生 or 3日連続未達
 */
export function calculateRiskLevel(input: RiskInput): {
  level: RiskLevelType
  flags: RiskFlag[]
} {
  const flags: RiskFlag[] = []

  // フラグを収集
  if (input.zeroDays > 0) {
    flags.push('zero_day_detected')
  }
  if (input.consecutiveFailDays >= 3) {
    flags.push('consecutive_fail_3')
  } else if (input.consecutiveFailDays >= 2) {
    flags.push('consecutive_fail_2')
  }
  if (input.freezeThisWeek >= 2) {
    flags.push('freeze_multiple')
  }
  if (input.mathUnderperformed2Weeks) {
    flags.push('math_underperformed_2w')
  }
  if (input.englishUnderperformed2Weeks) {
    flags.push('english_underperformed_2w')
  }

  // レベル判定（高い方から判定）
  let level: RiskLevelType = 'LEVEL_0'

  // Level 3: ゼロ日発生 or 3日連続未達
  if (flags.includes('zero_day_detected') || flags.includes('consecutive_fail_3')) {
    level = 'LEVEL_3'
  }
  // Level 2: 連続2日未達 or Freeze週2
  else if (flags.includes('consecutive_fail_2') || flags.includes('freeze_multiple')) {
    level = 'LEVEL_2'
  }
  // Level 1: 特定科目未達が2週連続
  else if (flags.includes('math_underperformed_2w') || flags.includes('english_underperformed_2w')) {
    level = 'LEVEL_1'
  }

  return { level, flags }
}

// ============================================
// フェーズ移行判定
// ============================================

interface PhaseInput {
  currentPhase: PhaseType
  consecutiveClearDays: number
  zeroDaysInMonth: number
  freezeInMonth: number
  mathUnderperformRate: number // 0-100%
  isHighSchoolStart: boolean
}

/**
 * フェーズ移行を判定
 *
 * Phase 0 → 1: 14日連続クリア、ゼロ日0
 * Phase 1 → 2: 30日中25日以上実行
 * Phase 2 → 3: 60日ゼロ日0、Freezeなし（または高校入学）
 *
 * ロールバック:
 * Phase 1 → 0: 月にゼロ日2回
 * Phase 2 → 1: 数学未達率40%以上
 * Phase 3 → 2: 新生活でゼロ日発生
 */
export function calculatePhaseTransition(input: PhaseInput): PhaseTransitionResult {
  const { currentPhase, consecutiveClearDays, zeroDaysInMonth, freezeInMonth, mathUnderperformRate, isHighSchoolStart } = input

  // 高校入学時は強制的にPhase 3へ
  if (isHighSchoolStart && currentPhase !== 'PHASE_3') {
    return {
      shouldTransition: true,
      direction: 'up',
      targetPhase: 'PHASE_3',
      reason: '高校移行期への移行',
    }
  }

  // 上昇判定
  switch (currentPhase) {
    case 'PHASE_0':
      if (consecutiveClearDays >= 14 && zeroDaysInMonth === 0) {
        return {
          shouldTransition: true,
          direction: 'up',
          targetPhase: 'PHASE_1',
          reason: '14日連続クリア達成',
        }
      }
      break

    case 'PHASE_1':
      // 30日中25日以上実行をチェック（簡易版: ゼロ日が5以下）
      if (zeroDaysInMonth <= 5 && freezeInMonth === 0) {
        return {
          shouldTransition: true,
          direction: 'up',
          targetPhase: 'PHASE_2',
          reason: '安定運用を達成',
        }
      }
      break

    case 'PHASE_2':
      // 60日ゼロ日0、Freezeなし（ここでは30日で簡易判定）
      if (zeroDaysInMonth === 0 && freezeInMonth === 0) {
        // 実際は60日判定が必要だが、ここでは簡易版
      }
      break
  }

  // 下降（ロールバック）判定
  switch (currentPhase) {
    case 'PHASE_1':
      if (zeroDaysInMonth >= 2) {
        return {
          shouldTransition: true,
          direction: 'down',
          targetPhase: 'PHASE_0',
          reason: '最適化のためPhase 0へ',
        }
      }
      break

    case 'PHASE_2':
      if (mathUnderperformRate >= 40) {
        return {
          shouldTransition: true,
          direction: 'down',
          targetPhase: 'PHASE_1',
          reason: '最適化のためPhase 1へ',
        }
      }
      break

    case 'PHASE_3':
      if (zeroDaysInMonth >= 1) {
        return {
          shouldTransition: true,
          direction: 'down',
          targetPhase: 'PHASE_2',
          reason: '最適化のためPhase 2へ',
        }
      }
      break
  }

  return {
    shouldTransition: false,
    direction: 'stay',
    targetPhase: currentPhase,
    reason: '現状維持',
  }
}

// ============================================
// ストリーク更新ロジック
// ============================================

interface StreakInput {
  currentCount: number
  currentFrozenCount: number
  maxCount: number
  lastClearDate: Date | null
  todayCleared: boolean
}

/**
 * ストリークを更新
 * リセットは禁止、代わりにfreeze（凍結）を使用
 */
export function updateStreak(input: StreakInput): {
  count: number
  frozenCount: number
  maxCount: number
  shouldFreeze: boolean
} {
  const { currentCount, currentFrozenCount, maxCount, lastClearDate, todayCleared } = input

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 前回クリアからの経過日数
  let daysSinceLastClear = 0
  if (lastClearDate) {
    const lastDate = new Date(lastClearDate)
    lastDate.setHours(0, 0, 0, 0)
    daysSinceLastClear = differenceInDays(today, lastDate)
  }

  // 今日クリアした場合
  if (todayCleared) {
    // 連続の場合（昨日もクリア）
    if (daysSinceLastClear <= 1) {
      const newCount = currentCount + 1
      return {
        count: newCount,
        frozenCount: currentFrozenCount,
        maxCount: Math.max(maxCount, newCount),
        shouldFreeze: false,
      }
    }
    // 1日以上空いた場合でも、リセットせずfreeze
    else {
      return {
        count: 1, // 1から再スタート（リセットではなく新しいストリーク開始）
        frozenCount: currentFrozenCount + 1,
        maxCount: maxCount,
        shouldFreeze: true,
      }
    }
  }

  // 今日クリアしていない場合
  // まだ当日中ならカウントは維持
  if (isToday(today)) {
    return {
      count: currentCount,
      frozenCount: currentFrozenCount,
      maxCount: maxCount,
      shouldFreeze: false,
    }
  }

  // 前日未クリアで日付が変わった場合はfreeze
  return {
    count: currentCount, // カウントは維持（リセットしない）
    frozenCount: currentFrozenCount + 1,
    maxCount: maxCount,
    shouldFreeze: true,
  }
}

// ============================================
// リカバリーアクション生成
// ============================================

/**
 * リスクレベルに応じた推奨アクションを生成
 */
export function generateRecoveryAction(level: RiskLevelType): RecoveryAction {
  switch (level) {
    case 'LEVEL_1':
      return {
        level,
        actions: [
          '未達科目の完了基準を下げる（量のデグレード）',
          '例: 数学の完了条件を「2問 or 10分」に',
        ],
        tutorMessage: '軽微な調整で回復可能。量を減らして継続を優先。',
      }

    case 'LEVEL_2':
      return {
        level,
        actions: [
          '1日1タスク化（英語のみ等）',
          'コメント制限モード（励ましのみ）',
          '完了基準をさらに下げる',
        ],
        tutorMessage: '継続の危機。最小構成で再開を優先。',
      }

    case 'LEVEL_3':
      return {
        level,
        actions: [
          '3日間「チェックだけ」モード',
          'done入力のみ、科目を減らす',
          'ストリーク維持を最優先',
        ],
        tutorMessage: '崩壊前兆。回復期として最小負荷で再起動。',
      }

    default:
      return {
        level: 'LEVEL_0',
        actions: [],
        tutorMessage: '順調。現状維持。',
      }
  }
}

// ============================================
// 自動メッセージ生成（AI短文）
// ============================================

const MESSAGES = {
  cleared: [
    '最低限クリア。継続が一番強い。',
    '今日も守れた。その積み重ね。',
    'やるべきことはやった。十分。',
  ],
  partial: [
    '全部じゃなくても、やったことが大事。',
    '数学は未達でも英語は守れた。十分。',
    '一部でもやれば継続。ゼロじゃない。',
  ],
  zero: [
    '今日は休み。明日また。',
    '止まっても、リセットはしない。',
    'ゼロの日もある。明日1つだけ。',
  ],
  streak: [
    '連続{count}日。淡々と。',
    '{count}日継続中。これが習慣。',
    '続いてる。それだけで価値がある。',
  ],
  freeze: [
    '凍結したけど、終わりじゃない。',
    '止まっただけ。リセットはしない。',
    '明日1つやれば再開。',
  ],
}

/**
 * 状況に応じた短文メッセージを生成
 * 原則50字以内、責めない、原因追及しない
 */
export function generateMessage(
  type: 'cleared' | 'partial' | 'zero' | 'streak' | 'freeze',
  params?: { count?: number }
): string {
  const messages = MESSAGES[type]
  const message = messages[Math.floor(Math.random() * messages.length)]

  if (params?.count !== undefined) {
    return message.replace('{count}', params.count.toString())
  }

  return message
}

// ============================================
// 高校移行時の再設定
// ============================================

interface HighSchoolTransitionInput {
  currentSettings: {
    weeklyTemplate: Record<string, string[]>
    completionThresholds: Record<string, string>
  }
}

/**
 * 高校移行時のテンプレート再設定
 * - 週間テンプレを「平日型」「週末型」に分離
 * - 完了基準を一段下げる
 */
export function generateHighSchoolSettings(input: HighSchoolTransitionInput) {
  // 平日型: 英語・数学（最小構成）
  const weekdayTemplate = {
    monday: ['ENGLISH', 'MATH'],
    tuesday: ['ENGLISH', 'MATH'],
    wednesday: ['ENGLISH', 'MATH'],
    thursday: ['ENGLISH', 'MATH'],
    friday: ['ENGLISH', 'MATH'],
  }

  // 週末型: 考える系を集約
  const weekendTemplate = {
    saturday: ['ENGLISH', 'MATH'],
    sunday: ['ENGLISH'], // 日曜は軽め
  }

  // 完了基準を一段下げる（守り）
  const completionThresholds = {
    ENGLISH: '単語10個 or 音読5分',
    MATH: '計算2問 or 10分',
  }

  return {
    isHighSchoolMode: true,
    weekdayTemplate,
    weekendTemplate,
    completionThresholds,
  }
}
