/**
 * 日期处理工具函数库
 */

import type { Loan } from '@/lib/types'

/**
 * 格式化日期字符串
 * @param dateString - YYYY-MM-DD 格式的日期字符串
 * @returns 格式化后的日期 (例如: 2024-01-15)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch (error) {
    console.error('Failed to format date:', error)
    return dateString
  }
}

/**
 * 计算应还日期
 * @param loanDate - 借阅日期 (YYYY-MM-DD)
 * @param days - 借阅天数
 * @returns 应还日期 (YYYY-MM-DD)
 */
export const calculateDueDate = (loanDate: string, days: number): string => {
  try {
    const date = new Date(loanDate + 'T00:00:00')
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.error('Failed to calculate due date:', error)
    return loanDate
  }
}

/**
 * 检查借阅是否逾期
 * @param loan - 借阅记录
 * @returns 是否逾期
 */
export const isOverdue = (loan: Loan): boolean => {
  // 已归还的借阅记录不逾期
  if (loan.return_date) return false

  const today = new Date().toISOString().split('T')[0]
  return loan.due_date < today
}

/**
 * 获取借阅状态
 * @param loan - 借阅记录
 * @returns 借阅状态 ('active' | 'returned' | 'overdue')
 */
export const getLoanStatus = (
  loan: Loan
): 'active' | 'returned' | 'overdue' => {
  // 已归还
  if (loan.return_date) return 'returned'

  // 检查是否逾期
  const today = new Date().toISOString().split('T')[0]
  if (loan.due_date < today) return 'overdue'

  return 'active'
}

/**
 * 获取剩余借阅天数
 * @param dueDate - 应还日期
 * @returns 剩余天数 (负数表示已逾期)
 */
export const getDaysRemaining = (dueDate: string): number => {
  const today = new Date().toISOString().split('T')[0]
  const dueDateObj = new Date(dueDate + 'T00:00:00')
  const todayObj = new Date(today + 'T00:00:00')

  const diffTime = dueDateObj.getTime() - todayObj.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * 获取逾期天数
 * @param dueDate - 应还日期
 * @returns 逾期天数 (0表示未逾期)
 */
export const getDaysOverdue = (dueDate: string): number => {
  const remainingDays = getDaysRemaining(dueDate)
  return remainingDays < 0 ? Math.abs(remainingDays) : 0
}

/**
 * 获取当前日期 (YYYY-MM-DD 格式)
 * @returns 当前日期字符串
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0]
}

/**
 * 检查日期是否有效
 * @param dateString - 日期字符串 (YYYY-MM-DD)
 * @returns 是否有效
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false
  const date = new Date(dateString + 'T00:00:00')
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * 获取日期范围内的天数
 * @param startDate - 开始日期 (YYYY-MM-DD)
 * @param endDate - 结束日期 (YYYY-MM-DD)
 * @returns 天数
 */
export const getDaysBetween = (
  startDate: string,
  endDate: string
): number => {
  try {
    const start = new Date(startDate + 'T00:00:00')
    const end = new Date(endDate + 'T00:00:00')
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch (error) {
    console.error('Failed to calculate days between:', error)
    return 0
  }
}
