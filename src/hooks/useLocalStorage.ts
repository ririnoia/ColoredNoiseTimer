import { useState, useEffect } from 'react'

function readFromStorage<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue
  try {
    const stored = localStorage.getItem(key)
    return stored !== null ? (JSON.parse(stored) as T) : initialValue
  } catch {
    return initialValue
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedKey, setStoredKey] = useState(key)
  const [value, setValue] = useState<T>(() => readFromStorage(key, initialValue))

  // React "storing information from previous renders" pattern:
  // calling setState during render forces an immediate re-render with the new state,
  // preventing the stale value from being written to the new key.
  if (storedKey !== key) {
    setStoredKey(key)
    setValue(readFromStorage(key, initialValue))
  }

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, [key, value])

  return [value, setValue] as const
}
