import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

// 图片占位数据类型定义
interface ImagePlaceholder {
  id: number
  width: string
  height: string
  aspectRatio: string
}

// 16个图片占位数据 - 不同大小和比例
const imagePlaceholders: ImagePlaceholder[] = [
  // 第一行 - 大尺寸图片
  { id: 1, width: 'w-full', height: 'h-80', aspectRatio: 'aspect-[4/3]' },
  { id: 2, width: 'w-2/3', height: 'h-60', aspectRatio: 'aspect-[3/2]' },
  { id: 3, width: 'w-1/2', height: 'h-72', aspectRatio: 'aspect-[2/3]' },
  { id: 4, width: 'w-3/4', height: 'h-48', aspectRatio: 'aspect-[3/2]' },
  
  // 第二行 - 中等尺寸图片
  { id: 5, width: 'w-1/3', height: 'h-56', aspectRatio: 'aspect-[1/2]' },
  { id: 6, width: 'w-2/3', height: 'h-40', aspectRatio: 'aspect-[3/2]' },
  { id: 7, width: 'w-1/2', height: 'h-64', aspectRatio: 'aspect-[2/3]' },
  { id: 8, width: 'w-3/4', height: 'h-52', aspectRatio: 'aspect-[3/2]' },
  
  // 第三行 - 混合尺寸
  { id: 9, width: 'w-full', height: 'h-44', aspectRatio: 'aspect-[4/3]' },
  { id: 10, width: 'w-1/2', height: 'h-68', aspectRatio: 'aspect-[2/3]' },
  { id: 11, width: 'w-2/3', height: 'h-36', aspectRatio: 'aspect-[3/2]' },
  { id: 12, width: 'w-1/3', height: 'h-60', aspectRatio: 'aspect-[1/2]' },
  
  // 第四行 - 小尺寸图片
  { id: 13, width: 'w-1/4', height: 'h-40', aspectRatio: 'aspect-[1/2]' },
  { id: 14, width: 'w-1/2', height: 'h-48', aspectRatio: 'aspect-[2/3]' },
  { id: 15, width: 'w-2/3', height: 'h-44', aspectRatio: 'aspect-[3/2]' },
  { id: 16, width: 'w-1/3', height: 'h-52', aspectRatio: 'aspect-[1/2]' }
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
  const { theme } = useTheme()

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
      {/* 照片墙容器 */}
      <div 
        className="w-full h-full max-w-6xl max-h-[800px] p-4"
        style={{
          backgroundColor: theme === 'dark' 
            ? 'rgba(0, 0, 0, 0.2)' 
            : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
        }}
      >
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 
            className="text-3xl font-bold mb-2"
            style={{
              color: theme === 'dark' ? 'white' : '#1f2937',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            📸 照片墙
          </h2>
          <p 
            className="text-sm opacity-60"
            style={{
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              fontFamily: 'Fira Code, monospace'
            }}
          >
            16个不同尺寸的图片占位 - 悬停放大
          </p>
        </div>

        {/* 不规则网格布局 */}
        <div className="grid grid-cols-4 gap-4 h-full overflow-y-auto">
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
