// 使用直接API调用而不是SDK，确保兼容性
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

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
    
    const fullPrompt = `请为我推荐一句优美的诗句，要求：
1. 可以是中文或英文
2. 可以是古代、现代或当代作品
3. 诗句要优美、有意境
4. 请以JSON格式返回：{"poem": "诗句内容", "author": "作者", "title": "诗歌标题", "source": "来源", "language": "语言"}

用户请求：${prompt}`

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
          thinkingConfig: {
            thinkingBudget: 0  // 禁用思考功能，加快响应
          }
        }
      })
    })

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`)
    }

    const data = await response.json()
    console.log('AI响应:', data)
    
    // 解析响应
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0]
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const generatedText = candidate.content.parts[0].text
        console.log('生成的文本:', generatedText)
        
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
      }
    }
    
    throw new Error('无法解析AI响应')
  } catch (error) {
    console.error('AI搜索失败:', error)
    throw new Error('搜索诗句失败，请稍后重试')
  }
}
