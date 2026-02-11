# Seedance 2.0 SEO 文案优化需求文档

## 一、项目背景

### 1.1 当前状态
- **框架**: Next.js + next-intl 多语言 (11 种语言: en/zh/es/ar/pt/fr/de/ja/nl/pl/ru)
- **核心页面**: 首页 (index)、AI Video Generator、Text-to-Video、Image-to-Video、Pricing、About、Blog
- **SEO 机制**: `src/shared/lib/seo.ts` 统一处理 metadata, OG, Twitter Card, canonical URL
- **文案存储**: `src/config/locale/messages/{locale}/` 下的 JSON 文件
- **当前视频资源** (保留不动):
  - `hero-bg.mp4` (首页背景)
  - `showcase-racing.mp4`, `showcase-character.mp4`, `showcase-motion.mp4`, `showcase-cinematic.mp4`, `showcase-3d.mp4`
  - `example-1.mp4`, `example-2.mp4`

### 1.2 优化目标
围绕核心关键词 **"Seedance 2.0"** + **"AI video"** 系列长尾词，结合 Seedance 2.0 官方资料中的真实技术亮点进行文案重写，提升搜索排名和 CTR。**视频内容保持不变，仅优化文字文案。**

---

## 二、核心关键词策略

### 2.1 主关键词
| 优先级 | 关键词 | 搜索意图 |
|--------|--------|----------|
| P0 | Seedance 2.0 | 品牌词 |
| P0 | Seedance 2.0 AI video generator | 品牌+功能词 |
| P0 | AI video generator | 泛功能词 |

### 2.2 长尾关键词矩阵
| 类别 | 关键词 |
|------|--------|
| 品牌长尾 | Seedance 2.0 online, Seedance 2.0 free, Seedance AI video, Seedance 2.0 text to video |
| 功能长尾 | AI text to video generator, AI image to video, AI video maker online, generate video from text AI |
| 场景长尾 | AI video for social media, AI cinematic video maker, AI short film generator, AI video ad maker |
| 技术长尾 | AI video with sound, AI video multi-shot, AI video physics simulation, AI video camera control |
| 对比长尾 | Seedance 2.0 vs Sora, Seedance 2.0 vs Kling, best AI video generator 2026 |

### 2.3 LSI (语义相关) 关键词
`cinematic AI video`, `text-to-video AI`, `image animation AI`, `AI film maker`, `video generation model`, `AI video creation tool`, `multi-modal video AI`, `dual-branch diffusion transformer`, `AI audio-visual sync`, `native audio generation`

---

## 三、需要优化的文件清单

### 3.1 SEO Meta 层 (高优先级)

#### 文件 1: `src/config/locale/messages/en/common.json`
**位置**: `metadata` 对象

**当前文案**:
```json
{
  "title": "Seedance 2.0 AI Video Generator – Create Cinematic Videos with AI",
  "description": "Create stunning cinematic videos with Seedance 2.0 AI video generator. Text-to-video, image-to-video with smooth motion and professional quality. Try free now.",
  "keywords": "Seedance 2.0, AI video generator, text to video, image to video, cinematic AI video, Seedance AI, video generation, AI video maker"
}
```

**优化方向**:
- Title: 保持在 50-60 字符，前置 "Seedance 2.0"，加入差异化卖点 (如 "with Native Audio" 或 "Multi-Shot Cinematic")
- Description: 控制在 150-160 字符，突出 2.0 核心技术差异 (音画同步、多镜头叙事、12 素材多模态参考)，包含 CTA
- Keywords: 扩充至 15-20 个，覆盖长尾词矩阵

**建议新文案**:
```json
{
  "title": "Seedance 2.0 AI Video Generator | Cinematic AI Video with Native Audio",
  "description": "Seedance 2.0 generates cinematic AI videos with native audio sync, multi-shot storytelling, and 12-input multimodal control. Text-to-video & image-to-video in 2K. Try free.",
  "keywords": "Seedance 2.0, AI video generator, text to video, image to video, AI video with audio, cinematic AI video, multi-shot video AI, Seedance AI, AI video maker, video generation, AI film maker, AI video online free, AI short film generator, AI video creation tool, best AI video generator 2026"
}
```

---

