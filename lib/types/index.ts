/**
 * 项目全局TypeScript类型定义
 */

/**
 * 图书信息接口
 */
export interface Book {
  id: number
  title: string
  status: '在馆' | '借出' | '丢失'
  author_id: number
  authors?: Author | Author[]
}

/**
 * 读者信息接口
 */
export interface Reader {
  id: number
  name: string
}

/**
 * 作者信息接口
 */
export interface Author {
  id: number
  name: string
}

/**
 * 借阅记录基础接口
 */
export interface Loan {
  id: number
  book_id: number
  reader_id: number
  loan_date: string
  due_date: string
  return_date: string | null
  created_at?: string
  updated_at?: string
}

/**
 * 借阅记录详情接口（包含关联的图书和读者信息）
 */
export interface LoanWithDetails extends Loan {
  books: {
    id: number
    title: string
    authors: { name: string }
  }
  readers: {
    id: number
    name: string
  }
}

/**
 * 借阅状态类型
 * - active: 借阅中（未逾期）
 * - returned: 已归还
 * - overdue: 逾期
 */
export type LoanStatus = 'active' | 'returned' | 'overdue'

/**
 * 图书状态类型
 */
export type BookStatus = '在馆' | '借出' | '丢失'

/**
 * 总体统计信息
 */
export interface OverallStats {
  totalLoans: number // 总借阅次数
  activeLoans: number // 当前借出数
  totalReaders: number // 总读者数
  totalBooks: number // 总图书数
}

/**
 * 活跃读者信息（用于排行榜）
 */
export interface TopReader {
  reader_id: number
  reader_name: string
  loan_count: number
}

/**
 * 热门图书信息（用于排行榜）
 */
export interface PopularBook {
  book_id: number
  book_title: string
  loan_count: number
}

/**
 * 读者统计信息
 */
export interface ReaderStats {
  totalLoans: number // 总借阅次数
  activeLoans: number // 当前借阅数
  overdueLoans: number // 逾期借阅数
}

/**
 * 借阅趋势数据项
 */
export interface LoanTrendItem {
  date: string
  count: number
}

/**
 * 借阅请求参数
 */
export interface CreateLoanRequest {
  book_id: number
  reader_id: number
  loan_date: string
  due_date: string
}

/**
 * 归还请求参数
 */
export interface ReturnLoanRequest {
  loan_id: number
  return_date: string
}

/**
 * API响应包装器（成功）
 */
export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
}

/**
 * API响应包装器（失败）
 */
export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
}

/**
 * API响应类型
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
