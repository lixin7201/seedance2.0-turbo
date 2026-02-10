# 视频生成异步任务 + 历史记录 + 站内通知 PRD（V1.1）

日期：2026-02-10  
状态：可执行需求文档（仅方案，不改代码）

## 1. 背景与问题
当前视频生成耗时较长，用户需要停留等待，导致体验差、转化下降和请求超时风险。需要引入异步生成与历史记录，允许用户离开页面，生成完成后可回看与下载。

## 2. 目标
1. 用户点击生成后可关闭浏览器，任务继续执行。  
2. 生成结果进入历史记录，30 天内可播放与下载。  
3. 生成失败自动退回积分。  
4. 生成完成或失败发送站内通知。  
5. 支持生成进度百分比展示。  
6. 支持用户删除历史记录。  

## 3. 范围
1. 异步任务体系。  
2. 历史记录与详情页。  
3. 结果存储至 Cloudflare R2。  
4. 积分扣除与退回逻辑。  
5. 站内通知系统（基础版）。  
6. 并发限制与 Pricing 页面说明。  

## 4. 非目标
1. 邮件或短信通知。  
2. 复杂订阅计费体系。  
3. 内容审核与版权合规流程。  

## 5. 关键决策（已确认）
1. 任务提交并扣积分后，即使关闭浏览器也继续生成。  
2. 生成失败自动退回积分。  
3. 失败后重试需要再次扣积分。  
4. 视频保留 30 天，到期自动清理并标记为 `expired`。  
5. 站内通知是默认告知方式。  
6. 支持进度百分比展示。  
7. 并发限制：免费 1 个，付费 3 个。  
8. 允许用户删除历史记录。  

## 6. 用户故事
1. 作为用户，我点击生成后可以离开页面，不会丢失结果。  
2. 作为用户，我可以在历史列表查看任务状态与进度。  
3. 作为用户，我可以在历史记录里播放或下载完成视频。  
4. 作为用户，如果生成失败，我会收到通知并退回积分。  
5. 作为用户，我可以删除历史记录。  

## 7. 任务状态与进度
### 7.1 状态
1. `queued` 已排队  
2. `processing` 生成中  
3. `succeeded` 生成成功  
4. `failed` 生成失败  
5. `expired` 结果过期  

### 7.2 状态流转
1. `queued` → `processing`  
2. `processing` → `succeeded`  
3. `processing` → `failed`  
4. `succeeded` → `expired`（到期清理）  

### 7.3 进度百分比
1. `queued` 为 0%  
2. `processing` 为 1%~99%  
3. `succeeded` 为 100%  
4. `failed` 与 `expired` 不展示百分比，展示状态说明  

### 7.4 进度来源（需求要求）
1. 若生成引擎可提供真实进度，则直接透传。  
2. 若无真实进度，按阶段映射为进度百分比。  

建议阶段映射：  
1. 队列等待 0%~5%  
2. 生成中 5%~90%  
3. 后处理与上传 90%~99%  

## 8. 积分与重试规则
1. 创建任务时立即扣积分。  
2. 生成失败时自动退回积分。  
3. 失败重试需再次扣积分并生成新任务。  
4. 删除历史记录不退积分。  
5. 任务过期不退积分。  

## 9. 并发限制与 Pricing 说明
1. 免费用户同时最多 1 个任务。  
2. 付费用户同时最多 3 个任务。  
3. 超限时前端提示“请等待当前任务完成”。  
4. Pricing 页面新增并发说明。  

## 10. 存储与文件策略
1. 生成视频存储在 Cloudflare R2。  
2. 存储路径格式：`videos/{user_id}/{task_id}.mp4`。  
3. 建议生成首帧 poster，存储路径：`posters/{user_id}/{task_id}.jpg`。  
4. 文件默认私有，访问通过签名 URL。  
5. 签名 URL 有效期建议 1~24 小时。  
6. 保留 30 天，过期自动清理。  

## 11. 历史删除规则
1. 用户可删除自己的历史记录。  
2. 删除后从列表移除并标记 `deleted_at`。  
3. 删除触发异步清理 R2 对象。  
4. 删除操作应幂等。  