#### 文件 2: `src/config/locale/messages/en/ai/video.json`
**位置**: `metadata` 对象

**当前文案**:
```json
{
  "title": "AI Video Generator",
  "description": "Generate videos with AI models, support text-to-video, image-to-video and video-to-video."
}
```

**问题**: Title 太短缺乏关键词密度，Description 过于笼统

**建议新文案**:
```json
{
  "title": "Seedance 2.0 AI Video Generator Online | Text & Image to Video Free",
  "description": "Create AI videos with Seedance 2.0 — the next-gen video generator with native audio, physics simulation, and multi-shot narrative. Text-to-video, image-to-video, video-to-video supported. Start free."
}
```

---

#### 文件 3: `src/config/locale/messages/en/pages/features/text-to-video.json`
**位置**: `metadata` 对象

**当前文案**:
```json
{
  "title": "Text to Video - AI Video Generation",
  "description": "Create dynamic videos from text descriptions. Support detailed scene, character, and action prompts with multiple visual styles and 1080p/2K HD output."
}
```

**建议新文案**:
```json
{
  "title": "Seedance 2.0 Text to Video | AI Video Generator from Text Prompts",
  "description": "Turn text into cinematic AI videos with Seedance 2.0. Describe scenes, characters & camera movements — get 2K HD video with native audio and physics-based motion. Try now."
}
```

---

#### 文件 4: `src/config/locale/messages/en/pages/features/image-to-video.json`
**位置**: `metadata` 对象

**当前文案**:
```json
{
  "title": "Image to Video - AI Animation",
  "description": "Upload static images and let AI breathe life into them. Intelligent image recognition with natural, fluid motion effects and custom animations."
}
```

**建议新文案**:
```json
{
  "title": "Seedance 2.0 Image to Video | Animate Photos with AI Video Generator",
  "description": "Transform any photo into cinematic video with Seedance 2.0 AI. Upload images, add motion & camera effects automatically. 2K output with native audio sync. Free to try."
}
```

---

#### 文件 5: `src/config/locale/messages/en/pages/pricing.json`
**位置**: `metadata` 对象

**当前文案**:
```json
{
  "title": "Pricing - Seedance 2.0",
  "description": "Choose the Seedance 2.0 plan that fits your needs. Start creating cinematic AI videos today.",
  "keywords": "pricing, plans, free trial, video generation, AI video, credits"
}
```

**建议新文案**:
```json
{
  "title": "Seedance 2.0 Pricing & Plans | AI Video Generator from $0/mo",
  "description": "Compare Seedance 2.0 plans — Free, Starter ($29/mo), Pro ($79/mo), Business ($199/mo). Get credits for AI video generation with text-to-video & image-to-video. Start free.",
  "keywords": "Seedance 2.0 pricing, AI video generator price, Seedance 2.0 free trial, AI video credits, Seedance plans, video generation cost"
}
```

---

#### 文件 6: `src/config/locale/messages/en/pages/blog.json`
**当前问题**: page title 显示 "ShipAny Blog" (模板遗留)

**需修正**:
```json
{
  "page": {
    "title": "Seedance 2.0 Blog",
    "sections": {
      "blog": {
        "title": "Seedance 2.0 Blog",
        "description": "Read the latest AI video generation tips, Seedance 2.0 updates, and creative tutorials."
      }
    }
  }
}
```

---

### 3.2 首页文案层 (高优先级)

#### 文件: `src/config/locale/messages/en/pages/index.json`

##### (A) Hero Section

**当前**:
```json
{
  "title": "Turn Ideas into Cinematic Videos with Seedance 2.0",
  "description": "Seedance 2.0 is a powerful AI video generator that brings your creative vision to life. From text prompts to image animation — create professional-grade videos with fluid motion, realistic physics, and stunning visual effects. No editing experience needed."
}
```

**问题**: 未突出 2.0 的核心差异化 (音画同步/多镜头叙事/多模态参考)

**优化要点**:
- Title: 突出 "Seedance 2.0" 品牌 + 核心差异 (如 "Director-Level AI Video" 或 "Cinematic AI Video with Native Audio")
- Description: 融入资料中的核心卖点:
  - 双分支扩散变换器 → 原生音画同步
  - 多镜头叙事能力 → 不只是片段，是完整故事
  - 12 素材多模态输入 → 前所未有的控制力
  - 2K 输出 + 60 秒生成 15 秒视频
