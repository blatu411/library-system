/**
 * 项目全局常量定义
 * 所有常量统一管理在此文件中
 */

// ========== 分页配置 ==========
export const ITEMS_PER_PAGE = 20
export const SEARCH_DEBOUNCE_MS = 300

// ========== 借阅状态枚举 ==========
export const LOAN_STATUS = {
  ACTIVE: 'active',
  RETURNED: 'returned',
  OVERDUE: 'overdue',
} as const

// ========== 图书状态枚举 ==========
export const BOOK_STATUS = {
  AVAILABLE: '在馆',
  BORROWED: '借出',
  LOST: '丢失',
} as const

// ========== 借阅期限选项 (天数) ==========
export const BORROW_PERIOD_OPTIONS = {
  WEEK: 7,
  TWO_WEEKS: 14,
  MONTH: 30,
} as const

// ========== 借阅期限选项标签 ==========
export const BORROW_PERIOD_LABELS = {
  [BORROW_PERIOD_OPTIONS.WEEK]: '7天',
  [BORROW_PERIOD_OPTIONS.TWO_WEEKS]: '14天',
  [BORROW_PERIOD_OPTIONS.MONTH]: '30天',
} as const

// ========== 统计数据相关常量 ==========
export const TOP_READERS_LIMIT = 10
export const POPULAR_BOOKS_LIMIT = 10
export const LOAN_TREND_DAYS = 30

// ========== 日期格式 ==========
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

// ========== 路由路径 ==========
export const ROUTES = {
  HOME: '/',
  LOANS: '/loans',
  STATISTICS: '/statistics',
  READER: (id: number) => `/readers/${id}`,
} as const

// ========== 错误消息 ==========
export const ERROR_MESSAGES = {
  BORROW_FAILED: '借阅失败，请稍后重试',
  RETURN_FAILED: '还书失败，请稍后重试',
  FETCH_FAILED: '获取数据失败，请稍后重试',
  INVALID_DATE: '日期无效，请重新选择',
  SELECT_READER: '请选择读者',
  SELECT_BOOK: '请选择图书',
} as const

// ========== 成功消息 ==========
export const SUCCESS_MESSAGES = {
  BORROW_SUCCESS: '借阅成功！',
  RETURN_SUCCESS: '还书成功！',
} as const
