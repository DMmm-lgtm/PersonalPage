import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

// 图片占位数据类型定义
interface ImagePlaceholder {
  id: number
  width: string
  height: string
  aspectRatio: string
}

// 9个图片占位数据 - 统一的3x3网格布局
const imagePlaceholders: ImagePlaceholder[] = [
  { id: 1, width: 'w-full', height: 'h-48', aspectRatio: 'aspect-square' },
  { id: 2, width: 'w-full', height: 'h-48', aspectRatio: 'aspect-square' },
  { id: 3, width: 'w-full', height: 'h-48', aspectRatio: 'aspect-square' },
  { id: 4, width: 'w-full', height: 'h-48', aspectRatio: 'aspect-square' },
  { id: 5, width: 'w-full', height: 'h-48', aspectRatio: 'aspect-square' },
  { id: 6, width: 'w-full', height: 'h-48', aspectRatio: 'aspect-square' },
  { id: 7, width: 'w-full', height: 'h-48', aspectRatio: 'aspect-square' },
  { id: 8, width: 'w-full', height: 'h-48', aspectRatio: 'aspect-square' },
  { id: 9, width: 'w-full', height: 'h-48', aspectRatio: 'aspect-square' }
]

// 单个图片占位组件
const ImagePlaceholder: React.FC<{ placeholder: ImagePlaceholder }> = ({ placeholder }) => {
  const { theme } = useTheme()
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className={`${placeholder.width} ${placeholder.height} ${placeholder.aspectRatio} relative overflow-hidden rounded-lg cursor-pointer transition-all duration-500 ease-out`}
      style={{
        backgroundColor: theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)',
        border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        minHeight: '120px', // 确保最小高度
        transform: isHovered ? 'scale(1.2)' : 'scale(1)',
        zIndex: isHovered ? 50 : 'auto',
        boxShadow: isHovered 
          ? theme === 'dark'
            ? '0 20px 40px rgba(0, 0, 0, 0.6), 0 10px 20px rgba(0, 0, 0, 0.4)'
            : '0 20px 40px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2)'
          : 'none',
        willChange: 'transform, box-shadow, z-index',
        backfaceVisibility: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 图片占位内容 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center transition-all duration-500">
          <div 
            className="text-2xl mb-2 transition-all duration-500"
            style={{
              opacity: isHovered ? 0.9 : 0.6,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            📷
          </div>
          <div 
            className="text-xs font-mono transition-all duration-500"
            style={{
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
              opacity: isHovered ? 0.8 : 0.4,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {placeholder.id}
          </div>
        </div>
      </div>
      
      {/* 悬停时的覆盖层和提示文字 */}
      <div 
        className="absolute inset-0 transition-all duration-500 flex items-center justify-center"
        style={{
          backgroundColor: isHovered 
            ? (theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)')
            : 'rgba(0, 0, 0, 0)'
        }}
      >
        <div 
          className="transition-all duration-500"
          style={{ 
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)'
          }}
        >
          <div 
            className="text-sm font-medium text-center"
            style={{
              color: theme === 'dark' ? 'white' : 'white',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            点击查看
          </div>
        </div>
      </div>
    </div>
  )
}

const LeftGallery: React.FC = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      padding: '2rem',
      boxSizing: 'border-box'
    }}>
      {/* 简化的3x3网格布局 */}
      <div className="w-full h-full max-w-4xl max-h-[600px] p-4">
        <div className="grid grid-cols-3 gap-4 h-full">
          {imagePlaceholders.map((placeholder) => (
            <ImagePlaceholder
              key={placeholder.id}
              placeholder={placeholder}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeftGallery
