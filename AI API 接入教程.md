# AI API 接入完整教程

## 免费AI API推荐

### 1. 推荐方案：Hugging Face Inference API（免费）
**优势**:
- 完全免费，每月有足够的免费额度
- 支持多种开源模型
- 无需信用卡注册
- 响应速度快

**限制**:
- 每月免费调用次数有限制
- 模型质量可能不如商业API

### 2. 备选方案：OpenAI API（付费但便宜）
**优势**:
- 模型质量最高
- 响应稳定
- 支持中文理解

**成本**:
- GPT-3.5-turbo: $0.001/1K tokens（非常便宜）
- 你的使用量估计每月 < $1

## 方案一：Hugging Face API（推荐，完全免费）

### 步骤1：注册Hugging Face账号
1. 访问 https://huggingface.co/
2. 点击 "Sign Up" 注册账号
3. 验证邮箱
4. 登录后进入个人设置

### 步骤2：获取API Token
1. 登录后，点击右上角头像
2. 选择 "Settings"
3. 左侧菜单选择 "Access Tokens"
4. 点击 "New token"
5. 输入名称（如：personal-page-api）
6. 选择权限：Read
7. 点击 "Generate a token"
8. **复制并保存这个token**（只显示一次）

### 步骤3：安装依赖
在项目根目录运行：
```bash
npm install @huggingface/inference
```

### 步骤4：创建环境变量文件
在项目根目录创建 `.env.local` 文件：
```
VITE_HUGGINGFACE_API_KEY=你的token
```

### 步骤5：创建AI服务文件
创建 `src/lib/aiService.ts`：

```typescript
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY)

export interface PoemSearchResponse {
  poem: string
  author: string
  title: string
  source: string
  language: 'chinese' | 'english' | 'other'
}

export const searchPoem = async (prompt: string): Promise<PoemSearchResponse> => {
  try {
    // 使用Hugging Face的文本生成模型
    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium', // 免费模型
      inputs: `请为我推荐一句优美的诗句，要求：
1. 可以是中文或英文
2. 可以是古代、现代或当代作品
3. 诗句要优美、有意境
4. 请以JSON格式返回：{"poem": "诗句内容", "author": "作者", "title": "诗歌标题", "source": "来源", "language": "语言"}

用户请求：${prompt}`,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        return_full_text: false
      }
    })

    // 解析返回的文本
    const generatedText = response.generated_text
    
    // 尝试提取JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const jsonStr = jsonMatch[0]
      const result = JSON.parse(jsonStr)
      return result
    } else {
      // 如果无法解析JSON，返回默认格式
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

## 方案二：OpenAI API（付费但便宜）

### 步骤1：注册OpenAI账号
1. 访问 https://platform.openai.com/
2. 点击 "Sign up" 注册账号
3. 验证邮箱和手机号
4. 登录后进入Dashboard

### 步骤2：获取API Key
1. 登录后，点击右上角头像
2. 选择 "View API keys"
3. 点击 "Create new secret key"
4. 输入名称（如：personal-page）
5. 点击 "Create secret key"
6. **复制并保存这个key**（只显示一次）

### 步骤3：设置付费方式
1. 在Dashboard左侧选择 "Billing"
2. 点击 "Add payment method"
3. 添加信用卡（最低充值$5）
4. 设置使用限制（建议$1/月）

### 步骤4：安装依赖
```bash
npm install openai
```

### 步骤5：创建环境变量
在 `.env.local` 文件中添加：
```
VITE_OPENAI_API_KEY=你的api_key
```

### 步骤6：创建AI服务文件
创建 `src/lib/aiService.ts`：

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // 注意：生产环境应该使用后端代理
})

export interface PoemSearchResponse {
  poem: string
  author: string
  title: string
  source: string
  language: 'chinese' | 'english' | 'other'
}

export const searchPoem = async (prompt: string): Promise<PoemSearchResponse> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个诗歌专家，能够推荐优美的诗句。请以JSON格式返回结果。"
        },
        {
          role: "user",
          content: `请为我推荐一句优美的诗句，要求：
