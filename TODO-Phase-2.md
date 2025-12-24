# Phase 2 - 核心功能UI组件 开发任务清单

## 📋 概览
- **总任务数**：18个
- **当前进度**：0/18 (0%)
- **状态**：待开始
- **预计完成**：Phase 2阶段

---

## 🎯 功能点（必须完成）

- [ ] **全局导航栏** - 响应式导航，支持移动端，高亮当前页面
- [ ] **改进借阅弹窗** - 支持自定义期限（7天/14天/30天/自定义），显示预计归还日期
- [ ] **重构首页** - 使用新的数据查询层，添加搜索和筛选功能
- [ ] **更新元数据** - 更新layout.tsx的title和description
- [ ] **集成导航栏** - 在layout.tsx中集成Navigation组件

---

## 📁 文件创建任务

### 新增文件
- [ ] **创建Navigation组件** (app/components/Navigation.tsx)
  - 目的：全局导航栏，支持响应式和移动端汉堡菜单
  - 类型：Client Component ('use client')
  - 功能：导航链接、当前页面高亮、移动端菜单

- [ ] **创建BorrowModal组件** (app/components/BorrowModal.tsx)
  - 目的：改进的借阅弹窗，支持自定义期限
  - 类型：Client Component ('use client')
  - 功能：读者选择、期限选择、预计日期计算、表单验证

### 修改文件
- [ ] **修改layout.tsx**
  - 导入Navigation组件
  - 添加Navigation到layout中
  - 更新metadata（title和description）
  - 调整布局结构支持导航栏

- [ ] **重构page.tsx**
  - 导入新的BorrowModal组件
  - 使用lib/queries/books.ts和lib/queries/readers.ts
  - 移除旧的内联借阅逻辑
  - 添加搜索和状态筛选功能
  - 更新handleBorrowClick调用新的BorrowModal

---

## 💻 功能实现任务

### Navigation组件 (app/components/Navigation.tsx)
- [ ] **任务1：基础导航栏结构**
  - 创建导航栏容器（Tailwind样式）
  - 添加项目Logo/标题
  - 添加导航链接（首页、借阅记录、统计看板）

- [ ] **任务2：响应式设计**
  - 桌面端：水平导航
  - 移动端：汉堡菜单（使用useState管理菜单状态）
  - 创建MobileMenu组件或内联菜单

- [ ] **任务3：当前页面高亮**
  - 使用usePathname()获取当前路由
  - 根据路由高亮对应的导航链接
  - 添加下划线或背景色表示当前页面

- [ ] **任务4：样式和交互**
  - 使用Tailwind CSS美化导航栏
  - 添加hover效果
  - 添加过渡动画
  - 确保移动端菜单关闭时不显示

### BorrowModal组件 (app/components/BorrowModal.tsx)
- [ ] **任务5：基础弹窗结构**
  - 创建Modal容器（半透明背景）
  - 添加关闭按钮
  - 显示图书标题
  - 添加读者选择下拉菜单

- [ ] **任务6：借阅期限选择**
  - 添加4个选项：7天、14天、30天、自定义
  - 使用radio或tab切换
  - 默认选择14天

- [ ] **任务7：自定义日期选择**
  - 当选择"自定义"时显示日期输入框
  - 日期不能早于今天（验证）
  - 显示选择的日期

- [ ] **任务8：预计归还日期显示**
  - 实时计算预计归还日期
  - 显示：借阅日期 + 选定天数 = 应还日期
  - 格式化日期显示（YYYY-MM-DD）

- [ ] **任务9：表单验证和交互**
  - 验证：必须选择读者
  - 验证：自定义日期不能早于今天
  - 提交时使用createLoan创建借阅记录
  - 失败时显示错误提示（alert或toast）
  - 成功时关闭弹窗并刷新数据

- [ ] **任务10：Props和类型定义**
  - 定义BorrowModalProps接口
  - props包括：isOpen, book, readers, onClose, onConfirm
  - 所有回调都需要正确的类型定义

### 首页重构 (app/page.tsx)
- [ ] **任务11：导入新的查询函数**
  - 导入getAllBooks和getBooksByStatus
  - 导入getAllReaders
  - 导入新的BorrowModal组件
  - 导入搜索防抖工具

- [ ] **任务12：重构数据获取**
  - useEffect中使用getAllBooks代替supabase查询
  - useEffect中使用getAllReaders代替supabase查询
  - 更新error handling逻辑

- [ ] **任务13：添加搜索功能**
  - 添加搜索输入框（搜索图书标题）
  - 使用debounce防抖（300ms）
  - 实时过滤books列表
  - 搜索为空时显示全部图书

- [ ] **任务14：添加状态筛选**
  - 添加状态筛选按钮（全部、在馆、借出）
  - 点击按钮切换状态
  - 使用getBooksByStatus查询
  - 显示当前筛选状态

- [ ] **任务15：集成BorrowModal**
  - 导入BorrowModal组件
  - 在页面中添加<BorrowModal />
  - 更新handleBorrowClick使用新Modal
  - 更新handleConfirmBorrow调用createLoan并传递due_date

