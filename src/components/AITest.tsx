import React, { useState } from 'react'

// 简单的AI测试组件
const AITest: React.FC = () => {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const listModels = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
      const data = await response.json()
      console.log('可用模型:', data)
      return data
    } catch (err) {
      console.error('获取模型列表失败:', err)
      return null
    }
  }

  const testAI = async () => {
    setLoading(true)
    setError('')
    setResult('')

    try {
      console.log('开始测试AI API...')
      
      // 使用正确的Gemini API端点
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      console.log('API Key:', apiKey ? 'Found' : 'Not found')
      
      if (!apiKey) {
        throw new Error('API Key not found in environment variables')
      }

      // 先获取可用模型列表
      console.log('获取可用模型列表...')
      const models = await listModels()
      if (models && models.models) {
        console.log('可用模型:', models.models.map((m: any) => m.name))
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Provide a line of poetry in any language, including the author and the title of the poem.'
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
        const errorText = await response.text()
        console.error('API错误响应:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      console.log('=== AI完整响应 ===')
      console.log(JSON.stringify(data, null, 2))
      console.log('=== 响应结构分析 ===')
      console.log('data keys:', Object.keys(data))
      if (data.candidates) {
        console.log('candidates数量:', data.candidates.length)
        if (data.candidates.length > 0) {
          console.log('第一个candidate keys:', Object.keys(data.candidates[0]))
        }
      }
      
      // 使用官方文档的标准响应解析
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0]
        console.log('第一个候选结果:', candidate)
        
        // 检查finishReason
        if (candidate.finishReason) {
          console.log('完成原因:', candidate.finishReason)
          if (candidate.finishReason === 'SAFETY') {
            setResult('内容被安全过滤器阻止')
            return
          } else if (candidate.finishReason === 'RECITATION') {
            setResult('内容被引用过滤器阻止')
            return
          }
        }
        
        // 直接显示完整的候选结果结构
        console.log('完整候选结果:', JSON.stringify(candidate, null, 2))
        
        // 尝试多种可能的文本提取路径
        let extractedText = ''
        
        // 路径1: candidate.content.parts[0].text
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          extractedText = candidate.content.parts[0].text
          console.log('路径1成功 - content.parts[0].text:', extractedText)
        }
        // 路径2: candidate.text
        else if (candidate.text) {
          extractedText = candidate.text
          console.log('路径2成功 - candidate.text:', extractedText)
        }
        // 路径3: candidate.content.text
        else if (candidate.content && candidate.content.text) {
          extractedText = candidate.content.text
          console.log('路径3成功 - content.text:', extractedText)
        }
        // 路径4: 检查其他可能的字段
        else {
          console.log('所有路径都失败，显示候选结果的所有字段:')
          console.log('candidate keys:', Object.keys(candidate))
          if (candidate.content) {
            console.log('candidate.content keys:', Object.keys(candidate.content))
          }
          extractedText = `无法提取文本。候选结果结构: ${JSON.stringify(candidate, null, 2)}`
        }
        
        setResult(extractedText)
      } else {
        console.log('响应中没有candidates')
        setResult('AI返回了空结果 - 没有candidates')
      }
    } catch (err) {
      console.error('AI测试失败:', err)
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#00FFFF',
      padding: '1rem',
      borderRadius: '10px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '16px' }}>AI测试</h3>
      
      <button
        onClick={testAI}
        disabled={loading}
        style={{
          background: loading ? '#666' : '#00FFFF',
          color: loading ? '#ccc' : '#000',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '1rem'
        }}
      >
        {loading ? '测试中...' : '测试AI API'}
      </button>

      {error && (
        <div style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '0.5rem' }}>
          错误: {error}
        </div>
      )}

      {result && (
        <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
          <strong>AI回复:</strong><br />
          {result}
        </div>
      )}
    </div>
  )
}

export default AITest
