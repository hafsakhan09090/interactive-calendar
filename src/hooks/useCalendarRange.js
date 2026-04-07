import { useState, useEffect } from 'react'

export const useCalendarRange = (monthKey) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [rangeNote, setRangeNote] = useState('')

  // Load range note from localStorage
  useEffect(() => {
    if (startDate && endDate) {
      const key = `rangeNote_${monthKey}_${startDate.getTime()}_to_${endDate.getTime()}`
      const saved = localStorage.getItem(key)
      if (saved !== null) setRangeNote(saved)
      else setRangeNote('')
    }
  }, [startDate, endDate, monthKey])

  // Save range note
  useEffect(() => {
    if (startDate && endDate) {
      const key = `rangeNote_${monthKey}_${startDate.getTime()}_to_${endDate.getTime()}`
      localStorage.setItem(key, rangeNote)
    }
  }, [rangeNote, startDate, endDate, monthKey])

  const handleDateClick = (clickedDate) => {
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
  }

  const clearRange = () => {
    setStartDate(null)
    setEndDate(null)
    setRangeNote('')
  }

  const isInRange = (dayDate) => {
    if (!startDate || !endDate) return false
    return dayDate.getTime() > startDate.getTime() && dayDate.getTime() < endDate.getTime()
  }

  const isStart = (dayDate) => {
    if (!startDate) return false
    return dayDate.getTime() === startDate.getTime()
  }

  const isEnd = (dayDate) => {
    if (!endDate) return false
    return dayDate.getTime() === endDate.getTime()
  }

  const getRangeText = () => {
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
    } else if (startDate && !endDate) {
      return `Start: ${startDate.toLocaleDateString()} (click end date)`
    }
    return "No range selected"
  }

  return {
    startDate,
    endDate,
    rangeNote,
    setRangeNote,
    handleDateClick,
    clearRange,
    isInRange,
    isStart,
    isEnd,
    getRangeText
  }
}
