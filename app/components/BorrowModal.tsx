/**
 * 借阅弹窗组件
 * 支持自定义借阅期限（7天/14天/30天/自定义日期）
 * 实时显示预计归还日期
 */

'use client'

import { useState } from 'react'

import type { Book, Reader } from '@/lib/types'
import { BORROW_PERIOD_OPTIONS, BORROW_PERIOD_LABELS } from '@/lib/constants'
import { calculateDueDate, formatDate, getTodayString } from '@/lib/utils/date'

/**
 * 借阅弹窗Props接口
 */
interface BorrowModalProps {
  /** 是否打开弹窗 */
  isOpen: boolean
  /** 选中的图书对象 */
  book: Book | null
  /** 可用的读者列表 */
  readers: Reader[]
  /** 关闭弹窗的回调函数 */
  onClose: () => void
  /** 确认借阅的回调函数 */
  onConfirm: (readerId: number, dueDate: string) => Promise<void>
}

/**
 * 借阅弹窗组件
 * @param props - 组件Props
 * @returns 借阅弹窗组件
 */
export const BorrowModal: React.FC<BorrowModalProps> = ({
  isOpen,
  book,
  readers,
  onClose,
  onConfirm,
}) => {
  // 状态管理
  const [selectedReaderId, setSelectedReaderId] = useState<number | null>(null)
  const [borrowPeriod, setBorrowPeriod] = useState<keyof typeof BORROW_PERIOD_OPTIONS>(
    'TWO_WEEKS'
  )
  const [isCustomPeriod, setIsCustomPeriod] = useState(false)
  const [customDate, setCustomDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 不显示则返回null
  if (!isOpen || !book) {
    return null
  }

  // 计算应还日期
  const today = getTodayString()
  const dueDate = isCustomPeriod
    ? customDate
    : calculateDueDate(today, BORROW_PERIOD_OPTIONS[borrowPeriod])

  /**
   * 验证表单
   * @returns 是否有效
   */
  const isValid = (): boolean => {
    // 检查是否选择了读者
    if (!selectedReaderId) {
      setError('请选择读者')
      return false
    }

    // 检查自定义日期是否有效
    if (isCustomPeriod) {
      if (!customDate) {
        setError('请选择归还日期')
        return false
      }

      // 验证日期不能早于今天
      if (customDate < today) {
        setError('归还日期不能早于今天')
        return false
      }
    }

    setError(null)
    return true
  }

  /**
   * 处理确认借阅
   */
  const handleConfirm = async () => {
    // 验证表单
    if (!isValid()) {
      return
    }

    setIsLoading(true)
    try {
      await onConfirm(selectedReaderId!, dueDate)
      // 重置状态
      setSelectedReaderId(null)
      setBorrowPeriod('TWO_WEEKS')
      setIsCustomPeriod(false)
      setCustomDate('')
      setError(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '借阅失败，请重试'
      setError(errorMsg)
      console.error('Borrow failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 处理关闭弹窗
   */
  const handleClose = () => {
    // 重置状态
    setSelectedReaderId(null)
    setBorrowPeriod('TWO_WEEKS')
    setIsCustomPeriod(false)
    setCustomDate('')
    setError(null)
    onClose()
  }

  return (
    // 背景遮罩
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* 弹窗容器 */}
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in">
        {/* 标题 */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            借阅《{book.title}》
          </h3>
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="关闭"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 读者选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择读者 *
          </label>
          <select
            value={selectedReaderId || ''}
            onChange={(e) => setSelectedReaderId(Number(e.target.value) || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            disabled={isLoading}
          >
            <option value="">-- 请选择读者 --</option>
            {readers.map((reader) => (
              <option key={reader.id} value={reader.id}>
                {reader.name}
              </option>
            ))}
          </select>
        </div>

        {/* 借阅期限选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            借阅期限 *
          </label>

          {/* 预设期限选项 */}
          <div className="space-y-2 mb-4">
            {Object.entries(BORROW_PERIOD_OPTIONS).map(([key, days]) => (
              <label key={key} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="borrowPeriod"
                  value={key}
                  checked={!isCustomPeriod && borrowPeriod === key}
                  onChange={() => {
                    setBorrowPeriod(key as keyof typeof BORROW_PERIOD_OPTIONS)
                    setIsCustomPeriod(false)
                  }}
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700">
                  {BORROW_PERIOD_LABELS[days as keyof typeof BORROW_PERIOD_LABELS]}
                </span>
              </label>
            ))}

            {/* 自定义期限选项 */}
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="borrowPeriod"
                checked={isCustomPeriod}
                onChange={() => setIsCustomPeriod(true)}
                disabled={isLoading}
                className="w-4 h-4 text-blue-500 cursor-pointer"
              />
              <span className="ml-3 text-gray-700">自定义日期</span>
            </label>
          </div>

          {/* 自定义日期输入 */}
          {isCustomPeriod && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              min={today}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          )}
        </div>

        {/* 预计归还日期显示 */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">预计归还日期</p>
          <p className="text-lg font-semibold text-blue-600">
            {dueDate ? formatDate(dueDate) : '请选择期限'}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors font-medium"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !selectedReaderId}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? '处理中...' : '确认借阅'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BorrowModal
