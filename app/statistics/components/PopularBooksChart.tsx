/**
 * 热门图书排行图表组件
 * 水平条形图展示图书借阅排行
 */

'use client'

import type { PopularBook } from '@/lib/types'

interface PopularBooksChartProps {
  /** 热门图书列表 */
  books: PopularBook[]
}

/**
 * 热门图书排行图表
 * @param props - 组件Props
 * @returns 热门图书排行图表
 */
export const PopularBooksChart: React.FC<PopularBooksChartProps> = ({ books }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无数据
      </div>
    )
  }

  // 找出最大的借阅次数用于计算百分比
  const maxLoans = Math.max(...books.map((b) => b.loan_count), 1)

  return (
    <div className="space-y-4">
      {books.map((book, index) => {
        const percentage = (book.loan_count / maxLoans) * 100
        const bgColorClass = [
          'bg-gradient-to-r from-yellow-400 to-yellow-300',
          'bg-gradient-to-r from-gray-400 to-gray-300',
          'bg-gradient-to-r from-orange-400 to-orange-300',
          'bg-gradient-to-r from-blue-400 to-blue-300',
          'bg-gradient-to-r from-green-400 to-green-300',
          'bg-gradient-to-r from-purple-400 to-purple-300',
          'bg-gradient-to-r from-pink-400 to-pink-300',
          'bg-gradient-to-r from-indigo-400 to-indigo-300',
          'bg-gradient-to-r from-teal-400 to-teal-300',
          'bg-gradient-to-r from-cyan-400 to-cyan-300',
        ]
        const bgColor = bgColorClass[index % bgColorClass.length]

        return (
          <div key={book.book_id}>
            {/* 排行号 + 图书名称 + 数量 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1">
                {/* 排行号 */}
                <span className="text-sm font-bold text-gray-600 w-6">
                  {index + 1}.
                </span>
                {/* 图书名称 */}
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {book.book_title}
                </span>
              </div>
              {/* 借阅次数 */}
              <span className="text-sm font-bold text-gray-700 ml-2">
                {book.loan_count} 次
              </span>
            </div>

            {/* 条形 */}
            <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${bgColor} flex items-center justify-end pr-3`}
                style={{ width: `${percentage}%` }}
              >
                {percentage > 20 && (
                  <span className="text-xs font-bold text-white drop-shadow">
                    {Math.round(percentage)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PopularBooksChart
