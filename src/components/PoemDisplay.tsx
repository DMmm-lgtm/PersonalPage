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