1. 可以是中文或英文
2. 可以是古代、现代或当代作品
3. 诗句要优美、有意境
4. 请以JSON格式返回：{"poem": "诗句内容", "author": "作者", "title": "诗歌标题", "source": "来源", "language": "语言"}

用户请求：${prompt}`
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    })

    const content = completion.choices[0]?.message?.content || ""
    
    // 解析JSON
    try {
      const result = JSON.parse(content)
      return result
    } catch {
      // 如果无法解析JSON，返回默认格式
      return {
        poem: content,
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

## 推荐实现方案

### 建议使用方案一（Hugging Face）
**原因**:
1. 完全免费，适合学习
2. 无需信用卡
3. 足够满足你的使用需求

### 实现步骤

#### 步骤1：安装依赖
```bash
npm install @huggingface/inference
```

#### 步骤2：创建环境变量文件
在项目根目录创建 `.env.local`：
```
VITE_HUGGINGFACE_API_KEY=你的token
```

#### 步骤3：创建AI服务
创建 `src/lib/aiService.ts`（使用上面的Hugging Face代码）

#### 步骤4：创建四芒星按钮组件
创建 `src/components/StarButton.tsx`：

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

#### 步骤5：创建诗句显示组件
创建 `src/components/PoemDisplay.tsx`：

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

#### 步骤6：创建状态管理
创建 `src/contexts/PoemContext.tsx`：

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
    setPoemState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isVisible: false
    }))

    try {
      const result = await searchPoem('推荐一句优美的诗句')
      setPoemState(prev => ({
        ...prev,
        currentPoem: result,
        isLoading: false,
        isVisible: true
      }))
    } catch (error) {
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

#### 步骤7：添加CSS动画
在 `src/index.css` 中添加：

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

#### 步骤8：集成到主页面
修改 `src/App.tsx`，在中间页面添加组件：

```typescript
// 在文件顶部添加导入
import { PoemProvider, usePoem } from './contexts/PoemContext'
import StarButton from './components/StarButton'
import PoemDisplay from './components/PoemDisplay'

// 在AppContent组件中添加
const AppContent: React.FC = () => {
  const { theme } = useTheme()
  const { poemState, searchPoem, clearPoem } = usePoem()
  
  // ... 现有代码 ...

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 现有背景和粒子代码... */}
      
      {/* 中间页面区域 */}
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
      
      {/* 其他现有代码... */}
    </div>
  )
}

// 修改App组件
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

## 测试步骤

### 1. 环境测试
```bash
# 检查依赖是否安装成功
npm list @huggingface/inference

# 检查环境变量
echo $VITE_HUGGINGFACE_API_KEY
```

### 2. 功能测试
1. 启动开发服务器：`npm run dev`
2. 打开浏览器访问页面
3. 点击左上角四芒星按钮
4. 观察是否显示加载动画
5. 检查是否显示诗句结果

### 3. 错误处理测试
1. 故意输入错误的API key
2. 断网测试
3. 检查错误提示是否正常

## 常见问题解决

### 问题1：API调用失败
**解决方案**：
1. 检查API key是否正确
2. 检查网络连接
3. 查看浏览器控制台错误信息

### 问题2：样式不显示
**解决方案**：
1. 检查CSS动画是否正确添加
2. 检查z-index层级
3. 检查主题切换是否正常

### 问题3：组件不显示
**解决方案**：
1. 检查导入路径是否正确
2. 检查Context Provider是否正确包装
3. 检查组件props传递

## 下一步优化

1. **错误处理优化**：添加更详细的错误信息
2. **加载状态优化**：添加更丰富的加载动画
3. **样式优化**：根据实际效果调整样式
4. **性能优化**：添加请求缓存机制

## 总结

这个教程提供了完整的AI API接入方案，包括：
- 免费的Hugging Face API方案
- 付费但便宜的OpenAI API方案
- 详细的实现步骤
- 完整的代码示例
- 测试和调试方法

建议先使用Hugging Face API进行学习，后续如果需要更好的效果再考虑OpenAI API。
