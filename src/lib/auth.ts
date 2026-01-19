import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getSessionUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

export async function requirePermission(role: 'STUDENT' | 'TUTOR' | 'PARENT') {
  const user = await getSessionUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function canAccessStudent(studentId: string) {
  const user = await getSessionUser()
  if (!user) return false
  return true
}
