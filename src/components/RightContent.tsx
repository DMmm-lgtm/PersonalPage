import React from 'react'
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

// 9个卡片数据 - 简化的文章列表
const cardData: CardData[] = [
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
  }
]

const RightContent: React.FC = () => {
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
          {cardData.map((card) => (
            <ArticleCard
              key={card.id}
              id={card.id}
              title={card.title}
              date={card.date}
              link={card.link}
              readCount={card.readCount}
              likeCount={card.likeCount}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RightContent
