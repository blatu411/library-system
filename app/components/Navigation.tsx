/**
 * 全局导航栏组件
 * 支持响应式设计（桌面端/移动端）
 * 高亮当前活跃页面
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ROUTES } from '@/lib/constants'

/**
 * 导航链接项接口
 */
interface NavLink {
  label: string
  href: string
  icon?: string
}

/**
 * 导航栏组件
 * @returns 导航栏组件
 */
export const Navigation = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 导航链接配置
  const navLinks: NavLink[] = [
    { label: '首页', href: ROUTES.HOME, icon: '📚' },
    { label: '借阅记录', href: ROUTES.LOANS, icon: '📋' },
    { label: '统计看板', href: ROUTES.STATISTICS, icon: '📊' },
  ]

  /**
   * 判断链接是否为当前活跃页面
   * @param href - 导航链接地址
   * @returns 是否为当前页面
   */
  const isActive = (href: string): boolean => {
    return pathname === href
  }

  /**
   * 获取导航链接的样式类
   * @param href - 导航链接地址
   * @returns Tailwind CSS类名
   */
  const getLinkClassName = (href: string): string => {
    const baseClass =
      'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'

    if (isActive(href)) {
      return `${baseClass} bg-blue-500 text-white`
    }

    return `${baseClass} text-gray-700 hover:bg-gray-100`
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/标题 */}
          <div className="flex-shrink-0">
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">
                图书管理系统
              </span>
            </Link>
          </div>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={getLinkClassName(link.href)}
              >
                <span className="mr-1">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="切换菜单"
            >
              {/* 汉堡菜单图标 */}
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  // 关闭图标
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // 菜单图标
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  block w-full text-left px-3 py-2 rounded-md
                  ${
                    isActive(link.href)
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                  transition-colors duration-200
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
