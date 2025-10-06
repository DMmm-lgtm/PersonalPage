import React, { useMemo } from 'react'
import ArticleCard from './ArticleCard'

// 卡片数据类型定义
interface CardData {
  id: number
  title: string
  date: string
  link: string
  readCount: number
  likeCount: number
}

// 卡片位置类型定义
interface CardPosition {
  left: number
  top: number
  rotation: number
}

// 21个卡片数据 - 根据图片内容对应
const cardData: CardData[] = [
  // 第一组7个卡片（第一张图片）
  {
    id: 1,
    title: "「yes and」与「我执」",
    date: "9月2日",
    link: "https://example.com/article1",
    readCount: 151,
    likeCount: 2
  },
  {
    id: 2,
    title: "重识贝叶斯",
    date: "8月18日",
    link: "https://example.com/article2",
    readCount: 1398,
    likeCount: 39
  },
  {
    id: 3,
    title: "睡觉 呼吸 疗愈",
    date: "8月3日",
    link: "https://example.com/article3",
    readCount: 123,
    likeCount: 2
  },
  {
    id: 4,
    title: "《一辈子不愁钱的活法》读后感",
    date: "7月16日",
    link: "https://example.com/article4",
    readCount: 7702,
    likeCount: 56
  },
  {
    id: 5,
    title: "样样都push, 样样都不matter",
    date: "6月30日",
    link: "https://example.com/article5",
    readCount: 55,
    likeCount: 3
  },
  {
    id: 6,
    title: "生活就是一场即兴",
    date: "6月21日",
    link: "https://example.com/article6",
    readCount: 1833,
    likeCount: 9
  },
  {
    id: 7,
    title: "巴厘岛神奇之旅",
    date: "6月16日",
    link: "https://example.com/article7",
    readCount: 148,
    likeCount: 10
  },
  
  // 第二组7个卡片（第二张图片）
  {
    id: 8,
    title: "书非借不能读也",
    date: "1月24日",
    link: "https://example.com/article8",
    readCount: 20,
    likeCount: 0
  },
  {
    id: 9,
    title: "《瓦尔登湖》划线笔记",
    date: "1月21日",
    link: "https://example.com/article9",
    readCount: 53,
    likeCount: 0
  },
  {
    id: 10,
    title: "2024阅读回顾",
    date: "2024年12月31日",
    link: "https://example.com/article10",
    readCount: 6,
    likeCount: 0
  },
  {
    id: 11,
    title: "一日三餐",
    date: "2024年12月24日",
    link: "https://example.com/article11",
    readCount: 19,
    likeCount: 0
  },
  {
    id: 12,
    title: "抓住笔头一小记三篇",
    date: "2024年11月17日",
    link: "https://example.com/article12",
    readCount: 3,
    likeCount: 1
  },
  {
    id: 13,
    title: "工作为何为工作",
    date: "2024年6月30日",
    link: "https://example.com/article13",
    readCount: 12,
    likeCount: 1
  },
  {
    id: 14,
    title: "香港一瞥",
    date: "2024年6月23日",
    link: "https://example.com/article14",
    readCount: 14,
    likeCount: 2
  },
  
  // 第三组7个卡片（第三张图片）
  {
    id: 15,
    title: "观察钟表",
    date: "2024年5月26日",
    link: "https://example.com/article15",
    readCount: 14,
    likeCount: 0
  },
  {
    id: 16,
    title: "美好生活向往",
    date: "2024年5月19日",
    link: "https://example.com/article16",
    readCount: 19,
    likeCount: 0
  },
  {
    id: 17,
    title: "框",
    date: "2024年5月11日",
    link: "https://example.com/article17",
    readCount: 8,
    likeCount: 0
  },
  {
    id: 18,
    title: "我偏爱",
    date: "2024年5月4日",
    link: "https://example.com/article18",
    readCount: 14,
    likeCount: 0
  },
  {
    id: 19,
    title: "看书店再生长",
    date: "2024年4月28日",
    link: "https://example.com/article19",
    readCount: 32,
    likeCount: 3
  },
  {
    id: 20,
    title: "从守株待兔到气候变化",
    date: "2024年4月21日",
    link: "https://example.com/article20",
    readCount: 8,
    likeCount: 0
  },
  {
    id: 21,
    title: "假如我是湖边一棵树",
    date: "2024年4月14日",
    link: "https://example.com/article21",
    readCount: 8,
    likeCount: 1
  }
]

const RightContent: React.FC = () => {
  // 🎲 性能优化：使用useMemo缓存随机位置，避免每次渲染都重新计算
  const cardPositions = useMemo(() => {
    const positions: CardPosition[] = []
    const cardWidth = 320
    const cardHeight = 120
    const containerWidth = 1200
    const containerHeight = 800
    const margin = 50 // 边距
    
    // 生成21个不重叠的随机位置
    for (let i = 0; i < cardData.length; i++) {
      let attempts = 0
      let position: CardPosition
      
      do {
        // 生成随机位置，确保卡片完全在容器内
        const left = Math.random() * (containerWidth - cardWidth - margin * 2) + margin
        const top = Math.random() * (containerHeight - cardHeight - margin * 2) + margin
        
        // 生成随机旋转角度（-8度到8度）
        const rotation = (Math.random() - 0.5) * 16
        
        position = { left, top, rotation }
        attempts++
        
        // 检查是否与已有位置重叠
        const hasOverlap = positions.some(existingPos => {
          const distance = Math.sqrt(
            Math.pow(position.left - existingPos.left, 2) + 
            Math.pow(position.top - existingPos.top, 2)
          )
          return distance < 200 // 最小距离200px
        })
        
        if (!hasOverlap || attempts > 50) {
          break
        }
      } while (attempts <= 50)
      
      positions.push(position)
    }
    
    return positions
  }, []) // 空依赖数组：只在组件挂载时计算一次

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      padding: '2rem',
      boxSizing: 'border-box',
      position: 'relative' // 为拖拽卡片提供定位上下文
    }}>
      {/* 卡片容器 - 移除尺寸限制，允许卡片拖拽到整个区域 */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        // 移除maxWidth和maxHeight限制，让卡片可以拖拽到整个网站区域
      }}>
        {/* 渲染21个卡片，使用随机位置 */}
        {cardData.map((card, index) => (
          <ArticleCard
            key={card.id}
            id={card.id}
            title={card.title}
            date={card.date}
            link={card.link}
            readCount={card.readCount}
            likeCount={card.likeCount}
            position={cardPositions[index]}
          />
        ))}
      </div>
    </div>
  )
}

export default RightContent
