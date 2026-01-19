'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SUBJECT_LABELS, MOOD_LABELS, EFFORT_LABELS } from '@/types'

interface Task {
  subject: string
  planned: boolean
  done: boolean
}

interface TodayCheckProps {
  date: string
  tasks: Task[]
  mood: string | null
  effort: string | null
  canEdit: boolean
  onSave?: (data: {
    tasks: { subject: string; done: boolean }[]
    mood: string
    effort: string
  }) => Promise<void>
}

export function TodayCheck({
  date,
  tasks: initialTasks,
  mood: initialMood,
  effort: initialEffort,
  canEdit,
  onSave,
}: TodayCheckProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [mood, setMood] = useState(initialMood || 'NORMAL')
  const [effort, setEffort] = useState(initialEffort || 'CIRCLE')
  const [saving, setSaving] = useState(false)

  const plannedTasks = tasks.filter(t => t.planned)

  const toggleTask = (subject: string) => {
    if (!canEdit) return
    setTasks(prev =>
      prev.map(t =>
        t.subject === subject ? { ...t, done: !t.done } : t
      )
    )
  }

  const handleSave = async () => {
    if (!onSave) return
    setSaving(true)
    try {
      await onSave({
        tasks: tasks.map(t => ({ subject: t.subject, done: t.done })),
        mood,
        effort,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Today</p>
        <CardTitle>{date}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* タスクリスト */}
        <div className="space-y-2">
          {plannedTasks.length === 0 ? (
            <p className="text-zinc-500 text-xs">今日の予定科目はありません</p>
          ) : (
            plannedTasks.map(task => (
              <button
                key={task.subject}
                onClick={() => toggleTask(task.subject)}
                disabled={!canEdit}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                  task.done
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                } ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
              >
                <span className="font-light text-white">
                  {SUBJECT_LABELS[task.subject] || task.subject}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    task.done ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  {task.done ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <X className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* 気分 */}
        <div>
          <p className="text-[10px] tracking-[0.15em] text-zinc-500 uppercase mb-2">Mood</p>
          <div className="flex gap-2">
            {Object.entries(MOOD_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => canEdit && setMood(key)}
                disabled={!canEdit}
                className={`flex-1 py-2 px-3 rounded-full text-xs transition-all duration-200 ${
                  mood === key
                    ? 'bg-white text-black'
                    : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                } ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 取り組み度 */}
        <div>
          <p className="text-[10px] tracking-[0.15em] text-zinc-500 uppercase mb-2">Effort</p>
          <div className="flex gap-2">
            {Object.entries(EFFORT_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => canEdit && setEffort(key)}
                disabled={!canEdit}
                className={`flex-1 py-2 px-3 rounded-full text-sm transition-all duration-200 ${
                  effort === key
                    ? 'bg-white text-black'
                    : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                } ${!canEdit ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 保存ボタン */}
        {canEdit && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
            size="lg"
          >
            {saving ? '保存中...' : '記録する'}
          </Button>
        )}

        {!canEdit && (
          <p className="text-center text-xs text-zinc-600">
            過去の記録は編集できません
          </p>
        )}
      </CardContent>
    </Card>
  )
}
