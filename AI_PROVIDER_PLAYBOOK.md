# AI Provider Playbook (Seedance2)

> 目标：前端只选模型，后端可随时切平台；新增模型或报错时，用 Postman 自检并把示例交给 AI 处理。

---

## 1. 统一模型信息（每个模型一份）

- 统一模型 ID：
- 显示名称：
- 支持场景（多选）：`text-to-video` / `image-to-video` / `video-to-video` / `text-to-image` / `image-to-image` / `text-to-music`
- 默认参数（可选）：分辨率 / 时长 / 画幅 / 其他

说明：
1. 你填写的“显示名称”必须等于前端用户看到的模型名称。
2. 统一模型 ID 由 AI 根据显示名称生成（如 `Seedance 1.5 Pro` → `seedance-1.5-pro`），你确认后固定不再改。

---

## 2. 名称归一化规则（必须遵守）

目标：无论平台原始名称怎么写，都归一化到“统一模型 ID”。

规则：
1. 统一模型 ID 是唯一主键，任何平台名都必须映射到它。
2. 清洗规则建议：
   - 全部小写
   - 去掉空格、连字符、点号
   - 统一版本写法（如 `1.5` 统一为 `1.5`）
3. 优先级：
   - 明确平台映射表（最优先）
   - 否则按清洗后的名称匹配

示例（你强调的 case）：
- 统一模型 ID：`seedance-1.5-pro`
- 平台原始名称 → 统一模型 ID：
  - `seedance-1.5-pro` → `seedance-1.5-pro`
  - `seedance 1.5 pro` → `seedance-1.5-pro`
  - `seedance1.5` → `seedance-1.5-pro`

---

## 3. 模型映射表（你整理完后填这里）

表格一行代表一个“统一模型 ID”，每个平台填写对应名称。

| 统一模型 ID | 显示名称 | fal | evolink | replicate | kie | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| seedance-1.5-pro | Seedance 1.5 Pro | seedance-1.5-pro | seedance 1.5 pro | seedance1.5 | - | 示例 |
| kling-3.0 | Kling 3.0 | fal-ai/kling-video/o3/standard/image-to-video | - | - | - | 文生图(实际为I2V) |

---

## 4. 平台清单（每个平台一份）

### 平台：`fal`

- 官方文档链接：
- API Key 说明：
- 是否支持 webhook：

**模型映射**
- 统一模型 ID → 平台模型 ID  
  例：`seedance-1.5-pro` → `fal-ai/bytedance/seedance/v1.5/pro`

**参数映射（示例）**
- `image_input` → `image_url` 或 `input_images`
- `video_input` → `video_url`
- `image_input[1]` → `end_image_url` (Kling 3.0 特有)

**特殊规则（示例）**
- seedance 1.5 在 fal 需要区分 T2V / I2V（写清楚触发条件）

**生成接口**
- URL：
- Method：`POST`
- Headers：
  - `Authorization: `
  - `Content-Type: application/json`
- Request 示例：
```json
{}
```
- Response 成功示例：
```json
{}
```
- Response 失败示例：
```json
{}
```

**查询接口**
- URL：
- Method：`GET` / `POST`
- Headers：
- Request 示例：
```json
{}
```
- Response 成功示例：
```json
{}
```
- Response 失败示例：
```json
{}
```

---

### 平台：`evolink`

（同上结构）

---

### 平台：`replicate`

（同上结构）

---

### 平台：`kie`

（同上结构）

---

## 5. 常见错误对照表（便于 AI 快速定位）

- 错误信息：
- 可能原因：
- 修复建议：

---

## 6. Postman 自检流程（固定步骤）

1. 填好 API Key
2. 调“生成接口”获得 `taskId`
3. 调“查询接口”轮询直到完成
4. 对照成功/失败示例
5. 把请求/响应完整贴给 AI 处理

---

## 7. 给 AI 的固定输入格式（你只需要粘贴）

```
[平台名称]
官方文档链接：

[生成接口]
URL：
Headers：
Request：
Response：

[查询接口]
URL：
Headers：
Request：
Response：

[错误信息]
报错内容：
```

---

## 8. 你给 AI 的“原始粘贴内容”格式（重要）

你后续可能会直接粘贴类似：
```
[Pasted Content 2115 chars]
```

要求：
1. 在粘贴前先注明平台名称与统一模型 ID（若已知）。
2. AI 必须先依据“名称归一化规则”和“模型映射表”完成归一化。
3. AI 必须输出“统一模型 ID → 平台模型名”的映射结果。

---

