import styles from '@/styles/Calendar.module.css'
import { monthNames } from '@/utils/dateHelpers'

export default function MonthNavigator({ currentYear, currentMonth, onPrev, onNext }) {
  return (
    <div className={styles.monthHeader}>
      <div className={styles.monthTitle}>
        {monthNames[currentMonth]} <span className={styles.yearBadge}>{currentYear}</span>
      </div>
      <div>
        <button className={styles.navBtn} onClick={onPrev}>←</button>
        <button className={styles.navBtn} onClick={onNext} style={{ marginLeft: '8px' }}>→</button>
      </div>
    </div>
  )
}
