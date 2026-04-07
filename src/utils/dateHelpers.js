// Get days in month - CORRECTED
export const getDaysInMonth = (year, month) => {
  // month is 0-indexed (0 = January)
  return new Date(year, month + 1, 0).getDate()
}

// Get first day of month (0 = Sunday, 1 = Monday, etc.)
export const getFirstDayOfMonth = (year, month) => {
  // month is 0-indexed
  return new Date(year, month, 1).getDay()
}

// Format date for comparison
export const formatDateKey = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Check if weekend
export const isWeekend = (year, month, day) => {
  const date = new Date(year, month, day)
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

// Compare two dates (same day)
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

// Check if date is between start and end (inclusive)
export const isDateInRange = (date, start, end) => {
  if (!start || !end) return false
  const time = date.getTime()
  return time > start.getTime() && time < end.getTime()
}

// Month names
export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
