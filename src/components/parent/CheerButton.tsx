'use client'

import { useState } from 'react'
import { Heart, Send } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CHEER_OPTIONS } from '@/types'

interface CheerButtonProps {
  cheersThisWeek: number
  onSendCheer?: (type: string, senderName: string) => Promise<void>
}

export function CheerButton({
  cheersThisWeek,
  onSendCheer,
}: CheerButtonProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!selectedType || !onSendCheer) return
    setSending(true)
    try {
      await onSendCheer(selectedType, 'お母さん')
      setSelectedType(null)
    } finally {
      setSending(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Cheer</p>
        </div>
        <p className="text-xs text-zinc-600">
          今週の応援: {cheersThisWeek}回
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 応援タイプ選択 */}
        <div className="grid grid-cols-2 gap-2">
          {CHEER_OPTIONS.map(option => (
            <button
              key={option.type}
              onClick={() => setSelectedType(option.type)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 active:scale-[0.98] ${
                selectedType === option.type
                  ? 'border-pink-500/50 bg-pink-500/10'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              <span className="text-xs text-zinc-300">{option.label}</span>
            </button>
          ))}
        </div>

        {/* 送信ボタン */}
        <Button
          onClick={handleSend}
          disabled={!selectedType || sending}
          variant="cheer"
          className="w-full"
        >
          {sending ? (
            '送信中...'
          ) : (
            <>
              <Send className="w-3 h-3 mr-2" />
              応援を送る
            </>
          )}
        </Button>

        {/* 注記 */}
        <p className="text-[10px] text-zinc-600 text-center">
          定型文のみ。杏に直接届きます。
        </p>
      </CardContent>
    </Card>
  )
}
