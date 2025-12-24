/**
 * 格式化工具函数库
 */

import type { LoanStatus } from '@/lib/types'

/**
 * 格式化数字（添加千位分隔符）
 * @param num - 要格式化的数字
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('zh-CN').format(num)
}

/**
 * 格式化借阅状态为中文标签
 * @param status - 借阅状态 ('active' | 'returned' | 'overdue')
 * @returns 中文状态标签
 */
export const formatLoanStatus = (status: LoanStatus): string => {
  const statusMap: Record<LoanStatus, string> = {
    active: '进行中',
    returned: '已归还',
    overdue: '已逾期',
  }
  return statusMap[status] || status
}

/**
 * 获取借阅状态的样式类名
 * @param status - 借阅状态
 * @returns Tailwind CSS 类名
 */
export const getLoanStatusClassName = (status: LoanStatus): string => {
  const classNameMap: Record<LoanStatus, string> = {
    active: 'bg-blue-100 text-blue-800 border-blue-300',
    returned: 'bg-green-100 text-green-800 border-green-300',
    overdue: 'bg-red-100 text-red-800 border-red-300',
  }
  return classNameMap[status] || ''
}

/**
 * 格式化百分比
 * @param value - 数值
 * @param total - 总数
 * @returns 百分比字符串 (例如: 50%)
 */
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%'
  const percentage = Math.round((value / total) * 100)
  return `${percentage}%`
}

/**
 * 截断长文本
 * @param text - 文本
 * @param maxLength - 最大长度
 * @returns 截断后的文本
 */
export const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * 格式化字节大小为人类可读的格式
 * @param bytes - 字节数
 * @returns 格式化后的文本
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 格式化持续时间（天数）为可读字符串
 * @param days - 天数
 * @returns 格式化后的字符串
 */
export const formatDuration = (days: number): string => {
  if (days <= 0) return '0天'
  if (days === 1) return '1天'
  if (days < 7) return `${days}天`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks}周`
  }
  const months = Math.floor(days / 30)
  return `${months}个月`
}

/**
 * 首字母大写
 * @param text - 文本
 * @returns 首字母大写后的文本
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
