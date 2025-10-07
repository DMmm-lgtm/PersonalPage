# AI诗句搜索功能 - 详细实现计划

## 项目概述
在中间页面左上角添加四芒星按钮，点击后调用AI API搜索诗句，并在页面中央显示结果。

## 技术方案
- **AI API**: Google Gemini API（免费）
- **状态管理**: React Context API
- **样式**: 内联样式 + CSS动画
- **主题**: 支持深色/浅色模式

---

## 第一步：环境准备

### 1.1 注册Google账号
**操作步骤**:
1. 打开浏览器，访问 https://accounts.google.com/
2. 点击 "创建账号" 按钮
3. 输入姓名、用户名、密码
4. 验证手机号（如果要求）
5. 完成账号创建

**验收标准**: 能够成功登录Google账号

### 1.2 获取Gemini API Key
**操作步骤**:
1. 访问 https://aistudio.google.com/app/apikey
2. 使用Google账号登录
3. 点击 "Create API Key" 按钮
4. 选择 "Create API key in new project" 或使用现有项目
5. 点击 "Create API key"
6. **立即复制API key**（只显示一次，请保存到记事本）

**验收标准**: 获得一个以 `AIza` 开头的API key

### 1.3 安装依赖包
**操作步骤**:
1. 打开终端，确保在项目根目录 `/Users/dyl/GitHub/PersonalPage`
2. 运行命令：`npm install @google/generative-ai`
3. 等待安装完成

**验收标准**: 控制台显示安装成功，无错误信息

### 1.4 创建环境变量文件
**操作步骤**:
1. 在项目根目录创建文件 `.env.local`
2. 在文件中添加：`VITE_GEMINI_API_KEY=你的API_key`
3. 保存文件

**验收标准**: 文件创建成功，包含正确的API key

---

## 第二步：创建AI服务

### 2.1 创建AI服务文件
**操作步骤**:
1. 在 `src/lib/` 目录下创建文件 `aiService.ts`
2. 复制以下代码到文件中：

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export interface PoemSearchResponse {
  poem: string
  author: string
  title: string
  source: string
  language: 'chinese' | 'english' | 'other'
}

export const searchPoem = async (prompt: string): Promise<PoemSearchResponse> => {
  try {
    console.log('开始搜索诗句...')
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const fullPrompt = `请为我推荐一句优美的诗句，要求：
1. 可以是中文或英文
2. 可以是古代、现代或当代作品
3. 诗句要优美、有意境
4. 请以JSON格式返回：{"poem": "诗句内容", "author": "作者", "title": "诗歌标题", "source": "来源", "language": "语言"}

用户请求：${prompt}`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const generatedText = response.text()

    console.log('AI响应:', generatedText)
    
    // 尝试提取JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const jsonStr = jsonMatch[0]
      const result = JSON.parse(jsonStr)
      console.log('解析成功:', result)
      return result
    } else {
      // 如果无法解析JSON，返回默认格式
      console.log('无法解析JSON，使用默认格式')
      return {
        poem: generatedText,
        author: "未知",
        title: "AI推荐",
        source: "AI生成",
        language: "chinese"
      }
    }
  } catch (error) {
    console.error('AI搜索失败:', error)
    throw new Error('搜索诗句失败，请稍后重试')
  }
}
```

**验收标准**: 文件创建成功，代码无语法错误

---

## 第三步：创建四芒星按钮组件

### 3.1 创建按钮组件文件
**操作步骤**:
1. 在 `src/components/` 目录下创建文件 `StarButton.tsx`
2. 复制以下代码到文件中：

```typescript
import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface StarButtonProps {
  onClick: () => void
  isLoading: boolean
}

