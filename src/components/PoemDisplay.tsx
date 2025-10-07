import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import type { PoemSearchResponse } from '../lib/aiService'

interface PoemDisplayProps {
  poem: PoemSearchResponse | null
  isVisible: boolean
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({ poem, isVisible }) => {
  const { theme } = useTheme()

  if (!poem) {
    return null
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        background: theme === 'dark' 
          ? 'radial-gradient(circle at center, rgba(0, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.9) 70%)'
          : 'radial-gradient(circle at center, rgba(0, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.9) 70%)'
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        {/* 标题 */}
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-cyan-400 animate-pulse">
          {poem.title}
        </h1>
        
        {/* 作者 */}
        <p className="text-xl md:text-2xl text-cyan-300 mb-12 font-light">
          {poem.author}
        </p>
        
        {/* 诗词内容 */}
        <div className="space-y-6">
          {poem.content.map((line, index) => (
            <p 
              key={index}
              className="text-lg md:text-xl text-gray-300 leading-relaxed animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {line}
            </p>
          ))}
        </div>
        
        {/* 翻译 */}
        {poem.translation && (
          <div className="mt-12 p-6 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">译文</h3>
            <p className="text-gray-300 leading-relaxed">
              {poem.translation}
            </p>
          </div>
        )}
        
        {/* 赏析 */}
        {poem.analysis && (
          <div className="mt-8 p-6 bg-cyan-500/5 rounded-lg border border-cyan-500/10">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">赏析</h3>
            <p className="text-gray-300 leading-relaxed">
              {poem.analysis}
            </p>
          </div>
        )}
        
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default PoemDisplay