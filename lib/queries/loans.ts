/**
 * 借阅记录查询模块
 * 包含所有与借阅相关的数据库操作
 */

import { supabase } from '@/lib/supabase'
import type { Loan, LoanWithDetails, CreateLoanRequest } from '@/lib/types'

/**
 * 获取所有借阅记录（含关联的图书和读者信息）
 * @returns 借阅记录列表
 */
export const getAllLoans = async (): Promise<LoanWithDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select(
        `
        id,
        loan_date,
        due_date,
        return_date,
        created_at,
        updated_at,
        books (
          id,
          title,
          authors (name)
        ),
        readers (
          id,
          name
        )
      `
      )
      .order('loan_date', { ascending: false })

    if (error) throw error

    return (data as unknown as LoanWithDetails[]) || []
  } catch (error) {
    console.error('Failed to fetch all loans:', error)
    return []
  }
}

/**
 * 按ID获取单条借阅记录
 * @param loanId - 借阅记录ID
 * @returns 借阅记录详情
 */
export const getLoanById = async (loanId: number): Promise<LoanWithDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select(
        `
        id,
        loan_date,
        due_date,
        return_date,
        created_at,
        updated_at,
        books (
          id,
          title,
          authors (name)
        ),
        readers (
          id,
          name
        )
      `
      )
      .eq('id', loanId)
      .single()

    if (error) throw error

    return (data as unknown as LoanWithDetails) || null
  } catch (error) {
    console.error(`Failed to fetch loan ${loanId}:`, error)
    return null
  }
}

/**
 * 获取指定读者的所有借阅记录
 * @param readerId - 读者ID
 * @returns 借阅记录列表
 */
export const getLoansByReader = async (readerId: number): Promise<LoanWithDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select(
        `
        id,
        loan_date,
        due_date,
        return_date,
        created_at,
        updated_at,
        books (
          id,
          title,
          authors (name)
        ),
        readers (
          id,
          name
        )
      `
      )
      .eq('reader_id', readerId)
      .order('loan_date', { ascending: false })

    if (error) throw error

    return (data as unknown as LoanWithDetails[]) || []
  } catch (error) {
    console.error(`Failed to fetch loans for reader ${readerId}:`, error)
    return []
  }
}

/**
 * 获取指定图书的所有借阅记录
 * @param bookId - 图书ID
 * @returns 借阅记录列表
 */
export const getLoansByBook = async (bookId: number): Promise<LoanWithDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select(
        `
        id,
        loan_date,
        due_date,
        return_date,
        created_at,
        updated_at,
        books (
          id,
          title,
          authors (name)
        ),
        readers (
          id,
          name
        )
      `
      )
      .eq('book_id', bookId)
      .order('loan_date', { ascending: false })

    if (error) throw error

    return (data as unknown as LoanWithDetails[]) || []
  } catch (error) {
    console.error(`Failed to fetch loans for book ${bookId}:`, error)
    return []
  }
}

/**
 * 创建新的借阅记录
 * @param request - 借阅请求参数 { book_id, reader_id, loan_date, due_date }
 * @returns 创建的借阅记录或错误
 */
export const createLoan = async (
  request: CreateLoanRequest
): Promise<{ success: boolean; loan?: Loan; error?: string }> => {
  try {
    const { book_id, reader_id, loan_date, due_date } = request

    const { data, error } = await supabase
      .from('loans')
      .insert([
        {
          book_id,
          reader_id,
          loan_date,
          due_date,
          return_date: null,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      loan: data as Loan,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    console.error('Failed to create loan:', error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * 归还图书（更新borrowal记录的return_date）
 * @param loanId - 借阅记录ID
 * @param returnDate - 归还日期
 * @returns 操作结果
 */
export const returnLoan = async (
  loanId: number,
  returnDate: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('loans')
      .update({ return_date: returnDate })
      .eq('id', loanId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    console.error(`Failed to return loan ${loanId}:`, error)
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * 获取未归还的借阅记录（进行中的借阅）
 * @returns 未归还的借阅记录列表
 */
export const getActivLoans = async (): Promise<LoanWithDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select(
        `
        id,
        loan_date,
        due_date,
        return_date,
        created_at,
        updated_at,
        books (
          id,
          title,
          authors (name)
        ),
        readers (
          id,
          name
        )
      `
      )
      .is('return_date', null)
      .order('loan_date', { ascending: false })

    if (error) throw error

    return (data as unknown as LoanWithDetails[]) || []
  } catch (error) {
    console.error('Failed to fetch active loans:', error)
    return []
  }
}

/**
 * 获取指定读者最近的未归还借阅记录
 * @param readerId - 读者ID
 * @returns 最近一条未归还的借阅记录
 */
export const getReaderLatestActiveLoan = async (
  readerId: number
): Promise<LoanWithDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select(
        `
        id,
        loan_date,
        due_date,
        return_date,
        created_at,
        updated_at,
        books (
          id,
          title,
          authors (name)
        ),
        readers (
          id,
          name
        )
      `
      )
      .eq('reader_id', readerId)
      .is('return_date', null)
      .order('loan_date', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return (data as unknown as LoanWithDetails) || null
  } catch (error) {
    console.error(`Failed to fetch latest active loan for reader ${readerId}:`, error)
    return null
  }
}

/**
 * 统计借阅记录总数
 * @returns 总借阅次数
 */
export const getLoansCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    return count || 0
  } catch (error) {
    console.error('Failed to count loans:', error)
    return 0
  }
}

/**
 * 统计当前借出的图书数量
 * @returns 借出数量
 */
export const getActivLoansCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })
      .is('return_date', null)

    if (error) throw error

    return count || 0
  } catch (error) {
    console.error('Failed to count active loans:', error)
    return 0
  }
}
