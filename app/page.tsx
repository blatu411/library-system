'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Book {
  id: number
  title: string
  status: '在馆' | '借出' | '丢失'
  authors: { name: string }
}

interface Reader {
  id: number
  name: string
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [readers, setReaders] = useState<Reader[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedReader, setSelectedReader] = useState<number | null>(null)
  const [borrowing, setBorrowing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取图书信息（联表查询）
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('id, title, status, authors(name)')

        if (booksError) throw booksError
        setBooks(booksData || [])

        // 获取读者信息
        const { data: readersData, error: readersError } = await supabase
          .from('readers')
          .select('id, name')

        if (readersError) throw readersError
        setReaders(readersData || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case '在馆':
        return 'bg-green-100 text-green-800 border-green-300'
      case '借出':
        return 'bg-red-100 text-red-800 border-red-300'
      case '丢失':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleBorrowClick = (book: Book) => {
    setSelectedBook(book)
    setSelectedReader(null)
    setShowModal(true)
  }

  const handleConfirmBorrow = async () => {
    if (!selectedBook || !selectedReader) {
      alert('请选择读者')
      return
    }

    setBorrowing(true)
    try {
      const today = new Date().toISOString().split('T')[0]

      // 1. 在 loans 表插入记录
      const { error: loanError } = await supabase
        .from('loans')
        .insert([
          {
            book_id: selectedBook.id,
            reader_id: selectedReader,
            loan_date: today,
            return_date: null,
          },
        ])

      if (loanError) throw loanError

      // 2. 更新 books 表状态为 '借出'
      const { error: updateError } = await supabase
        .from('books')
        .update({ status: '借出' })
        .eq('id', selectedBook.id)

      if (updateError) throw updateError

      alert('借阅成功！')
      setShowModal(false)

      // 刷新数据
      const { data: booksData } = await supabase
        .from('books')
        .select('id, title, status, authors(name)')
      setBooks(booksData || [])
    } catch (error) {
      console.error('Borrow failed:', error)
      alert('借阅失败，请重试')
    } finally {
      setBorrowing(false)
    }
  }

  const handleReturnBook = async (book: Book) => {
    setBorrowing(true)
    try {
      // 1. 查询该书最近一条未归还的 loans 记录（return_date 为 NULL）
      const { data: loans, error: queryError } = await supabase
        .from('loans')
        .select('id')
        .eq('book_id', book.id)
        .is('return_date', null)
        .order('loan_date', { ascending: false })
        .limit(1)

      if (queryError) throw queryError

      if (!loans || loans.length === 0) {
        alert('未找到该书的借阅记录')
        return
      }

      const loanId = loans[0].id
      const today = new Date().toISOString().split('T')[0]

      // 2. 更新 loans 表的 return_date
      const { error: updateLoanError } = await supabase
        .from('loans')
        .update({ return_date: today })
        .eq('id', loanId)

      if (updateLoanError) throw updateLoanError

      // 3. 更新 books 表的 status 为 '在馆'
      const { error: updateBookError } = await supabase
        .from('books')
        .update({ status: '在馆' })
        .eq('id', book.id)

      if (updateBookError) throw updateBookError

      alert('还书成功！')

      // 刷新数据
      const { data: booksData } = await supabase
        .from('books')
        .select('id, title, status, authors(name)')
      setBooks(booksData || [])
    } catch (error) {
      console.error('Return failed:', error)
      alert('还书失败，请重试')
    } finally {
      setBorrowing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* 借阅弹窗 */}
      {showModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              借阅《{selectedBook.title}》
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                选择读者：
              </label>
              <select
                value={selectedReader || ''}
                onChange={(e) => setSelectedReader(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">-- 请选择读者 --</option>
                {readers.map((reader) => (
                  <option key={reader.id} value={reader.id}>
                    {reader.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={borrowing}
              >
                取消
              </button>
              <button
                onClick={handleConfirmBorrow}
                disabled={borrowing || !selectedReader}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-medium"
              >
                {borrowing ? '处理中...' : '确认借阅'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
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

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="text-gray-500">加载中...</div>
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  暂无图书
                </div>
              ) : (
                <div className="space-y-4">
                  {books.map((book) => (
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
                            作者：{book.authors?.name || '未知'}
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
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
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
                      className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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
