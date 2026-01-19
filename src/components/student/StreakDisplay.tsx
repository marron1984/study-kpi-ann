'use client'

import { Flame, Snowflake, Trophy, Heart } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CHEER_OPTIONS } from '@/types'

interface CheerItem {
  type: string
  senderName: string
  createdAt: string
}

interface StreakDisplayProps {
  count: number
  maxCount: number
  frozenCount: number
  lastClearDate: string | null
  message: string
  cheers?: CheerItem[]
}

export function StreakDisplay({
  count,
  maxCount,
  frozenCount,
  lastClearDate,
  message,
  cheers = [],
}: StreakDisplayProps) {
  const getCheerLabel = (type: string) => {
    const option = CHEER_OPTIONS.find(o => o.type === type)
    return option?.label || type
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Streak</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* メインストリーク表示 */}
        <div className="text-center py-4">
          <div className="text-6xl font-extralight text-orange-500">{count}</div>
          <div className="text-zinc-500 text-xs mt-2 tracking-wide">連続日数</div>
        </div>

        {/* サブ情報 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
              <Trophy className="w-3 h-3" />
              <span className="text-[10px] tracking-wide uppercase">Best</span>
            </div>
            <div className="text-2xl font-light text-amber-400">{maxCount}</div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-cyan-500 mb-1">
              <Snowflake className="w-3 h-3" />
              <span className="text-[10px] tracking-wide uppercase">Freeze</span>
            </div>
            <div className="text-2xl font-light text-cyan-400">{frozenCount}</div>
          </div>
        </div>

        {/* 最終クリア日 */}
        {lastClearDate && (
          <div className="text-center text-xs text-zinc-600">
            最終クリア: {lastClearDate}
          </div>
        )}

        {/* メッセージ */}
        <div className="border border-zinc-800 rounded-lg p-4 text-center">
          <p className="text-zinc-400 text-sm">{message}</p>
        </div>

        {/* 注記 */}
        <p className="text-[10px] text-zinc-600 text-center">
          ストリークはリセットされません
        </p>

        {/* 応援セクション */}
        {cheers.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-3 h-3 text-pink-500" />
              <span className="text-[10px] tracking-[0.15em] text-zinc-500 uppercase">Cheers</span>
            </div>
            <div className="space-y-2">
              {cheers.map((cheer, index) => (
                <div
                  key={index}
                  className="bg-pink-500/10 border border-pink-500/20 rounded-lg px-3 py-2 flex items-center justify-between"
                >
                  <span className="text-pink-400 text-xs">
                    {getCheerLabel(cheer.type)}
                  </span>
                  <span className="text-[10px] text-pink-500/70">
                    {cheer.senderName}より
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
