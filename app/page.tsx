'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'

import type { Book, Reader } from '@/lib/types'
import { BorrowModal } from '@/app/components/BorrowModal'
import { getAllBooks, getBooksByStatus, updateBookStatus } from '@/lib/queries/books'
import { getAllReaders } from '@/lib/queries/readers'
import { createLoan, returnLoan, getLoansByBook } from '@/lib/queries/loans'
import { getTodayString } from '@/lib/utils/date'
import { debounce } from '@/lib/utils/debounce'

/**
 * 首页组件
 * 显示图书列表和读者列表，支持搜索和筛选
 */
export default function Home() {
  // ========== 数据状态 ==========
  const [allBooks, setAllBooks] = useState<Book[]>([])
  const [readers, setReaders] = useState<Reader[]>([])
  const [loading, setLoading] = useState(true)

  // ========== 交互状态 ==========
  const [showModal, setShowModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [borrowing, setBorrowing] = useState(false)

  // ========== 搜索和筛选状态 ==========
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'全部' | '在馆' | '借出'>('全部')

  /**
   * 初始化 - 加载图书和读者数据
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, readersData] = await Promise.all([
          getAllBooks(),
          getAllReaders(),
        ])
        setAllBooks(booksData)
        setReaders(readersData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  /**
   * 获取筛选和搜索后的图书列表
   */
  const filteredBooks = useMemo(() => {
    let result = allBooks

    // 1. 按状态筛选
    if (statusFilter !== '全部') {
      result = result.filter((book) => book.status === statusFilter)
    }

    // 2. 按标题和作者搜索
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((book) => {
        const titleMatch = book.title.toLowerCase().includes(query)
        const authorMatch = Array.isArray(book.authors)
          ? book.authors.some((a) => a.name.toLowerCase().includes(query))
          : book.authors?.name.toLowerCase().includes(query) ?? false
        return titleMatch || authorMatch
      })
    }

    return result
  }, [allBooks, statusFilter, searchQuery])

  /**
   * 防抖搜索处理
   */
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query)
    }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  /**
   * 获取状态颜色样式
   */
  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      '在馆': 'bg-green-100 text-green-800 border-green-300',
      '借出': 'bg-red-100 text-red-800 border-red-300',
      '丢失': 'bg-gray-100 text-gray-800 border-gray-300',
    }
    return colorMap[status] || ''
  }

  /**
   * 获取作者名称
   */
  const getAuthorName = (authors: Book['authors']): string => {
    if (Array.isArray(authors)) {
      return authors.map((a) => a.name).join('、')
    }
    return authors?.name || '未知'
  }

  /**
   * 打开借阅弹窗
   */
  const handleBorrowClick = (book: Book) => {
    setSelectedBook(book)
    setShowModal(true)
  }

  /**
   * 确认借阅
   */
  const handleConfirmBorrow = async (readerId: number, dueDate: string) => {
    if (!selectedBook) return

    setBorrowing(true)
    try {
      const today = getTodayString()

      // 1. 创建借阅记录（包含due_date）
      const result = await createLoan({
        book_id: selectedBook.id,
        reader_id: readerId,
        loan_date: today,
        due_date: dueDate,
      })

      if (!result.success) {
        throw new Error(result.error || '创建借阅记录失败')
      }

      // 2. 更新图书状态为'借出'
      const updateResult = await updateBookStatus(selectedBook.id, '借出')
      if (!updateResult.success) {
        throw new Error(updateResult.error || '更新图书状态失败')
      }

      // 3. 刷新数据
      const booksData = await getAllBooks()
      setAllBooks(booksData)
      setShowModal(false)

      // 显示成功提示
      alert('借阅成功！')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '借阅失败，请重试'
      console.error('Borrow failed:', error)
      alert(errorMsg)
    } finally {
      setBorrowing(false)
    }
  }

  /**
   * 归还图书
   */
  const handleReturnBook = async (book: Book) => {
    setBorrowing(true)
    try {
      // 1. 查询该书的未归还借阅记录
      const loans = await getLoansByBook(book.id)
      const activeLoan = loans.find((loan) => !loan.return_date)

      if (!activeLoan) {
        alert('未找到该书的借阅记录')
        return
      }

      // 2. 归还图书（更新return_date）
      const today = getTodayString()
      const returnResult = await returnLoan(activeLoan.id, today)

      if (!returnResult.success) {
        throw new Error(returnResult.error || '归还失败')
      }

      // 3. 更新图书状态为'在馆'
      const updateResult = await updateBookStatus(book.id, '在馆')
      if (!updateResult.success) {
        throw new Error(updateResult.error || '更新图书状态失败')
      }

      // 4. 刷新数据
      const booksData = await getAllBooks()
      setAllBooks(booksData)

      // 显示成功提示
      alert('还书成功！')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '还书失败，请重试'
      console.error('Return failed:', error)
      alert(errorMsg)
    } finally {
      setBorrowing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* 借阅弹窗 */}
      <BorrowModal
        isOpen={showModal}
        book={selectedBook}
        readers={readers}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmBorrow}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          📚 图书管理系统
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左边栏 - 图书列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                📖 图书列表
              </h2>

              {/* 搜索和筛选工具栏 */}
              <div className="mb-6 space-y-4">
                {/* 搜索框 */}
                <div>
                  <input
                    type="text"
                    placeholder="搜索图书名称或作者..."
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* 状态筛选 */}
                <div className="flex gap-2 flex-wrap">
                  {(['全部', '在馆', '借出'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        statusFilter === status
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* 图书列表 */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="text-gray-500">加载中...</div>
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {allBooks.length === 0 ? '暂无图书' : '搜索结果为空'}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            作者：{getAuthorName(book.authors)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(
                              book.status
                            )}`}
                          >
                            {book.status}
                          </span>
                          {book.status === '在馆' && (
                            <button
                              onClick={() => handleBorrowClick(book)}
                              disabled={borrowing}
                              className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-sm font-medium whitespace-nowrap"
                            >
                              借阅
                            </button>
                          )}
                          {book.status === '借出' && (
                            <button
                              onClick={() => handleReturnBook(book)}
                              disabled={borrowing}
                              className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors text-sm font-medium whitespace-nowrap"
                            >
                              还书
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右边栏 - 读者列表 */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                👥 读者列表
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="text-gray-500">加载中...</div>
                </div>
              ) : readers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  暂无读者
                </div>
              ) : (
                <div className="space-y-3">
                  {readers.map((reader) => (
                    <div
                      key={reader.id}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-purple-300"
                    >
                      <p className="text-gray-800 font-medium">{reader.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
