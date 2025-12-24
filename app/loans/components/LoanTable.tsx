/**
 * 借阅记录表格组件
 * 展示借阅记录列表，支持行点击跳转到读者页面
 */

'use client'

import Link from 'next/link'

import type { LoanWithDetails } from '@/lib/types'
import { formatDate, getLoanStatus, getDaysRemaining } from '@/lib/utils/date'
import { formatLoanStatus, getLoanStatusClassName } from '@/lib/utils/format'

interface LoanTableProps {
  /** 借阅记录列表 */
  loans: LoanWithDetails[]
}

/**
 * 借阅记录表格
 * @param props - 组件Props
 * @returns 借阅记录表格组件
 */
export const LoanTable: React.FC<LoanTableProps> = ({ loans }) => {
  return (
    <div className="overflow-x-auto">
      {/* 桌面端表格视图 */}
      <table className="hidden md:table w-full">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">图书名称</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">读者名称</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">借阅日期</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">应还日期</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">归还日期</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">状态</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">剩余天数</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loans.map((loan) => {
            const status = getLoanStatus(loan)
            const daysRemaining = getDaysRemaining(loan.due_date)
            const isOverdue = status === 'overdue'

            return (
              <tr
                key={loan.id}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {loan.books.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <Link
                    href={`/readers/${loan.reader_id}`}
                    className="text-blue-500 hover:text-blue-700 hover:underline transition-colors"
                  >
                    {loan.readers.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(loan.loan_date)}
                </td>
                <td className={`px-6 py-4 text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                  {formatDate(loan.due_date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {loan.return_date ? formatDate(loan.return_date) : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLoanStatusClassName(status)}`}>
                    {formatLoanStatus(status)}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-semibold ${
                  isOverdue
                    ? 'text-red-600'
                    : daysRemaining <= 3
                    ? 'text-orange-600'
                    : 'text-gray-600'
                }`}>
                  {loan.return_date ? '-' : `${daysRemaining}天`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* 移动端卡片视图 */}
      <div className="md:hidden space-y-4">
        {loans.map((loan) => {
          const status = getLoanStatus(loan)
          const daysRemaining = getDaysRemaining(loan.due_date)
          const isOverdue = status === 'overdue'

          return (
            <div
              key={loan.id}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {loan.books.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    读者：
                    <Link
                      href={`/readers/${loan.reader_id}`}
                      className="text-blue-500 hover:text-blue-700 hover:underline ml-1"
                    >
                      {loan.readers.name}
                    </Link>
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getLoanStatusClassName(status)}`}>
                  {formatLoanStatus(status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500 text-xs">借阅日期</p>
                  <p className="font-medium text-gray-800">{formatDate(loan.loan_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">应还日期</p>
                  <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                    {formatDate(loan.due_date)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">归还日期</p>
                  <p className="font-medium text-gray-800">
                    {loan.return_date ? formatDate(loan.return_date) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">剩余天数</p>
                  <p className={`font-medium ${
                    isOverdue
                      ? 'text-red-600'
                      : daysRemaining <= 3
                      ? 'text-orange-600'
                      : 'text-gray-800'
                  }`}>
                    {loan.return_date ? '-' : `${daysRemaining}天`}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LoanTable
