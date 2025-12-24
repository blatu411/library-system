# 📦 Vercel 部署指南

## 前置条件检查

✅ **构建测试** - npm run build 已成功通过
✅ **GitHub同步** - 代码已推送到 github.com/blatu411/library-system
✅ **环境变量** - .env.local 已配置 Supabase 密钥

---

## 部署方式 1️⃣：GitHub 自动部署 (推荐)

### 步骤 1: 访问 Vercel 官网
访问 https://vercel.com

### 步骤 2: 登录或注册
- 如果已有账户，直接登录
- 否则使用 GitHub 账户登录（推荐）

### 步骤 3: 导入项目
1. 点击 "Add New Project" 或 "Import Project"
2. 选择 "Import Git Repository"
3. 输入或搜索：`blatu411/library-system`
4. 点击 "Import"

### 步骤 4: 配置项目
1. **Project Name**：保持默认 `library-system` 或自定义
2. **Framework**：应自动检测为 "Next.js"
3. **Root Directory**：保持默认 (.)
4. **Build Command**：保持默认 `next build`
5. **Output Directory**：保持默认 `.next`
6. **Install Command**：保持默认 `npm install` 或 `npm ci`

### 步骤 5: 配置环境变量 (重要！)
在 "Environment Variables" 部分，添加以下变量：

从你的项目根目录 `.env.local` 文件中复制这两个变量的值：

```
NEXT_PUBLIC_SUPABASE_URL
值: [从 .env.local 中复制 NEXT_PUBLIC_SUPABASE_URL 的值]

NEXT_PUBLIC_SUPABASE_ANON_KEY
值: [从 .env.local 中复制 NEXT_PUBLIC_SUPABASE_ANON_KEY 的值]
```

✅ 这些值与 .env.local 中的完全相同
✅ 使用你自己项目中的实际值，不要复制示例值
✅ 确保完整复制，没有多余的空格或换行符

### 步骤 6: 点击 Deploy
点击 "Deploy" 按钮，Vercel 将：
1. 从 GitHub 克隆代码
2. 安装依赖
3. 运行 build
4. 部署到全球 CDN

### 步骤 7: 等待部署完成
部署通常需要 2-5 分钟
- 看到 ✅ "Congratulations!" 即表示部署成功
- 你会获得一个 Vercel URL，例如：
  ```
  https://library-system-tau.vercel.app
  ```

---

## 部署方式 2️⃣：GitHub App 自动集成 (完全自动)

如果你想要推送代码后自动部署，可以：

### 步骤 1: 在 Vercel 中安装 GitHub App
1. 登录 Vercel
2. 访问 Settings → Git Integrations
3. 连接你的 GitHub 账户
4. 授权 Vercel 访问你的仓库

### 步骤 2: 自动部署配置
一旦连接，每次推送到 `main` 分支时，Vercel 会：
- 自动克隆最新代码
- 自动运行 build
- 自动部署到生产环境

**Preview Deployments**：
- 每个 Pull Request 都会获得一个预览 URL
- 方便在合并前测试

---

## 部署后验证清单

部署完成后，访问你的 Vercel URL 进行验证：

### ✅ 基础页面检查
- [ ] 首页正常加载 (`/`)
- [ ] 导航栏显示正确
- [ ] 图书列表显示数据

### ✅ 功能测试
- [ ] 搜索功能工作
- [ ] 借阅记录页加载 (`/loans`)
- [ ] 读者历史页加载 (`/readers/1`)
- [ ] 统计看板页加载 (`/statistics`)
- [ ] 点击读者卡片可跳转

### ✅ 数据库连接
- [ ] 能正常获取图书数据
- [ ] 能正常获取读者数据
- [ ] 能正常获取借阅记录

### ✅ 响应式设计
- [ ] 桌面端显示正确
- [ ] 手机端显示正确
- [ ] 平板端显示正确

---

## 常见问题 & 解决方案

### ❌ "Build failed" 错误

**可能原因**：环境变量未设置或值不正确

**解决方案**：
1. 在 Vercel 项目设置中检查环境变量
2. 确保 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 都已添加
3. 重新触发 build：点击 "Redeploy"

### ❌ "Cannot find module" 错误

**可能原因**：依赖安装失败

**解决方案**：
1. 检查 package.json 是否正确
2. 在 Vercel 中重新部署
3. 查看 Build Logs 获取详细错误信息

### ❌ 数据无法加载（空白页面）

**可能原因**：Supabase 连接失败

**解决方案**：
1. 验证环境变量值是否正确复制（不要有空格）
2. 检查 Supabase 数据库是否在线
3. 检查浏览器控制台是否有错误信息
4. 在 Vercel 中查看 Function Logs

### ❌ "Vercel CLI token not valid"

**可能原因**：Vercel 认证过期

**解决方案**：
使用 GitHub 集成部署（推荐），无需 CLI token

---

## 已部署的项目信息

### 项目配置
| 项目 | 值 |
|------|-----|
| Repository | github.com/blatu411/library-system |
| Framework | Next.js 16.1.1 |
| Runtime | Node.js |
| Database | Supabase PostgreSQL |
| Build Status | ✅ 成功 |

### 路由配置
| 路由 | 类型 | 说明 |
|------|------|------|
| / | Static | 首页 |
| /loans | Dynamic | 借阅记录列表 |
| /readers/[id] | Dynamic | 读者详情页 |
| /statistics | Static | 统计看板 |

### 环境变量
| 变量 | 类型 | 必需 |
|------|------|------|
| NEXT_PUBLIC_SUPABASE_URL | Public | ✅ 是 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public | ✅ 是 |

---

## 部署后的下一步

### 🌐 自定义域名 (可选)
1. 在 Vercel 项目设置中添加自定义域名
2. 更新域名 DNS 设置
3. 等待 SSL 证书生成（约 5-10 分钟）

### 📊 监控和分析
1. Vercel Dashboard 查看部署历史
2. 查看 Function Logs 监控后端错误
3. 使用 Web Analytics 跟踪用户行为

### 🔄 自动更新
1. 每次推送到 main 分支自动部署
2. Preview deployments 用于 PR 测试
3. 自动 rollback 功能（如需要）

### 💾 备份和回滚
1. Vercel 自动保留部署历史
2. 可随时从任何历史版本恢复
3. "Rollback Deployment" 按钮在 Deployments 标签中

---

## 🚀 快速部署总结

如果你按照上面的步骤：

```
1. 访问 vercel.com 并登录
2. 点击 "Add New Project"
3. 导入 "blatu411/library-system"
4. 添加 Supabase 环境变量（2个）
5. 点击 "Deploy"
6. 等待 2-5 分钟
7. 获得你的 Vercel URL
8. 完成！🎉
```

---

## 📞 需要帮助？

- **Vercel 文档**：https://vercel.com/docs
- **Next.js 部署**：https://nextjs.org/docs/deployment
- **Supabase 连接**：https://supabase.com/docs

---

**现在你已准备好部署到 Vercel 了！** 🚀
