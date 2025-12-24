import { Suspense } from 'react'

import type { LoanWithDetails } from '@/lib/types'
import { getAllLoans } from '@/lib/queries/loans'
import { LoanSearch } from './components/LoanSearch'
import { LoanFilters } from './components/LoanFilters'
import { LoanTable } from './components/LoanTable'

interface LoansPageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    page?: string
  }>
}

/**
 * 借阅记录列表页
 * Server Component - 获取并显示所有借阅记录
 * 支持搜索、筛选和分页
 */
export default async function LoansPage({ searchParams }: LoansPageProps) {
  const params = await searchParams
  const searchQuery = params.q || ''
  const statusFilter = params.status || 'all'
  const currentPage = parseInt(params.page || '1', 10)
  const itemsPerPage = 10

  try {
    // 获取所有借阅记录
    const allLoans = await getAllLoans()

    // 筛选和搜索
    let filteredLoans = allLoans

    // 按搜索词筛选（图书名或读者名）
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filteredLoans = filteredLoans.filter((loan) => {
        const bookMatch = loan.books.title.toLowerCase().includes(query)
        const readerMatch = loan.readers.name.toLowerCase().includes(query)
        return bookMatch || readerMatch
      })
    }

    // 按状态筛选
    if (statusFilter !== 'all') {
      filteredLoans = filteredLoans.filter((loan) => {
        if (statusFilter === 'active') return !loan.return_date
        if (statusFilter === 'returned') return loan.return_date
        if (statusFilter === 'overdue') {
          return !loan.return_date && loan.due_date < new Date().toISOString().split('T')[0]
        }
        return true
      })
    }

    // 分页
    const totalItems = filteredLoans.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const validPage = Math.min(Math.max(currentPage, 1), totalPages || 1)
    const startIndex = (validPage - 1) * itemsPerPage
    const paginatedLoans = filteredLoans.slice(startIndex, startIndex + itemsPerPage)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 标题 */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            📋 借阅记录
          </h1>

          {/* 搜索和筛选工具栏 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <Suspense fallback={<div className="text-gray-500">加载中...</div>}>
              <LoanSearch initialQuery={searchQuery} />
            </Suspense>

            <Suspense fallback={<div className="text-gray-500">加载中...</div>}>
              <LoanFilters initialStatus={statusFilter} />
            </Suspense>
          </div>

          {/* 借阅记录表格 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {paginatedLoans.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {allLoans.length === 0 ? '暂无借阅记录' : '搜索结果为空'}
              </div>
            ) : (
              <>
                <Suspense fallback={<div className="text-gray-500">加载中...</div>}>
                  <LoanTable loans={paginatedLoans} />
                </Suspense>

                {/* 分页信息和按钮 */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t pt-6">
                    <div className="text-sm text-gray-600">
                      第 <span className="font-semibold">{validPage}</span> 页 / 共{' '}
                      <span className="font-semibold">{totalPages}</span> 页 (共{' '}
                      <span className="font-semibold">{totalItems}</span> 条记录)
                    </div>

                    <div className="flex gap-2">
                      {validPage > 1 && (
                        <a
                          href={`/loans?q=${searchQuery}&status=${statusFilter}&page=${validPage - 1}`}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          ← 上一页
                        </a>
                      )}

                      {/* 页码按钮 */}
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1
                          return (
                            <a
                              key={pageNum}
                              href={`/loans?q=${searchQuery}&status=${statusFilter}&page=${pageNum}`}
                              className={`px-3 py-2 rounded-lg transition-colors ${
                                validPage === pageNum
                                  ? 'bg-blue-500 text-white'
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </a>
                          )
                        })}
                      </div>

                      {validPage < totalPages && (
                        <a
                          href={`/loans?q=${searchQuery}&status=${statusFilter}&page=${validPage + 1}`}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          下一页 →
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch loans:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 text-red-800 rounded-lg p-6">
            加载借阅记录失败，请稍后重试
          </div>
        </div>
      </div>
    )
  }
}
