import React, { useState, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'

// 卡片位置类型定义
interface CardPosition {
  left: number
  top: number
  rotation: number
}

// 卡片属性接口
interface ArticleCardProps {
  id: number
  title: string
  date: string
  link: string
  readCount: number
  likeCount: number
  position: CardPosition
}

const ArticleCard: React.FC<ArticleCardProps> = ({ id, title, date, link, readCount, likeCount, position }) => {
  const { theme } = useTheme()
  
  // 拖拽状态管理
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentPosition, setCurrentPosition] = useState(position)
  const cardRef = useRef<HTMLDivElement>(null)

  // 当position prop变化时，更新currentPosition
  React.useEffect(() => {
    setCurrentPosition(position)
  }, [position])

  // 处理卡片点击事件
  const handleCardClick = (e: React.MouseEvent) => {
    // 如果正在拖拽，不触发点击事件
    if (isDragging) {
      e.preventDefault()
      return
    }
    // 暂时使用alert，后续可以改为实际跳转
    alert(`点击了文章: ${title}\n链接: ${link}`)
  }

  // 开始拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault() // 防止默认行为
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      
      // 计算鼠标相对于卡片左上角的偏移
      // 使用clientX和clientY，因为rect也是相对于视口的
      const offsetX = e.clientX - rect.left
      const offsetY = e.clientY - rect.top
      
      setDragOffset({
        x: offsetX,
        y: offsetY
      })
      
      // 获取滚动容器的位置信息
      const scrollContainer = document.querySelector('div[style*="overflowX: scroll"]') as HTMLElement
      const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0
      
      // 立即更新位置到鼠标位置，确保卡片从当前位置开始跟随
      const newLeft = e.clientX - offsetX + scrollLeft
      const newTop = e.clientY - offsetY + scrollTop
      
      setCurrentPosition(prev => ({
        ...prev,
        left: newLeft,
        top: newTop
      }))
      
      setIsDragging(true)
    }
  }

  // 拖拽中
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault() // 防止默认行为
      
      // 获取滚动容器的位置信息
      const scrollContainer = document.querySelector('div[style*="overflowX: scroll"]') as HTMLElement
      const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0
      
      // 计算新位置：鼠标位置减去偏移量，再加上滚动偏移
      const newLeft = e.clientX - dragOffset.x + scrollLeft
      const newTop = e.clientY - dragOffset.y + scrollTop
      
      setCurrentPosition(prev => ({
        ...prev,
        left: newLeft,
        top: newTop
      }))
    }
  }

  // 结束拖拽
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 添加全局鼠标事件监听
  React.useEffect(() => {
    if (isDragging) {
      // 添加事件监听器，使用passive: false确保可以preventDefault
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp, { passive: false })
      
      // 防止拖拽时选中文字
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        // 恢复默认样式
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
      }
    }
  }, [isDragging, dragOffset])

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        width: '320px',
        height: '120px',
        backgroundColor: theme === 'dark' 
          ? 'rgba(26, 26, 26, 0.8)' 
          : 'rgba(45, 45, 45, 0.8)',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: isDragging 
          ? theme === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)'
          : theme === 'dark'
            ? '0 2px 8px rgba(0, 0, 0, 0.4)'
            : '0 2px 8px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isDragging ? 'none' : 'auto', // 拖拽时禁用其他鼠标事件
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '16px',
        // 使用当前位置和旋转
        left: `${currentPosition.left}px`,
        top: `${currentPosition.top}px`,
        transform: `rotate(${currentPosition.rotation}deg)`,
        opacity: isDragging ? 0.9 : 1,
        zIndex: isDragging ? 1000 : 'auto',
        userSelect: 'none', // 防止拖拽时选中文字
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = `rotate(${currentPosition.rotation}deg) translateY(-2px)`
          e.currentTarget.style.boxShadow = theme === 'dark'
            ? '0 4px 16px rgba(0, 0, 0, 0.5)'
            : '0 4px 16px rgba(0, 0, 0, 0.3)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = `rotate(${currentPosition.rotation}deg)`
          e.currentTarget.style.boxShadow = theme === 'dark'
            ? '0 2px 8px rgba(0, 0, 0, 0.4)'
            : '0 2px 8px rgba(0, 0, 0, 0.2)'
        }
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
