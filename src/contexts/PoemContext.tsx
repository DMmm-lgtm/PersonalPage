import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { searchPoem } from '../lib/aiService'
import type { PoemSearchResponse } from '../lib/aiService'

interface PoemState {
  currentPoem: PoemSearchResponse | null
  isLoading: boolean
  error: string | null
  isVisible: boolean
}

interface PoemContextType {
  poemState: PoemState
  searchPoem: (query: string) => Promise<void>
  showPoem: () => void
  hidePoem: () => void
  clearError: () => void
}

const PoemContext = createContext<PoemContextType | undefined>(undefined)

export const usePoem = () => {
  const context = useContext(PoemContext)
  if (context === undefined) {
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

  const handleSearchPoem = async (query: string) => {
    setPoemState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }))

    try {
      const poem = await searchPoem(query)
      setPoemState(prev => ({
        ...prev,
        currentPoem: poem,
        isLoading: false,
        isVisible: true
      }))
    } catch (error) {
      setPoemState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '搜索诗词时发生错误',
        isLoading: false
      }))
    }
  }

  const showPoem = () => {
    setPoemState(prev => ({
      ...prev,
      isVisible: true
    }))
  }

  const hidePoem = () => {
    setPoemState(prev => ({
      ...prev,
      isVisible: false
    }))
  }

  const clearError = () => {
    setPoemState(prev => ({
      ...prev,
      error: null
    }))
  }

  const value: PoemContextType = {
    poemState,
    searchPoem: handleSearchPoem,
    showPoem,
    hidePoem,
    clearError
  }

  return (
    <PoemContext.Provider value={value}>
      {children}
    </PoemContext.Provider>
  )
}
