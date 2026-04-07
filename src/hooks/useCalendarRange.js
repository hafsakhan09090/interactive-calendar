import { useState, useEffect, useCallback } from 'react'

export const useCalendarRange = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [rangeNotesMap, setRangeNotesMap] = useState({})
  const [currentRangeNote, setCurrentRangeNote] = useState('')
  
  // Load all saved range notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wallCalendar_rangeNotesMap')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
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
  
  // Update current range note when selection changes
  useEffect(() => {
    if (startDate && endDate) {
      const key = getRangeKey(startDate, endDate)
      const savedNote = rangeNotesMap[key] || ''
      setCurrentRangeNote(savedNote)
    } else {
      setCurrentRangeNote('')
    }
  }, [startDate, endDate, rangeNotesMap])
  
  const getRangeKey = useCallback((start, end) => {
    if (!start || !end) return null
    return `${start.getTime()}_to_${end.getTime()}`
  }, [])
  
  const saveRangeNote = useCallback((start, end, note) => {
    const key = getRangeKey(start, end)
    if (key) {
      setRangeNotesMap(prev => ({
        ...prev,
        [key]: note
      }))
      setCurrentRangeNote(note)
    }
  }, [getRangeKey])
  
  const deleteRangeNote = useCallback((start, end) => {
    const key = getRangeKey(start, end)
    if (key) {
      setRangeNotesMap(prev => {
        const newMap = { ...prev }
        delete newMap[key]
        return newMap
      })
      setCurrentRangeNote('')
    }
  }, [getRangeKey])
  
  const handleDateClick = useCallback((clickedDate) => {
    if (!startDate) {
      setStartDate(clickedDate)
      setEndDate(null)
    } else if (startDate && !endDate) {
      if (clickedDate.getTime() === startDate.getTime()) {
        setStartDate(null)
        setEndDate(null)
      } else if (clickedDate > startDate) {
        setEndDate(clickedDate)
      } else {
        setStartDate(clickedDate)
        setEndDate(null)
      }
    } else if (startDate && endDate) {
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
    rangeNotesMap,
    saveRangeNote,
    deleteRangeNote
  }
}
