export const range = (start: number, end: number): number[] => {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

// Helper function to pick random elements from an array
export const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

// Helper function to pick multiple unique random elements from an array
export const getUniqueRandomItems = <T>(arr: T[], count: number): T[] => {
  if (count > arr.length) {
    throw new Error('Cannot select more unique items than the array length')
  }
  const shuffled = [...arr].sort(() => 0.5 - Math.random()) // Shuffle array
  return shuffled.slice(0, count) // Return the specified number of items
}
