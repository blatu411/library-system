/**
 * 图书查询模块
 * 包含所有与图书相关的数据库操作
 */

import { supabase } from '@/lib/supabase'
import type { Book, BookStatus } from '@/lib/types'

/**
 * 获取所有图书（含作者信息）
 * @returns 图书列表
 */
export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('id, title, status, author_id, authors(name)')
      .order('id', { ascending: true })

    if (error) throw error

    return (data as Book[]) || []
  } catch (error) {
    console.error('Failed to fetch all books:', error)
    return []
  }
}

/**
 * 按ID获取单本图书
 * @param bookId - 图书ID
 * @returns 图书详情
 */
export const getBookById = async (bookId: number): Promise<Book | null> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('id, title, status, author_id, authors(name)')
      .eq('id', bookId)
      .single()

    if (error) throw error

    return (data as Book) || null
  } catch (error) {
    console.error(`Failed to fetch book ${bookId}:`, error)
    return null
  }
}

/**
 * 按状态查询图书
 * @param status - 图书状态 ('在馆' | '借出' | '丢失')
 * @returns 图书列表
 */
export const getBooksByStatus = async (status: BookStatus): Promise<Book[]> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('id, title, status, author_id, authors(name)')
      .eq('status', status)
      .order('id', { ascending: true })

    if (error) throw error

    return (data as Book[]) || []
  } catch (error) {
    console.error(`Failed to fetch books with status ${status}:`, error)
    return []
  }
}

/**
 * 按作者ID查询图书
 * @param authorId - 作者ID
 * @returns 图书列表
 */
export const getBooksByAuthor = async (authorId: number): Promise<Book[]> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('id, title, status, author_id, authors(name)')
      .eq('author_id', authorId)
      .order('id', { ascending: true })

    if (error) throw error

    return (data as Book[]) || []
  } catch (error) {
    console.error(`Failed to fetch books by author ${authorId}:`, error)
    return []
  }
}

/**
 * 搜索图书（按标题搜索）
 * @param keyword - 搜索关键词
 * @returns 匹配的图书列表
 */
export const searchBooks = async (keyword: string): Promise<Book[]> => {
  try {
    if (!keyword || keyword.trim() === '') {
      return await getAllBooks()
    }

    const { data, error } = await supabase
      .from('books')
      .select('id, title, status, author_id, authors(name)')
      .ilike('title', `%${keyword}%`)
      .order('id', { ascending: true })

    if (error) throw error

    return (data as Book[]) || []
  } catch (error) {
    console.error(`Failed to search books with keyword "${keyword}":`, error)
    return []
  }
}

/**
 * 更新图书状态
 * @param bookId - 图书ID
 * @param status - 新的状态
 * @returns 操作结果
 */
export const updateBookStatus = async (
  bookId: number,
  status: BookStatus
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('books')
      .update({ status })
      .eq('id', bookId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    console.error(`Failed to update book ${bookId} status:`, error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * 统计图书总数
 * @returns 图书总数
 */
export const getBooksCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    return count || 0
  } catch (error) {
    console.error('Failed to count books:', error)
    return 0
  }
}

/**
 * 统计在馆图书数
 * @returns 在馆数量
 */
export const getAvailableBooksCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('status', '在馆')

    if (error) throw error

    return count || 0
  } catch (error) {
    console.error('Failed to count available books:', error)
    return 0
  }
}

/**
 * 统计借出图书数
 * @returns 借出数量
 */
export const getBorrowedBooksCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('status', '借出')

    if (error) throw error

    return count || 0
  } catch (error) {
    console.error('Failed to count borrowed books:', error)
    return 0
  }
}
