import { useState, useEffect } from 'react'
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
  const monthKey = `${currentYear}-${currentMonth}`
  
  const [generalNote, setGeneralNote] = useState('')
  
  const {
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
  } = useCalendarRange(monthKey)
  
  // Load general note from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wallCalendar_generalNote')
    if (saved !== null) setGeneralNote(saved)
  }, [])
  
  useEffect(() => {
    localStorage.setItem('wallCalendar_generalNote', generalNote)
  }, [generalNote])
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }
  
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
              isInRange={isInRange}
              isStart={isStart}
              isEnd={isEnd}
              onDateClick={handleDateClick}
            />
            <div className={styles.selectionInfo}>
              📅 {getRangeText()}
              {(startDate || endDate) && (
                <button className={styles.clearRange} onClick={clearRange}>clear</button>
              )}
            </div>
          </div>
          
          <NotesPanel 
            generalNote={generalNote}
            onGeneralNoteChange={setGeneralNote}
            rangeNote={rangeNote}
            onRangeNoteChange={setRangeNote}
            hasRange={hasRange}
            rangeText={getRangeText()}
          />
          
        </div>
        <div className={styles.footer}>
          🕊️ wall calendar · select any date range · notes persist locally
        </div>
      </div>
    </div>
  )
}
