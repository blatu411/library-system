/**
 * 防抖工具函数
 * 用于搜索、输入等高频事件的节流处理
 */

/**
 * 防抖函数 - 延迟执行，多次触发时重新计时
 * @param func - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('搜索:', query)
 * }, 300)
 *
 * input.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value)
 * })
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    // 清除之前的定时器
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    // 设置新的定时器
    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * 节流函数 - 固定时间间隔执行
 * @param func - 要执行的函数
 * @param delay - 时间间隔（毫秒）
 * @returns 节流后的函数
 *
 * @example
 * const throttledScroll = throttle(() => {
 *   console.log('滚动中...')
 * }, 300)
 *
 * window.addEventListener('scroll', throttledScroll)
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastRunTime = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastRunTime >= delay) {
      func(...args)
      lastRunTime = now
    }
  }
}

/**
 * 创建可取消的防抖函数
 * @param func - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 包含取消方法的防抖函数对象
 *
 * @example
 * const search = createCancelableDebounce((query: string) => {
 *   console.log('搜索:', query)
 * }, 300)
 *
 * // 执行防抖函数
 * search.debounce('keyword')
 *
 * // 取消待执行的操作
 * search.cancel()
 */
export const createCancelableDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, delay)
  }

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return {
    debounce: debounced,
    cancel,
  }
}
