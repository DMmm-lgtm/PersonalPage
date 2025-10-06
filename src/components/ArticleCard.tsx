import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

// 卡片属性接口
interface ArticleCardProps {
  id: number
  title: string
  date: string
  link: string
  readCount: number
  likeCount: number
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, date, link, readCount, likeCount }) => {
  const { theme } = useTheme()
  
  // 处理卡片点击事件
  const handleCardClick = () => {
    // 暂时使用alert，后续可以改为实际跳转
    alert(`点击了文章: ${title}\n链接: ${link}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="relative w-full h-32 rounded-lg cursor-pointer transition-all duration-300 ease-out"
      style={{
        backgroundColor: theme === 'dark' 
          ? 'rgba(26, 26, 26, 0.8)' 
          : 'rgba(45, 45, 45, 0.8)',
        boxShadow: theme === 'dark'
          ? '0 2px 8px rgba(0, 0, 0, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        willChange: 'transform, box-shadow',
        backfaceVisibility: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = theme === 'dark'
          ? '0 4px 16px rgba(0, 0, 0, 0.5)'
          : '0 4px 16px rgba(0, 0, 0, 0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = theme === 'dark'
          ? '0 2px 8px rgba(0, 0, 0, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* 左侧文字内容区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}>
        {/* 日期 */}
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: 'Inter, sans-serif',
          marginBottom: '4px'
        }}>
          {date}
        </div>

        {/* 标题 */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'white',
          margin: '0 0 8px 0',
          lineHeight: '1.4',
          fontFamily: 'Inter, sans-serif',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {title}
        </h3>

        {/* 阅读数和点赞数 */}
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: 'Inter, sans-serif',
          marginTop: 'auto'
        }}>
          阅读{readCount} 赞{likeCount}
        </div>
      </div>

      {/* 右侧缩略图区域 */}
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        flexShrink: 0
      }}>
        <span style={{
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '24px',
          fontFamily: 'Inter, sans-serif'
        }}>
          📷
        </span>
      </div>
    </div>
  )
}

export default ArticleCard
