import { useState } from 'react'
import styles from '@/styles/Calendar.module.css'

export default function NotesPanel({ 
  generalNote, 
  onGeneralNoteChange, 
  rangeNote, 
  onRangeNoteChange, 
  hasRange,
  rangeText,
  savedNotesIndicator,
  onClearRange
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  return (
    <div className={styles.notesSection}>
      <div className={styles.notesHeader}>
        <span className={styles.notesIcon}>📔</span>
        <h3>Journal & Notes</h3>
        <button 
          className={styles.expandBtn}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          {/* Monthly Memo Section */}
          <div className={styles.noteGroup}>
            <div className={styles.noteLabel}>
              <span>📌 Monthly Memo</span>
              <span className={styles.noteHint}>persists across months</span>
            </div>
            <textarea 
              className={styles.notesTextarea}
              style={{ minHeight: '100px' }}
              value={generalNote}
              onChange={(e) => onGeneralNoteChange(e.target.value)}
              placeholder="General notes for the month... events, reminders, or personal thoughts."
            />
          </div>
          
          {/* Range-Specific Notes Section - IMPROVED */}
          <div className={styles.noteGroup}>
            <div className={styles.noteLabel}>
              <span>✍️ Range-specific Notes</span>
              {savedNotesIndicator && (
                <span className={styles.savedBadge}>💾 Saved</span>
              )}
            </div>
            
            {/* Range info card */}
            <div className={styles.rangeInfoCard}>
              <div className={styles.rangeBadge}>
                {hasRange ? (
                  <>
                    <span className={styles.rangeIcon}>📅</span>
                    <span className={styles.rangeText}>{rangeText}</span>
                    <button className={styles.clearRangeBtn} onClick={onClearRange}>
                      ✕
                    </button>
                  </>
                ) : (
                  <span className={styles.noRangeMsg}>
                    👆 Click on calendar to select a date range
                  </span>
                )}
              </div>
            </div>
            
            {/* Notes textarea - enabled only when range is selected */}
            <textarea 
              className={`${styles.notesTextarea} ${!hasRange ? styles.disabledTextarea : ''}`}
              style={{ minHeight: '140px' }}
              value={rangeNote}
              onChange={(e) => onRangeNoteChange(e.target.value)}
              placeholder={hasRange 
                ? "Write notes for this specific date range. They will be saved automatically and reappear when you select the same range again!" 
                : "Select a start and end date on the calendar first..."
              }
              disabled={!hasRange}
            />
            
            {/* Helpful tip */}
            {hasRange && (
              <div className={styles.rangeTip}>
                💡 Tip: Your notes are saved for this exact date range. 
                If you select the same range again later, your notes will reappear!
              </div>
            )}
          </div>
          
          {/* Recent ranges quick access - NEW FEATURE */}
          <div className={styles.recentRanges}>
            <div className={styles.recentHeader}>
              <span>🕐 Recent Ranges</span>
            </div>
            <div className={styles.recentList}>
              {/* This will be populated from props - shows last 3 ranges with notes */}
              {savedNotesIndicator === 'list' && (
                <div className={styles.recentEmpty}>Select a range to see saved notes</div>
              )}
            </div>
          </div>
          
          {/* Vintage footer */}
          <div className={styles.notesFooter}>
            “The calendar pages turn, but memories stay.”
          </div>
        </>
      )}
    </div>
  )
}
