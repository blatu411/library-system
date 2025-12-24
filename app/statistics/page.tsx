import { Suspense } from 'react'

import { getOverallStats, getTopReaders, getPopularBooks } from '@/lib/queries/statistics'
import { StatCard } from './components/StatCard'
import { TopReadersChart } from './components/TopReadersChart'
import { PopularBooksChart } from './components/PopularBooksChart'

/**
 * 统计数据看板页
 * Server Component - 显示系统的统计数据和排行信息
 */
export default async function StatisticsPage() {
  try {
    // 并行获取所有统计数据
    const [overallStats, topReaders, popularBooks] = await Promise.all([
      getOverallStats(),
      getTopReaders(10),
      getPopularBooks(10),
    ])

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 标题 */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            📊 统计看板
          </h1>

          {/* 总体统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Suspense fallback={<div className="bg-white rounded-lg shadow p-6 animate-pulse h-32" />}>
              <StatCard
                icon="📚"
                title="图书总数"
                value={overallStats.totalBooks}
              />
            </Suspense>

            <Suspense fallback={<div className="bg-white rounded-lg shadow p-6 animate-pulse h-32" />}>
              <StatCard
                icon="👥"
                title="读者总数"
                value={overallStats.totalReaders}
              />
            </Suspense>

            <Suspense fallback={<div className="bg-white rounded-lg shadow p-6 animate-pulse h-32" />}>
              <StatCard
                icon="📤"
                title="当前借出"
                value={overallStats.activeLoans}
              />
            </Suspense>

            <Suspense fallback={<div className="bg-white rounded-lg shadow p-6 animate-pulse h-32" />}>
              <StatCard
                icon="📋"
                title="总借阅次数"
                value={overallStats.totalLoans}
              />
            </Suspense>
          </div>

          {/* 排行榜部分 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 活跃读者排行 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🏆 活跃读者排行 (Top 10)
              </h2>

              <Suspense
                fallback={
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-gray-100 h-12 rounded animate-pulse" />
                    ))}
                  </div>
                }
              >
                <TopReadersChart readers={topReaders} />
              </Suspense>
            </div>

            {/* 热门图书排行 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                ⭐ 热门图书排行 (Top 10)
              </h2>

              <Suspense
                fallback={
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="bg-gray-100 h-12 rounded animate-pulse" />
                    ))}
                  </div>
                }
              >
                <PopularBooksChart books={popularBooks} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 text-red-800 rounded-lg p-6">
            加载统计数据失败，请稍后重试
          </div>
        </div>
      </div>
    )
  }
}
