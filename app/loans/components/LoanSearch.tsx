/**
 * 借阅记录搜索组件
 * 支持搜索图书名或读者名，防抖优化
 */

'use client'

import { useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { debounce } from '@/lib/utils/debounce'

interface LoanSearchProps {
  /** 初始搜索词 */
  initialQuery: string
}

/**
 * 搜索输入组件
 * @param props - 组件Props
 * @returns 搜索输入组件
 */
export const LoanSearch: React.FC<LoanSearchProps> = ({ initialQuery }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)

  /**
   * 防抖搜索处理
   */
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      const params = new URLSearchParams(searchParams)
      if (searchQuery.trim()) {
        params.set('q', searchQuery)
      } else {
        params.delete('q')
      }
      params.set('page', '1') // 重置分页
      router.push(`/loans?${params.toString()}`)
    }, 300),
    [searchParams, router]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    debouncedSearch(newQuery)
  }

  const handleClear = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams)
    params.delete('q')
    params.set('page', '1')
    router.push(`/loans?${params.toString()}`)
  }

  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索图书名或读者名..."
          value={query}
          onChange={handleChange}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="清空搜索"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default LoanSearch
