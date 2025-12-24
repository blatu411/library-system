/**
 * 统计数据查询模块
 * 包含所有统计和分析相关的数据库操作
 */

import { supabase } from '@/lib/supabase'
import type { OverallStats, TopReader, PopularBook, LoanTrendItem } from '@/lib/types'
import {
  getLoansCount,
  getActivLoansCount,
} from './loans'
import {
  getBooksCount,
} from './books'
import {
  getReadersCount,
} from './readers'

/**
 * 获取总体统计信息
 * @returns 总体统计对象
 */
export const getOverallStats = async (): Promise<OverallStats> => {
  try {
    const [totalLoans, activeLoans, totalReaders, totalBooks] = await Promise.all([
      getLoansCount(),
      getActivLoansCount(),
      getReadersCount(),
      getBooksCount(),
    ])

    return {
      totalLoans,
      activeLoans,
      totalReaders,
      totalBooks,
    }
  } catch (error) {
    console.error('Failed to fetch overall stats:', error)
    return {
      totalLoans: 0,
      activeLoans: 0,
      totalReaders: 0,
      totalBooks: 0,
    }
  }
}

/**
 * 获取活跃读者排行（按借阅次数排序）
 * @param limit - 返回的排行数量
 * @returns 活跃读者列表
 */
export const getTopReaders = async (limit: number = 10): Promise<TopReader[]> => {
  try {
    // 获取所有借阅记录和读者信息
    const { data: loans, error: loansError } = await supabase
      .from('loans')
      .select('reader_id')

    if (loansError) throw loansError

    // 统计每个读者的借阅次数
    const readerCounts: Record<number, number> = {}
    loans?.forEach((loan) => {
      readerCounts[loan.reader_id] = (readerCounts[loan.reader_id] || 0) + 1
    })

    // 获取读者信息
    const readerIds = Object.keys(readerCounts).map(Number)
    const { data: readers, error: readersError } = await supabase
      .from('readers')
      .select('id, name')
      .in('id', readerIds)

    if (readersError) throw readersError

    // 合并数据并排序
    const topReaders: TopReader[] = readers
      ?.map((reader) => ({
        reader_id: reader.id,
        reader_name: reader.name,
        loan_count: readerCounts[reader.id] || 0,
      }))
      .sort((a, b) => b.loan_count - a.loan_count)
      .slice(0, limit) || []

    return topReaders
  } catch (error) {
    console.error('Failed to fetch top readers:', error)
    return []
  }
}

/**
 * 获取热门图书排行（按借阅次数排序）
 * @param limit - 返回的排行数量
 * @returns 热门图书列表
 */
export const getPopularBooks = async (limit: number = 10): Promise<PopularBook[]> => {
  try {
    // 获取所有借阅记录和图书信息
    const { data: loans, error: loansError } = await supabase
      .from('loans')
      .select('book_id')

    if (loansError) throw loansError

    // 统计每本图书的借阅次数
    const bookCounts: Record<number, number> = {}
    loans?.forEach((loan) => {
      bookCounts[loan.book_id] = (bookCounts[loan.book_id] || 0) + 1
    })

    // 获取图书信息
    const bookIds = Object.keys(bookCounts).map(Number)
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, title')
      .in('id', bookIds)

    if (booksError) throw booksError

    // 合并数据并排序
    const popularBooks: PopularBook[] = books
      ?.map((book) => ({
        book_id: book.id,
        book_title: book.title,
        loan_count: bookCounts[book.id] || 0,
      }))
      .sort((a, b) => b.loan_count - a.loan_count)
      .slice(0, limit) || []

    return popularBooks
  } catch (error) {
    console.error('Failed to fetch popular books:', error)
    return []
  }
}

/**
 * 获取借阅趋势数据（按日期统计借阅次数）
 * @param days - 统计天数
 * @returns 趋势数据列表
 */
export const getLoanTrend = async (days: number = 30): Promise<LoanTrendItem[]> => {
  try {
    // 计算起始日期
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // 获取指定时间范围内的所有借阅记录
    const { data: loans, error } = await supabase
      .from('loans')
      .select('loan_date')
      .gte('loan_date', startDateStr)
      .lte('loan_date', endDateStr)

    if (error) throw error

    // 按日期统计
    const trendMap: Record<string, number> = {}

    // 初始化所有日期的计数为0
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      trendMap[dateStr] = 0
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // 统计实际数据
    loans?.forEach((loan) => {
      const date = loan.loan_date
      trendMap[date] = (trendMap[date] || 0) + 1
    })

    // 转换为数组格式
    const trend: LoanTrendItem[] = Object.entries(trendMap)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, count]) => ({ date, count }))

    return trend
  } catch (error) {
    console.error('Failed to fetch loan trend:', error)
    return []
  }
}

/**
 * 获取某读者的借阅排行位置
 * @param readerId - 读者ID
 * @returns 排行位置（1为最高）或-1（未在排行内）
 */
export const getReaderRank = async (readerId: number): Promise<number> => {
  try {
    const topReaders = await getTopReaders(100)
    const rank = topReaders.findIndex((r) => r.reader_id === readerId)
    return rank >= 0 ? rank + 1 : -1
  } catch (error) {
    console.error(`Failed to fetch reader rank for reader ${readerId}:`, error)
    return -1
  }
}

/**
 * 获取某图书的借阅排行位置
 * @param bookId - 图书ID
 * @returns 排行位置（1为最高）或-1（未在排行内）
 */
export const getBookRank = async (bookId: number): Promise<number> => {
  try {
    const popularBooks = await getPopularBooks(100)
    const rank = popularBooks.findIndex((b) => b.book_id === bookId)
    return rank >= 0 ? rank + 1 : -1
  } catch (error) {
    console.error(`Failed to fetch book rank for book ${bookId}:`, error)
    return -1
  }
}

/**
 * 获取借阅最活跃的时间段（按小时）
 * @returns 借阅活跃度统计
 */
export const getPeakHours = async (): Promise<Record<number, number>> => {
  try {
    const { data: loans, error } = await supabase
      .from('loans')
      .select('created_at')
      .not('created_at', 'is', null)

    if (error) throw error

    // 统计每小时的借阅数
    const hourCounts: Record<number, number> = {}

    loans?.forEach((loan) => {
      if (loan.created_at) {
        const hour = new Date(loan.created_at).getHours()
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      }
    })

    return hourCounts
  } catch (error) {
    console.error('Failed to fetch peak hours:', error)
    return {}
  }
}