## 12. 站内通知
1. 生成成功创建通知：标题“视频生成完成”。  
2. 生成失败创建通知：标题“视频生成失败，积分已退回”。  
3. 通知支持已读与未读状态。  
4. 点击通知进入任务详情页。  

## 13. 数据模型（需求级）
### 13.1 Task
字段  
1. `task_id`  
2. `user_id`  
3. `status`  
4. `progress`  
5. `prompt`  
6. `params`  
7. `created_at`  
8. `started_at`  
9. `finished_at`  
10. `r2_object_key`  
11. `r2_url`  
12. `poster_key`  
13. `error_message`  
14. `credit_cost`  
15. `refund_amount`  
16. `expires_at`  
17. `deleted_at`  

### 13.2 Notification
字段  
1. `notification_id`  
2. `user_id`  
3. `type`（success 或 failed）  
4. `title`  
5. `content`  
6. `task_id`  
7. `created_at`  
8. `read_at`  

### 13.3 CreditTransaction（建议）
字段  
1. `tx_id`  
2. `user_id`  
3. `task_id`  
4. `amount`（扣为负，退为正）  
5. `reason`  
6. `created_at`  

## 14. API 需求（需求级）
### 14.1 创建任务
`POST /api/generate`  
请求  
1. `prompt`  
2. `params`  
响应  
1. `task_id`  
2. `status`  
3. `progress`  

### 14.2 查询单个任务
`GET /api/task/:id`  
响应  
1. `task_id`  
2. `status`  
3. `progress`  
4. `result_url`（成功时返回签名链接）  
5. `poster_url`（可选）  
6. `error_message`（失败时返回简化说明）  

### 14.3 历史列表
`GET /api/history?page=1&page_size=20`  
响应  
1. `items`  
2. `total`  
3. `next_cursor`（可选）  

### 14.4 失败重试
`POST /api/task/:id/retry`  
响应  
1. `task_id`（新任务）  
2. `status`  

### 14.5 删除历史
`DELETE /api/task/:id`  
响应  
1. `ok`  

### 14.6 通知列表
`GET /api/notifications`  
响应  
1. `items`  
2. `unread_count`  

### 14.7 通知已读
`POST /api/notifications/:id/read`  
响应  
1. `ok`  

## 15. UI 需求
1. 生成按钮点击后显示“已提交，可在历史查看”。  
2. 历史列表显示状态、进度、创建时间、缩略图。  
3. 成功任务显示播放与下载按钮。  
4. 失败任务显示失败原因与“重试”按钮。  
5. 处理中的任务展示进度百分比。  
6. 历史记录支持删除。  
7. 通知中心支持未读小红点。  

## 16. 安全与权限
1. 用户只能访问自己的任务和通知。  
2. R2 对象默认私有，访问通过签名 URL。  
3. 任务查询需校验 user_id。  
4. 删除与重试需校验 user_id。  

## 17. 失败与异常处理
1. 生成失败必须写入 `error_message`。  
2. 生成失败自动退积分。  
3. 上传 R2 失败视为任务失败。  
4. 任务超时需自动标记 `failed`。  
5. 过期清理后标记 `expired`。  

## 18. 任务执行与架构约束
1. Vercel API 仅负责提交与查询。  
2. 视频生成必须由独立 Worker 执行。  
3. Worker 负责更新状态、进度、上传结果、创建通知。  

## 19. 运维与指标
1. 平均生成时长。  
2. 成功率与失败率。  
3. 退积分比例。  
4. 通知点击率。  
5. 历史列表访问率。  

## 20. 验收标准
1. 提交生成后关闭浏览器，任务仍可完成。  
2. 生成成功后历史记录可播放与下载。  
3. 生成失败后自动退积分并发送通知。  
4. 历史列表显示进度百分比。  
5. 并发限制生效，超限提示明确。  
6. 删除历史记录后列表移除且对象可清理。  
7. 30 天到期后任务显示过期状态。  

## 21. 待确认（如需进一步细化）
1. 失败原因是否对用户展示详细信息或仅简化描述。  
2. 进度百分比是引擎真实值还是阶段估算值。  
3. 过期后是否允许用户付费延长保存。  