## 9. AI 自动提取清单（你无需懂技术）

AI 必须从你粘贴的内容里提取：
1. 平台名称
2. 模型名称（从 URL 或文档中出现的模型名）
3. 该模型支持的场景（文生图/图生图/文生视频/图生视频/视频生视频/文生音乐）
4. 请求接口 URL 与方法
5. 必需 Headers（比如 Authorization）
6. 示例输入字段
7. 示例输出结构与关键字段（例如状态、任务 ID）

---

## 10. AI 输出格式（固定）

AI 必须输出以下结构（纯文本或 JSON 均可）：

```
[统一模型 ID]
平台：<平台名称>
平台模型名：<平台原始名称>
场景：<场景列表>
接口：
  生成：<URL>
  查询：<URL>
关键字段：
  任务 ID 字段：
  状态字段：
示例输入字段：
示例输出字段：
```

---

## 11. 示例（基于你贴的 fal 片段）

AI 应能从以下内容判断：
1. 平台 = fal
2. 平台模型名 = `fal-ai/bytedance/seedance/v1.5/pro`
3. 场景 = `image-to-video`（从 URL 或描述判断）
4. 任务 ID 字段 = `request_id`
5. 状态字段 = `status`

---

## 12. 你现在用的“平台+模型粘贴格式”（推荐）

你可以直接用你喜欢的格式，AI 必须能解析：

```
平台：FAL  模型：Seedance 1.5 Pro

文生图：
示例代码：curl --request POST \
  --url https://queue.fal.run/fal-ai/bytedance/seedance/v1.5/pro/image-to-video \
  --header "Authorization: Key $FAL_KEY" \
  --header "Content-Type: application/json" \
  --data '{ ... }'
示例输入：{ ... }
示例输出：{ ... }

图生图：
示例代码：curl --request POST \
  --url https://queue.fal.run/fal-ai/bytedance/seedance/v1.5/pro/image-to-video \
  --header "Authorization: Key $FAL_KEY" \
  --header "Content-Type: application/json" \
  --data '{ ... }'
示例输入：{ ... }
示例输出：{ ... }
```

AI 必须从上述内容里：
1. 识别平台（如 FAL）
2. 识别模型显示名称（如 Seedance 1.5 Pro）
3. 生成统一模型 ID（如 seedance-1.5-pro）并请求你确认
4. 从 URL 提取平台模型名（如 fal-ai/bytedance/seedance/v1.5/pro）
5. 识别场景（文生图/图生图/文生视频等）
6. 输出映射结果与建议的后台配置

---

## 13. 你和 AI 的协同流程（非技术版）

当你新增一个模型或新增一个平台时，按下面流程做即可：

1. 你整理平台 API 文档与示例，按第 12 节格式粘贴给 AI。
2. AI 输出：
   - 统一模型 ID
   - 平台模型名
   - 场景列表
   - 请求/响应关键字段
3. 你确认“统一模型 ID 与显示名称”是否正确。
4. 你在后台模型配置页把该模型标记为“已调通”，并填好：
   - 当前平台
   - 平台模型名（映射表）
5. 你切平台时只需要改“当前平台”，模型名映射不需要改。

---

## 14. AI 输出给你的最终配置建议（固定）

AI 最终必须给出一个“可直接照抄到后台”的配置建议：

```
统一模型 ID：
显示名称：
当前平台：
平台模型映射：
  fal: <平台模型名>
  evolink: <平台模型名>
  replicate: <平台模型名>
  kie: <平台模型名>
已调通：true/false
支持场景：
```

---

## 15. 新增模型时必须改哪些文件（AI 必须提示你）

1. `scripts/seed-ai-models.ts`  
   - 新增模型配置（统一模型 ID、显示名称、currentProvider、providerModelMap、supportedModes 等）。
   - 新模型默认 `verified=false`（未调通不显示）。
2. 后台模型配置页  
   - 运行种子脚本后，打开“Show All”，找到新模型并设置 `verified=true`。
3. 仅当平台参数格式不同才改 `src/extensions/ai/*.ts`  
   - 否则不要动 provider 代码。

---

## 16. 新增模型的操作步骤（你只要照做）

1. 把平台 API 示例按第 12 节格式发给 AI。
2. AI 输出统一模型 ID 与映射表。
3. AI 把新模型加入 `scripts/seed-ai-models.ts`。
4. 你运行：
   - `npx ts-node scripts/seed-ai-models.ts`
5. 打开后台模型配置页：
   - 打开“Show All”
   - 把新模型 `verified` 打开
6. 前端就会显示该模型，可切平台。