- [ ] **任务16：移除旧的借阅逻辑**
  - 删除旧的弹窗JSX代码
  - 删除旧的handleBorrow相关代码
  - 删除旧的借阅处理逻辑（集成到createLoan）

### Layout更新 (app/layout.tsx)
- [ ] **任务17：导入Navigation组件**
  - 导入app/components/Navigation
  - 检查Client Component标记

- [ ] **任务18：集成Navigation到layout**
  - 在html和body标签内顶部添加<Navigation />
  - 其他内容用<main>或<div>包裹
  - 确保布局结构正确

- [ ] **任务19：更新元数据**
  - 修改metadata.title为"图书管理系统"
  - 修改metadata.description为"图书借阅管理系统 - 管理图书、读者和借阅记录"

---

## 🧪 测试验证任务

- [ ] **功能测试**
  - 导航栏在所有页面显示
  - 点击导航链接能正确跳转
  - 当前页面导航链接高亮显示
  - 移动端汉堡菜单能正确开关

- [ ] **借阅弹窗测试**
  - 点击"借阅"按钮打开弹窗
  - 选择读者后确认按钮启用
  - 选择不同期限显示正确的归还日期
  - 选择自定义日期能正常工作
  - 借阅成功后弹窗关闭并显示成功提示
  - 借阅失败显示错误提示

- [ ] **首页功能测试**
  - 搜索功能正常工作（搜索图书）
  - 状态筛选正常工作（全部、在馆、借出）
  - 搜索和筛选可以组合使用
  - 读者列表正常显示

- [ ] **构建测试**
  - npm run build 通过（无TypeScript错误）
  - 本地dev server正常启动
  - 开发环境能正常访问所有页面

- [ ] **响应式设计测试**
  - 桌面端（1920px）布局正常
  - 平板端（768px）布局正常
  - 移动端（375px）布局正常
  - 导航栏在移动端正常工作
  - 弹窗在各设备上居中显示

- [ ] **浏览器兼容性测试**
  - Chrome最新版本测试通过
  - Firefox最新版本测试通过
  - Safari最新版本测试通过

---

## 📝 代码规范检查

- [ ] 所有函数都有JSDoc注释
- [ ] 所有TypeScript类型明确定义（没有any）
- [ ] 组件Props都用interface定义
- [ ] Import顺序正确（React → Next.js → 第三方库 → 本地）
- [ ] 所有异步操作都有try-catch
- [ ] 没有console.log（只有console.error用于错误）
- [ ] Tailwind类名正确且一致
- [ ] 没有硬编码的字符串（使用常量或i18n）
- [ ] 组件中没有死代码或注释掉的代码
- [ ] 使用const优先，避免let和var

---

## 📊 进度追踪

### 已完成的任务
（待开始）

### 当前进行中
（待开始）

### 待完成
- ⏳ 所有19个任务

### 遇到的问题
（暂无）

### 开发时间统计
| 组件/功能 | 预计时间 | 实际时间 | 状态 |
|----------|---------|---------|------|
| Navigation | 1.5小时 | - | 待开始 |
| BorrowModal | 1.5小时 | - | 待开始 |
| 首页重构 | 1.5小时 | - | 待开始 |
| Layout更新 | 0.5小时 | - | 待开始 |
| 测试验证 | 1小时 | - | 待开始 |
| **总计** | **6小时** | - | - |

---

## 🔗 相关文件

### 参考文档
- [开发规范](./development-standards.md)
- [实施计划](./plans/calm-hatching-balloon.md)
- [Phase 1 完成](./git-history)

### 关键代码文件
- [常量定义](./lib/constants.ts)
- [类型定义](./lib/types/index.ts)
- [日期工具](./lib/utils/date.ts)
- [借阅查询](./lib/queries/loans.ts)
- [图书查询](./lib/queries/books.ts)
- [读者查询](./lib/queries/readers.ts)

### 当前开发文件
- app/components/Navigation.tsx （待创建）
- app/components/BorrowModal.tsx （待创建）
- app/page.tsx （待修改）
- app/layout.tsx （待修改）

---

## ✨ 提示和注意事项

### Navigation组件
- 使用`usePathname()`确保客户端才能获取路由信息
- 需要标记为'use client'
- 确保移动端菜单关闭时不影响布局

### BorrowModal组件
- 接收book对象和readers数组作为props
- onConfirm回调需要传递readerId和dueDate
- 需要计算due_date并验证日期有效性
- 自定义日期需要验证（不能早于今天）

### 首页重构
- 保持现有的UI布局和样式
- 只替换数据获取和业务逻辑
- 搜索需要使用debounce避免过频繁更新
- 保留读者卡片（后续Phase 3会添加点击跳转）

### Layout更新
- 确保Navigation不会影响现有的页面内容
- metadata更新后页面标题会自动变化
- 测试在所有路由下导航栏都显示正常

---

## 🚀 开发步骤建议

1. **先创建Navigation组件** - 这是全局组件，可以独立开发
2. **再创建BorrowModal组件** - 基于现有的借阅逻辑改造
3. **更新Layout** - 集成Navigation
4. **重构首页** - 使用新的组件和查询层
5. **全面测试** - 确保所有功能正常

---

**准备开始？请确认是否需要调整TODO内容。** ✅
