export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay()
}

export const formatDateKey = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export const isWeekend = (year, month, day) => {
  const date = new Date(year, month, day)
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
