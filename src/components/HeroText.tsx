import React, { useState, useEffect } from 'react'

interface LetterProps {
  char: string
  isVisible: boolean
  isDestroying: boolean
  destroyDelay: number
}

const Letter: React.FC<LetterProps> = ({ char, isVisible, isDestroying, destroyDelay }) => {
  if (!isVisible) return null

  // 特殊处理空格字符
  const isSpace = char === '\u00A0' || char === ' '
  const spaceWidth = isSpace ? '0.5em' : 'auto'

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '5rem',
        fontWeight: '900',
        color: 'white',
        textShadow: '4px 4px 16px rgba(0, 0, 0, 0.9)',
        fontFamily: '"Kalam", "Caveat", "Dancing Script", cursive',
        letterSpacing: '-0.03em',
        margin: 0,
        width: spaceWidth,
        minWidth: spaceWidth,
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        animation: isDestroying 
          ? `letterDestroy 1s ease-out ${destroyDelay}ms forwards`
          : 'none',
        transformOrigin: 'center center',
        // 确保空格字符可见
        ...(isSpace && {
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none'
        })
      }}
    >
      {isSpace ? '\u00A0' : char}
    </span>
  )
}

const HeroText: React.FC = () => {
  const [visibleLetters, setVisibleLetters] = useState<boolean[]>([])
  const [destroyingLetters, setDestroyingLetters] = useState<boolean[]>([])
  const [showCursor, setShowCursor] = useState(true)
  const [currentPhase, setCurrentPhase] = useState<'typing' | 'holding' | 'deleting' | 'complete'>('typing')
  
  const fullText = 'Welcome\u00A0621\u00A0Space'
  const letters = fullText.split('')
  const typingSpeed = 300 // 每秒2个字母 = 500毫秒/字母
  const holdTime = 8000 // 保持10秒
  const wordPause = 800 // 单词间间隔1秒
  const destroyDelay = 50 // 每个字母粉碎间隔50ms

  // 初始化字母状态
  useEffect(() => {
    setVisibleLetters(new Array(letters.length).fill(false))
    setDestroyingLetters(new Array(letters.length).fill(false))
  }, [])

  useEffect(() => {
    let timeoutId: number

    if (currentPhase === 'typing') {
      const currentIndex = visibleLetters.filter(Boolean).length
      
      if (currentIndex < letters.length) {
        // 检查是否需要添加间隔
        let delay = typingSpeed
        
        // Welcome和621之间（位置7，空格后）
        if (currentIndex === 7) {
          delay = wordPause
        }
        // 621和Space之间（位置11，空格后）  
        else if (currentIndex === 11) {
          delay = wordPause
        }
        
        timeoutId = setTimeout(() => {
          setVisibleLetters(prev => {
            const newVisible = [...prev]
            newVisible[currentIndex] = true
            return newVisible
          })
        }, delay)
      } else {
        // 打字完成，开始保持
        timeoutId = setTimeout(() => {
          setCurrentPhase('holding')
        }, typingSpeed)
      }
    } else if (currentPhase === 'holding') {
      // 保持10秒
      timeoutId = setTimeout(() => {
        setCurrentPhase('deleting')
      }, holdTime)
    } else if (currentPhase === 'deleting') {
      // 开始粉碎动画
      setDestroyingLetters(new Array(letters.length).fill(true))
      
      // 1秒后完成
      timeoutId = setTimeout(() => {
        setCurrentPhase('complete')
      }, 1000)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [visibleLetters, currentPhase])

  // 光标闪烁效果（只在打字阶段显示，文字完成后立即消失）
  useEffect(() => {
    if (currentPhase !== 'typing') {
      setShowCursor(false)
      return
    }
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [currentPhase])

  return (
    <div style={{
      fontSize: '5rem',
      fontWeight: '900',
      color: 'white',
      textShadow: '4px 4px 16px rgba(0, 0, 0, 0.9)',
      fontFamily: '"Kalam", "Caveat", "Dancing Script", cursive',
      letterSpacing: '-0.03em',
      margin: 0,
      minHeight: '6rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {letters.map((char, index) => (
        <Letter
          key={index}
          char={char}
          isVisible={visibleLetters[index] || false}
          isDestroying={destroyingLetters[index] || false}
          destroyDelay={index * destroyDelay}
        />
      ))}
      {currentPhase === 'typing' && (
        <span 
          style={{
            opacity: showCursor ? 1 : 0,
            transition: 'opacity 0.1s',
            color: '#00FFFF'
          }}
        >
          |
        </span>
      )}
    </div>
  )
}

export default HeroText
