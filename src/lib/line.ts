// LINE Messaging API クライアント
import { messagingApi, WebhookEvent } from '@line/bot-sdk'
import { prisma } from './prisma'

// LINE クライアント設定
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
}

// クライアント初期化（環境変数が設定されている場合のみ）
const client = config.channelAccessToken
  ? new messagingApi.MessagingApiClient({
      channelAccessToken: config.channelAccessToken,
    })
  : null

/**
 * LINE通知を送信
 */
export async function sendLineMessage(
  lineUserId: string,
  message: string
): Promise<boolean> {
  if (!client) {
    console.log('[LINE] Client not configured, skipping message:', message)
    return false
  }

  try {
    await client.pushMessage({
      to: lineUserId,
      messages: [{ type: 'text', text: message }],
    })
    return true
  } catch (error) {
    console.error('[LINE] Failed to send message:', error)
    return false
  }
}

/**
 * 学習リマインダーを送信（生徒向け）
 */
export async function sendStudyReminder(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lineUserId: true, name: true },
  })

  if (!user?.lineUserId) return false

  const message = `${user.name}さん、今日の学習は終わりましたか？\n\n30秒で記録できます！`
  return sendLineMessage(user.lineUserId, message)
}

/**
 * 応援通知を送信（生徒向け）
 */
export async function sendCheerNotification(
  receiverId: string,
  senderName: string,
  cheerType: string
): Promise<boolean> {
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: { lineUserId: true },
  })

  if (!receiver?.lineUserId) return false

  const cheerLabels: Record<string, string> = {
    WATCHING: '見守ってるよ',
    GREAT: 'すごいね！',
    KEEP_GOING: 'その調子！',
    PROUD: '誇りに思うよ',
    SUPPORT: '応援してるよ',
  }

  const label = cheerLabels[cheerType] || cheerType
  const message = `${senderName}より応援が届きました！\n\n「${label}」`
  return sendLineMessage(receiver.lineUserId, message)
}

/**
 * 週次サマリーを送信（保護者向け）
 */
export async function sendWeeklySummaryToParent(
  parentId: string,
  studentName: string,
  summary: {
    studyDays: number
    zeroDays: number
    streakCount: number
  }
): Promise<boolean> {
  const parent = await prisma.user.findUnique({
    where: { id: parentId },
    select: { lineUserId: true },
  })

  if (!parent?.lineUserId) return false

  const message = `【${studentName}さんの週次レポート】\n\n学習日: ${summary.studyDays}日\nゼロ日: ${summary.zeroDays}日\n継続: ${summary.streakCount}日\n\n詳細はアプリで確認できます。`
  return sendLineMessage(parent.lineUserId, message)
}

/**
 * 高リスク通知を送信（家庭教師向け）
 */
export async function sendHighRiskAlert(
  tutorId: string,
  studentName: string,
  riskLevel: string
): Promise<boolean> {
  const tutor = await prisma.user.findUnique({
    where: { id: tutorId },
    select: { lineUserId: true },
  })

  if (!tutor?.lineUserId) return false

  const message = `【要確認】${studentName}さんのリスクレベルが${riskLevel}に上昇しました。\n\n早めのフォローアップをお勧めします。`
  return sendLineMessage(tutor.lineUserId, message)
}

/**
 * LINE Webhookイベント処理
 */
export async function handleLineWebhook(event: WebhookEvent): Promise<void> {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return
  }

  const lineUserId = event.source.userId
  if (!lineUserId) return

  // ユーザーをLINE IDで検索
  const user = await prisma.user.findUnique({
    where: { lineUserId },
  })

  if (!user) {
    // 未連携ユーザーへの案内
    if (client) {
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: 'アプリでLINE連携を行ってください。',
          },
        ],
      })
    }
    return
  }

  // 簡易コマンド対応
  const text = event.message.text.trim()

  if (text === '記録' || text === 'きろく') {
    if (client) {
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: `${user.name}さん、今日の学習記録はアプリから入力してください！`,
          },
        ],
      })
    }
  }
}

/**
 * LINEユーザーIDを連携
 */
export async function linkLineUser(
  userId: string,
  lineUserId: string
): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lineUserId },
    })
    return true
  } catch (error) {
    console.error('[LINE] Failed to link user:', error)
    return false
  }
}
