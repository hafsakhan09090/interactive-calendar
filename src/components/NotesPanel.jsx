import styles from '@/styles/Calendar.module.css'

export default function NotesPanel({ 
  generalNote, 
  onGeneralNoteChange, 
  rangeNote, 
  onRangeNoteChange, 
  hasRange,
  rangeText 
}) {
  return (
    <div className={styles.notesSection}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '0.5rem', color: '#5d432c' }}>
          📔 Journal & Notes
        </h3>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#b48a54' }}>
          📌 Monthly Memo
        </label>
        <textarea 
          className={styles.notesTextarea}
          style={{ width: '100%', minHeight: '100px', background: '#fffef7', border: '1px solid #eddbba', borderRadius: '24px', padding: '1rem', resize: 'vertical', fontFamily: 'Inter' }}
          value={generalNote}
          onChange={(e) => onGeneralNoteChange(e.target.value)}
          placeholder="General notes for the month... events, reminders, or personal thoughts."
        />
      </div>
      
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#b48a54' }}>
          ✍️ Range-specific notes {hasRange ? `(${rangeText})` : ''}
        </label>
        <textarea 
          className={styles.notesTextarea}
          style={{ width: '100%', minHeight: '140px', background: '#fffef7', border: '1px solid #eddbba', borderRadius: '24px', padding: '1rem', resize: 'vertical', fontFamily: 'Inter' }}
          value={rangeNote}
          onChange={(e) => onRangeNoteChange(e.target.value)}
          placeholder={hasRange ? "Jot down notes attached to this date range." : "Select a start and end date on the calendar to attach notes to this range."}
          disabled={!hasRange}
        />
      </div>
      
      <div style={{ marginTop: '1rem', borderTop: '1px dashed #eedeba', paddingTop: '0.8rem', fontSize: '0.7rem', color: '#bb9f73', fontStyle: 'italic', textAlign: 'center' }}>
        “The calendar pages turn, but memories stay.”
      </div>
    </div>
  )
}
