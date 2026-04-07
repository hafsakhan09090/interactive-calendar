import styles from '@/styles/Calendar.module.css'
import { getDaysInMonth, getFirstDayOfMonth, isWeekend } from '@/utils/dateHelpers'

export default function CalendarGrid({ year, month, startDate, endDate, isInRange, isStart, isEnd, onDateClick }) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  
  const calendarDays = []
  
  // Empty cells before month start
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ date: null, isEmpty: true, dayNum: null })
  }
  
  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const fullDate = new Date(year, month, d)
    calendarDays.push({
      date: fullDate,
      isEmpty: false,
      dayNum: d,
      fullDate,
      weekend: isWeekend(year, month, d)
    })
  }

  const getDayClass = (day) => {
    if (day.isEmpty) return styles.empty
    if (isStart(day.fullDate)) return styles.startDate
    if (isEnd(day.fullDate)) return styles.endDate
    if (isInRange(day.fullDate)) return styles.inRange
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
