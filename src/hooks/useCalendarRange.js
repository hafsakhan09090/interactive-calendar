import { useState, useEffect, useCallback } from 'react'

export const useCalendarRange = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [rangeNotesMap, setRangeNotesMap] = useState({}) // Store notes by range key
  
  // Load all saved range notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wallCalendar_rangeNotesMap')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Convert date strings back to Date objects for keys? No, keys are strings
        setRangeNotesMap(parsed)
      } catch (e) {
        console.error('Failed to load range notes', e)
      }
    }
  }, [])
  
  // Save range notes map whenever it changes
  useEffect(() => {
    localStorage.setItem('wallCalendar_rangeNotesMap', JSON.stringify(rangeNotesMap))
  }, [rangeNotesMap])
  
  // Generate a unique key for a date range
  const getRangeKey = useCallback((start, end) => {
    if (!start || !end) return null
    return `${start.getTime()}_to_${end.getTime()}`
  }, [])
  
  // Get current range key
  const currentRangeKey = startDate && endDate ? getRangeKey(startDate, endDate) : null
  
  // Get note for current range
  const currentRangeNote = currentRangeKey ? (rangeNotesMap[currentRangeKey] || '') : ''
  
  // Save note for current range
  const setCurrentRangeNote = useCallback((note) => {
    if (currentRangeKey) {
      setRangeNotesMap(prev => ({
        ...prev,
        [currentRangeKey]: note
      }))
    }
  }, [currentRangeKey])
  
  const handleDateClick = useCallback((clickedDate) => {
    if (!startDate) {
      // No start date -> set as start
      setStartDate(clickedDate)
      setEndDate(null)
    } else if (startDate && !endDate) {
      // Start exists, no end
      if (clickedDate.getTime() === startDate.getTime()) {
        // Same day -> deselect everything
        setStartDate(null)
        setEndDate(null)
      } else if (clickedDate > startDate) {
        // Valid end date
        setEndDate(clickedDate)
      } else {
        // Clicked before start -> swap: new start, clear end
        setStartDate(clickedDate)
        setEndDate(null)
      }
    } else if (startDate && endDate) {
      // Both exist -> reset and set new start
      setStartDate(clickedDate)
      setEndDate(null)
    }
  }, [startDate, endDate])
  
  const clearRange = useCallback(() => {
    setStartDate(null)
    setEndDate(null)
  }, [])
  
  const isInRange = useCallback((dayDate) => {
    if (!startDate || !endDate) return false
    return dayDate.getTime() > startDate.getTime() && dayDate.getTime() < endDate.getTime()
  }, [startDate, endDate])
  
  const isStart = useCallback((dayDate) => {
    if (!startDate) return false
    return dayDate.getTime() === startDate.getTime()
  }, [startDate])
  
  const isEnd = useCallback((dayDate) => {
    if (!endDate) return false
    return dayDate.getTime() === endDate.getTime()
  }, [endDate])
  
  const getRangeText = useCallback(() => {
    if (startDate && endDate) {
      const startStr = startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      const endStr = endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      const dayCount = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      return `${startStr} – ${endStr} (${dayCount} days)`
    } else if (startDate && !endDate) {
      return `📌 Start: ${startDate.toLocaleDateString()} → click end date`
    }
    return "✨ Select start & end dates"
  }, [startDate, endDate])
  
  // Check if a specific range has notes saved
  const hasSavedNotesForRange = useCallback((start, end) => {
    const key = getRangeKey(start, end)
    return key ? !!rangeNotesMap[key] : false
  }, [rangeNotesMap, getRangeKey])
  
  return {
    startDate,
    endDate,
    currentRangeNote,
    setCurrentRangeNote,
    handleDateClick,
    clearRange,
    isInRange,
    isStart,
    isEnd,
    getRangeText,
    hasSavedNotesForRange,
    rangeNotesMap
  }
}
