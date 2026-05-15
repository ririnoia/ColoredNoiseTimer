interface SessionCounterProps {
  count: number
}

export function SessionCounter({ count }: SessionCounterProps) {
  return (
    <p className="text-center text-xs text-gray-700 dark:text-gray-100">
      今日{' '}
      <span className="font-semibold text-gray-700 dark:text-gray-100">{count}</span>
      {' '}ポモ完了
    </p>
  )
}
