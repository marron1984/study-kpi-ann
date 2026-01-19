import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ヘッダー - ミニマル */}
      <header className="px-6 pt-12 pb-8">
        <p className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase mb-2">
          Ann's Study recording.
        </p>
        <h1 className="text-2xl font-light tracking-tight">
          吉田杏
        </h1>
        <p className="text-[11px] text-zinc-600 mt-1">
          学習継続KPI管理
        </p>
      </header>

      {/* メインナビゲーション */}
      <main className="flex-1 px-6 pb-8">
        <nav className="space-y-3">
          {/* 生徒（杏） */}
          <Link
            href="/student"
            className="block group"
          >
            <div className="border border-zinc-800 rounded-lg p-5 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-900/50 active:scale-[0.98]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase mb-1">
                    Student
                  </p>
                  <p className="text-lg font-light">吉田杏</p>
                </div>
                <div className="w-8 h-8 border border-zinc-700 rounded-full flex items-center justify-center group-hover:border-zinc-500 transition-colors">
                  <span className="text-zinc-500 text-xs">→</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-600 mt-3">
                今日のチェック / 継続記録 / 週間ログ
              </p>
            </div>
          </Link>

          {/* 家庭教師（安藤紗弥香） */}
          <Link
            href="/tutor"
            className="block group"
          >
            <div className="border border-zinc-800 rounded-lg p-5 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-900/50 active:scale-[0.98]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase mb-1">
                    Tutor
                  </p>
                  <p className="text-lg font-light">安藤紗弥香</p>
                </div>
                <div className="w-8 h-8 border border-zinc-700 rounded-full flex items-center justify-center group-hover:border-zinc-500 transition-colors">
                  <span className="text-zinc-500 text-xs">→</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-600 mt-3">
                30秒で状況判断 / 量の調整
              </p>
            </div>
          </Link>

          {/* 保護者 */}
          <Link
            href="/parent"
            className="block group"
          >
            <div className="border border-zinc-800 rounded-lg p-5 transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-900/50 active:scale-[0.98]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase mb-1">
                    Parent
                  </p>
                  <p className="text-lg font-light">保護者</p>
                </div>
                <div className="w-8 h-8 border border-zinc-700 rounded-full flex items-center justify-center group-hover:border-zinc-500 transition-colors">
                  <span className="text-zinc-500 text-xs">→</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-600 mt-3">
                週次サマリー / 応援のみ
              </p>
            </div>
          </Link>
        </nav>

        {/* 設計思想 - ミニマル表示 */}
        <div className="mt-12 pt-8 border-t border-zinc-900">
          <p className="text-[10px] tracking-[0.2em] text-zinc-600 uppercase mb-4">
            Concept
          </p>
          <div className="grid grid-cols-2 gap-4 text-[11px]">
            <div>
              <p className="text-zinc-400">do</p>
              <p className="text-zinc-600 mt-1">done / not done のみ</p>
            </div>
            <div>
              <p className="text-zinc-400">don't</p>
              <p className="text-zinc-600 mt-1">点数・偏差値・時間</p>
            </div>
            <div>
              <p className="text-zinc-400">recovery</p>
              <p className="text-zinc-600 mt-1">リセットしない</p>
            </div>
            <div>
              <p className="text-zinc-400">phase</p>
              <p className="text-zinc-600 mt-1">0→3で自動移行</p>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="px-6 py-6 border-t border-zinc-900">
        <p className="text-[10px] text-zinc-700 text-center tracking-wide">
          学習継続KPI可視化システム
        </p>
      </footer>
    </div>
  )
}
