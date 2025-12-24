/**
 * 读者借阅历史组件
 * 时间线样式展示读者的借阅历史记录
 */

'use client'

import type { LoanWithDetails } from '@/lib/types'
import { formatDate, getLoanStatus } from '@/lib/utils/date'
import { formatLoanStatus, getLoanStatusClassName } from '@/lib/utils/format'

interface ReaderLoanHistoryProps {
  /** 借阅记录列表 */
  loans: LoanWithDetails[]
}

/**
 * 读者借阅历史时间线
 * @param props - 组件Props
 * @returns 借阅历史时间线组件
 */
export const ReaderLoanHistory: React.FC<ReaderLoanHistoryProps> = ({ loans }) => {
  return (
    <div className="space-y-6">
      {loans.map((loan, index) => {
        const status = getLoanStatus(loan)
        const isLast = index === loans.length - 1

        return (
          <div key={loan.id} className="flex gap-4">
            {/* 时间线竖线和圆点 */}
            <div className="flex flex-col items-center">
              {/* 圆点 */}
              <div
                className={`h-4 w-4 rounded-full border-2 mt-1 ${
                  status === 'overdue'
                    ? 'bg-red-500 border-red-500'
                    : status === 'returned'
                    ? 'bg-green-500 border-green-500'
                    : 'bg-orange-500 border-orange-500'
                }`}
              />
              {/* 竖线 */}
              {!isLast && (
                <div
                  className={`h-16 w-0.5 ${
                    status === 'overdue'
                      ? 'bg-red-200'
                      : status === 'returned'
                      ? 'bg-green-200'
                      : 'bg-orange-200'
                  }`}
                />
              )}
            </div>

            {/* 借阅记录内容 */}
            <div className="flex-1 pb-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                {/* 标题和状态 */}
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {loan.books.title}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getLoanStatusClassName(status)}`}>
                    {formatLoanStatus(status)}
                  </span>
                </div>

                {/* 日期信息 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                  {/* 借阅日期 */}
                  <div>
                    <p className="text-gray-500 text-xs mb-1">借阅日期</p>
                    <p className="font-medium text-gray-800">
                      📅 {formatDate(loan.loan_date)}
                    </p>
                  </div>

                  {/* 应还日期 */}
                  <div>
                    <p className="text-gray-500 text-xs mb-1">应还日期</p>
                    <p className={`font-medium ${
                      status === 'overdue'
                        ? 'text-red-600'
                        : 'text-gray-800'
                    }`}>
                      📆 {formatDate(loan.due_date)}
                    </p>
                  </div>

                  {/* 归还日期 */}
                  <div>
                    <p className="text-gray-500 text-xs mb-1">归还日期</p>
                    <p className="font-medium text-gray-800">
                      {loan.return_date ? `✅ ${formatDate(loan.return_date)}` : '- 未归还'}
                    </p>
                  </div>
                </div>

                {/* 额外信息 */}
                {status === 'overdue' && !loan.return_date && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    ⚠️ 该书已逾期，请尽快归还
                  </div>
                )}

                {loan.return_date && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                    ✅ 已于 {formatDate(loan.return_date)} 成功归还
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ReaderLoanHistory
