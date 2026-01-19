// 学習継続KPI可視化システム - 型定義

// ============================================
// 基本型（Prismaからの再エクスポート + 拡張）
// ============================================

export type {
  User,
  DailyLog,
  TaskStatus,
  Streak,
  PhaseState,
  Settings,
  Cheer,
  RiskAssessment
} from '@prisma/client'

// SQLiteではenumが使えないため、型として定義
export type Role = 'STUDENT' | 'TUTOR' | 'PARENT'
export type Mood = 'HIGH' | 'NORMAL' | 'LOW'
export type Effort = 'DOUBLE_CIRCLE' | 'CIRCLE' | 'TRIANGLE'
export type Subject = 'ENGLISH' | 'MATH' | 'SCIENCE' | 'SOCIAL' | 'JAPANESE'
export type Phase = 'PHASE_0' | 'PHASE_1' | 'PHASE_2' | 'PHASE_3'
export type RiskLevel = 'LEVEL_0' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3'
export type CheerType = 'WATCHING' | 'GREAT' | 'KEEP_GOING' | 'PROUD' | 'SUPPORT'

// ============================================
// ビュー用の型定義
// ============================================

// 今日のタスク入力用
export interface TodayInput {
  mood: Mood
  effort: Effort
  tasks: {
    subject: Subject
    done: boolean
  }[]
}

// 週次サマリー
export interface WeeklySummary {
  studyDays: number       // 勉強した日数
  zeroDays: number        // ゼロ勉強日数
  clearedDays: number     // 完全クリア日数
  englishDays: number     // 英語実行日数
  mathDays: number        // 数学実行日数
  streakCount: number     // 現在のストリーク
  freezeCount: number     // 凍結回数
  riskLevel: RiskLevelType
  flags: RiskFlag[]
}

// リスクレベル型
export type RiskLevelType = 'LEVEL_0' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3'

// リスクフラグ
export type RiskFlag =
  | 'math_underperformed_2w'      // 数学未達が2週連続
  | 'english_underperformed_2w'   // 英語未達が2週連続
  | 'zero_day_detected'           // ゼロ日発生
  | 'consecutive_fail_2'          // 連続2日未達
  | 'consecutive_fail_3'          // 連続3日未達
  | 'freeze_multiple'             // 複数回凍結

// フェーズ型
export type PhaseType = 'PHASE_0' | 'PHASE_1' | 'PHASE_2' | 'PHASE_3'

// ============================================
// 判定ロジック用の型
// ============================================

// 日次クリア判定結果
export interface DailyClearResult {
  cleared: boolean
  plannedCount: number
  doneCount: number
}

// フェーズ移行判定結果
export interface PhaseTransitionResult {
  shouldTransition: boolean
  direction: 'up' | 'down' | 'stay'
  targetPhase: PhaseType
  reason: string
}

// 自動アクション推奨
export interface RecoveryAction {
  level: RiskLevelType
  actions: string[]
  tutorMessage: string
}

// ============================================
// 画面表示用の型
// ============================================

// 生徒Today画面
export interface StudentTodayView {
  date: string
  tasks: {
    subject: string
    subjectLabel: string
    planned: boolean
    done: boolean
  }[]
  mood: string | null
  effort: string | null
  canEdit: boolean // 当日のみ編集可能
}

// 生徒Streak画面
export interface StudentStreakView {
  count: number
  maxCount: number
  frozenCount: number
  lastClearDate: string | null
  message: string // AI短文メッセージ
}

// 生徒Week画面
export interface StudentWeekView {
  weekStart: string
  weekEnd: string
  days: {
    date: string
    dayOfWeek: string
    studyDone: boolean
    cleared: boolean
  }[]
  summary: {
    studyDays: number
    zeroDays: number
  }
}

// 家庭教師Overview画面
export interface TutorOverviewView {
  studentName: string
  summary: WeeklySummary
  phase: PhaseType
  phaseLabel: string
  riskLabel: string
  autoFlags: RiskFlag[]
  lastUpdated: string
}

// 家庭教師Timeline画面
export interface TutorTimelineView {
  weekStart: string
  days: {
    date: string
    dayOfWeek: string
    english: { planned: boolean; done: boolean } | null
    math: { planned: boolean; done: boolean } | null
  }[]
}

// 家庭教師Control Panel
export interface TutorControlView {
  currentThresholds: {
    english: string
    math: string
  }
  weeklyTemplate: {
    [dayOfWeek: string]: string[] // 曜日ごとの科目配列
  }
  isHighSchoolMode: boolean
  recommendedActions: RecoveryAction | null
}

// 保護者Summary画面（超簡略）
export interface ParentSummaryView {
  studentName: string
  studyDays: number       // 今週の勉強日数
  zeroDays: number        // ゼロ勉強日数
  streakCount: number     // ストリーク数字のみ
  riskColor: 'green' | 'yellow' | 'red' // 3段階の色のみ
  cheersThisWeek: number  // 今週送った応援数
}

// 応援ボタンの選択肢
export const CHEER_OPTIONS = [
  { type: 'WATCHING' as const, label: '見てるよ' },
  { type: 'GREAT' as const, label: 'えらい' },
  { type: 'KEEP_GOING' as const, label: '継続ナイス' },
  { type: 'PROUD' as const, label: 'すごい' },
  { type: 'SUPPORT' as const, label: '応援してる' },
] as const

// ============================================
// UIラベル定義
// ============================================

export const MOOD_LABELS: Record<string, string> = {
  HIGH: '良い',
  NORMAL: '普通',
  LOW: '低い',
}

export const EFFORT_LABELS: Record<string, string> = {
  DOUBLE_CIRCLE: '◎',
  CIRCLE: '○',
  TRIANGLE: '△',
}

export const SUBJECT_LABELS: Record<string, string> = {
  ENGLISH: '英語',
  MATH: '数学',
  SCIENCE: '理科',
  SOCIAL: '社会',
  JAPANESE: '国語',
}

export const PHASE_LABELS: Record<PhaseType, string> = {
  PHASE_0: '習慣構築期',
  PHASE_1: '安定運用期',
  PHASE_2: '耐性形成期',
  PHASE_3: '高校移行期',
}

export const RISK_LABELS: Record<RiskLevelType, string> = {
  LEVEL_0: '正常',
  LEVEL_1: '軽微',
  LEVEL_2: '要注意',
  LEVEL_3: '崩壊前兆',
}

export const RISK_COLORS: Record<RiskLevelType, string> = {
  LEVEL_0: 'green',
  LEVEL_1: 'yellow',
  LEVEL_2: 'orange',
  LEVEL_3: 'red',
}
