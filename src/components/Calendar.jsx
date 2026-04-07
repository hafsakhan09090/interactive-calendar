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
  const [isEditing, setIsEditing] = useState(false)
  
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
    rangeNotesMap,
    saveRangeNote,
    deleteRangeNote
  } = useCalendarRange()
  
  // Load general note from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wallCalendar_generalNote')
    if (saved !== null) setGeneralNote(saved)
    
    // Load recent ranges with notes
    loadRecentRanges()
  }, [])
  
  const loadRecentRanges = () => {
    const allNotes = localStorage.getItem('wallCalendar_rangeNotesMap')
    if (allNotes) {
      try {
        const notesMap = JSON.parse(allNotes)
        const ranges = Object.keys(notesMap).map(key => {
          const [start, end] = key.split('_to_').map(Number)
          return {
            key,
            start: new Date(start),
            end: new Date(end),
            note: notesMap[key],
            display: `${new Date(start).toLocaleDateString()} – ${new Date(end).toLocaleDateString()}`
          }
        }).sort((a, b) => b.start.getTime() - a.start.getTime()).slice(0, 5)
        
        setRecentRanges(ranges)
        
        // Update DOM
        setTimeout(() => {
          const listEl = document.getElementById('recent-list')
          if (listEl && ranges.length > 0) {
            listEl.innerHTML = ranges.map(range => `
              <div class="${styles.recentItem}" data-start="${range.start.getTime()}" data-end="${range.end.getTime()}">
                <div class="${styles.recentItemDate}">📅 ${range.display}</div>
                <div class="${styles.recentItemPreview}">${range.note.substring(0, 50)}${range.note.length > 50 ? '...' : ''}</div>
              </div>
            `).join('')
            
            // Add click handlers
            document.querySelectorAll('.recentItem').forEach(el => {
              el.addEventListener('click', () => {
                const startTime = parseInt(el.dataset.start)
                const endTime = parseInt(el.dataset.end)
                const newStart = new Date(startTime)
                const newEnd = new Date(endTime)
                // This would require a way to jump to that range - could be expanded
                alert(`Range selected: ${newStart.toLocaleDateString()} – ${newEnd.toLocaleDateString()}\nNote: ${notesMap[`${startTime}_to_${endTime}`]}`)
              })
            })
          } else if (listEl) {
            listEl.innerHTML = '<div class="recentEmpty">No saved notes yet. Create your first range note!</div>'
          }
        }, 100)
      } catch(e) {}
    }
  }
  
  // Save general note
  useEffect(() => {
    localStorage.setItem('wallCalendar_generalNote', generalNote)
  }, [generalNote])
  
  // Reload recent ranges when notes change
  useEffect(() => {
    loadRecentRanges()
  }, [rangeNotesMap])
  
  const prevMonth = useCallback(() => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }, [currentYear, currentMonth])
  
  const nextMonth = useCallback(() => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }, [currentYear, currentMonth])
  
  const hasRange = startDate && endDate
  
  const hasSavedNote = useMemo(() => {
    if (startDate && endDate) {
      return hasSavedNotesForRange(startDate, endDate)
    }
    return false
  }, [startDate, endDate, hasSavedNotesForRange])
  
  const handleSaveRangeNote = (note) => {
    if (startDate && endDate) {
      saveRangeNote(startDate, endDate, note)
      setIsEditing(false)
    }
  }
  
  const handleDeleteRangeNote = () => {
    if (startDate && endDate) {
      deleteRangeNote(startDate, endDate)
      setIsEditing(false)
    }
  }
  
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
                    💾 Saved note exists
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
            onSaveRangeNote={handleSaveRangeNote}
            onDeleteRangeNote={handleDeleteRangeNote}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
          
        </div>
        <div className={styles.footer}>
          🕊️ Wall Calendar · Select dates → Add Note → Save → Persists forever
        </div>
      </div>
    </div>
  )
}