- Announcement badge: 利用起来做热点引流
- Tip: 加入社会证明

**建议新文案**:
```json
{
  "title": "Create Cinematic AI Videos with Native Audio — Seedance 2.0",
  "highlight_text": "Cinematic AI Videos",
  "description": "The world's first AI video generator with native audio-visual sync. Seedance 2.0 generates multi-shot cinematic sequences from text, images, video clips & audio — all in one prompt. 2K HD output, physics-based motion, and director-level camera control. No editing skills required.",
  "announcement": {
    "badge": "Trending",
    "title": "Seedance 2.0 — Rated Best AI Video Model 2026",
    "url": "/#showcase_grid"
  },
  "tip": "Trusted by filmmakers, content creators & marketing teams worldwide"
}
```

---

##### (B) Showcase Grid Section

每个 showcase 的 description 中自然嵌入 "Seedance 2.0"，并结合资料中的技术术语:

| Showcase ID | 当前标题 | 建议新标题 | 优化重点 |
|-------------|---------|-----------|---------|
| showcase-racing | Fluid, Realistic Motion | **Physics-Accurate Motion by Seedance 2.0** | 强调时空因果建模 (STCM)，重力、惯性、物体交互 |
| showcase-character | Expressive Character Animation | **Lifelike Character Animation** | 强调角色表情、肢体自然度 |
| showcase-motion | Multi-Character Consistency | **Multi-Shot Character Consistency** | 强调跨镜头角色服饰/面部一致性 |
| showcase-cinematic | Image-to-Cinematic Video | **Image to Cinematic Video with Native Audio** | 强调音画同步生成 |
| showcase-3d | 3D Action & Visual Effects | **Movie-Grade VFX & Action Sequences** | 强调电影级 CG 质感 |

每个 description 优化要点:
- 嵌入 "Seedance 2.0" 品牌词至少 1 次
- 引用资料中的真实技术特征 (STCM、双分支架构等)
- tags 增加搜索友好型标签

**建议新文案（showcase section label & description）**:
```json
{
  "label": "Powered by Seedance 2.0",
  "title": "See What Seedance 2.0 AI Video Generator Can Create",
  "description": "From high-speed action to intimate character stories — every frame below was generated by Seedance 2.0's dual-branch diffusion transformer with native audio sync."
}
```

**各 showcase item 建议**:

```json
[
  {
    "id": "showcase-racing",
    "title": "Physics-Accurate Motion",
    "description": "Seedance 2.0's Spatial-Temporal Causal Modeling (STCM) delivers motion that obeys real-world physics — gravity, inertia, and object interaction. Watch tire spray, camera tracking, and debris flow with cinematic precision no other AI video generator can match.",
    "tags": ["Physics Simulation", "STCM", "High-Speed", "Seedance 2.0"]
  },
  {
    "id": "showcase-character",
    "title": "Lifelike Character Animation",
    "description": "From subtle micro-expressions to full-body choreography, Seedance 2.0 brings AI characters to life with unprecedented naturalism. Powered by the dual-branch diffusion transformer, every gesture syncs perfectly with generated dialogue and audio.",
    "tags": ["Character Animation", "Facial Expression", "Audio Sync"]
  },
  {
    "id": "showcase-motion",
    "title": "Multi-Shot Character Consistency",
    "description": "Seedance 2.0 locks facial features, clothing textures, and body proportions across every angle and scene. This action-packed chase sequence maintains pixel-level character identity through wide shots, close-ups, and rapid cuts — ideal for ads, short films, and branded video series.",
    "tags": ["Character Consistency", "Multi-Shot", "Narrative", "Identity Lock"]
  },
  {
    "id": "showcase-cinematic",
    "title": "Image to Cinematic Video with Audio",
    "description": "Upload a single photo and Seedance 2.0 transforms it into an immersive cinematic clip — complete with native audio, dynamic camera movement, and atmospheric effects. The dual-branch architecture generates sound and vision simultaneously, eliminating the 'dubbed' feel of other AI tools.",
    "tags": ["Image to Video", "Native Audio", "Cinematic", "Dual-Branch"]
  },
  {
    "id": "showcase-3d",
    "title": "Movie-Grade VFX & Action Sequences",
    "description": "Seedance 2.0 generates complex 3D action sequences with physically accurate motion, dramatic lighting, and blockbuster-quality visual effects. Cloth dynamics, fluid splashes, and impact physics rival professional CG studios — all from a single text prompt.",
    "tags": ["3D Animation", "VFX", "Action", "Physics Engine"]
  }
]
```

