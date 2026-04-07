import styles from '@/styles/Calendar.module.css'
import { getDaysInMonth, getFirstDayOfMonth, isWeekend, isSameDay, isDateInRange } from '@/utils/dateHelpers'

export default function CalendarGrid({ year, month, startDate, endDate, onDateClick }) {
  // Get calendar data
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  
  // Build calendar days array
  const calendarDays = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ 
      date: null, 
      isEmpty: true, 
      dayNum: null,
      isStart: false,
      isEnd: false,
      isInRange: false
    })
  }
  
  // Add actual days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const fullDate = new Date(year, month, d)
    
    // Check selection status
    const isStartDate = startDate ? isSameDay(fullDate, startDate) : false
    const isEndDate = endDate ? isSameDay(fullDate, endDate) : false
    const isInRangeSelected = startDate && endDate ? isDateInRange(fullDate, startDate, endDate) : false
    
    calendarDays.push({
      date: fullDate,
      isEmpty: false,
      dayNum: d,
      fullDate: fullDate,
      weekend: isWeekend(year, month, d),
      isStart: isStartDate,
      isEnd: isEndDate,
      isInRange: isInRangeSelected
    })
  }
  
  // Get CSS class for a day
  const getDayClass = (day) => {
    if (day.isEmpty) return styles.empty
    if (day.isStart) return styles.startDate
    if (day.isEnd) return styles.endDate
    if (day.isInRange) return styles.inRange
    return ''
  }

  return (
    <>
      <div className={styles.weekdays}>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div className={styles.weekday} key={day}>{day}</div>
        ))}
      </div>
      
      <div className={styles.calendarGrid}>
        {calendarDays.map((day, idx) => (
          <div 
            key={idx} 
            className={`${styles.calendarDay} ${getDayClass(day)} ${day.weekend && !day.isEmpty ? styles.weekend : ''}`}
            onClick={() => !day.isEmpty && onDateClick(day.fullDate)}
          >
            {!day.isEmpty && <span className={styles.dayNumber}>{day.dayNum}</span>}
          </div>
        ))}
      </div>
    </>
  )
}
