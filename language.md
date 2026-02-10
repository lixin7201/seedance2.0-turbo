**全站多语言需求文档（通用版）**

**目标**  
为全站启用新的语言 `lang`（如德语/日语等），覆盖 UI 文案与内容页（Docs/Pages/Posts/Logs），并保证语言切换与默认语言行为一致。

**范围**  
包含语言配置、i18n 文案 JSON、Docs 配置、内容 MDX。

**约定**  
- `lang` 为新增语言代码（例如 `de`、`ja`、`fr`），下文均以 `lang` 表示。
- 所有翻译必须“只改文本、不改结构”。

---

**一、语言配置（必须）**

1. 修改 `src/config/locale/index.ts`
- 在 `localeNames` 增加 `lang` 的显示名（如 `Deutsch`、`日本語` 等）。
- 在 `locales` 数组中增加 `lang`。

**二、i18n 文案 JSON（必须完整覆盖）**

1. 新增目录 `src/config/locale/messages/lang/`
- 目录结构必须与 `src/config/locale/messages/en/` 完全一致。
- 文件名必须一一对应，不允许缺失任何文件。

2. 翻译所有 JSON 文件
- 每个 JSON 文件的 **key、层级结构、数组顺序** 必须与英文版完全一致。
- **保留** 变量占位符（如 `{locale}`、`{count}`）、HTML 标签、Markdown 标记、链接格式。
- **只翻译文本值**，不新增/删除字段。

3. 修改 `src/config/locale/messages/lang/landing.json`
- `header.show_locale = true`
- `footer.show_locale = true`

**三、Docs 系统配置（必须）**

1. 修改 `src/core/docs/source.ts`
- 在 `languages` 增加 `lang`。

2. 修改 `src/app/[locale]/(docs)/layout.tsx`
- 在 `locales` 列表中增加 `lang`。
- 增加 `lang` 的 UI 翻译（至少 `search` 文案）。

**四、内容页 MDX（必须新增对应语言文件）**

为每个已有 MDX 文件新增 `lang` 版本，命名规则与现有 `.zh.mdx` 一致。

1. `content/docs/`
- 为每个 `*.mdx` 新增 `*.lang.mdx`

2. `content/pages/`
- 为每个 `*.mdx` 新增 `*.lang.mdx`

3. `content/posts/`
- 为每个 `*.mdx` 新增 `*.lang.mdx`

4. `content/logs/`
- 为每个 `*.mdx` 新增 `*.lang.mdx`

MDX 翻译规则  
- 保持 front matter 的 **key 与结构** 不变。
- 保留所有 MDX 组件标签与属性。
- 只翻译正文内容。

**五、默认语言（可选项，按需）**

如需修改默认语言：
- 修改 `.env.development` 与 `.env.production`
- 设置 `NEXT_PUBLIC_DEFAULT_LOCALE="lang"`

**六、验收标准**

1. `/lang/*` 路由可访问并显示 `lang` 文案。
2. 语言切换入口可见且包含 `lang`。
3. 默认语言路由不带语言前缀，非默认语言带语言前缀。
4. `src/config/locale/messages/lang/**` 与英文版 key 完全一致。
5. Docs/Pages/Posts/Logs 的 `*.lang.mdx` 均存在并可访问。

---

**附：给 AI 的最简通用指令模板（可直接引用）**

```
请按以下规则将项目翻译为语言 lang：
1) 仅翻译文本值，保留 JSON 的 key、结构与数组顺序；
2) 保留所有占位符（如 {locale}）、HTML/Markdown 标记；
3) MDX 保留 front matter 与组件标签/属性，只翻译正文；
4) 按 language.md 的文件清单与规则执行。
```
