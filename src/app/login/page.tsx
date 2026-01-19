'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BookOpen, GraduationCap, Users, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Role = 'STUDENT' | 'TUTOR' | 'PARENT'

const DEMO_USERS = [
  {
    role: 'STUDENT' as Role,
    email: 'ann@example.com',
    name: '杏（学生）',
    icon: GraduationCap,
    color: 'bg-blue-500',
    description: '学習記録を入力・確認',
  },
  {
    role: 'TUTOR' as Role,
    email: 'tutor@example.com',
    name: '家庭教師',
    icon: BookOpen,
    color: 'bg-green-500',
    description: '生徒の進捗を管理',
  },
  {
    role: 'PARENT' as Role,
    email: 'parent@example.com',
    name: '保護者',
    icon: Heart,
    color: 'bg-pink-500',
    description: '週次サマリー・応援',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<Role | null>(null)

  const handleLogin = async (email: string, role: Role) => {
    setLoading(role)
    try {
      const result = await signIn('credentials', {
        email,
        role,
        redirect: false,
      })

      if (result?.ok) {
        // ロールに応じてリダイレクト
        switch (role) {
          case 'STUDENT':
            router.push('/student')
            break
          case 'TUTOR':
            router.push('/tutor')
            break
          case 'PARENT':
            router.push('/parent')
            break
        }
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* ヘッダー */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">学習継続KPI</h1>
          </div>
          <p className="text-gray-600">ログインするアカウントを選択</p>
        </div>

        {/* デモユーザー選択 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">デモログイン</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEMO_USERS.map(user => {
              const Icon = user.icon
              return (
                <button
                  key={user.role}
                  onClick={() => handleLogin(user.email, user.role)}
                  disabled={loading !== null}
                  className={`w-full p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all flex items-center gap-4 ${
                    loading === user.role ? 'opacity-50' : ''
                  }`}
                >
                  <div className={`${user.color} p-3 rounded-full`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.description}</div>
                  </div>
                  {loading === user.role && (
                    <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                  )}
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* LINE連携ボタン（今後実装） */}
        <div className="text-center">
          <Button variant="outline" disabled className="w-full">
            LINE でログイン（準備中）
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            LINE連携で通知を受け取れます
          </p>
        </div>
      </div>
    </div>
  )
}
