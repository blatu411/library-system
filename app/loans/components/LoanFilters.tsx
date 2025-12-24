/**
 * 借阅记录筛选组件
 * 支持按借阅状态筛选
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface LoanFiltersProps {
  /** 初始筛选状态 */
  initialStatus: string
}

interface FilterOption {
  label: string
  value: string
  icon: string
}

/**
 * 状态筛选组件
 * @param props - 组件Props
 * @returns 筛选组件
 */
export const LoanFilters: React.FC<LoanFiltersProps> = ({ initialStatus }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filterOptions: FilterOption[] = [
    { label: '全部', value: 'all', icon: '📋' },
    { label: '进行中', value: 'active', icon: '⏳' },
    { label: '已归还', value: 'returned', icon: '✅' },
    { label: '逾期', value: 'overdue', icon: '⚠️' },
  ]

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }
    params.set('page', '1') // 重置分页
    router.push(`/loans?${params.toString()}`)
  }

  const handleClearFilters = () => {
    router.push('/loans')
  }

  return (
    <div className="space-y-4">
      {/* 状态筛选按钮 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          借阅状态
        </label>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                initialStatus === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 清空筛选按钮 */}
      {(initialStatus !== 'all' || searchParams.get('q')) && (
        <div>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
          >
            ↺ 清空所有筛选
          </button>
        </div>
      )}
    </div>
  )
}

export default LoanFilters