## 22. 修改方案（文件级，含明确动作）
以下为“可直接交给执行型 AI 的文件级修改清单”，每一条都指向具体文件与具体动作，避免歧义。

### 22.1 数据库与迁移
1. 新增字段到 AI 任务表  
   - 文件：`src/config/db/schema.postgres.ts`  
   - 动作：在 `aiTask` 表新增字段  
     - `progress`（integer，默认 0）  
     - `expiresAt`（timestamp，可空，用于 30 天过期）  
     - `resultAssets`（text，JSON 字符串，存储视频/海报的 key 与 URL 列表）  
   - 同步修改：  
     - `src/config/db/schema.mysql.ts`  
     - `src/config/db/schema.sqlite.ts`  
2. 新增通知表  
   - 文件：`src/config/db/schema.postgres.ts`  
   - 动作：新增 `notification` 表（字段：id, userId, type, title, content, taskId, createdAt, readAt）  
   - 同步修改：  
     - `src/config/db/schema.mysql.ts`  
     - `src/config/db/schema.sqlite.ts`  
3. 新增数据库迁移  
   - 文件夹：`src/config/db/migrations/`  
   - 动作：创建对应迁移文件（新增字段与通知表）  

### 22.2 Model 层
1. AI 任务模型  
   - 文件：`src/shared/models/ai_task.ts`  
   - 动作：  
     - 新增 `findAITaskByProviderTaskId(taskId: string)`  
     - 新增 `getActiveAITasksCount(userId: string)`（统计 pending/processing）  
     - 新增 `softDeleteAITask(id: string, userId: string)`（写入 deletedAt）  
     - `getAITasks` 默认过滤 `deletedAt IS NULL`  
     - `updateAITaskById` 支持更新 `progress`、`expiresAt`、`resultAssets`  
2. 通知模型  
   - 文件：`src/shared/models/notification.ts`（新建）  
   - 动作：  
     - 新增通知 CRUD：create、list、markRead、getUnreadCount  

### 22.3 存储层（R2）
1. 扩展 StorageProvider 接口  
   - 文件：`src/extensions/storage/index.ts`  
   - 动作：新增接口方法  
     - `deleteFile(options: { key: string; bucket?: string }): Promise<boolean>`  
     - `getSignedUrl(options: { key: string; expiresIn: number; bucket?: string }): Promise<string>`  
2. 实现 R2 删除与签名  
   - 文件：`src/extensions/storage/r2.ts`  
   - 动作：实现 `deleteFile` 与 `getSignedUrl`  
3. StorageManager 暴露方法  
   - 文件：`src/extensions/storage/index.ts`  
   - 动作：在 `StorageManager` 中添加 `deleteFile` 与 `getSignedUrl` 对外方法  
4. 对外服务  
   - 文件：`src/shared/services/storage.ts`  
   - 动作：透出 `deleteFile` / `getSignedUrl`  

### 22.4 AI Provider 与进度/回调
1. EvoLink Provider  
   - 文件：`src/extensions/ai/evolink.ts`  
   - 动作：  
     - `callback_url` 不依赖 `params.options`，改为全局可配置  
     - 返回结果中附带 `storageKey`（用于删除与下载）  
     - 若 API 返回进度，填充 `taskInfo.progress`  
2. AI Types  
   - 文件：`src/extensions/ai/types.ts`  
   - 动作：  
     - `AIVideo` 新增 `storageKey?: string` `posterKey?: string`  
     - `AITaskInfo` 新增 `progress?: number`  
3. AI Service 配置  
   - 文件：`src/shared/services/ai.ts`  
   - 动作：给 Evolink 传入 `customStorage`（新增配置项）  
4. AI 设置项  
   - 文件：`src/shared/services/settings.ts`  
   - 动作：新增 `evolink_custom_storage` 开关  

### 22.5 API 路由
1. 生成接口并发限制  
   - 文件：`src/app/api/ai/generate/route.ts`  
   - 动作：  
     - 读取用户订阅状态（免费/付费）  
     - 根据 `getActiveAITasksCount` 限制并发（免费 1，付费 3）  
     - 写入 `expiresAt = now + 30 days`  
