import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const FloatingBox: React.FC = () => {
  const { theme } = useTheme()

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999, // 最高层级，确保不被遮挡
        padding: '12px 20px',
        borderRadius: '20px',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ff6b9d 100%)'
          : 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: '"Comic Sans MS", "Marker Felt", cursive',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        boxShadow: theme === 'dark'
          ? '0 8px 32px rgba(255, 107, 107, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(255, 154, 158, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        animation: 'floatingMove 25s ease-in-out infinite',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        userSelect: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'
        e.currentTarget.style.boxShadow = theme === 'dark'
          ? '0 12px 48px rgba(255, 107, 107, 0.6), 0 6px 24px rgba(0, 0, 0, 0.4)'
          : '0 12px 48px rgba(255, 154, 158, 0.6), 0 6px 24px rgba(0, 0, 0, 0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'
        e.currentTarget.style.boxShadow = theme === 'dark'
          ? '0 8px 32px rgba(255, 107, 107, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(255, 154, 158, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)'
      }}
      onClick={(e) => {
        // 复制到剪贴板
        const el = e.currentTarget
        navigator.clipboard.writeText('q494294512').then(() => {
          // 临时显示复制成功提示
          const originalText = el.textContent
          el.textContent = '已复制！'
          window.setTimeout(() => {
            el.textContent = originalText
          }, 1000)
        })
      }}
    >
      {/* 装饰层，替代 ::before 伪元素 */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-5px',
          left: '-5px',
          right: '-5px',
          bottom: '-5px',
          background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          borderRadius: '25px',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      catch me：q494294512
    </div>
  )
}

export default FloatingBox
