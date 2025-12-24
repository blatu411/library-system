/**
 * 读者查询模块
 * 包含所有与读者相关的数据库操作
 */

import { supabase } from '@/lib/supabase'
import type { Reader, ReaderStats } from '@/lib/types'
import { getActivLoansCount } from './loans'

/**
 * 获取所有读者
 * @returns 读者列表
 */
export const getAllReaders = async (): Promise<Reader[]> => {
  try {
    const { data, error } = await supabase
      .from('readers')
      .select('id, name')
      .order('id', { ascending: true })

    if (error) throw error

    return (data as Reader[]) || []
  } catch (error) {
    console.error('Failed to fetch all readers:', error)
    return []
  }
}

/**
 * 按ID获取单个读者
 * @param readerId - 读者ID
 * @returns 读者详情
 */
export const getReaderById = async (readerId: number): Promise<Reader | null> => {
  try {
    const { data, error } = await supabase
      .from('readers')
      .select('id, name')
      .eq('id', readerId)
      .single()

    if (error) throw error

    return (data as Reader) || null
  } catch (error) {
    console.error(`Failed to fetch reader ${readerId}:`, error)
    return null
  }
}

/**
 * 搜索读者（按姓名搜索）
 * @param keyword - 搜索关键词
 * @returns 匹配的读者列表
 */
export const searchReaders = async (keyword: string): Promise<Reader[]> => {
  try {
    if (!keyword || keyword.trim() === '') {
      return await getAllReaders()
    }

    const { data, error } = await supabase
      .from('readers')
      .select('id, name')
      .ilike('name', `%${keyword}%`)
      .order('id', { ascending: true })

    if (error) throw error

    return (data as Reader[]) || []
  } catch (error) {
    console.error(`Failed to search readers with keyword "${keyword}":`, error)
    return []
  }
}

/**
 * 获取读者的借阅统计信息
 * @param readerId - 读者ID
 * @returns 读者统计信息
 */
export const getReaderStats = async (readerId: number): Promise<ReaderStats> => {
  try {
    // 1. 获取总借阅次数
    const { count: totalLoans, error: totalError } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })
      .eq('reader_id', readerId)

    if (totalError) throw totalError

    // 2. 获取当前借阅数（未归还）
    const { count: activeLoans, error: activeError } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })
      .eq('reader_id', readerId)
      .is('return_date', null)

    if (activeError) throw activeError

    // 3. 获取逾期借阅数
    const today = new Date().toISOString().split('T')[0]
    const { count: overdueLoans, error: overdueError } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })
      .eq('reader_id', readerId)
      .is('return_date', null)
      .lt('due_date', today)

    if (overdueError) throw overdueError

    return {
      totalLoans: totalLoans || 0,
      activeLoans: activeLoans || 0,
      overdueLoans: overdueLoans || 0,
    }
  } catch (error) {
    console.error(`Failed to fetch reader stats for reader ${readerId}:`, error)
    return {
      totalLoans: 0,
      activeLoans: 0,
      overdueLoans: 0,
    }
  }
}

/**
 * 统计读者总数
 * @returns 读者总数
 */
export const getReadersCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('readers')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    return count || 0
  } catch (error) {
    console.error('Failed to count readers:', error)
    return 0
  }
}

/**
 * 获取有借阅记录的读者数
 * @returns 读者数量
 */
export const getActiveReadersCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('loans')
      .select('reader_id', { count: 'exact', head: true })
      .neq('reader_id', -1) // 排除无效读者

    if (error) throw error

    // 注意：这个计数可能有重复，实际应该用 DISTINCT
    return count || 0
  } catch (error) {
    console.error('Failed to count active readers:', error)
    return 0
  }
}

/**
 * 获取借阅最频繁的读者ID列表
 * @param limit - 返回数量限制
 * @returns 读者ID列表（按借阅次数降序）
 */
export const getTopReaderIds = async (limit: number = 10): Promise<number[]> => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select('reader_id')
      .order('reader_id', { ascending: true })

    if (error) throw error

    // 在前端统计（因为Supabase查询限制）
    const readerCounts: Record<number, number> = {}
    data?.forEach((loan) => {
      readerCounts[loan.reader_id] = (readerCounts[loan.reader_id] || 0) + 1
    })

    // 排序并返回top N
    const topReaders = Object.entries(readerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([readerId]) => Number(readerId))

    return topReaders
  } catch (error) {
    console.error('Failed to get top reader IDs:', error)
    return []
  }
}
