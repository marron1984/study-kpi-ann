'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase',
  {
    variants: {
      variant: {
        default: 'bg-zinc-800 text-zinc-300',
        success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        // リスクレベル用
        level0: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        level1: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        level2: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
        level3: 'bg-red-500/20 text-red-400 border border-red-500/30',
        // フェーズ用
        phase0: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
        phase1: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        phase2: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        phase3: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
