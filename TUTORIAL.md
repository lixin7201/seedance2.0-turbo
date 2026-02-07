# ShipAny 模版保姆级开发教程 (编程小白版)

> 🎯 **写在前面**
> 
> 本文档专门为编程新手设计。你**不需要**精通代码，只需要会复制粘贴指令，配合 AI 助手（推荐 Cursor, Claude Code, Windsurf 等）即可完成网站开发。
> 
> **教程使用指南：**
> 1. 遇到 `📌 终端指令`：这是需要在终端（Terminal）运行的命令，直接复制运行即可。
> 2. 遇到 `🤖 告诉 AI`：这是发给 AI 助手的指令，复制文案发给 AI，它会帮你改代码。
> 3. 遇到 `📝 修改配置`：这是需要你手动去网站注册或填写的配置信息。
> 4. **只读模式**：请通读本教程，不要修改本文件内容。所有操作都在项目代码中进行。

---

## ⏳ 第零阶段：准备工作（预计耗时：30-60分钟）

在开始之前，我们需要准备好盖房子的“工具”和“材料”。

### 0.1 必备账号注册
请确保你拥有以下账号（如果没有，现在去注册）：
- **GitHub** (https://github.com): 用于保存你的代码。
- **Vercel** (https://vercel.com): 用于发布你的网站给全世界看。
- **Neon** (https://neon.tech): 免费的云数据库（推荐）。
- **Cloudflare** (https://www.cloudflare.com): 用于存储图片和域名解析（可选但推荐）。
- **Stripe** (https://stripe.com): 用于接收付款（如果需要支付功能）。

### 0.2 安装基础软件
你的电脑需要安装以下软件才能运行代码：
1. **Node.js** (版本 >= 20): 下载地址 https://nodejs.org/ (建议下载 LTS 版本)
2. **Git**: 下载地址 https://git-scm.com/downloads
3. **VS Code 或 Cursor**: 推荐下载 **[Cursor](https://cursor.com)**，它自带非常强大的 AI，能大大降低开发难度。

### 0.3 验证安装
打开终端（Mac叫Terminal，Windows叫PowerShell），输入以下命令检查是否安装成功：

```bash
node -v
# 应显示版本号，如 v20.x.x

npm -v
# 应显示版本号

git --version
# 应显示版本号
```

---

## 📅 第一阶段：项目本地部署（预计耗时：15-30分钟）

### 1.1 准备代码
如果你还没拉取代码，请在终端执行：

**📌 终端指令**：
```bash
# 1. 克隆代码仓库（默认拉取 dev 分支）
git clone https://github.com/shipanyai/shipany-template-two my-shipany-project

# 2. 进入项目文件夹
cd my-shipany-project
```

**🔍 分支选择说明**：

ShipAny 提供了三个分支，根据你的需求选择：

| 分支 | 适用场景 | Next.js 版本 | 部署平台 |
|------|----------|--------------|----------|
| **dev** | 追求最新功能 | 16 | Vercel / VPS |
| **main** | 追求稳定性 | 16 | Vercel / VPS |
| **cf** | 部署到 Cloudflare | 15.5.5 | Cloudflare Workers |

**如果需要拉取其他分支**：
```bash
# 拉取 main 分支（稳定版）
git clone -b main https://github.com/shipanyai/shipany-template-two my-shipany-project

# 拉取 cf 分支（Cloudflare Workers 专用）
git clone -b cf https://github.com/shipanyai/shipany-template-two my-shipany-project
```

> 💡 **小白建议**：如果不确定选哪个，使用默认的 `dev` 分支即可。

### 1.2 安装依赖
这一步相当于给项目安装“零部件”。

**📌 终端指令**：
```bash
# 1. 安装 pnpm (一个更快的包管理工具)
npm install -g pnpm

# 2. 安装项目所有需要的依赖包
pnpm install
```

### 1.3 配置环境变量
项目需要一些密码和配置才能运行。我们先复制一份示例配置。

**📌 终端指令**：
```bash
# 复制配置文件
cp .env.example .env.development
```

**📝 修改配置**：

打开 `.env.development` 文件，你会看到类似这样的内容：

```env
# app
NEXT_PUBLIC_APP_URL = "http://localhost:3000"
NEXT_PUBLIC_APP_NAME = "ShipAny Two"

# theme
NEXT_PUBLIC_THEME = "default"

# appearance
NEXT_PUBLIC_APPEARANCE = "system"

# database
DATABASE_URL = ""
DATABASE_PROVIDER = "postgresql"
DB_SINGLETON_ENABLED = "true"
DB_MAX_CONNECTIONS = "1"

# auth secret
# openssl rand -base64 32
AUTH_SECRET = ""
```

**现阶段只需修改以下两项**（其他配置在后续阶段填写）：

1. **NEXT_PUBLIC_APP_URL**：改为 `http://localhost:3000`（本地开发地址）
2. **NEXT_PUBLIC_APP_NAME**：改为你的项目名称（如 `我的 SaaS 项目`）

> 💡 **配置说明**：
> - `NEXT_PUBLIC_THEME`：主题名称，默认 `default` 即可
> - `NEXT_PUBLIC_APPEARANCE`：外观模式，`system`（跟随系统）/ `light`（亮色）/ `dark`（暗色）
> - `DATABASE_URL`：数据库地址，第二阶段配置
> - `AUTH_SECRET`：登录密钥，第二阶段配置

### 1.4 启动开发服务器
让我们看看网站长什么样！

**📌 终端指令**：
```bash
pnpm dev
```

终端会显示类似 `http://localhost:3000` 的链接。按住 `Cmd` (Mac) 或 `Ctrl` (Windows) 点击链接。如果能在浏览器看到网站首页，恭喜你，你的网站已经在本地跑起来了！🎉

**🔧 自定义端口（可选）**：

如果 3000 端口被占用，可以指定其他端口：

```bash
# 使用 8080 端口
pnpm dev --port 8080
```

**✅ 验证成功**：

如果看到类似下图的页面，说明本地部署成功：
- 页面顶部有 ShipAny 的 Logo
- 页面中间有 "Ship Your SaaS in Days" 等英文标题
- 页面可以正常滚动，没有报错

> ⚠️ **常见问题**：
> - **端口被占用**：使用 `--port` 参数换个端口
> - **依赖安装失败**：检查网络，可能需要科学上网
> - **页面空白**：检查终端是否有报错信息

### 1.5 预览不同设备的显示效果

网站开发完成后，你需要确保在不同设备上都能正常显示。ShipAny 模板已经做好了响应式设计，但你需要预览效果。

#### 📱 如何预览手机端、平板端效果

**方法 1：使用浏览器开发者工具（推荐）**

1. **打开开发者工具**：
   - Chrome/Edge：按 `F12` 或 `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Safari：先在"设置 → 高级"中启用"显示开发菜单"，然后按 `Cmd+Option+I`

2. **切换到设备模拟模式**：
   - 点击工具栏左上角的"设备切换"图标（📱图标）
   - 或按快捷键：`Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)

3. **选择预览设备**：
   - **手机端**：iPhone 14 Pro、iPhone SE、Samsung Galaxy S20
   - **平板端**：iPad Air、iPad Mini、Surface Pro 7
   - **自定义尺寸**：可以手动输入宽度和高度

4. **多设备同时预览**：
   - 在顶部设备选择器中，可以快速切换不同设备
   - 建议测试：iPhone（手机）、iPad（平板）、Desktop（电脑）

**方法 2：使用在线预览工具**

如果你想看更真实的效果，可以使用以下工具：

- **Responsively** (https://responsively.app/)：免费的多设备预览工具
  - 可以同时显示手机、平板、电脑三个视图
  - 支持同步滚动和点击
  
- **BrowserStack** (https://www.browserstack.com/)：在线真机测试
  - 可以在真实的手机和平板上测试
  - 有免费试用额度

**方法 3：手机扫码预览（真机测试）**

1. **确保手机和电脑在同一 WiFi 网络**

2. **查看电脑的 IP 地址**：
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```
   找到类似 `192.168.x.x` 的地址

3. **在手机浏览器访问**：
   - 打开手机浏览器
   - 输入：`http://你的IP地址:3000`
   - 例如：`http://192.168.1.100:3000`

4. **使用二维码（更方便）**：
   - 安装二维码生成工具：`npm install -g qrcode-terminal`
   - 生成二维码：`qrcode-terminal http://你的IP:3000`
   - 用手机扫码即可访问

#### 🎨 常见的响应式断点

ShipAny 模板使用以下响应式断点（你不需要改代码，了解即可）：

| 设备类型 | 屏幕宽度 | 典型设备 |
|---------|---------|---------|
| 手机（竖屏） | < 640px | iPhone SE, iPhone 14 |
| 手机（横屏） | 640px - 768px | iPhone 14 Pro Max 横屏 |
| 平板（竖屏） | 768px - 1024px | iPad Mini, iPad Air |
| 平板（横屏） | 1024px - 1280px | iPad Pro 横屏 |
| 笔记本 | 1280px - 1536px | MacBook Air, 小屏笔记本 |
| 台式机 | > 1536px | 大屏显示器 |

#### ✅ 预览检查清单

在不同设备上检查以下内容：

**手机端（< 640px）**：
- ✅ 导航菜单是否变成汉堡菜单（☰）
- ✅ 文字大小是否合适（不要太小）
- ✅ 按钮是否够大（方便手指点击）
- ✅ 图片是否正常显示（不变形、不溢出）
- ✅ 表单输入框是否方便填写

**平板端（768px - 1024px）**：
- ✅ 布局是否合理（不要太挤或太空）
- ✅ 侧边栏是否正常显示
- ✅ 卡片网格是否适配（通常 2 列）

**电脑端（> 1280px）**：
- ✅ 内容是否居中（不要太宽）
- ✅ 导航栏是否完整显示
- ✅ 卡片网格是否美观（通常 3-4 列）

#### 🤖 如何让 AI 帮你调整响应式样式

如果你发现某个设备上显示不好，可以这样告诉 AI：

```text
🤖 告诉 AI：
我发现在手机端（宽度 < 640px）时，首页的标题太大了，
请帮我调整一下，让手机端的标题字体小一些。

具体要求：
- 电脑端保持现在的大小
- 手机端改为原来的 70%
- 平板端改为原来的 85%
```

或者：

```text
🤖 告诉 AI：
在手机端预览时，功能卡片挤在一起了，
请帮我改成手机端每行只显示 1 个卡片，
平板端每行显示 2 个，电脑端每行显示 3 个。
```

#### 📚 更多预览技巧

**参考资料**：
- 📱 **手机端效果预览详细教程**：[点击查看微信文章](https://mp.weixin.qq.com/s?__biz=MzI3NjAyMTYyNQ==&mid=2247484269&idx=1&sn=c9cebd744128b28dbba8b48262b9f728)
- 🎨 **响应式设计最佳实践**：确保在所有设备上都有良好的用户体验

**💡 小白提示**：
- 不需要在所有设备上都完美，重点关注手机端和电脑端
- 如果发现问题，直接告诉 AI 让它帮你修改
- 真机测试比模拟器更准确，建议用方法 3 在真实手机上测试

---

## 🔐 第二阶段：配置数据库与用户系统（预计耗时：30-60分钟）

如果你的网站需要 **用户登录**、**保存数据** 或 **支付功能**，请务必执行此阶段。

### 2.1 创建云数据库（两种选择）

#### 选项 1: Neon（推荐，更省钱）

**为什么推荐 Neon？**
- ✅ 免费额度更大
- ✅ 一个账号可创建 **10 个数据库**
- ✅ 每个数据库可创建 **10 个分支**（相当于 100 个独立环境）
- ✅ 非常适合管理多个小项目

**🎯 省钱策略：多项目共用一个 Neon 账号**

如果你有多个网站项目，可以这样规划：

```
Neon 账号
├── 数据库 1: blog-projects（博客类项目）
│   ├── 分支 main: blog-site-1
│   ├── 分支 dev: blog-site-2
│   └── 分支 test: blog-site-3
├── 数据库 2: shop-projects（电商类项目）
│   ├── 分支 main: shop-site-1
│   └── 分支 dev: shop-site-2
└── 数据库 3: landing-projects（落地页项目）
    └── 分支 main: landing-site-1
```

**📌 创建步骤**：

1. 登录 [Neon](https://neon.tech)
2. 创建新项目 (Create Project)
3. 找到 `Connection String` (连接字符串)，点击复制
4. 连接字符串格式：`postgres://neondb_owner:xxxxx@ep-cool-frog-123456...`

**💡 小白提示**：
- 第一个项目用主数据库的 main 分支
- 后续项目可以创建新分支，无需新建数据库
- 这样可以在免费额度内管理更多项目

---

#### 选项 2: Supabase（功能更全面）

**为什么选 Supabase？**
- ✅ 内置用户认证系统
- ✅ 自带后台管理界面
- ✅ 提供实时数据库功能
- ✅ 有文件存储功能

**🎯 省钱策略：多租户设计（一个项目服务多个网站）**

核心思路：**不要为每个网站创建一个 Supabase 项目，而是用一个项目服务所有网站**。

**方法 1：表名加前缀**

```
一个 Supabase 项目
├── blog_users（博客网站的用户表）
├── blog_posts（博客网站的文章表）
├── shop_users（电商网站的用户表）
├── shop_products（电商网站的商品表）
└── landing_users（落地页的用户表）
```

**方法 2：添加站点标识字段（推荐）**

所有表共用，但加一个 `site_code` 字段区分：

```sql
-- 用户表（所有网站共用）
users (
  id,
  email,
  site_code,  -- 'blog', 'shop', 'landing' 等
  created_at
)

-- 查询时带上站点条件
SELECT * FROM users WHERE site_code = 'blog';
```

**方法 3：使用不同的 Schema**

```
一个 Supabase 项目
├── schema: blog
│   ├── users
│   └── posts
├── schema: shop
│   ├── users
│   └── products
└── schema: landing
    └── users
```

**📌 创建步骤**：

1. 登录 [Supabase](https://supabase.com)
2. 创建新项目 (New Project)
3. 进入项目设置 → Database → Connection String
4. 复制连接字符串

**💡 小白提示**：
- 如果只有 1-2 个网站，直接用 Supabase 即可
- 如果有 3+ 个网站，建议用**方法 2**（添加 site_code 字段）
- 需要用 AI 帮你改代码时，告诉它你用的是哪种方法

**🤖 如何让 AI 帮你实现多租户设计**：

```text
告诉 AI：
我想用一个 Supabase 项目管理多个网站的数据。

请帮我：
1. 在所有用户相关的表中添加 site_code 字段
2. 修改代码，让所有查询自动带上 site_code 条件
3. 在环境变量中添加 NEXT_PUBLIC_SITE_CODE 配置

我的网站列表：
- blog（博客网站）
- shop（电商网站）
- landing（落地页）
```

---

#### 💰 成本对比

| 方案 | 免费额度 | 适合场景 | 省钱技巧 |
|------|---------|---------|---------|
| **Neon** | 10 个数据库 + 每个 10 分支 | 多个独立小项目 | 用分支管理多项目 |
| **Supabase** | 2 个项目 | 需要完整后端功能 | 用多租户设计 |

**🎯 推荐组合**：
- **纯数据存储**：用 Neon（省钱）
- **需要用户登录 + 文件存储**：用 Supabase + 多租户设计

---

### 2.1.1 选择哪个数据库？（决策指南）

```
你的项目需要什么？
│
├─ 只需要存储数据，自己处理用户登录？
│  └─ ✅ 选 Neon（更便宜，免费额度大）
│
├─ 需要内置的用户认证系统？
│  └─ ✅ 选 Supabase（自带 Auth）
│
├─ 有 3+ 个网站项目？
│  ├─ 用 Neon：创建多个数据库/分支
│  └─ 用 Supabase：用多租户设计（一个项目服务多站）
│
└─ 需要实时数据库功能？
   └─ ✅ 选 Supabase（支持实时订阅）
```

**💡 小白建议**：
- 第一次使用，推荐 **Neon**，简单直接
- 如果需要完整的用户系统，选 **Supabase**
- 有多个项目时，记得用省钱策略！

### 2.2 配置环境变量
回到代码编辑器（Cursor），打开项目根目录的 `.env.development` 文件。

**📝 修改配置**：
1. 找到 `DATABASE_URL`，填入刚才复制的 Neon 连接字符串。
2. 生成一个安全的随机密钥，填入 `AUTH_SECRET`。

你可以用这个指令生成密钥：
**📌 终端指令**：
```bash
openssl rand -base64 32
```

修改后的文件应该像这样：
```env
DATABASE_URL="postgres://neondb_owner:xxxxx@ep-cool-frog-123456..."
AUTH_SECRET="你的随机长字符串"
```

### 2.3 初始化数据库
把我们设计好的数据表结构“写入”你的云数据库。

**📌 终端指令**：
```bash
# 1. 生成 SQL 迁移文件
pnpm db:generate

# 2. 推送结构到数据库
pnpm db:migrate
```

**⚠️ 遇到 Timeout 错误怎么办？**

如果执行 `pnpm db:migrate` 时遇到超时或长时间无响应，请按以下步骤排查：

1. **检查数据库连接**：
   ```bash
   # 使用 psql 命令测试连接（替换为你的数据库地址）
   psql "postgresql://user:password@address:port/database"
   ```
   
   如果无法连接，可能是：
   - 数据库地址填写错误
   - 网络问题（防火墙、需要科学上网）
   - 数据库服务未启动

2. **启用数据库单例模式**：
   在 `.env.development` 中设置：
   ```env
   DB_SINGLETON_ENABLED = "true"
   ```
   这会复用数据库连接，提升迁移速度。

3. **重试命令**：
   网络波动可能导致超时，多试几次通常能成功。

**✅ 验证成功**：

迁移成功后，你可以：
- 登录 Neon 控制台，查看数据库中是否有新建的表（如 `users`、`sessions` 等）
- 或者使用 psql 命令查看表列表：
  ```bash
  psql "你的数据库地址" -c "\dt"
  ```

### 2.4 设置管理员账户 (RBAC 权限)
我们需要一个超级管理员账号来管理网站。

**Step 1: 初始化权限配置**
**📌 终端指令**：
```bash
pnpm rbac:init
```
*(这会往数据库写入默认的角色和权限列表)*

**Step 2: 注册账号**
1. 确保 `pnpm dev` 正在运行。
2. 浏览器访问 `http://localhost:3000/sign-in`。
3. 使用邮箱注册一个新账号（例如 `admin@example.com`）。

**Step 3: 升级为超级管理员**
回到终端，执行以下命令将刚才注册的账号提升为超级管理员。

**📌 终端指令**：
```bash
# 请将 admin@example.com 替换为你刚才注册的邮箱
pnpm rbac:assign -- --email=admin@example.com --role=super_admin
```

**Step 4: 验证**
访问 `http://localhost:3000/admin`。如果你能看到管理后台面板，说明配置成功！

---

## 🤖 第三阶段：认识 AI Skills（ShipAny 的超级助手）

在开始修改网站之前，让我们先了解一个强大的工具：**AI Skills**。

### 什么是 Skill？

**Skill（技能）** 是 ShipAny 为 AI 助手（如 Cursor、Claude）准备的"专业操作手册"。你可以把它理解为：

- 📦 **一套专业的操作指南**：就像给 AI 提供了一本详细的"使用说明书"
- 🎯 **专门解决特定问题**：每个 skill 专注于解决一个特定领域的任务
- 🔧 **包含自动化脚本**：不仅有说明，还有自动化工具来提高效率
- ✅ **降低出错风险**：有明确的操作范围，不会误改重要代码

**简单来说**：Skill 就是教 AI 如何专业地完成某项工作的"培训教材"，让编程小白也能通过 AI 快速完成复杂任务。

---

### 本项目中的两个 Skills

ShipAny 模板内置了两个强大的 Skills，位于 `.claude/skills/` 文件夹：

#### 1️⃣ **shipany-quick-start** （快速启动技能）

**用途**：帮助你快速定制一个全新的 ShipAny 项目

**适用场景**：当你刚开始一个新项目，需要一次性修改品牌信息、Logo、首页文案等基础内容时使用。

**它能做什么**：
- ✏️ 修改应用的基本信息（名称、域名、描述）
- 🎨 设置 SEO 元数据（让搜索引擎更容易找到你的网站）
- 📄 定制首页内容（中英文双语）
- 🎨 调整主题样式（颜色、字体等）
- 🖼️ 替换 Logo 和网站图标（favicon）
- 📋 生成网站地图（sitemap）
- 📜 创建法律页面（隐私政策、服务条款等）
- 🖼️ 处理图片资源

**特点**：
- 只修改配置文件，不改动核心代码（安全）
- 有严格的修改范围限制
- 提供了自动化脚本来简化操作

**使用示例**（见下一阶段 3.1）

---

#### 2️⃣ **shipany-page-builder** （页面构建器技能）

**用途**：帮助你创建新的动态页面

**适用场景**：当你需要添加新页面时使用（比如添加"功能介绍"、"产品特性"、"使用案例"等页面）。

**它能做什么**：
- ➕ 创建新的多语言页面（中文和英文）
- 📝 根据关键词和参考内容自动生成页面结构
- 🔗 自动注册新页面到系统路由中
- 🎨 使用预设的页面模板（Hero、Features、FAQ、CTA 等区块）

**特点**：
- 只创建新页面，不修改现有页面（安全）
- 使用 JSON 文件来定义页面内容（不需要写复杂代码）
- 提供了 Python 脚本 `create_dynamic_page.py` 来自动创建页面

**使用示例**（见第四阶段 4.2）

---

### 通俗的比喻

如果把建网站比作**装修房子**：

- 🏠 **ShipAny 模板** = 一套精装修的样板房
- 🔧 **shipany-quick-start** = 全屋改造服务（帮你刷墙、换家具、贴壁纸、换门牌）
- 🚪 **shipany-page-builder** = 加建房间服务（帮你添加新的功能房间）

---

### 📋 什么时候用哪个 Skill？（决策指南）

**🤔 我该用哪个 Skill？**

按照以下决策树选择：

```
你想做什么？
│
├─ 刚开始新项目，需要一次性改品牌信息、Logo、首页？
│  └─ ✅ 使用 shipany-quick-start
│
├─ 需要添加新的页面（如功能介绍、定价、关于我们）？
│  └─ ✅ 使用 shipany-page-builder
│
└─ 只是修改某个具体文件的内容？
   └─ ❌ 不用 Skill，直接告诉 AI 修改即可
```

---

### 🎯 Skill 1: shipany-quick-start 使用指南

**什么时候用**：

✅ **适合以下情况**：
- 刚拉取代码，第一次启动项目
- 需要一次性修改网站名称、Logo、首页文案
- 想快速完成项目初始化

❌ **不适合以下情况**：
- 只想改某一个页面的内容
- 只想添加一个新页面
- 项目已经定制过，只想微调

---

**完整的 AI 提示词模板**：

```text
Use ".claude/skills/shipany-quick-start" to setup my project.

Project Details:
- Name: [你的网站名称，如：AI 写作助手]
- Domain: [你的域名，如：aiwriter.com]
- Description: [一句话描述，如：帮助创作者用 AI 生成高质量文章]
- Content Reference: [参考网站链接，可选，如：https://jasper.ai]

Please update common.json, landing.json and generate logo placeholders.
```

**📝 填写示例**：

```text
Use ".claude/skills/shipany-quick-start" to setup my project.

Project Details:
- Name: 智能简历生成器
- Domain: smartresume.ai
- Description: 用 AI 帮你 3 分钟生成专业简历
- Content Reference: https://www.resumegenius.com

Please update common.json, landing.json and generate logo placeholders.
```

**AI 会帮你做什么**：
1. ✅ 修改 `common.json`（中英文）的网站名称和描述
2. ✅ 修改 `landing.json`（中英文）的首页内容
3. ✅ 生成 Logo 占位符（你可以后续替换）
4. ✅ 更新 SEO 元数据
5. ✅ 修改 sitemap.xml

**⏱️ 预计耗时**：5-10 分钟

---

### 🎯 Skill 2: shipany-page-builder 使用指南

**什么时候用**：

✅ **适合以下情况**：
- 需要添加新的功能介绍页（如 `/features/ai-chat`）
- 需要添加定价页、关于我们页、使用案例页
- 想快速生成一个包含多个区块的完整页面

❌ **不适合以下情况**：
- 只想修改现有页面的内容
- 想写博客文章（应该用 MDX 静态页面）
- 想修改首页（首页已经存在，直接改 `index.json` 即可）

---

### 📖 深入理解：页面构建器（Page Builder）

在 ShipAny 中，有两种创建页面的方式：**静态页面** 和 **动态页面**。

#### 🔹 静态页面 vs 动态页面（重要对比）

| 特性 | 静态页面 (MDX) | 动态页面 (JSON) |
|------|---------------|----------------|
| **文件格式** | `.mdx` (Markdown) | `.json` (JSON配置) |
| **适用场景** | 法律文档、博客文章、公司介绍 | 营销页面、功能介绍、定价页 |
| **编辑方式** | 直接写 Markdown 文本 | 配置 JSON 数据结构 |
| **灵活性** | 高（可以写任意内容） | 中（使用预设区块组合） |
| **学习难度** | 低（会 Markdown 即可） | 低（填写 JSON 配置） |
| **示例** | 隐私政策、服务条款 | 功能页、定价页 |

**🤔 我该用哪种？**

```
你想创建什么页面？
│
├─ 法律文档（隐私政策、服务条款）？
│  └─ ✅ 使用静态页面 (MDX)
│
├─ 博客文章、新闻、公司介绍？
│  └─ ✅ 使用静态页面 (MDX)
│
└─ 营销页面（功能介绍、定价、关于我们）？
   └─ ✅ 使用动态页面 (JSON)
```

---

#### 📝 如何用 AI 创建静态页面

**适用场景**：博客、法律文档、公司介绍等文字内容为主的页面

**🤖 告诉 AI（直接复制使用）**：

```text
请帮我创建一个静态页面：

路径：/blog/first-post
标题：我的第一篇博客
内容：介绍我们产品的最新功能

请创建 content/pages/blog/first-post.mdx 文件，使用 Markdown 格式。
```

**✅ AI 会帮你做什么**：
- 创建 `.mdx` 文件
- 填写页面标题和描述
- 生成基础的 Markdown 内容结构
- 如果需要多语言，会创建对应的语言版本

**💡 小白提示**：
- 你不需要懂代码，只需要告诉 AI 你想要什么内容
- AI 会自动创建文件并填充内容
- 你可以后续再让 AI 修改内容

---

#### 📝 如何用 AI 创建动态页面

**适用场景**：功能介绍、定价页、关于我们等营销页面

**🤖 告诉 AI（直接复制使用）**：

```text
请帮我创建一个动态页面：

路径：/features/ai-chat
标题：AI 聊天功能
描述：智能对话助手，支持多轮对话
需要的区块：hero（主视觉）、features（功能列表）、faq（常见问题）、cta（行动号召）

请创建中英文配置文件，并注册路由。
```

**✅ AI 会帮你做什么**：
1. 创建英文配置文件 `src/config/locale/messages/en/pages/features/ai-chat.json`
2. 创建中文配置文件 `src/config/locale/messages/zh/pages/features/ai-chat.json`
3. 在 `src/config/locale/index.ts` 中注册路由
4. 根据你的描述生成页面内容

**💡 小白提示**：
- 你只需要告诉 AI 需要哪些区块（见下面的区块列表）
- AI 会自动生成所有配置文件
- 你不需要理解 JSON 的具体结构

---

#### 🧩 内置区块（Blocks）列表

动态页面就像搭积木，ShipAny 提供了 15+ 种"积木"（区块），你可以自由组合：

| 区块名称 | 用途 | 什么时候用 |
|---------|------|-----------|
| `hero` | 主视觉区块 | 页面顶部的大标题和介绍（必备） |
| `features` | 功能特点 | 展示 3-6 个核心功能（网格布局） |
| `features-list` | 特性列表 | 展示更多功能（列表布局） |
| `faq` | 常见问题 | 回答用户疑问（推荐） |
| `cta` | 行动号召 | 引导用户注册/购买（必备） |
| `testimonials` | 用户评价 | 展示客户好评 |
| `stats` | 数据统计 | 展示用户数、增长率等数据 |
| `showcases` | 产品展示 | 展示产品截图、案例 |

> 💡 **小白建议**：刚开始只用 `hero` + `features` + `faq` + `cta` 这 4 个区块就够了！

**🤖 如何告诉 AI 使用这些区块**：

```text
请帮我创建一个功能介绍页面：

路径：/features/ai-writing
需要的区块：
1. hero - 标题"AI 写作助手"，描述"用 AI 帮你写文章"
2. features - 展示 3 个功能：智能续写、语法检查、风格转换
3. faq - 添加 3 个常见问题
4. cta - 引导用户"免费试用"

请创建中英文配置文件。
```

**✅ AI 会自动**：
- 生成所有区块的配置
- 填充合理的默认内容
- 创建中英文两个版本

---

**完整的 AI 提示词模板**：

```text
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: [页面路径，如：/features/ai-chat]
- Keywords: [3-5个关键词，用逗号分隔]
- Description: [页面描述，一句话]
- Reference: [参考网站，可选]
- Sections: [需要的区块，可选，默认：hero, introduce, benefits, features, faq, cta]

请创建中英文配置文件，并在 src/config/locale/index.ts 中注册路由。
```

**📝 填写示例 1：功能介绍页**

```text
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /features/ai-writing
- Keywords: AI Writing, Content Generation, Blog Posts, SEO Optimization
- Description: AI-powered writing assistant that helps you create engaging content
- Reference: https://jasper.ai/features
- Sections: hero, benefits, features, use_cases, faq, cta

请创建中英文配置文件，并在 src/config/locale/index.ts 中注册路由。
```

**📝 填写示例 2：定价页**

```text
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /pricing
- Keywords: Pricing, Plans, Subscription, Free Trial
- Description: Choose the perfect plan for your needs
- Sections: hero, pricing_table, comparison, faq, cta

请创建中英文配置文件，并在 src/config/locale/index.ts 中注册路由。
```

**📝 填写示例 3：关于我们页**

```text
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /about
- Keywords: About Us, Team, Mission, Story
- Description: Learn about our mission and the team behind the product
- Sections: hero, story, team, values, cta

请创建中英文配置文件，并在 src/config/locale/index.ts 中注册路由。
```

**AI 会帮你做什么**：
1. ✅ 创建 `src/config/locale/messages/en/pages/[你的路径].json`
2. ✅ 创建 `src/config/locale/messages/zh/pages/[你的路径].json`
3. ✅ 在 `src/config/locale/index.ts` 中注册路由
4. ✅ 根据关键词生成页面内容（Hero、Features、FAQ 等区块）
5. ✅ 生成中英文双语内容

**⏱️ 预计耗时**：3-5 分钟/页面

---

### 🔧 使用 Skills 的注意事项

**✅ 使用前**：
1. 确保你使用的是支持 Skills 的 AI 工具（**推荐 Cursor**）
2. 确保项目已经在本地运行（`pnpm dev` 正常）
3. 准备好要填写的信息（网站名称、域名、关键词等）

**✅ 使用中**：
1. 完整复制提示词模板，替换 `[方括号]` 中的内容
2. 不要省略任何必填项（Route、Keywords、Description）
3. Reference 是可选的，但提供参考网站能让 AI 生成更好的内容

**✅ 使用后**：
1. 运行 `rm -rf .next` 清除缓存
2. 运行 `pnpm build` 验证代码是否正确
3. 运行 `pnpm dev` 查看效果
4. 访问对应的页面路径检查是否正常显示

**⚠️ 常见问题**：

**Q: 使用 Skill 后页面显示 404？**
A: 检查 `src/config/locale/index.ts` 中是否正确注册了路由，格式应该是 `'pages/your-route'`

**Q: 可以同时使用两个 Skills 吗？**
A: 可以！先用 `shipany-quick-start` 初始化项目，再用 `shipany-page-builder` 添加新页面

**Q: Skill 生成的内容不满意怎么办？**
A: 可以直接告诉 AI 修改对应的 JSON 文件，或者重新运行 Skill 并提供更详细的 Reference

---

## 🌟 第三阶段补充:深入理解氛围编程（Vibe Coding）

### 什么是氛围编程?

**氛围编程（Vibe Coding）** 是 ShipAny 提出的一种全新开发理念:通过 AI 助手和专业工具,让编程小白也能高效开发。

**核心思想**:
- 🤖 **AI 是你的编程伙伴**:不是替代你,而是辅助你
- 📚 **Skills 是 AI 的操作手册**:告诉 AI 如何专业地完成特定任务
- 🔗 **MCP 是知识库连接器**:让 AI 随时查阅官方文档

---

### 🔧 MCP（文档助手）详解

**什么是 MCP?**

MCP 可以让 AI 在开发时随时查阅 ShipAny 的官方文档,就像给 AI 配了一个"随身文档助手"。

**为什么需要它?**

传统方式:你需要打开浏览器 → 搜索文档 → 复制内容 → 粘贴给 AI  
使用 MCP:AI 自动查阅文档,无需你手动操作!

**📌 使用 MCP 的三种方式**:

#### 方式 1:直接分享文档链接（最简单,推荐新手）

```text
🤖 告诉 AI:
请阅读这个文档:https://www.shipany.ai/zh/docs/page-builder
然后帮我创建一个新的功能介绍页面。
```

#### 方式 2:克隆文档到本地

```bash
# 在终端运行
git clone git@github.com:shipanyai/shipany-two-docs.git
```

然后告诉 AI:

```text
🤖 告诉 AI:
请扫描 shipany-two-docs 文件夹中的文档,
了解如何配置支付功能,然后帮我完成配置。
```

#### 方式 3:使用 MCP 服务器（高级用法）

ShipAny 推荐使用 **Ref MCP** 或 **Context7 MCP**,配置后 AI 可以自动查阅文档。

**🔍 MCP 使用场景对比**:

| 场景 | 传统方式 | 使用 MCP |
|------|---------|----------|
| 查询如何配置数据库 | 打开文档 → 搜索 → 复制 → 粘贴给 AI | AI 自动查阅文档并配置 |
| 了解某个区块的用法 | 打开文档 → 查找示例 → 手动修改 | AI 自动查阅并生成代码 |
| 排查部署错误 | 搜索错误信息 → 查找解决方案 | AI 自动查阅文档并修复 |

**💡 小白建议**:

如果你是编程新手,推荐使用**方式 1**（直接分享链接）,最简单直接。

---

### 🎯 Skills（AI 技能包）深度解析

**什么是 Skill?**

Skill 就是给 AI 准备的"专业操作手册"。就像你给师傅一份详细的装修图纸,师傅就知道该怎么干活。

**📂 Skill 的工作流程**:

1. **你发送提示词**:`use shipany-quick-start skill to start my project`
2. **AI 读取操作手册**:了解这个 Skill 的功能和步骤
3. **AI 规划任务**:拆分成具体的操作步骤
4. **AI 执行任务**:修改配置、生成文件、运行脚本
5. **AI 报告结果**:告诉你完成了哪些操作

**📊 Skill 使用效果对比**:

| 任务 | 不使用 Skill | 使用 Skill |
|------|-------------|-----------|
| 初始化项目 | 需要手动修改 10+ 个文件 | 一条指令完成 |
| 创建新页面 | 需要创建文件、注册路由、写内容 | 一条指令完成 |
| 出错风险 | 高（可能漏改文件） | 低（有明确的操作范围） |
| 耗时 | 30-60 分钟 | 3-5 分钟 |

---

### 🚀 氛围编程最佳实践（重点）

#### 1. 选择合适的 AI 工具

推荐使用以下工具:
- **Cursor**（推荐）:内置 AI,支持 Skills,体验最好
- **Claude Code**:官方工具,支持 Skills
- **Windsurf**:新兴工具,功能强大

#### 2. 善用提示词模板

本教程提供了大量提示词模板,直接复制使用即可:
- 看到 `🤖 告诉 AI` 标记的内容,直接复制粘贴
- 把 `[方括号]` 中的内容替换成你的实际信息

**示例**:

```text
原模板:
Use ".claude/skills/shipany-quick-start" to setup my project.
Project Details:
- Name: [你的网站名称]
- Domain: [你的域名]

你的实际使用:
Use ".claude/skills/shipany-quick-start" to setup my project.
Project Details:
- Name: AI 写作助手
- Domain: aiwriter.com
```

#### 3. 分步骤执行

不要一次性让 AI 做太多事情:

✅ **正确做法**:
- 第一步:让 AI 初始化项目
- 第二步:让 AI 创建首页
- 第三步:让 AI 创建功能页

❌ **错误做法**:
- 一次性让 AI 完成整个网站

#### 4. 及时验证

每次 AI 修改代码后,立即验证:

```bash
# 清除缓存
rm -rf .next

# 重新构建
pnpm build

# 启动开发服务器
pnpm dev
```

然后在浏览器中检查效果。

#### 5. 遇到问题怎么办?

**如果 AI 没有发现你的 Skill**:

```text
🤖 告诉 AI:
请使用 ".claude/skills/shipany-quick-start" 这个技能来初始化我的项目。
（明确指定 Skill 的完整路径）
```

**如果 AI 执行出错**:

```text
🤖 告诉 AI:
刚才出现了这个错误:[复制错误信息]
请帮我修复。
```

**如果生成的内容不满意**:

```text
🤖 告诉 AI:
请修改 src/config/locale/messages/zh/pages/index.json 文件,
把标题改为"[你想要的标题]",
把描述改为"[你想要的描述]"。
```

---

### 💡 氛围编程常见问题

**Q1: 我不会写代码,能用 ShipAny 吗?**

A: **完全可以!** 这就是氛围编程的核心价值:
- ✅ 你只需要会复制粘贴提示词
- ✅ AI 会帮你写代码、修改配置
- ✅ 本教程提供了所有需要的提示词模板

**Q2: 可以同时使用多个 Skills 吗?**

A: 可以,但建议按顺序使用:
1. 先用 `shipany-quick-start` 初始化项目
2. 再用 `shipany-page-builder` 创建新页面

**Q3: Skill 生成的内容不满意怎么办?**

A: 直接告诉 AI 修改:
```text
🤖 告诉 AI:
请把首页的标题改为"[新标题]",
把第一个功能的描述改为"[新描述]"。
```

**Q4: 我需要学习 JSON 或 Markdown 吗?**

A: **不需要!** 你只需要:
- 告诉 AI 你想要什么内容
- AI 会自动生成正确的格式
- 如果需要修改,继续告诉 AI 即可

**Q5: 推荐使用哪个 AI 模型?**

A: 在 Cursor 中推荐使用:
- `Auto`（自动选择）
- `GPT-5.2`（最新）
- `Opus 4.5`（强大）

这些模型对 Skills 的理解更准确。

---

### 🎓 氛围编程学习路径

**第 1 天:熟悉基础操作**
- 学会使用 `shipany-quick-start` 初始化项目
- 学会让 AI 修改基础配置

**第 2 天:创建页面**
- 学会使用 `shipany-page-builder` 创建新页面
- 学会告诉 AI 使用不同的区块

**第 3 天:深度定制**
- 学会让 AI 修改页面内容
- 学会让 AI 调整样式和布局

**第 4 天:独立开发**
- 不看教程,尝试自己告诉 AI 创建新功能
- 遇到问题时,学会查阅文档或让 AI 查阅

---


## 🎨 第四阶段：品牌与基础信息修改（AI 辅助）（预计耗时：1-2小时）

### 4.1 AI 一键初始化 (使用 shipany-quick-start 技能)
ShipAny 内置了强大的 AI 技能。如果你使用 Cursor,可以直接告诉它帮你做。

**🤖 告诉 AI(Cursor Chat)**:
```text
Use ".claude/skills/shipany-quick-start" to setup my project.

Project Details:
- Name: [你的网站名称]
- Domain: [你的域名, 如 my-saas.com]
- Description: [一句话描述你的产品]
- Content Reference: [参考网站链接, 可选]

Please update common.json, landing.json and generate logo placeholders.
```
*(如果没有生效,请继续手动操作下面的步骤)*

### 4.2 手动修改基础信息
如果不使用技能，我们需要手动让 AI 修改配置文件。

**核心文件路径**：
- `src/config/locale/messages/en/common.json` (英文通用)
- `src/config/locale/messages/zh/common.json` (中文通用)
- `src/config/locale/messages/*/landing.json` (首页文字)

**🤖 告诉 AI**：
```text
请帮我修改网站品牌信息，同时更新 en 和 zh 的 common.json 和 landing.json：

1. 网站及品牌名称: "[你的网站名称]"
2. 网站描述: "[你的产品一句话介绍]"
3. 社交链接 (Footer):
   - Twitter: [链接]
   - Email: [邮箱]
```

### 4.3 生成 Logo
网站需要两个图标：`public/logo.png` (主 Logo) 和 `public/favicon.ico` (浏览器标签图标)。

**🤖 告诉 AI**：
```text
请使用 DALL-E 3 (或你可用的画图工具) 为我生成一个 Logo。
风格：[描述风格，如：极简、蓝色系、科技感]
内容：[描述内容，如：字母 S 的抽象图形]
生成后请帮我保存为 public/logo.png，并转换一个版本保存为 public/favicon.ico
```
*(如果 AI 无法直接画图保存，请它生成提示词，你自己去 Midjourney 生成后放入 public 文件夹)*

### 4.4 完整配置清单（参考官方文档）

以下是需要自定义的所有配置文件清单。你可以根据需要选择性修改，或者全部交给 AI 处理。

#### ✅ 必改项

| 文件 | 说明 | AI 提示词 |
|------|------|-----------|
| `.env.development` | 应用基本信息 | 见 1.3 节 |
| `public/logo.png` | 网站 Logo | 见 4.3 节 |
| `public/favicon.ico` | 浏览器图标 | 见 4.3 节 |

#### 🔶 推荐修改项

| 文件 | 说明 | AI 提示词 |
|------|------|-----------|
| `src/config/locale/messages/en/common.json` | 英文通用文案 | 见 4.2 节 |
| `src/config/locale/messages/zh/common.json` | 中文通用文案 | 见 4.2 节 |
| `src/config/locale/messages/en/landing.json` | 英文首页内容 | 见 5.1 节 |
| `src/config/locale/messages/zh/landing.json` | 中文首页内容 | 见 5.1 节 |
| `public/sitemap.xml` | 网站地图 | 见 9.2 节 |

#### 📝 可选修改项

**法律文档**：
```text
🤖 告诉 AI：
请帮我更新以下法律文档，将所有 "ShipAny" 替换为 "[你的网站名称]"，
将 "support@shipany.ai" 替换为 "[你的邮箱]"：

1. content/pages/privacy-policy-en.mdx（英文隐私政策）
2. content/pages/privacy-policy-zh.mdx（中文隐私政策）
3. content/pages/terms-of-service-en.mdx（英文服务条款）
4. content/pages/terms-of-service-zh.mdx（中文服务条款）
```

**主题样式**（高级）：
```text
🤖 告诉 AI：
我想修改网站的主题颜色。请帮我修改 src/config/style/theme.css：

1. 主色调改为：[颜色描述，如：深蓝色 #1e40af]
2. 强调色改为：[颜色描述，如：橙色 #f97316]
3. 背景色改为：[颜色描述，如：浅灰 #f8fafc]

请保持 CSS 变量的结构不变，只修改颜色值。
```

**多语言设置**（高级）：
- 文件：`src/config/locale/index.ts`
- 说明：控制网站支持的语言（默认中英文）
- 小白建议：保持默认即可

**✅ 验证修改**：

修改完成后，运行以下命令验证：

```bash
# 清除缓存
rm -rf .next

# 重新构建
pnpm build
```

如果构建成功（没有报错），说明配置正确！


## 📝 第五阶段:修改页面内容(预计耗时:1-2小时)

### 5.1 修改首页 (Landing Page)
首页内容在 `src/config/locale/messages/*/pages/index.json`。

**🤖 告诉 AI**：
```text
请帮我重写首页文案 (src/config/locale/messages/*/pages/index.json)：

1. Hero 区域:
   - 标题: "[吸引人的主标题]"
   - 副标题: "[你的价值主张]"
   
2. Features 区域:
   - 替换为我的3个核心功能:
     1. [功能1标题]: [描述]
     2. [功能2标题]: [描述]
     3. [功能3标题]: [描述]

3. FAQ 区域:
   - 添加3个常见问题及回答。
```

### 5.2 创建新页面 (使用 shipany-page-builder 技能)

**📚 页面类型说明**：

ShipAny 支持两种页面类型：

| 类型 | 说明 | 适用场景 | 示例 |
|------|------|----------|------|
| **静态页面** | 使用 MDX 文件编写 | 法律文档、博客文章 | 隐私政策、服务条款 |
| **动态页面** | 使用 JSON 配置生成 | 营销页面、功能介绍 | 功能页、定价页 |

**编程小白建议**：使用动态页面！只需要填写 JSON 配置，AI 会帮你生成，无需写代码。

---

**🎯 创建动态页面示例**：

比如你想做一个 `/features/ai-chat` 页面介绍 AI 聊天功能。

**🤖 告诉 AI**：
```text
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /features/ai-chat
- Keywords: AI Chat, GPT-4, Chatbot, Conversation
- Description: An advanced AI chat interface powered by GPT-4
- Reference: https://chat.openai.com (可选，提供参考网站)

请创建中英文配置文件，并在 src/config/locale/index.ts 中注册路由。
```

**AI 会自动帮你**：
1. 创建 `src/config/locale/messages/en/pages/features/ai-chat.json`
2. 创建 `src/config/locale/messages/zh/pages/features/ai-chat.json`
3. 在 `src/config/locale/index.ts` 中注册路由
4. 生成包含 Hero、Features、FAQ、CTA 等区块的完整页面

---

**🎯 更多页面创建示例**：

**示例 1：定价页面**
```text
🤖 告诉 AI：
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /pricing
- Keywords: Pricing, Plans, Subscription, Cost
- Description: Flexible pricing plans for every need
- Sections: hero, pricing_table, faq, cta

请创建中英文配置文件。
```

**示例 2：关于我们页面**
```text
🤖 告诉 AI：
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /about
- Keywords: About Us, Team, Mission, Vision
- Description: Learn more about our company and team
- Sections: hero, team, values, cta

请创建中英文配置文件。
```

**示例 3：使用案例页面**
```text
🤖 告诉 AI：
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /use-cases/marketing
- Keywords: Marketing Automation, Email Campaigns, Analytics
- Description: Powerful marketing automation tools
- Sections: hero, benefits, features, testimonials, cta

请创建中英文配置文件。
```

---

**✅ 验证新页面**：

创建完成后：
1. 运行 `pnpm dev`
2. 访问 `http://localhost:3000/features/ai-chat`（替换为你的路由）
3. 检查页面是否正常显示

> 💡 **提示**：如果页面显示 404，检查 `src/config/locale/index.ts` 中是否正确注册了路由。

### 5.3 法律文档
不要忽视隐私政策和服务条款。
修改文件：`content/pages/privacy-policy*.mdx` 和 `terms-of-service*.mdx`。

**🤖 告诉 AI**：
```text
请帮我把 content/pages/ 下的隐私政策和服务条款中的 "ShipAny" 替换为 "[你的网站名称]"，"support@shipany.ai" 替换为 "[你的邮箱]"。
```

---

## 💰 第六阶段:支付配置 (Stripe)(预计耗时:1-2小时)

### 6.1 获取 API 密钥
1. 注册并登录 [Stripe Dashboard](https://dashboard.stripe.com/)。
2. 开启右上角的 **Test Mode** (测试模式)。
3. 进入 **Developers** -> **API keys**。
4. 复制 `Publishable key` (pk_test_...) 和 `Secret key` (sk_test_...)。

### 6.2 配置环境变量与后台
1. 打开 `.env.development`，填入：
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   ```
2. 启动项目 (`pnpm dev`)，进入管理后台 `http://localhost:3000/admin`。
3. 在 **Settings -> Payment -> Stripe** 中，同样填入这两个 Key 并保存。

### 6.3 设计价格表
定价文件在 `src/config/locale/messages/*/pages/pricing.json`。

**🤖 告诉 AI**：
```text
请帮我修改定价表 (pricing.json)，保留两个方案：

1. Basic 版 ($9/月):
   - product_id: "basic_monthly"
   - features: [功能1, 功能2]
   
2. Pro 版 ($29/月, 推荐):
   - product_id: "pro_monthly"
   - features: [全部功能, 优先支持]
   
注意：amount 单位是分 ($9 = 900)。请同时更新 en 和 zh 文件。
```

### 6.4 验证支付
在本地环境，去 `/pricing` 页面，点击订阅。Stripe 提供了测试卡号（如 `4242 4242 4242 4242`），可以直接模拟支付成功。

---

## ☁️ 第七阶段:配置文件存储 (Cloudflare R2)(预计耗时:30-60分钟)

要在网站上上传头像或生成图片,你需要文件存储服务。

### 7.1 创建存储桶
1. 登录 Cloudflare -> **R2**。
2. 点击 **Create bucket**，起个名字（如 `my-app-storage`）。
3. 进入桶设置，找到 **Public Development URL** (R2.dev 子域名)，点击 **Enable**。复制这个链接。

### 7.2 获取 R2 密钥
1. 在 R2 首页右侧点击 **Manage R2 API Tokens**。
2. 点击 **Create API token**。
3. 权限选择 **Admin Read & Write**。
4. 创建后，复制 `Access Key ID` 和 `Secret Access Key`。

### 7.3 配置管理后台
1. 进入本地管理后台 `http://localhost:3000/admin`。
2. 进入 **Settings -> Storage -> Cloudflare R2**。
3. 填入：
   - Access Key ID
   - Secret Access Key
   - Bucket Name (你刚才起的桶名)
   - Account ID (在 R2 首页右上方可以看到)
   - Public Domain (刚才开启的 R2.dev 链接，或者你绑定的自定义域名)
4. 点击保存。

**验证**：去个人设置页 (`/settings/profile`) 试着上传一张新头像。如果成功，说明配置搞定！

### 7.4 配置自定义域名（推荐）

**为什么需要自定义域名？**

R2 默认的 `.r2.dev` 域名有速率限制，正式上线时建议配置自定义域名。

**📌 配置步骤**：

1. **添加自定义域名**：
   - 在 R2 存储桶设置页面，点击 **Custom Domains** 右侧的 **Add** 按钮
   - 输入你的自定义域名，如 `r2.yourdomain.com`
   - 点击 **Add Domain**

2. **配置 DNS 解析**：
   - 如果你的域名托管在 Cloudflare，DNS 记录会自动添加
   - 如果不是，需要手动在域名服务商添加 CNAME 记录：
     ```
     类型：CNAME
     名称：r2
     值：（Cloudflare 提供的目标地址）
     ```

3. **更新管理后台配置**：
   - 回到 **Settings -> Storage -> Cloudflare R2**
   - 将 **Public Domain** 改为 `https://r2.yourdomain.com`
   - 保存配置

**✅ 验证自定义域名**：

上传一张图片后，右键"在新标签页中打开图片"，检查图片 URL 是否使用了你的自定义域名。

---

## 🚀 第八阶段:部署上线 (Vercel)(预计耗时:30-60分钟)

### 8.1 推送代码到 GitHub
**📌 终端指令**：
```bash
# 初始化 git (如果还没做)
git init

# 提交所有修改
git add .
git commit -m "准备上线"

# 关联 GitHub 仓库 (先去 GitHub 建个空仓库，Private私有库)
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送
git push -u origin main (或者 dev)
```

### 8.2 在 Vercel 部署
1. 登录 [Vercel](https://vercel.com)。
2. 点击 **Add New...** -> **Project**。
3. 导入刚才推送的 GitHub 仓库。
4. **Environment Variables (最关键一步)**：
   - 把你本地 `.env.development` 里的内容，逐条复制进去。
   - **注意**：
     - `NEXT_PUBLIC_APP_URL`: 修改为你的线上真实域名（如 `https://my-saas.com`，如果没有先填 Vercel 分配的）。
     - `DATABASE_URL`: 确保是 Neon 的地址。
5. 点击 **Deploy**。

**📝 详细的环境变量配置指南**：

在 Vercel 部署页面，你需要配置以下环境变量。建议先在本地创建 `.env.production` 文件：

```env
# ===== 必填项 =====
# 应用基本信息
NEXT_PUBLIC_APP_URL = "https://yourdomain.com"  # 改为你的真实域名
NEXT_PUBLIC_APP_NAME = "你的网站名称"

# 数据库（使用 Neon 云数据库地址）
DATABASE_URL = "postgresql://user:password@ep-xxx.pooler.supabase.com:6543/postgres"
DATABASE_PROVIDER = "postgresql"
DB_SINGLETON_ENABLED = "false"  # Vercel 必须设为 false
DB_MAX_CONNECTIONS = "1"

# 登录鉴权
AUTH_SECRET = "你的随机密钥"  # 使用 openssl rand -base64 32 生成

# ===== 可选项（根据需要填写） =====
# 主题和外观
NEXT_PUBLIC_THEME = "default"
NEXT_PUBLIC_APPEARANCE = "system"

# Stripe 支付（如果配置了支付功能）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_live_..."  # 注意：生产环境用 pk_live
STRIPE_SECRET_KEY = "sk_live_..."  # 注意：生产环境用 sk_live
```

**⚠️ 重要提示**：

1. **DATABASE_URL**：必须使用云数据库（Neon/Supabase），不能用本地数据库
2. **DB_SINGLETON_ENABLED**：Vercel 部署必须设为 `"false"`
3. **STRIPE 密钥**：生产环境要用 `pk_live` 和 `sk_live`，不是 `pk_test`
4. **NEXT_PUBLIC_APP_URL**：必须是 `https://` 开头的完整域名

**📌 在 Vercel 添加环境变量的步骤**：

1. 在 Vercel 部署页面，找到 **Environment Variables** 区域
2. 逐条添加上面的环境变量：
   - **Key**: 变量名（如 `NEXT_PUBLIC_APP_URL`）
   - **Value**: 变量值（如 `https://yourdomain.com`）
   - **Environment**: 选择 `Production`（生产环境）
3. 添加完所有变量后，点击 **Deploy**

**✅ 验证部署**：

部署完成后（约 2-3 分钟）：
1. 点击 **Visit** 按钮访问你的网站
2. 检查页面是否正常显示
3. 尝试注册/登录功能是否正常
4. 检查浏览器控制台是否有报错

**🔧 部署后修改环境变量**：

如果需要修改环境变量：
1. 进入 Vercel 项目管理页面
2. 点击 **Settings** -> **Environment Variables**
3. 修改对应的变量值
4. 进入 **Deployments** 页面
5. 选择最新的部署，点击 **Redeploy** 重新部署

> 💡 **提示**：每次修改环境变量后，必须重新部署才能生效！

### 8.3 绑定域名
部署完成后，在 Vercel 项目设置 -> **Domains** 中添加你的域名。Vercel 会提示你在域名服务商（如阿里云、Namecheap）添加 DNS 记录（通常是 CNAME 或 A 记录），照做即可。

---

## 🔍 第九阶段:SEO 优化与谷歌收录(预计耗时:1-2小时)

### 9.1 完善元数据 (Metadata)
这一步决定了用户在谷歌搜索结果里看到什么。

**🤖 告诉 AI**：
```text
请检查 src/config/locale/messages/en/pages/index.json。
优化 metadata 字段：
- title: 必须包含关键词 "[你的核心关键词]"，长度 <60字符。
- description: 吸引人的描述，包含关键词，长度 <160字符。
```

### 9.2 更新站点地图 (Sitemap)
**🤖 告诉 AI**：
```text
请更新 public/sitemap.xml：
1. 将所有 example.com 替换为我的真实域名: [你的域名]
2. 确保所有新页面（如 /pricing, /features/ai-chat）都在列表中。
```

### 9.3 提交到 Google Search Console
1. 访问 [Google Search Console](https://search.google.com/search-console)。
2. 添加你的域名（URL 前缀或域属性）。
3. 在左侧菜单找到 **Sitemaps**。
4. 提交 `https://你的域名/sitemap.xml`。
5. 等待谷歌爬虫抓取（通常需要几天）。

### 9.4 配置 Google Analytics (可选)
1. 注册 Google Analytics，获取 Measure ID (`G-xxxxxx`)。
2. 进管理后台 `Settings -> Analytics`。
3. 填入 ID 并保存。

---

## 🛠️ 第十阶段:后续维护

### 如何修改内容？
1. **修改**：在本地代码中修改。
2. **预览**：`pnpm dev` 确认效果。
3. **上线**：
   ```bash
   git add .
   git commit -m "修改了XXX"
   git push
   ```
   Vercel 会自动检测到推送并开始重新部署。

### 遇到报错怎么办？
1. 查看 Vercel 后台的 **Logs**。
2. 复制报错红字，发给 AI。

---

## ⏱️ 附录：上线时间预估

| 阶段 | 预估耗时 | 备注 |
|------|----------|------|
| 0. 准备工作 | 30-60 mins | 取决于网速和账号注册速度 |
| 1. 本地部署 | 20-30 mins | 包含分支选择和环境变量配置 |
| 2. 数据库配置 | 45-60 mins | 第一次用 Neon 可能需要摸索，包含故障排查 |
| 3. 认识 AI Skills | 10-15 mins | 阅读理解即可 |
| 4. 品牌修改 | 1.5-2 hours | 设计 Logo 和改文案比较花时间 |
| 5. 内容修改 | 2-3 hours | 核心业务页面的打磨没有上限 |
| 6. 支付配置 | 1-1.5 hours | 注册 Stripe 和测试支付 |
| 7. 文件存储 | 45-60 mins | 包含 R2 配置和自定义域名设置 |
| 8. 部署上线 | 45-60 mins | Vercel 是自动化的，但环境变量配置需要仔细 |
| 9. SEO 配置 | 1-1.5 hours | 主要是等待谷歌生效 |
| **总计** | **8-14 小时** | 建议分 2-4 个晚上完成，不要着急 |

**💡 小白建议**：

- ✅ **第一天**（3-4小时）：完成阶段 0-2，确保本地环境跑起来
- ✅ **第二天**（3-4小时）：完成阶段 3-5，定制品牌和内容
- ✅ **第三天**（2-3小时）：完成阶段 6-7，配置支付和存储
- ✅ **第四天**（2-3小时）：完成阶段 8-9，部署上线和 SEO

**🎯 快速上线版本**（6-8小时）：

如果你想快速上线一个 MVP（最小可行产品），可以跳过以下可选步骤：
- ❌ 跳过支付配置（阶段 6）
- ❌ 跳过文件存储（阶段 7）
- ✅ 只做基础的品牌定制和首页修改
- ✅ 先用 Vercel 默认域名，后续再绑定自定义域名

---

## 🎉 恭喜完成！

如果你已经走到这一步，恭喜你成功上线了自己的 SaaS 网站！🚀

**接下来可以做什么？**

1. 📊 **监控数据**：通过 Google Analytics 查看访问数据
2. 💰 **开始推广**：在社交媒体、论坛分享你的产品
3. 🔧 **持续优化**：根据用户反馈不断改进功能
4. 📈 **SEO 优化**：定期更新内容，提升搜索排名

祝你的产品大卖！🚀