---

##### (C) Features Section

根据 Seedance 2.0 资料重新定义 6 个特征，突出 2.0 独有能力:

| # | 当前 | 建议替换为 | 技术依据 |
|---|------|-----------|---------|
| 1 | Text-to-Video | **Multi-Modal Input (12 References)** | 支持同时 9 图+3 视频+3 音频+文字 |
| 2 | Image-to-Video | **Native Audio-Visual Sync** | 双分支扩散架构，音画帧级对齐，口型误差 < 1 帧 |
| 3 | Physics Engine | **Physics-Aware Generation** | 时空因果建模，理解重力、惯性、物体交互 |
| 4 | Cinematic Output | **Auto Camera & Directing** | 自运镜，AI 自动规划分镜和运镜 |
| 5 | Narrative Continuity | **Multi-Shot Storytelling** | 多镜头叙事，角色/光影/风格统一 |
| 6 | Style Versatility | **First & Last Frame Control** | 首尾帧控制，精确转场和节奏 |

**建议新文案**:
```json
{
  "id": "features",
  "title": "What Makes Seedance 2.0 the Best AI Video Generator",
  "description": "Six breakthrough capabilities that set Seedance 2.0 apart from every other AI video tool.",
  "items": [
    {
      "title": "Multi-Modal Input (12 References)",
      "description": "Upload up to 9 images, 3 video clips, and 3 audio files as references. Use @mention syntax to assign each asset's role — character, style, camera, or soundtrack.",
      "icon": "RiFileTextLine"
    },
    {
      "title": "Native Audio-Visual Sync",
      "description": "The dual-branch diffusion transformer generates video and audio in parallel. Lip-sync accuracy within 1 frame — no more 'dubbed' AI videos.",
      "icon": "RiMusic2Line"
    },
    {
      "title": "Physics-Aware Generation",
      "description": "Spatial-Temporal Causal Modeling (STCM) understands gravity, inertia, and object interaction. Cloth flows, liquids splash, and light behaves realistically.",
      "icon": "RiSettings3Line"
    },
    {
      "title": "Auto Camera & Directing",
      "description": "Seedance 2.0 acts as your AI director — automatically planning shot sequences, camera angles, and transitions based on your scene description.",
      "icon": "RiFilmLine"
    },
    {
      "title": "Multi-Shot Storytelling",
      "description": "Generate connected multi-scene narratives with consistent characters, lighting, and atmosphere across wide shots, medium shots, and close-ups.",
      "icon": "RiBookOpenLine"
    },
    {
      "title": "First & Last Frame Control",
      "description": "Upload start and end frame images for precise transition control. The AI intelligently interpolates the motion between them.",
      "icon": "RiImageEditLine"
    }
  ]
}
```

---

##### (D) FAQ Section

优化现有 FAQ 并新增高价值问题 (利于 Featured Snippet):

