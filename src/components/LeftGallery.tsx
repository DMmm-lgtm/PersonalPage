import React, { useState, useMemo, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'

// 图片占位数据类型定义
interface ImagePlaceholder {
  id: number
  width: string
  height: string
  aspectRatio: string
}

// 9个图片占位数据
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

// 单个图片占位组件 - 叠放文件夹版本
const ImagePlaceholder: React.FC<{ 
  placeholder: ImagePlaceholder
  stackIndex: number // 在栈中的位置（0为最顶层）
  isTop: boolean // 是否为最顶层
  onClick: (id: number) => void
  url?: string | null
}> = ({ placeholder, stackIndex, isTop, onClick, url }) => {
  const { theme } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  // 计算每个图片的偏移量（从右下角往左上角堆叠）
  const offsetX = -stackIndex * 0.035 // 每个图片向左偏移2%
  const offsetY = -stackIndex * 0.04 // 每个图片向上偏移2%
  
  // 计算z-index（最顶层最高）
  const zIndex = 100 - stackIndex

  // 图片 URL 由父组件传入（从 Supabase 获取后设置到状态）
  const supabaseUrl = url || undefined

  return (
    <div
      className="absolute overflow-hidden rounded-[10px] cursor-pointer"
      style={{
        // 每张图片本身占屏幕的2/3大小
        width: '66.67vw',
        height: '66.67vh',
        maxWidth: '800px',
        maxHeight: '600px',
        minWidth: '400px',
        minHeight: '300px',
        // 相对于视口偏右下角定位，然后应用叠放偏移
        left: '57%', // 从中心向右偏移15%
        top: '57%', // 从中心向下偏移15%
        transform: `translate(calc(-50% + ${offsetX * 100}%), calc(-50% + ${offsetY * 100}%))`,
        // z-index层级
        zIndex,
        // 过渡动画
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        // 性能优化
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
      onClick={() => onClick(placeholder.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 图片容器 */}
      <div
        className="w-full h-full relative"
        style={{
          // 黑灰色填充背景，作为留边区域
          backgroundColor: theme === 'dark' ? '#0a0a0a' : '#111111',
          border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
          // 悬停时的阴影效果
          boxShadow: isHovered 
            ? (theme === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)')
            : (stackIndex === 0 
                ? '0 4px 16px rgba(0, 0, 0, 0.1)' 
                : 'none'),
          // 悬停时轻微放大
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease'
        }}
      >
        {/* 图片内容 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {supabaseUrl ? (
            // 渲染图片
            <img 
              src={supabaseUrl}
              alt={`照片 ${placeholder.id}`}
              className="w-full h-full object-cover"
              style={{
                opacity: isTop ? 0.9 : 0.75,
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                transition: 'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease',
                // 保持比例并居中平铺，填充容器
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block',
                borderRadius: '10px',
                backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(20, 20, 20, 0.8)',
                // 非顶层图片添加黑度效果
                filter: isTop ? 'none' : 'brightness(50%)'
              }}
              onError={(e) => {
                // 如果图片加载失败，显示占位符
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* 占位符内容（当没有图片或图片加载失败时显示） */}
          <div 
            className="absolute inset-0 flex items-center justify-center text-center"
            style={{ display: supabaseUrl ? 'none' : 'flex' }}
          >
            <div 
              className="text-sm font-mono font-medium transition-all duration-300"
              style={{
                color: theme === 'dark' ? 'rgba(255, 120, 120, 0.9)' : '#cc0000',
                backgroundColor: theme === 'dark' ? 'rgba(255, 120, 120, 0.08)' : 'rgba(204, 0, 0, 0.06)',
                border: `1px solid ${theme === 'dark' ? 'rgba(255, 120, 120, 0.4)' : 'rgba(204, 0, 0, 0.35)'}`,
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                opacity: isTop ? 0.95 : 0.7,
                transform: isHovered ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              url error
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

const LeftGallery: React.FC = () => {
  // 图片栈顺序状态管理（初始时1号图片在最顶层，9号图片在最底层）
  const [imageStack, setImageStack] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [galleryUrls, setGalleryUrls] = useState<(string | null)[]>(Array(9).fill(null))
  
  // 处理图片点击事件
  const handleImageClick = (clickedId: number) => {
    setImageStack(prevStack => {
      // 找到被点击图片的当前位置
      const clickedIndex = prevStack.indexOf(clickedId)
      
      if (clickedIndex === -1) return prevStack // 如果找不到，返回原数组
      
      // 计算动画时长：每张图片插入底部需要0.2秒
      const animationDuration = (prevStack.length - 1 - clickedIndex) * 0.2
      
      // 创建新的栈顺序：被点击的图片移到最顶层（右下角位置），其他图片按原顺序排列
      const newStack = [
        clickedId, // 被点击的图片移到最顶层
        ...prevStack.filter(id => id !== clickedId) // 其他图片保持原顺序
      ]
      
      console.log(`点击了图片 ${clickedId}，从位置 ${clickedIndex} 移到顶层，动画时长 ${animationDuration}s`)
      
      return newStack
    })
  }

  // 使用useMemo缓存图片组件，避免不必要的重新渲染
  const imageComponents = useMemo(() => {
    return imageStack.map((imageId, stackIndex) => {
      const placeholder = imagePlaceholders.find(p => p.id === imageId)
      if (!placeholder) return null
      
      return (
        <ImagePlaceholder
          key={`${imageId}-${stackIndex}`} // 使用id和位置作为key
          placeholder={placeholder}
          stackIndex={stackIndex}
          isTop={stackIndex === 0}
          onClick={handleImageClick}
          url={galleryUrls[placeholder.id - 1]}
        />
      )
    })
  }, [imageStack, galleryUrls])

  // 拉取 Supabase 图片列表：优先根目录，若为空回退到 gallery/
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const listPath = async (path: string) => {
          const res = await supabase
            .storage
            .from('image')
            .list(path, { limit: 100, sortBy: { column: 'name', order: 'asc' } })
          return { path, ...res }
        }

        // 仅使用根目录（根据你的说明，照片都在 image 桶的根目录）
        let listing = await listPath('')
        if (!active) return
        if (listing.error) console.warn('Supabase list root error:', listing.error.message)

        let usingPath = ''
        let files = (listing.data ?? []).filter((item: any) => item && item.name)

        if (!files.length) {
          console.log('Supabase: 根目录无文件')
          return
        }

        // 为每个文件生成可访问 URL：优先签名 URL，回退 public URL
        const buildUrlFor = async (path: string): Promise<string | null> => {
          try {
            const signed = await supabase.storage.from('image').createSignedUrl(path, 3600)
            if (signed.data?.signedUrl) return signed.data.signedUrl
            const pub = supabase.storage.from('image').getPublicUrl(path)
            return pub.data.publicUrl || null
          } catch {
            const pub = supabase.storage.from('image').getPublicUrl(path)
            return pub.data.publicUrl || null
          }
        }

        // 直接按返回列表顺序取前 9 张（无需特定命名或 gallery/ 文件夹）
        const targets: string[] = files.slice(0, 9).map((f: any) => f.name)

        const fullPaths = targets.map(name => name ? name : '')
        const urls: (string | null)[] = await Promise.all(fullPaths.map(p => p ? buildUrlFor(p) : Promise.resolve(null)))

        console.log('Supabase: 使用路径 =', usingPath || '(root)', ' 总文件数 =', files.length)
        console.log('Supabase: 目标文件 =', targets)
        console.log('Supabase: 生成URL =', urls)

        // 保持长度为9的数组，对应占位 id 1..9
        setGalleryUrls(urls)

        // （移除诊断网络请求）
      } catch (e: any) {
        if (!active) return
        setError(e?.message ?? '未知错误')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      padding: '2rem',
      boxSizing: 'border-box',
      // 性能优化
      contain: 'layout style paint'
    }}>
      {/* 加载与错误状态提示（简洁显示，不遮挡布局） */}
      {loading && (
        <div className="absolute top-4 left-4 text-xs font-mono" style={{ color: 'rgba(0, 255, 255, 0.5)', zIndex: 1000 }}>
          正在从 Supabase 加载图片...
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 text-xs font-mono" style={{ color: 'rgba(255, 100, 100, 0.8)', zIndex: 1000 }}>
          加载失败：{error}
        </div>
      )}
      {/* 调试显示已移除 */}
      {/* 叠放的图片组件 - 直接相对于视口定位 */}
      {imageComponents}
      
    </div>
  )
}

export default LeftGallery
