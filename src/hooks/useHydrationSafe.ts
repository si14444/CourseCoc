'use client'

import { useEffect, useState } from 'react'

/**
 * Hydration-safe hook for client-side only operations
 */
export function useHydrationSafe() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

/**
 * Hydration-safe localStorage hook
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const isMounted = useHydrationSafe()
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    if (!isMounted) return

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
  }, [key, isMounted])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (isMounted && typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}