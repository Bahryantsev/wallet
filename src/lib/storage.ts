// Stores data using chrome.storage.local
export const store = (key: string, value: string): void => {
  chrome.storage.local.set({ [key]: value })
}

// Retrieves data using chrome.storage.local
export const retrieve = async (key: string): Promise<string> => {
  const value = await chrome.storage.local.get([key])
  return value[key]
}
