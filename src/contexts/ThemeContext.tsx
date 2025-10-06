import React, { createContext, useContext, useEffect, useState } from 'react'

// 定义主题类型
type Theme = 'light' | 'dark'

// 定义Context的类型
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// 创建Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 自定义Hook来使用ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// ThemeProvider组件
interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 状态管理：默认为浅色模式
  const [theme, setTheme] = useState<Theme>('light')

  // 切换主题的函数
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  // 当主题改变时，更新HTML元素的class
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  // 从localStorage读取保存的主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // 如果没有保存的设置，使用系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // 保存主题设置到localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const value = {
    theme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