**建议新 FAQ 列表**:
```json
{
  "id": "faq",
  "title": "Seedance 2.0 — Frequently Asked Questions",
  "description": "Everything you need to know about Seedance 2.0 AI video generation.",
  "items": [
    {
      "question": "What is Seedance 2.0?",
      "answer": "Seedance 2.0 is a next-generation AI video generator developed by ByteDance's Seed team. It uses a dual-branch diffusion transformer architecture to generate cinematic videos with native audio, multi-shot narratives, and physics-based motion from text, images, video clips, and audio references. Our platform provides independent access to this technology through a user-friendly interface."
    },
    {
      "question": "What makes Seedance 2.0 different from Sora and Kling?",
      "answer": "Seedance 2.0 is the only AI video model that generates audio and video simultaneously using a dual-branch architecture, achieving frame-level lip-sync accuracy. It supports up to 12 multimodal reference inputs (vs single image for Sora), native multi-shot storytelling, and automatic camera planning. Sora focuses on physics simulation while Kling specializes in motion control — Seedance 2.0 combines narrative, audio, and visual generation in one unified model."
    },
    {
      "question": "Can Seedance 2.0 generate video with sound?",
      "answer": "Yes. Seedance 2.0 is one of the first AI video generators to produce native audio alongside video. The dual-branch diffusion transformer generates dialogue, sound effects, and music in parallel with the visual frames — meaning audio is inherently synced to the action, not added as an afterthought. Lip-sync accuracy is within 1 frame."
    },
    {
      "question": "How many reference inputs does Seedance 2.0 support?",
      "answer": "Seedance 2.0 supports up to 12 simultaneous reference inputs: up to 9 images (for character, scene, and style reference), up to 3 video clips totaling 15 seconds (for camera and motion reference), and up to 3 audio files totaling 15 seconds (for rhythm and soundtrack reference), plus a text prompt. You use the @mention system to assign each asset's role."
    },
    {
      "question": "What video resolutions does Seedance 2.0 support?",
      "answer": "Seedance 2.0 supports up to 2K high-definition output. Multiple aspect ratios are available including 16:9, 9:16, 1:1, 4:3, and 3:4 to fit any platform — from YouTube and TikTok to Instagram and cinematic widescreen."
    },
    {
      "question": "How long are Seedance 2.0 generated videos?",
      "answer": "Generated videos range from 4 to 15 seconds with precision down to 1-second increments. A 15-second video typically generates in about 60 seconds — 30% faster than previous versions."
    },
    {
      "question": "What visual styles can Seedance 2.0 generate?",
      "answer": "Seedance 2.0 supports a wide range of visual styles including photorealistic, anime, cyberpunk, watercolor, oil painting, 3D CG animation, and more. You can specify your preferred style in the text prompt or use image references to guide the aesthetic."
    },
    {
      "question": "What is the relationship between this platform and ByteDance?",
      "answer": "This platform is an independent service that provides a user-friendly interface for AI video generation powered by Seedance 2.0. We are not affiliated with, endorsed by, or sponsored by ByteDance. We leverage AI models through API integrations to provide our video generation services."
    }
  ]
}
```

---

##### (E) CTA Section

**当前**: `"Ready to Create with Seedance 2.0?"`

**建议新文案**:
```json
{
  "id": "cta",
  "title": "Start Creating Cinematic AI Videos — Free",
  "description": "Join thousands of creators using Seedance 2.0 to generate professional videos with native audio, multi-shot narratives, and physics-based motion. No credit card required.",
  "buttons": [
    {
      "title": "Start Creating Free",
      "url": "/ai-video-generator",
      "target": "_self",
      "icon": "Zap"
    },
    {
      "title": "View Pricing",
      "url": "/pricing",
      "target": "_self",
      "variant": "outline",
      "icon": "CreditCard"
    }
  ],
  "className": "bg-muted"
}
```

---

### 3.3 Landing JSON (Header/Footer)

#### 文件: `src/config/locale/messages/en/landing.json`

##### Footer Description
**当前**:
```
"Seedance 2.0 provides an easy-to-use interface for AI video generation, supporting text-to-video and image-to-video with high quality output."
```

**建议新文案**:
```
"Seedance 2.0 is a next-generation AI video generator powered by dual-branch diffusion transformer technology. Create cinematic videos with native audio sync, multi-shot narratives, and multimodal input — from text, images, video clips, and audio references."
```

##### Footer Friends 链接
**当前**: Runway, Pika, Kling
**建议**: 考虑增加 Sora 链接 (增加语义相关性) 或替换为实际合作伙伴

---

### 3.4 Blog 文章 (中优先级)

#### 文件: `content/posts/what-is-xxx.mdx` (及所有语言版本)

**当前问题**: 仍是模板文案 "YourAppName is an AI SaaS development framework..."

**优化方向**: 重写为 "What is Seedance 2.0" SEO 文章，内容结构:
1. H1: What is Seedance 2.0? — The Next-Gen AI Video Generator
2. H2: Core Technology — Dual-Branch Diffusion Transformer
3. H2: Key Features — 6 个核心功能详述
4. H2: How Seedance 2.0 Compares (vs Sora 2 / Kling 3.0 / Veo 3.1)
5. H2: Use Cases — 短剧/广告/社交媒体/教育
6. H2: Industry Recognition — 冯骥/影视飓风等行业评价引用
7. H2: Getting Started with Seedance 2.0

