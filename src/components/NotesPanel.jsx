import { useState, useEffect } from 'react'
import styles from '@/styles/Calendar.module.css'

export default function NotesPanel({ 
  generalNote, 
  onGeneralNoteChange, 
  rangeNote, 
  hasRange,
  rangeText,
  savedNotesIndicator,
  onClearRange,
  onSaveRangeNote,
  onDeleteRangeNote,
  isEditing,
  setIsEditing
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [localNote, setLocalNote] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Sync local note when range note changes
  useEffect(() => {
    setLocalNote(rangeNote)
  }, [rangeNote])
  
  const handleSave = () => {
    if (localNote && localNote.trim()) {
      onSaveRangeNote(localNote)
    }
  }
  
  const handleCancel = () => {
    setLocalNote(rangeNote)
    setIsEditing(false)
  }
  
  const handleDelete = () => {
    onDeleteRangeNote()
    setShowDeleteConfirm(false)
  }
  
  const hasNote = savedNotesIndicator || (localNote && localNote.trim())
  
  return (
    <div className={styles.notesSection}>
      <div className={styles.notesHeader}>
        <span className={styles.notesIcon}>📔</span>
        <h3>Journal & Notes</h3>
        <button className={styles.expandBtn} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          {/* Monthly Memo */}
          <div className={styles.noteGroup}>
            <div className={styles.noteLabel}>
              <span>📌 Monthly Memo</span>
              <span className={styles.noteHint}>auto-saves</span>
            </div>
            <textarea 
              className={styles.notesTextarea}
              style={{ minHeight: '100px' }}
              value={generalNote}
              onChange={(e) => onGeneralNoteChange(e.target.value)}
              placeholder="General notes for the month..."
            />
          </div>
          
          {/* Range Notes */}
          <div className={styles.noteGroup}>
            <div className={styles.noteLabel}>
              <span>✍️ Range-specific Notes</span>
              {savedNotesIndicator && <span className={styles.savedBadge}>💾 Saved</span>}
            </div>
            
            <div className={styles.rangeInfoCard}>
              <div className={styles.rangeBadge}>
                {hasRange ? (
                  <>
                    <span>📅</span>
                    <span className={styles.rangeText}>{rangeText}</span>
                    <button className={styles.clearRangeBtn} onClick={onClearRange}>✕</button>
                  </>
                ) : (
                  <span className={styles.noRangeMsg}>👆 Click on calendar to select a date range</span>
                )}
              </div>
            </div>
            
            <textarea 
              className={`${styles.notesTextarea} ${!hasRange ? styles.disabledTextarea : ''}`}
              style={{ minHeight: '120px' }}
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              placeholder={hasRange ? "Write your notes here..." : "Select a date range first"}
              disabled={!hasRange}
            />
            
            {/* Action Buttons */}
            {hasRange && (
              <div className={styles.noteActions}>
                {!isEditing && !savedNotesIndicator && localNote && localNote.trim() && (
                  <button className={styles.saveBtn} onClick={handleSave}>💾 Save Note</button>
                )}
                
                {!isEditing && savedNotesIndicator && (
                  <>
                    <button className={styles.editBtn} onClick={() => setIsEditing(true)}>✏️ Edit</button>
                    <button className={styles.deleteBtn} onClick={() => setShowDeleteConfirm(true)}>🗑️ Delete</button>
                  </>
                )}
                
                {!isEditing && !savedNotesIndicator && (!localNote || !localNote.trim()) && hasRange && (
                  <button className={styles.saveBtn} onClick={handleSave} disabled={!localNote || !localNote.trim()}>
                    ➕ Add Note
                  </button>
                )}
                
                {isEditing && (
                  <>
                    <button className={styles.saveBtn} onClick={handleSave}>💾 Save Changes</button>
                    <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                  </>
                )}
              </div>
            )}
            
            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className={styles.confirmDialog}>
                <p>Delete this note permanently?</p>
                <div className={styles.confirmActions}>
                  <button className={styles.confirmYes} onClick={handleDelete}>Yes, Delete</button>
                  <button className={styles.confirmNo} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                </div>
              </div>
            )}
            
            {hasRange && (
              <div className={styles.rangeTip}>
                💡 Notes are saved per date range. Select the same range again and your note reappears!
              </div>
            )}
          </div>
          
          <div className={styles.notesFooter}>
            “The calendar pages turn, but memories stay.”
          </div>
        </>
      )}
    </div>
  )
}
