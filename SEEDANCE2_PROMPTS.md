# 🎬 Seedance 2.0 项目 AI 提示词指导

> 📖 本文档包含为 Seedance 2.0 项目定制的 AI 提示词模板，配合 ShipAny 模板的 AI Skills 使用，帮助你快速搭建完整的产品网站。

---

## 📋 第一步：项目初始化（使用 shipany-quick-start Skill）

将以下提示词复制给 AI，一次性完成项目基础配置：

```text
Use ".claude/skills/shipany-quick-start" to setup my project.

Project Details:
- Name: Seedance 2.0
- Name (中文): Seedance 2.0 - AI视频生成
- Domain: seedance2.com (请替换为你的实际域名)
- Description: Seedance 2.0 是字节跳动新一代多模态AI视频生成模型，支持文生视频和图生视频，创造电影级画质的动态视频内容。
- Description (English): Seedance 2.0 is ByteDance's next-generation multimodal AI video generation model, supporting text-to-video and image-to-video with cinematic quality.
- Keywords: AI视频生成, 文生视频, 图生视频, Seedance, 字节跳动, AI Video Generation, Text to Video, Image to Video
- Content Reference: https://runwayml.com, https://pika.art, https://kling.kuaishou.com

Please update:
1. common.json (中英文) - 网站名称、描述、SEO信息
2. landing.json / index.json (中英文) - 首页内容
3. Generate logo placeholders
4. Update sitemap.xml
```

---

## 📋 第二步：首页内容定制

如果需要进一步优化首页，使用以下提示词：

```text
请帮我优化首页内容，参考以下产品信息：

产品名称：Seedance 2.0
产品定位：字节跳动新一代AI视频生成模型

核心卖点（Features 区块，6个）：
1. 🎬 文生视频 - 用文字描述创造动态视频，支持详细的场景、角色、动作描述
2. 🖼️ 图生视频 - 上传静态图片，AI为其注入生命力和动态效果
3. 📐 物理模拟 - 引入"声学物理场"技术，真实模拟物体运动和光影互动
4. 🎥 电影画质 - 支持1080p乃至2K超清输出，消除抖动和伪影
5. 📖 复杂叙事 - 多镜头、多角色故事，场景转换保持高度一致性
6. 🎨 多风格支持 - 写实、动漫、赛博朋克、水彩等多种视觉风格

Hero 区块内容：
- 标题：用 AI 创造电影级视频
- 副标题：Seedance 2.0 - 字节跳动新一代多模态视频生成模型
- 描述：将文字或图片转化为高质量动态视频，支持30秒以上复杂叙事，1080p/2K超清输出
- CTA按钮：立即体验 / 了解更多

请修改：
- src/config/locale/messages/en/pages/index.json
- src/config/locale/messages/zh/pages/index.json
```

---

## 📋 第三步：添加 FAQ 常见问题

```text
请帮我更新首页的 FAQ 区块，添加以下常见问题：

1. Q: Seedance 2.0 是免费的吗？
   A: 参考行业惯例，很可能采用"免费额度+付费升级"的模式。生成5秒视频的价格预计低至0.5元人民币。

2. Q: 支持生成多长的视频？
   A: 目标支持生成超过30秒的复杂叙事视频，远超早期视频生成模型的时长限制。

3. Q: 支持哪些语言输入？
   A: 作为字节跳动产品，中文提示词理解是其强项，同时也支持英文等多种语言。

4. Q: 可以在哪些平台使用？
   A: 预计通过字节跳动AI产品矩阵（如豆包App）提供访问，也可能提供独立API供开发者集成。

5. Q: Seedance 2.0 和其他视频生成AI有什么区别？
   A: Seedance 2.0 采用"声学物理场"和"世界模型先验"技术，更好地模拟真实世界物理规律，生成更真实可信的视频内容。

请修改对应的 index.json 文件（中英文）。
```

---

## 📋 第四步：创建功能介绍页（使用 shipany-page-builder Skill）

### 4.1 文生视频功能页