**技术内容来源**: 参考资料文件 `网站视频/Seedance2.0资料整理.docx`

---

### 3.5 About 页面 (低优先级)

#### 文件: `src/config/locale/messages/en/pages/about.json`

**建议 metadata 优化**:
```json
{
  "title": "About Seedance 2.0 | AI Video Generation Platform",
  "description": "Learn about Seedance 2.0 — the AI video generation platform making cinematic content creation accessible to everyone. Our mission: everyone can be a director."
}
```

---

## 四、技术 SEO 问题清单

| # | 问题 | 文件位置 | 修复建议 |
|---|------|---------|---------|
| 1 | Blog 页面 title 显示 "ShipAny Blog" | `pages/blog.json` | 改为 "Seedance 2.0 Blog" |
| 2 | Blog 文章仍为模板内容 | `content/posts/what-is-xxx.mdx` | 重写为 Seedance 2.0 介绍文章 |
| 3 | 缺少 sitemap.ts 动态生成 | 项目中无 `src/app/sitemap.ts` | 需确认 sitemap 生成逻辑 (可能在 vercel.json 或插件中) |
| 4 | OG Image 使用默认 `/preview.png` | `src/config/index.ts` | 确保 preview.png 是 Seedance 2.0 品牌 OG 图 (1200x630) |
| 5 | introduce/benefits section 未在首页 show_sections 中 | `pages/index.json` show_sections 仅含 hero/showcase_grid/faq/cta | 考虑加入 features 到 show_sections 以增加页面 SEO 内容深度 |
| 6 | Feature 页面图片使用 picsum 占位图 | text-to-video / image-to-video JSON | 替换为真实产品截图 (提升 E-E-A-T 信号) |
| 7 | Text-to-Video FAQ 声称 "over 30 seconds" | `text-to-video.json` FAQ 第 4 条 | 资料显示实际为 4-15 秒，需修正避免误导 |
| 8 | ai/video.json page description 重复且过于简单 | `ai/video.json` page 和 generator 字段 | 优化为包含 Seedance 2.0 关键词的描述 |

---

## 五、多语言同步说明

所有英文文案优化确认后，需同步更新以下 **10 个语言版本**:
`zh`, `es`, `ar`, `pt`, `fr`, `de`, `ja`, `nl`, `pl`, `ru`

### 同步文件范围:
| 文件 | 同步内容 |
|------|---------|
| `common.json` | metadata (title/description/keywords) |
| `pages/index.json` | 全部 sections 文案 (hero/showcase_grid/features/faq/cta) |
| `pages/features/text-to-video.json` | metadata + hero + faq 修正 |
| `pages/features/image-to-video.json` | metadata + hero |
| `pages/pricing.json` | metadata |
| `pages/about.json` | metadata |
| `pages/blog.json` | metadata + page title (修正 ShipAny) |
| `ai/video.json` | metadata + page description |
| `landing.json` | footer description |

### 翻译注意事项:
- 品牌词 "Seedance 2.0" 在所有语言中保持英文不翻译
- 技术术语 (dual-branch diffusion transformer, STCM) 保持英文或附带翻译
- 每个语言版本的 meta description 控制在 160 字符以内
- 阿拉伯语 (ar) 注意 RTL 排版

---

## 六、优化优先级排序

