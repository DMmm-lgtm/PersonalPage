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
