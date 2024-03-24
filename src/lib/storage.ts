export const store = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const retrieve = (key: string): string | null => {
  return localStorage.getItem(key)
}