| 优先级 | 任务 | 影响范围 | 涉及文件 |
|--------|------|---------|---------|
| **P0** | common.json metadata 优化 | 所有页面 fallback title/desc | `en/common.json` |
| **P0** | 首页 Hero + Showcase + Features 文案 | 首页 (最高流量页面) | `en/pages/index.json` |
| **P0** | 首页 FAQ + CTA 文案 | 首页 Featured Snippet | `en/pages/index.json` |
| **P0** | AI Video Generator metadata | 核心产品页 | `en/ai/video.json` |
| **P1** | Text-to-Video 全页面文案 | 功能着陆页 | `en/pages/features/text-to-video.json` |
| **P1** | Image-to-Video 全页面文案 | 功能着陆页 | `en/pages/features/image-to-video.json` |
| **P1** | Landing footer description | 全站 footer | `en/landing.json` |
| **P1** | Pricing metadata 优化 | 定价页 | `en/pages/pricing.json` |
| **P1** | 首页 show_sections 增加 features | 首页内容深度 | `en/pages/index.json` |
| **P2** | Blog title 修正 ShipAny → Seedance 2.0 | Blog 页面 | `en/pages/blog.json` |
| **P2** | Blog 文章重写 (what-is-xxx.mdx) | Blog SEO 内容 | `content/posts/what-is-xxx.mdx` |
| **P2** | About 页 metadata 优化 | About 页 | `en/pages/about.json` |
| **P2** | 修正 text-to-video "30 秒" 不实描述 | FAQ 准确性 | `en/pages/features/text-to-video.json` |
| **P3** | 多语言同步 (10 种语言) | 全球流量 | 所有 locale 文件夹 |
| **P3** | 占位图替换为真实产品截图 | E-E-A-T 信号 | feature 页面 JSON |
| **P3** | OG Image 确认/更新 | 社交分享 | `public/preview.png` |

---

## 七、核心原则

1. **所有文案围绕现有视频内容展开** — 视频不改，文案配合视频叙事
2. **品牌词 "Seedance 2.0" 必须出现在每个页面的 H1/Title 中**
3. **技术描述基于官方资料** — 双分支扩散变换器、音画同步、多模态参考等真实特征
4. **避免夸大承诺** — 修正 "30 秒视频" 等不实描述 (实际 4-15 秒)
5. **FAQ 优化面向 Featured Snippet** — 问答格式清晰，答案开头即核心信息
6. **平台独立性声明保留** — 继续保留 "independent service, not affiliated with ByteDance" 声明
7. **关键词自然嵌入** — 避免关键词堆砌，每段文案读起来流畅自然

---

## 八、Seedance 2.0 技术要点速查 (供文案撰写参考)

以下要点摘自官方资料，供 AI 协同撰写文案时引用:

### 核心技术
- **双分支扩散变换器** (Dual-Branch Diffusion Transformer): 视觉分支 + 音频分支并行生成，音画同源
- **时空因果建模** (STCM - Spatial-Temporal Causal Modeling): 增强 3D 空间感知与动态记忆
- **音画同步**: 角色口型与台词像素级对齐，误差不超过 1 帧
- **物理感知机制**: 理解重力、惯性和物体间交互逻辑

### 核心功能
- **多模态输入**: 最多 12 个参考素材 (9 图 + 3 视频 + 3 音频 + 文字)
- **@提及参考系统**: 精准指定每个素材用途
- **多镜头叙事**: 自动生成多个相互关联的场景，保持角色一致性
- **首尾帧控制**: 上传起始帧与结束帧，智能推演中间动态
- **自运镜**: AI 根据情节自动规划分镜和运镜
- **视频编辑**: 可修改现有视频中不满意部分

### 输出规格
- 分辨率: 2K 高清
- 时长: 4-15 秒 (精确到 1 秒)
- 画面比例: 16:9, 9:16, 1:1, 4:3, 3:4
- 生成速度: 15 秒视频约需 60 秒

### 行业评价
- 冯骥 (游戏科学 CEO): "当前地表最强的视频生成模型，没有之一。AIGC 的童年时代，结束了。"
- 影视飓风 Tim: 六次用 "恐怖" 形容其能力
- A 股传媒板块: 发布当日多只个股涨停
- 海外用户: "This is the best video model of 2026, surpassing Sora 2"

### 竞品差异
| 维度 | Seedance 2.0 | Sora 2 | Kling 3.0 | Veo 3.1 |
|------|-------------|--------|-----------|---------|
| 核心优势 | 音画同步+多镜头叙事 | 物理模拟 | 运动控制 | 4K 画质 |
| 原生音频 | 支持 | 不支持 | 不支持 | 支持 |
| 多模态输入 | 12 素材 | 单图 | 图文 | 图文 |
| 多镜头叙事 | 支持 | 有限 | 有限 | 有限 |
| 音画同步精度 | 帧级对齐 | 后期匹配 | 后期匹配 | 较好 |