```text
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /features/text-to-video
- Keywords: 文生视频, Text to Video, AI视频生成, 文字描述, 场景创作
- Description: 用文字描述创造动态视频，支持详细的场景、角色和动作描述
- Reference: https://runwayml.com/ai-tools/gen-3
- Sections: hero, benefits, features, use_cases, faq, cta

功能要点：
- 支持详细的文本提示词
- 多种视觉风格（写实、动漫、水彩等）
- 1080p/2K 高清输出
- 物理规律模拟

请创建中英文配置文件，并在 src/config/locale/index.ts 中注册路由。
```

### 4.2 图生视频功能页

```text
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /features/image-to-video
- Keywords: 图生视频, Image to Video, 图片动态化, AI动画, 静态图转视频
- Description: 上传静态图片，AI为其注入生命力，创造动态效果
- Reference: https://pika.art
- Sections: hero, benefits, features, showcases, faq, cta

功能要点：
- 上传任意图片
- 智能识别图片元素
- 自然流畅的运动效果
- 支持补充运动描述

请创建中英文配置文件，并在 src/config/locale/index.ts 中注册路由。
```

---

## 📋 第五步：创建定价页

```text
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /pricing
- Keywords: 定价, Pricing, 套餐, Plans, 免费试用, Free Trial
- Description: 选择适合您的 Seedance 2.0 套餐方案
- Sections: hero, pricing_table, comparison, faq, cta

定价方案建议：
1. 免费版 - 每月10次生成，720p画质，5秒视频
2. 基础版 - ¥29/月，每月100次生成，1080p画质，10秒视频
3. 专业版 - ¥99/月，无限生成，2K画质，30秒视频，优先队列
4. 企业版 - 定制价格，API接入，批量生成，专属客服

请创建中英文配置文件，并在 src/config/locale/index.ts 中注册路由。
```

---

## 📋 第六步：创建使用案例页

```text
Use ".claude/skills/shipany-page-builder" to build a new page.

- Route: /use-cases
- Keywords: 使用案例, Use Cases, 应用场景, 行业应用, 创意视频
- Description: 探索 Seedance 2.0 在各行业的应用场景
- Sections: hero, showcases, testimonials, features, cta

应用场景：
1. 营销与广告 - 快速制作产品宣传片、广告创意视频
2. 教育内容 - 将抽象概念可视化，制作生动教学视频
3. 创意与娱乐 - 个人短片、动漫、音乐视频创作
4. 社交媒体 - 为抖音、TikTok、Instagram生成吸睛内容
5. 影视原型 - 快速生成故事板或概念预览

请创建中英文配置文件，并在 src/config/locale/index.ts 中注册路由。
```

---

## 📋 操作注意事项

### ✅ 每次 AI 修改后验证

```bash
# 清除缓存
rm -rf .next

# 验证构建
pnpm build

# 重新启动开发服务器
pnpm dev
```

### ✅ 推荐执行顺序

| 步骤 | 内容 | 验证点 |
|------|------|--------|
| 第一步 | 项目初始化 | 首页显示正常 |
| 第二步 | 优化首页内容 | 中英文切换正常 |
| 第三步 | 添加 FAQ | 问答显示正常 |
| 第四步 | 创建功能页 | 新页面路由正常 |
| 第五步 | 创建定价页 | 定价表格显示正常 |
| 第六步 | 创建案例页 | 案例展示正常 |

### 💡 小贴士

- 每完成一个步骤，先验证再进行下一步
- 如果效果不满意，可以直接告诉 AI 修改具体的 JSON 文件
- 可以提供参考网站链接（如 Runway、Pika）让 AI 生成更好的内容

---

## 🔗 相关资源

- [ShipAny 官方文档](https://shipany.ai/docs)
- [Runway ML](https://runwayml.com) - 视频生成参考
- [Pika](https://pika.art) - 视频生成参考
- [快影 Kling](https://kling.kuaishou.com) - 国产视频生成参考

---

> 📝 **更新记录**
> - 2026-02-07: 初始版本创建
