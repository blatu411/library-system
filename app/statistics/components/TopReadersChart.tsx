/**
 * 活跃读者排行图表组件
 * 水平条形图展示读者借阅排行
 */

'use client'

import type { TopReader } from '@/lib/types'

interface TopReadersChartProps {
  /** 读者排行列表 */
  readers: TopReader[]
}

/**
 * 活跃读者排行图表
 * @param props - 组件Props
 * @returns 活跃读者排行图表
 */
export const TopReadersChart: React.FC<TopReadersChartProps> = ({ readers }) => {
  if (readers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无数据
      </div>
    )
  }

  // 找出最大的借阅次数用于计算百分比
  const maxLoans = Math.max(...readers.map((r) => r.loan_count), 1)

  return (
    <div className="space-y-4">
      {readers.map((reader, index) => {
        const percentage = (reader.loan_count / maxLoans) * 100
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
          <div key={reader.reader_id}>
            {/* 排行号 + 读者名称 + 数量 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {/* 排行号 */}
                <span className="text-sm font-bold text-gray-600 w-6">
                  {index + 1}.
                </span>
                {/* 读者名称 */}
                <span className="text-sm font-semibold text-gray-900">
                  {reader.reader_name}
                </span>
              </div>
              {/* 借阅次数 */}
              <span className="text-sm font-bold text-gray-700">
                {reader.loan_count} 次
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

export default TopReadersChart
