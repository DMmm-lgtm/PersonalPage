import React, { createContext, useContext, useState, ReactNode } from 'react'
import { searchPoem, PoemSearchResponse } from '../lib/aiService'

interface PoemState {
  currentPoem: PoemSearchResponse | null
  isLoading: boolean
  error: string | null
  isVisible: boolean
}

interface PoemContextType {
  poemState: PoemState
  searchPoem: () => Promise<void>
  clearPoem: () => void
  retrySearch: () => void
}

const PoemContext = createContext<PoemContextType | undefined>(undefined)

export const usePoem = () => {
  const context = useContext(PoemContext)
  if (!context) {
    throw new Error('usePoem must be used within a PoemProvider')
  }
  return context
}

interface PoemProviderProps {
  children: ReactNode
}

export const PoemProvider: React.FC<PoemProviderProps> = ({ children }) => {
  const [poemState, setPoemState] = useState<PoemState>({
    currentPoem: null,
    isLoading: false,
    error: null,
    isVisible: false
  })

  const handleSearchPoem = async () => {
    console.log('开始搜索诗句...')
    setPoemState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isVisible: false
    }))

    try {
      const result = await searchPoem('推荐一句优美的诗句')
      console.log('搜索成功:', result)
      setPoemState(prev => ({
        ...prev,
        currentPoem: result,
        isLoading: false,
        isVisible: true
      }))
    } catch (error) {
      console.error('搜索失败:', error)
      setPoemState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '搜索失败'
      }))
    }
  }

  const clearPoem = () => {
    setPoemState(prev => ({
      ...prev,
      currentPoem: null,
      isVisible: false,
      error: null
    }))
  }

  const retrySearch = () => {
    handleSearchPoem()
  }

  return (
    <PoemContext.Provider
      value={{
        poemState,
        searchPoem: handleSearchPoem,
        clearPoem,
        retrySearch
      }}
    >
      {children}
    </PoemContext.Provider>
  )
}
