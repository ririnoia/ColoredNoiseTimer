import { useState, useEffect, useRef } from 'react'

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
  // Always start with initialValue so server and client first renders match (no hydration mismatch).
  // localStorage is read in an effect after mount, then the state is updated.
  const [value, setValue] = useState<T>(initialValue)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (!hydratedRef.current) {
      // First run: load stored value and skip the localStorage write (nothing has changed yet)
      hydratedRef.current = true
      setValue(readFromStorage(key, initialValue))
      return
    }
    // Subsequent runs: persist the user's change
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, [key, value, initialValue])

  return [value, setValue] as const
}
