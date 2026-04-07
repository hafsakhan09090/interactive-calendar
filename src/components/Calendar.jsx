import { useState, useEffect, useCallback, useMemo } from 'react'
import styles from '@/styles/Calendar.module.css'
import HeroImage from './HeroImage'
import MonthNavigator from './MonthNavigator'
import CalendarGrid from './CalendarGrid'
import NotesPanel from './NotesPanel'
import { useCalendarRange } from '@/hooks/useCalendarRange'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  
  const [generalNote, setGeneralNote] = useState('')
  const [recentRanges, setRecentRanges] = useState([])
  
  const {
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
  } = useCalendarRange()
  
  // Load general note from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wallCalendar_generalNote')
    if (saved !== null) setGeneralNote(saved)
    
    // Load recent ranges
    const savedRanges = localStorage.getItem('wallCalendar_recentRanges')
    if (savedRanges) {
      try {
        setRecentRanges(JSON.parse(savedRanges))
      } catch(e) {}
    }
  }, [])
  
  // Save general note
  useEffect(() => {
    localStorage.setItem('wallCalendar_generalNote', generalNote)
  }, [generalNote])
  
  // Track recent ranges when a new range is selected
  useEffect(() => {
    if (startDate && endDate) {
      const rangeKey = `${startDate.getTime()}_${endDate.getTime()}`
      const rangeDisplay = `${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}`
      const hasNote = rangeNotesMap[rangeKey] ? true : false
      
      setRecentRanges(prev => {
        const newRange = { key: rangeKey, display: rangeDisplay, hasNote, start: startDate.getTime(), end: endDate.getTime() }
        const filtered = prev.filter(r => r.key !== rangeKey)
        const updated = [newRange, ...filtered].slice(0, 5)
        localStorage.setItem('wallCalendar_recentRanges', JSON.stringify(updated))
        return updated
      })
    }
  }, [startDate, endDate, rangeNotesMap])
  
  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }, [currentYear, currentMonth])
  
  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }, [currentYear, currentMonth])
  
  const hasRange = startDate && endDate
  
  // Check if current range has saved notes
  const hasSavedNote = useMemo(() => {
    if (startDate && endDate) {
      return hasSavedNotesForRange(startDate, endDate)
    }
    return false
  }, [startDate, endDate, hasSavedNotesForRange])
  
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
              isInRange={isInRange}
              isStart={isStart}
              isEnd={isEnd}
              onDateClick={handleDateClick}
            />
            <div className={styles.selectionInfo}>
              <span className={styles.rangeIcon}>📅</span>
              {getRangeText()}
              {(startDate || endDate) && (
                <button className={styles.clearRange} onClick={clearRange}>
                  Clear
                </button>
              )}
            </div>
            
            {/* Quick stats */}
            {hasRange && (
              <div className={styles.rangeStats}>
                <div className={styles.statItem}>
                  <span>📊 Duration:</span>
                  <strong>{Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} days</strong>
                </div>
                {hasSavedNote && (
                  <div className={styles.savedNoteIndicator}>
                    💾 Saved note exists for this range
                  </div>
                )}
              </div>
            )}
          </div>
          
          <NotesPanel 
            generalNote={generalNote}
            onGeneralNoteChange={setGeneralNote}
            rangeNote={currentRangeNote}
            onRangeNoteChange={setCurrentRangeNote}
            hasRange={hasRange}
            rangeText={getRangeText()}
            savedNotesIndicator={hasSavedNote}
            onClearRange={clearRange}
          />
          
        </div>
        <div className={styles.footer}>
          🕊️ Wall Calendar · Select any date range · Notes auto-save & persist forever
        </div>
      </div>
    </div>
  )
}
