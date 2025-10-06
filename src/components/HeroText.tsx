import React, { useState, useEffect } from 'react'

interface LetterProps {
  char: string
  isVisible: boolean
  isDestroying: boolean
  destroyDelay: number
  isWobbling?: boolean // 是否在晃动阶段
  letterIndex: number // 字母在字符串中的索引
}

const Letter: React.FC<LetterProps> = ({ char, isVisible, isDestroying, destroyDelay, isWobbling, letterIndex }) => {
  if (!isVisible) return null

  // 特殊处理空格字符
  const isSpace = char === '\u00A0' || char === ' '
  const spaceWidth = isSpace ? '0.5em' : 'auto'
  
  // 为每个字符分配不同的晃动动画（基于字符内容生成）
  const getWobbleAnimation = () => {
    if (!isWobbling) return 'none'
    
    // 计算当前字母的实际保持时间
    const holdTime = 8000 // 整体保持8秒，让晃动更慢
    const leftWobbleTime = 0 // 取消向左移动，持续随机晃动
    const destroyDelay = 50 // 每个字母消失间隔50ms
    
    // 当前字母的晃动时长 = 总保持时间 - 当前字母的延迟 - 向左晃动时间
    const wobbleDuration = holdTime - (letterIndex * destroyDelay) - leftWobbleTime
    
    // 确保晃动时间至少为2秒，让晃动更慢
    const actualDuration = Math.max(wobbleDuration, 2000)
    
    // 使用字符的charCode来生成一致的随机数
    const charCode = char.charCodeAt(0)
    const wobbleIndex = (charCode % 9) + 1
    
    return `characterWobble${wobbleIndex} ${actualDuration}ms ease-in-out forwards`
  }

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
          : getWobbleAnimation(),
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

interface HeroTextProps {
  onComplete?: () => void
  onPhaseChange?: (phase: 'waiting' | 'typing' | 'holding' | 'deleting' | 'complete') => void
}

const HeroText: React.FC<HeroTextProps> = ({ onComplete, onPhaseChange }) => {
  const [visibleLetters, setVisibleLetters] = useState<boolean[]>([])
  const [destroyingLetters, setDestroyingLetters] = useState<boolean[]>([])
  const [showCursor, setShowCursor] = useState(true)
  const [currentPhase, setCurrentPhase] = useState<'waiting' | 'typing' | 'holding' | 'deleting' | 'complete'>('waiting')
  
  const fullText = 'Welcome\u00A0to\u00A0621\u00A0Space'
  const letters = fullText.split('')
  const typingSpeed = 100 // 每秒10个字母 = 100毫秒/字母
  const holdTime = 6000 // 保持8秒，让晃动更慢
  const wordPause = 400 // 单词间间隔0.6秒
  const destroyDelay = 50 // 每个字母粉碎间隔50ms

  // 初始化字母状态
  useEffect(() => {
    setVisibleLetters(new Array(letters.length).fill(false))
    setDestroyingLetters(new Array(letters.length).fill(false))
    
    // 延迟1秒后开始打字效果
    const startTypingTimer = window.setTimeout(() => {
      setCurrentPhase('typing')
    }, 1000)
    
    return () => window.clearTimeout(startTypingTimer)
  }, [])

  // 通知父组件阶段变化
  useEffect(() => {
    if (onPhaseChange) {
      onPhaseChange(currentPhase)
    }
  }, [currentPhase, onPhaseChange])


  useEffect(() => {
    let timeoutId: number | undefined

    if (currentPhase === 'typing') {
      const currentIndex = visibleLetters.filter(Boolean).length
      
      if (currentIndex < letters.length) {
        // 检查是否需要添加间隔
        let delay = typingSpeed
        
        // Welcome和to之间（位置7，空格后）
        if (currentIndex === 8) {
          delay = wordPause
        }
        // to和621之间（位置10，空格后）
        else if (currentIndex === 11) {
          delay = wordPause
        }
        // 621和Space之间（位置14，空格后）
        else if (currentIndex === 15) {
          delay = wordPause
        }
        
        timeoutId = window.setTimeout(() => {
          setVisibleLetters(prev => {
            const newVisible = [...prev]
            newVisible[currentIndex] = true
            return newVisible
          })
        }, delay)
      } else {
        // 打字完成，开始保持
        timeoutId = window.setTimeout(() => {
          setCurrentPhase('holding')
        }, typingSpeed)
      }
    } else if (currentPhase === 'holding') {
      // 保持10秒
      timeoutId = window.setTimeout(() => {
        setCurrentPhase('deleting')
      }, holdTime)
    } else if (currentPhase === 'deleting') {
      // 开始粉碎动画
      setDestroyingLetters(new Array(letters.length).fill(true))
      
      // 1秒后完成
      timeoutId = window.setTimeout(() => {
        setCurrentPhase('complete')
        // 触发完成回调
        if (onComplete) {
          onComplete()
        }
      }, 1000)
    }

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [visibleLetters, currentPhase])

  // 光标闪烁效果（只在打字阶段显示，最后一个字母'e'出现时不显示）
  useEffect(() => {
    if (currentPhase !== 'typing') {
      setShowCursor(false)
      return
    }
    
    // 检查是否正在输入最后一个字母'e'（索引18）
    const visibleCount = visibleLetters.filter(Boolean).length
    const isTypingLastLetter = visibleCount === letters.length - 1 && letters[letters.length - 1] === 'e'
    
    if (isTypingLastLetter) {
      setShowCursor(false) // 输入最后一个字母'e'时不显示光标
      return
    }
    
    // 检查当前要显示的字符是否是空格，如果是空格则不显示光标
    const currentChar = letters[visibleCount]
    if (currentChar === '\u00A0' || currentChar === ' ') {
      setShowCursor(false) // 输入空格时不显示光标
      return
    }
    
    const cursorInterval = window.setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => window.clearInterval(cursorInterval)
  }, [currentPhase, visibleLetters, letters])

  return (
    <div style={{
      // 整体页面居中
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      pointerEvents: 'none' // 不阻挡其他交互
    }}>
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
          isWobbling={currentPhase === 'holding'}
          letterIndex={index}
        />
      ))}
      {currentPhase === 'typing' && showCursor && (() => {
        // 再次检查是否正在输入最后一个字母'e'，确保不渲染光标
        const visibleCount = visibleLetters.filter(Boolean).length
        const isTypingLastLetter = visibleCount === letters.length - 1 && letters[letters.length - 1] === 'e'
        
        if (isTypingLastLetter) return null
        
        // 检查当前要显示的字符是否是空格，如果是空格则不渲染光标
        const currentChar = letters[visibleCount]
        if (currentChar === '\u00A0' || currentChar === ' ') return null
        
        return (
          <span 
            style={{
              color: '#00FFFF',
              fontSize: '5rem',
              fontWeight: '900',
              fontFamily: '"Kalam", "Caveat", "Dancing Script", cursive',
              animation: 'cursorBlink 1s infinite'
            }}
          >
            |
          </span>
        )
      })()}
      </div>
    </div>
  )
}

export default HeroText