const StarButton: React.FC<StarButtonProps> = ({ onClick, isLoading }) => {
  const { theme } = useTheme()

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '60px',
        height: '60px',
        background: 'transparent',
        border: 'none',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        zIndex: 1000,
        transition: 'transform 0.3s ease',
        transform: isLoading ? 'scale(0.95)' : 'scale(1)',
        opacity: isLoading ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.currentTarget.style.transform = 'scale(1.1)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading) {
          e.currentTarget.style.transform = 'scale(1)'
        }
      }}
    >
      {/* 四芒星SVG */}
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        style={{
          filter: `drop-shadow(0 0 20px ${theme === 'dark' ? '#00FFFF' : '#00CCCC'})`,
          animation: 'starGlow 2s ease-in-out infinite alternate'
        }}
      >
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#00FFFF', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#00CCCC', stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>
        <path
          d="M30 5 L35 25 L55 25 L40 35 L45 55 L30 45 L15 55 L20 35 L5 25 L25 25 Z"
          fill="url(#starGradient)"
          stroke={theme === 'dark' ? '#00FFFF' : '#00CCCC'}
          strokeWidth="2"
        />
      </svg>
      
      {/* 加载动画 */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            border: '2px solid transparent',
            borderTop: `2px solid ${theme === 'dark' ? '#00FFFF' : '#00CCCC'}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
    </button>
  )
}

export default StarButton
```

**验收标准**: 文件创建成功，组件代码无语法错误

---

## 第四步：创建诗句显示组件

### 4.1 创建显示组件文件
**操作步骤**:
1. 在 `src/components/` 目录下创建文件 `PoemDisplay.tsx`
2. 复制以下代码到文件中：

```typescript
import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { PoemSearchResponse } from '../lib/aiService'

interface PoemDisplayProps {
  poem: PoemSearchResponse | null
  isVisible: boolean
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({ poem, isVisible }) => {
  const { theme } = useTheme()

  if (!poem || !isVisible) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: theme === 'dark' 
          ? 'rgba(0, 0, 0, 0.8)' 
          : 'rgba(255, 255, 255, 0.9)',
        borderRadius: '20px',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        textAlign: 'center',
        zIndex: 1000,
        animation: 'poemFadeIn 1s ease-out',
        boxShadow: theme === 'dark'
          ? '0 20px 40px rgba(0, 0, 0, 0.5)'
          : '0 20px 40px rgba(0, 0, 0, 0.2)',
        border: `2px solid ${theme === 'dark' ? '#00FFFF' : '#00CCCC'}`
      }}
    >
      {/* 诗句内容 */}
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: theme === 'dark' ? '#00FFFF' : '#006666',
          marginBottom: '1rem',
          lineHeight: '1.6',
          fontFamily: 'serif'
        }}
      >
        "{poem.poem}"
      </div>
      
      {/* 作者和标题 */}
      <div
        style={{
          fontSize: '1rem',
          color: theme === 'dark' ? '#CCCCCC' : '#666666',
          marginBottom: '0.5rem'
        }}
      >
        —— {poem.author}
      </div>
      
      <div
        style={{
          fontSize: '0.9rem',
          color: theme === 'dark' ? '#AAAAAA' : '#888888',
          fontStyle: 'italic'
        }}
      >
        《{poem.title}》
      </div>
      
      {/* 来源信息 */}
      <div
        style={{
          fontSize: '0.8rem',
          color: theme === 'dark' ? '#999999' : '#AAAAAA',
          marginTop: '1rem',
          opacity: 0.7
        }}
      >
        来源：{poem.source}
      </div>
    </div>
  )
}

export default PoemDisplay
```

**验收标准**: 文件创建成功，组件代码无语法错误

---

## 第五步：创建状态管理

### 5.1 创建Context文件
**操作步骤**:
1. 在 `src/contexts/` 目录下创建文件 `PoemContext.tsx`
2. 复制以下代码到文件中：

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { searchPoem, PoemSearchResponse } from '../lib/aiService'

interface PoemState {
  currentPoem: PoemSearchResponse | null
  isLoading: boolean
  error: string | null
  isVisible: boolean
}

interface PoemContextType {
  poemState: PoemState
  searchPoem: () => Promise<void>
  clearPoem: () => void
  retrySearch: () => void
}

const PoemContext = createContext<PoemContextType | undefined>(undefined)

export const usePoem = () => {
  const context = useContext(PoemContext)
  if (!context) {
    throw new Error('usePoem must be used within a PoemProvider')
  }
  return context
}

interface PoemProviderProps {
  children: ReactNode
}

export const PoemProvider: React.FC<PoemProviderProps> = ({ children }) => {
  const [poemState, setPoemState] = useState<PoemState>({
    currentPoem: null,
    isLoading: false,
    error: null,
    isVisible: false
  })

  const handleSearchPoem = async () => {
    console.log('开始搜索诗句...')
    setPoemState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isVisible: false
    }))

    try {
      const result = await searchPoem('推荐一句优美的诗句')
      console.log('搜索成功:', result)
      setPoemState(prev => ({
        ...prev,
        currentPoem: result,
        isLoading: false,
        isVisible: true
      }))
    } catch (error) {
      console.error('搜索失败:', error)
      setPoemState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '搜索失败'
      }))
    }
  }

  const clearPoem = () => {
    setPoemState(prev => ({
      ...prev,
      currentPoem: null,
      isVisible: false,
      error: null
    }))
  }

  const retrySearch = () => {
    handleSearchPoem()
  }

  return (
    <PoemContext.Provider
      value={{
        poemState,
        searchPoem: handleSearchPoem,
        clearPoem,
        retrySearch
      }}
    >
      {children}
    </PoemContext.Provider>
  )
}
```

**验收标准**: 文件创建成功，Context代码无语法错误

---

## 第六步：添加CSS动画

### 6.1 修改CSS文件
**操作步骤**:
1. 打开 `src/index.css` 文件
2. 在文件末尾添加以下CSS代码：

```css
/* 四芒星发光动画 */
@keyframes starGlow {
  0% {
    filter: drop-shadow(0 0 10px #00FFFF);
  }
  100% {
    filter: drop-shadow(0 0 30px #00FFFF);
  }
}

/* 诗句淡入动画 */
@keyframes poemFadeIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 加载旋转动画 */
@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
```

**验收标准**: CSS代码添加成功，无语法错误

---

## 第七步：集成到主页面

### 7.1 修改App.tsx文件
**操作步骤**:
1. 打开 `src/App.tsx` 文件
2. 在文件顶部的import部分添加：

```typescript
import { PoemProvider, usePoem } from './contexts/PoemContext'
import StarButton from './components/StarButton'
import PoemDisplay from './components/PoemDisplay'
```

3. 在 `AppContent` 组件开始处添加：

```typescript
const AppContent: React.FC = () => {
  const { theme } = useTheme()
  const { poemState, searchPoem, clearPoem } = usePoem()
  
  // ... 现有代码保持不变 ...
```

4. 在中间页面区域（第790-802行）修改为：

```typescript
<div style={{ width: '100vw', height: '100vh', scrollSnapAlign: 'start' }}>
  <div style={{
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  }}>
    <HeroText onPhaseChange={handleHeroPhaseChange} />
    
    {/* 添加四芒星按钮 */}
    <StarButton 
      onClick={searchPoem}
      isLoading={poemState.isLoading}
    />
    
    {/* 添加诗句显示 */}
    <PoemDisplay 
      poem={poemState.currentPoem}
      isVisible={poemState.isVisible}
    />
  </div>
</div>
```

5. 修改 `App` 组件：

```typescript
function App() {
  return (
    <ThemeProvider>
      <PoemProvider>
        <AppContent />
      </PoemProvider>
    </ThemeProvider>
  )
}
```

**验收标准**: 代码修改成功，无语法错误

---

## 第八步：测试功能

### 8.1 启动开发服务器
**操作步骤**:
1. 在终端中运行：`npm run dev`
2. 等待服务器启动
3. 打开浏览器访问显示的URL（通常是 http://localhost:5173）

**验收标准**: 页面正常加载，无控制台错误

### 8.2 测试四芒星按钮
**操作步骤**:
1. 滚动到中间页面
2. 查看左上角是否显示四芒星按钮
3. 点击四芒星按钮
4. 观察是否显示加载动画
5. 等待几秒钟查看是否显示诗句

**验收标准**: 按钮显示正常，点击有响应，显示加载动画

### 8.3 测试诗句显示
**操作步骤**:
1. 等待AI搜索完成
2. 查看页面中央是否显示诗句
3. 检查诗句内容、作者、标题是否正确显示
4. 测试深色/浅色主题切换

**验收标准**: 诗句正确显示，样式美观，主题切换正常

### 8.4 测试错误处理
**操作步骤**:
1. 断网测试：关闭网络连接，点击按钮
2. 错误API key测试：修改.env.local中的API key为错误值
3. 观察错误提示是否正常

**验收标准**: 错误情况下有适当的提示信息

---

## 第九步：调试和优化

### 9.1 检查控制台日志
**操作步骤**:
1. 打开浏览器开发者工具（F12）
2. 查看Console标签页
3. 点击四芒星按钮
4. 观察控制台输出的日志信息

**验收标准**: 控制台显示正常的API调用日志

### 9.2 检查网络请求
**操作步骤**:
1. 在开发者工具中点击Network标签页
2. 点击四芒星按钮
3. 查看是否有API请求
4. 检查请求状态和响应

**验收标准**: 网络请求正常，响应状态为200

### 9.3 样式调整
**操作步骤**:
1. 根据实际显示效果调整按钮位置
2. 调整诗句显示样式
3. 优化动画效果
4. 确保在不同屏幕尺寸下正常显示

**验收标准**: 样式美观，响应式设计正常

---

## 第十步：最终验收

### 10.1 功能验收清单
- [ ] 四芒星按钮正确显示在左上角
- [ ] 点击按钮触发AI搜索
- [ ] 搜索时显示加载动画
- [ ] 搜索完成后显示诗句
- [ ] 诗句包含内容、作者、标题、来源
- [ ] 深色/浅色主题切换正常
- [ ] 错误情况下有适当提示

### 10.2 性能验收清单
- [ ] 页面加载速度正常
- [ ] 动画效果流畅
- [ ] 无内存泄漏
- [ ] 网络请求响应时间合理

### 10.3 兼容性验收清单
- [ ] 在不同浏览器中正常显示
- [ ] 在不同屏幕尺寸下正常显示
- [ ] 移动端基本可用

---

## 常见问题解决

### 问题1：API调用失败
**可能原因**:
- API key错误
- 网络连接问题
- Gemini API服务问题
- API配额限制

**解决方案**:
1. 检查.env.local文件中的API key是否正确
2. 检查网络连接
3. 查看控制台错误信息
4. 检查Gemini API配额是否用完
5. 尝试重新获取API key

### 问题2：组件不显示
**可能原因**:
- 导入路径错误
- Context Provider未正确包装
- 组件props传递错误

**解决方案**:
1. 检查import路径是否正确
2. 确保PoemProvider正确包装AppContent
3. 检查组件props传递

### 问题3：样式不生效
**可能原因**:
- CSS动画未正确添加
- z-index层级问题
- 主题切换问题

**解决方案**:
1. 检查CSS动画是否正确添加
2. 调整z-index层级
3. 检查主题切换逻辑

---

## 后续优化建议

### 功能优化
1. 添加搜索历史记录
2. 添加收藏功能
3. 支持更多语言
4. 添加分享功能

### 性能优化
1. 添加请求缓存
2. 优化动画性能
3. 添加预加载机制
4. 减少不必要的重渲染

### 用户体验优化
1. 添加更好的加载状态
2. 优化错误提示
3. 添加键盘快捷键
4. 支持语音搜索

---

## 总结

这个实现计划提供了完整的步骤指导，从环境准备到最终验收，每一步都有具体的操作说明和验收标准。按照这个计划，你应该能够成功实现AI诗句搜索功能。

如果在实施过程中遇到任何问题，请参考常见问题解决方案，或者查看控制台错误信息进行调试。