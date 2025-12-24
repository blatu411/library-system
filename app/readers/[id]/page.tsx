import { notFound } from 'next/navigation'

import type { Reader, LoanWithDetails } from '@/lib/types'
import { getReaderById, getReaderStats } from '@/lib/queries/readers'
import { getLoansByReader } from '@/lib/queries/loans'
import { ReaderLoanHistory } from './components/ReaderLoanHistory'

interface ReaderPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * 读者借阅历史页
 * Server Component - 显示单个读者的借阅历史和统计信息
 */
export default async function ReaderPage({ params }: ReaderPageProps) {
  const { id } = await params
  const readerId = parseInt(id, 10)

  if (isNaN(readerId)) {
    notFound()
  }

  try {
    // 并行获取读者信息和借阅记录
    const [reader, loans, stats] = await Promise.all([
      getReaderById(readerId),
      getLoansByReader(readerId),
      getReaderStats(readerId),
    ])

    if (!reader) {
      notFound()
    }

    // 按借阅日期排序（最新的在前）
    const sortedLoans = [...loans].sort(
      (a, b) => new Date(b.loan_date).getTime() - new Date(a.loan_date).getTime()
    )

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 返回按钮 */}
          <a
            href="/loans"
            className="inline-flex items-center text-blue-500 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回借阅记录
          </a>

          {/* 读者信息卡片 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  👤 {reader.name}
                </h1>
                <p className="text-gray-600">读者ID: {reader.id}</p>
              </div>
            </div>

            {/* 统计数据卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 总借阅次数 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-600 text-sm mb-1">总借阅次数</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalLoans}</p>
              </div>

              {/* 当前借阅 */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <p className="text-gray-600 text-sm mb-1">当前借阅</p>
                <p className="text-2xl font-bold text-orange-600">{stats.activeLoans}</p>
              </div>

              {/* 已归还 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <p className="text-gray-600 text-sm mb-1">已归还</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalLoans - stats.activeLoans - stats.overdueLoans}
                </p>
              </div>

              {/* 逾期次数 */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                <p className="text-gray-600 text-sm mb-1">逾期次数</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueLoans}</p>
              </div>
            </div>
          </div>

          {/* 借阅历史 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📚 借阅历史
            </h2>

            {sortedLoans.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                该读者暂无借阅记录
              </div>
            ) : (
              <ReaderLoanHistory loans={sortedLoans} />
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch reader data:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 text-red-800 rounded-lg p-6">
            加载读者信息失败，请稍后重试
          </div>
        </div>
      </div>
    )
  }
}
