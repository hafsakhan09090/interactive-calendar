import { useState, useEffect, useCallback } from 'react'
import styles from '@/styles/Calendar.module.css'
import HeroImage from './HeroImage'
import MonthNavigator from './MonthNavigator'
import CalendarGrid from './CalendarGrid'
import NotesPanel from './NotesPanel'
import { isSameDay } from '@/utils/dateHelpers'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [generalNote, setGeneralNote] = useState('')
  const [rangeNotesMap, setRangeNotesMap] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  
  // Load saved data
  useEffect(() => {
    const savedGeneral = localStorage.getItem('wallCalendar_generalNote')
    if (savedGeneral) setGeneralNote(savedGeneral)
    
    const savedNotes = localStorage.getItem('wallCalendar_rangeNotesMap')
    if (savedNotes) {
      try {
        setRangeNotesMap(JSON.parse(savedNotes))
      } catch(e) {}
    }
  }, [])
  
  // Save general note
  useEffect(() => {
    localStorage.setItem('wallCalendar_generalNote', generalNote)
  }, [generalNote])
  
  // Save range notes map
  useEffect(() => {
    localStorage.setItem('wallCalendar_rangeNotesMap', JSON.stringify(rangeNotesMap))
  }, [rangeNotesMap])
  
  // Get current range key
  const getRangeKey = useCallback(() => {
    if (startDate && endDate) {
      return `${startDate.getTime()}_to_${endDate.getTime()}`
    }
    return null
  }, [startDate, endDate])
  
  // Get current range note
  const currentRangeNote = (() => {
    const key = getRangeKey()
    return key ? (rangeNotesMap[key] || '') : ''
  })()
  
  // Handle date click for range selection - FIXED
  const handleDateClick = useCallback((clickedDate) => {
    // Case 1: No start date selected
    if (!startDate) {
      setStartDate(clickedDate)
      setEndDate(null)
      return
    }
    
    // Case 2: Start date selected, no end date
    if (startDate && !endDate) {
      // If clicking the same date -> clear selection
      if (isSameDay(clickedDate, startDate)) {
        setStartDate(null)
        setEndDate(null)
        return
      }
      
      // If clicked date is after start date -> set as end
      if (clickedDate > startDate) {
        setEndDate(clickedDate)
      } 
      // If clicked date is before start date -> new start
      else {
        setStartDate(clickedDate)
        setEndDate(null)
      }
      return
    }
    
    // Case 3: Both start and end selected -> start fresh with new date
    if (startDate && endDate) {
      setStartDate(clickedDate)
      setEndDate(null)
    }
  }, [startDate, endDate])
  
  // Save range note
  const handleSaveRangeNote = useCallback((note) => {
    const key = getRangeKey()
    if (key && note && note.trim()) {
      setRangeNotesMap(prev => ({
        ...prev,
        [key]: note
      }))
      setIsEditing(false)
    }
  }, [getRangeKey])
  
  // Delete range note
  const handleDeleteRangeNote = useCallback(() => {
    const key = getRangeKey()
    if (key) {
      setRangeNotesMap(prev => {
        const newMap = { ...prev }
        delete newMap[key]
        return newMap
      })
      setIsEditing(false)
    }
  }, [getRangeKey])
  
  // Clear range selection
  const clearRange = useCallback(() => {
    setStartDate(null)
    setEndDate(null)
    setIsEditing(false)
  }, [])
  
  // Check if current range has saved note
  const hasSavedNote = (() => {
    const key = getRangeKey()
    return key ? !!rangeNotesMap[key] : false
  })()
  
  // Get range display text
  const getRangeText = useCallback(() => {
    if (startDate && endDate) {
      const startStr = startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      const endStr = endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      const dayCount = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      return `${startStr} – ${endStr} (${dayCount} days)`
    }
    if (startDate && !endDate) {
      return `Selected start: ${startDate.toLocaleDateString()} → click end date`
    }
    return "Click a date to start selection"
  }, [startDate, endDate])
  
  // Navigation
  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    // Optionally clear selection when changing months
    // setStartDate(null)
    // setEndDate(null)
  }, [currentYear, currentMonth])
  
  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }, [currentYear, currentMonth])
  
  const hasRange = startDate && endDate
  
  return (
    <div className={styles.wallCalendar}>
      <div className={styles.calendarContainer}>
        <div className={styles.layout}>
          
          <div className={styles.mainSection}>
            <HeroImage />
            
            <MonthNavigator 
              currentYear={currentYear}
              currentMonth={currentMonth}
              onPrev={prevMonth}
              onNext={nextMonth}
            />
            
            <CalendarGrid 
              year={currentYear}
              month={currentMonth}
              startDate={startDate}
              endDate={endDate}
              onDateClick={handleDateClick}
            />
            
            <div className={styles.selectionInfo}>
              <span>📅</span>
              <span>{getRangeText()}</span>
              {(startDate || endDate) && (
                <button className={styles.clearRange} onClick={clearRange}>
                  Clear
                </button>
              )}
            </div>
            
            {hasRange && (
              <div className={styles.rangeStats}>
                <div className={styles.statItem}>
                  <span>📊 Duration:</span>
                  <strong>{Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} days</strong>
                </div>
                {hasSavedNote && (
                  <div className={styles.savedNoteIndicator}>💾 Saved note exists</div>
                )}
              </div>
            )}
          </div>
          
          <NotesPanel 
            generalNote={generalNote}
            onGeneralNoteChange={setGeneralNote}
            rangeNote={currentRangeNote}
            hasRange={hasRange}
            rangeText={getRangeText()}
            savedNotesIndicator={hasSavedNote}
            onClearRange={clearRange}
            onSaveRangeNote={handleSaveRangeNote}
            onDeleteRangeNote={handleDeleteRangeNote}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
          
        </div>
        <div className={styles.footer}>
          🕊️ Wall Calendar · Click dates to select range · Add notes · Auto-saves
        </div>
      </div>
    </div>
  )
}
