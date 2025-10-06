## 目标

将左侧图片容器的数据源迁移到 Supabase Storage，从 `image` 桶中获取图片并在页面展示。本文档是一步步的实施指南，先给出清晰计划，再按步骤落地。

---

## 步骤总览（计划）

1) 在 Supabase 控制台完成准备
- 获取项目 URL、anon key
- 创建并确认 `image` 桶（设为 Public）
- 设置公开读取策略（或使用签名 URL）
- 设置 CORS 允许你的站点域名
- 上传测试图片到 `image` 桶

2) 本地项目准备
- 安装客户端 SDK：`@supabase/supabase-js`
- 添加环境变量：`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`

3) 初始化 Supabase 客户端
- 新建 `src/lib/supabase.ts` 并创建客户端实例

4) 在 `LeftGallery.tsx` 拉取并展示图片
- 列出 `image` 桶内文件
- 生成可访问 URL（Public 或签名 URL）
- 用 React 状态渲染，遵循当前项目的性能规范

5) 可选增强与优化
- 使用签名 URL 控制访问
- 图片懒加载与尺寸优化
- 缓存与错误处理

6) 验证与排错
- 页面本地预览验证
- 常见错误与修复建议

等你确认以上计划没问题，我们再执行具体实现（从第 1 步开始）。

---

## 1. 在 Supabase 控制台完成准备

你已提供的配置：
- 项目 URL：`https://vewxvpuyvvxsgzbdijsf.supabase.co`
- Storage 桶名：`image`

还需要的信息：
- anon key（匿名公开访问用）

操作步骤：
1) 登录 Supabase 项目 → Project Settings → API → 复制 `anon key`
2) Storage → Buckets → 如果没有 `image` 桶则新建：
   - Name: `image`
   - Public: 勾选（若打算直接公开图片）
3) 若使用 Public 读取，确认策略（默认 Public 桶即可公开读）：
   - Storage → Policies → `image` 桶 → 确认 `SELECT` 允许匿名访问
4) CORS 设置（避免浏览器跨域报错）：
   - Project Settings → Storage → CORS → 添加你的本地与线上域名
   - 例如：`http://localhost:5173`、你的部署域名
5) 上传几张测试图片到 `image` 桶（可建立 `gallery/` 子目录方便管理）

提示：若不想公开桶，可不勾选 Public，然后走“签名 URL”方式（见后文 5. 可选增强）。

---

## 2. 本地项目准备

1) 安装 SDK

```bash
npm i @supabase/supabase-js
```

2) 配置环境变量（Vite）：在项目根目录创建 `.env.local`

```bash
VITE_SUPABASE_URL=https://vewxvpuyvvxsgzbdijsf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZld3h2cHV5dnZ4c2d6YmRpanNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MjgzNjgsImV4cCI6MjA3NTMwNDM2OH0.HiIaHW5CFpiYODtACTM5-xFQbz_86ocC4lwZJ9T2WiQ
```

3) 确认 `.gitignore` 已忽略 `.env*`（避免泄露密钥）

---

## 3. 初始化 Supabase 客户端

新建文件：`src/lib/supabase.ts`

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 4. 在 `LeftGallery.tsx` 拉取并展示图片

目标：从 `image` 桶列出文件，生成可访问 URL，渲染到左侧图片容器。

关键 API：
- 列表：`supabase.storage.from('image').list(path?, options)`
- Public URL：`supabase.storage.from('image').getPublicUrl(path)`
- 签名 URL：`supabase.storage.from('image').createSignedUrl(path, expiresIn)`

示例（Public 桶）逻辑要点：

```ts
// 伪代码结构，后续我们再落地到组件中
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type GalleryImage = { path: string; url: string; name: string };

export function useGalleryImages() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .storage
        .from('image')
        .list('gallery', { limit: 100, sortBy: { column: 'name', order: 'asc' } });

      if (!active) return;
      if (error) { setError(error.message); setLoading(false); return; }

      const files = (data ?? []).filter(item => item.id === undefined || item.name); // 排除文件夹
      const urls = files.map((f) => {
        const { data } = supabase.storage.from('image').getPublicUrl(`gallery/${f.name}`);
        return { path: `gallery/${f.name}`, url: data.publicUrl, name: f.name };
      });
      setImages(urls);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  // 避免每次渲染重算（符合项目 useMemo 规范）
  const stableImages = useMemo(() => images, [images]);

  return { images: stableImages, loading, error };
}
```

渲染时可配合 `loading`、`error` 状态，以及图片的 `loading="lazy"`、`decoding="async"`。若你的 `LeftGallery.tsx` 有现有布局，我们将在实现阶段将以上逻辑嵌入现有结构中，确保不破坏样式与性能规范。

---

## 5. 可选增强：签名 URL（非公开桶推荐）

如果不希望公开 `image` 桶，可使用签名 URL，只在客户端短期暴露：

```ts
const { data, error } = await supabase
  .storage
  .from('image')
  .createSignedUrl('gallery/xxx.jpg', 60 * 60); // 有效期 1 小时

const signedUrl = data?.signedUrl;
```

列表后为每个文件生成签名 URL。注意：签名 URL 会过期，需要在客户端处理刷新或在导航/重新进入页面时重新获取。

---

## 6. 性能与显示优化建议

- 懒加载：`<img loading="lazy" decoding="async" />`
- 指定尺寸：给定 `width/height` 或使用容器约束，避免 CLS
- 缓存：列表数据可适当缓存（内存/IndexedDB），减少重复请求
- 错误占位：加载失败时展示占位图
- 按需目录：将图片放在 `image/gallery/` 子目录，列表更清晰
- 遵循本项目性能规范：避免在渲染中创建新对象、使用 `useMemo` 稳定数据

---

## 7. 常见问题与排查

- 403/401：多为 CORS 或策略问题，检查 CORS 与 Storage Policy
- 图片链接 404：确认文件路径是否包含子目录前缀（如 `gallery/`）
- 本地 `undefined`：检查 `.env.local` 是否正确、是否重启开发服务器
- 样式错位：检查容器尺寸与图片比例，必要时加 `object-fit: cover`

---

## 8. 验证步骤

1) 本地启动 `npm run dev`
2) 打开左侧图片容器页面
3) 应能看到来自 `image` 桶（或其子目录）的图片
4) 打开 DevTools Network 检查图片请求是否来自 Supabase 域名

---

## 9. 下一步

如果你确认以上计划 OK，我们将开始：
1) 你在控制台取出 `anon key`，或授权我继续指导定位；
2) 我来创建 `src/lib/supabase.ts`；
3) 我们把拉取逻辑嵌入 `LeftGallery.tsx`，确保兼容现有样式与性能要求；
4) 本地验证并做错误处理与优化。