2. 轮询查询接口  
   - 文件：`src/app/api/ai/query/route.ts`  
   - 动作：  
     - 返回 `progress`  
     - 若结果是视频且未保存至 R2，调用 storage 保存并写入 `resultAssets`  
     - 当状态从 processing → success/failed 时创建站内通知  
3. Webhook 回调  
   - 文件：`src/app/api/ai/notify/[provider]/route.ts`（新建）  
   - 动作：  
     - 根据 provider 的 webhook payload 查找任务（通过 provider taskId）  
     - 更新状态、进度、结果  
     - 保存视频到 R2  
     - 创建站内通知  
4. 历史列表 API（可选，若前端改为 client fetch）  
   - 文件：`src/app/api/ai/history/route.ts`（新建）  
   - 动作：返回当前用户 ai_task 列表（过滤 deletedAt）  
5. 删除接口  
   - 文件：`src/app/api/ai/task/[id]/route.ts`（新建）  
   - 动作：`DELETE` 设置 deletedAt + 触发 R2 清理  
6. 通知接口  
   - 文件：`src/app/api/notifications/route.ts`（新建）  
   - 动作：返回通知列表 + unread 数  
   - 文件：`src/app/api/notifications/[id]/read/route.ts`（新建）  
   - 动作：设置 readAt  

### 22.6 定时清理（过期 30 天）
1. 清理接口  
   - 文件：`src/app/api/cron/ai-tasks/cleanup/route.ts`（新建）  
   - 动作：  
     - 查找 `expiresAt < now` 且未删除的任务  
     - 删除 R2 对象  
     - 标记 `status = expired`  
2. Vercel Cron  
   - 文件：`vercel.json`  
   - 动作：新增 cron 配置（每日 1 次）  

### 22.7 前端 UI
1. 视频生成页  
   - 文件：`src/shared/blocks/generator/video.tsx`  
   - 动作：  
     - 生成成功/已创建任务时显示“可关闭页面”提示  
     - 增加“查看历史记录”链接（/activity/ai-tasks?type=video）  
     - 进度条优先读取后端 `progress`  
2. 历史记录列表  
   - 文件：`src/app/[locale]/(landing)/activity/ai-tasks/page.tsx`  
   - 动作：  
     - 增加 `progress` 列  
     - 对 `video` 类型展示 video 预览与下载按钮  
     - 增加删除操作（调用删除 API）  
3. 通知页  
   - 文件：`src/app/[locale]/(landing)/activity/notifications/page.tsx`（新建）  
   - 动作：展示通知列表，支持点击标记已读  

### 22.8 国际化文案
1. 活动区侧边栏  
   - 文件：  
     - `src/config/locale/messages/zh/activity/sidebar.json`  
     - `src/config/locale/messages/en/activity/sidebar.json`  
   - 动作：新增“通知”入口  
2. AI 任务列表文案  
   - 文件：  
     - `src/config/locale/messages/zh/activity/ai-tasks.json`  
     - `src/config/locale/messages/en/activity/ai-tasks.json`  
   - 动作：新增 progress、delete、expired 等字段  
3. Pricing 文案  
   - 文件：  
     - `src/config/locale/messages/zh/pages/pricing.json`  
     - `src/config/locale/messages/en/pages/pricing.json`  
   - 动作：新增并发限制说明（免费 1，付费 3）  

## 23. 关键实现细节（无歧义约束）
1. R2 Key 规范  
   - 视频：`videos/{userId}/{taskId}/{index}.mp4`  
   - 海报：`posters/{userId}/{taskId}/{index}.jpg`  
2. resultAssets JSON 结构  
   - 示例：  
     ```json
     [
       {"type":"video","url":"...","key":"videos/u1/t1/0.mp4","posterKey":"posters/u1/t1/0.jpg"}
     ]
     ```  
3. 进度展示逻辑  
   - 若 provider 返回 progress → 直接显示  
   - 否则：按阶段估算并写入 `progress`  
4. 并发限制  
   - 免费用户：`activeTasks >= 1` → 禁止创建  
   - 付费用户：`activeTasks >= 3` → 禁止创建  
5. 退积分  
   - 当任务状态变为 `FAILED` 时触发 refund（复用 `updateAITaskById` 的逻辑）  
