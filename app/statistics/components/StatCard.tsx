/**
 * 统计卡片组件
 * 显示统计数据的通用卡片
 */

interface StatCardProps {
  /** 卡片图标 */
  icon: string
  /** 卡片标题 */
  title: string
  /** 统计数值 */
  value: number
  /** 趋势信息（可选） */
  trend?: {
    percentage: number
    direction: 'up' | 'down'
  }
}

/**
 * 统计卡片组件
 * @param props - 组件Props
 * @returns 统计卡片组件
 */
export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend }) => {
  const getBgGradient = (index: number) => {
    const gradients = [
      'from-blue-50 to-blue-100',
      'from-green-50 to-green-100',
      'from-orange-50 to-orange-100',
      'from-red-50 to-red-100',
    ]
    return gradients[index % gradients.length]
  }

  const getBorderColor = (index: number) => {
    const colors = [
      'border-blue-200',
      'border-green-200',
      'border-orange-200',
      'border-red-200',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className={`bg-gradient-to-br ${getBgGradient(0)} rounded-lg shadow-lg p-6 border ${getBorderColor(0)}`}>
      {/* 图标 */}
      <div className="text-4xl mb-2">{icon}</div>

      {/* 标题 */}
      <p className="text-gray-600 text-sm mb-2">{title}</p>

      {/* 数值 */}
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>

        {/* 趋势信息（可选） */}
        {trend && (
          <div
            className={`text-xs font-semibold ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}%
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
