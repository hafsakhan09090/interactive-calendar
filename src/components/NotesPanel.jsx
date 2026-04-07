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
  onClearRange,
  onSaveRangeNote,
  onDeleteRangeNote,
  isEditing,
  setIsEditing
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [localNote, setLocalNote] = useState(rangeNote)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Sync local note when range note changes from outside
  useState(() => {
    setLocalNote(rangeNote)
  }, [rangeNote])
  
  const handleSave = () => {
    onSaveRangeNote(localNote)
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setLocalNote(rangeNote)
    setIsEditing(false)
  }
  
  const handleDelete = () => {
    onDeleteRangeNote()
    setShowDeleteConfirm(false)
    setIsEditing(false)
  }
  
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
              <span className={styles.noteHint}>auto-saves as you type</span>
            </div>
            <textarea 
              className={styles.notesTextarea}
              style={{ minHeight: '100px' }}
              value={generalNote}
              onChange={(e) => onGeneralNoteChange(e.target.value)}
              placeholder="General notes for the month... events, reminders, or personal thoughts."
            />
          </div>
          
          {/* Range-Specific Notes Section - IMPROVED WITH BUTTONS */}
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
                    <button className={styles.clearRangeBtn} onClick={onClearRange} title="Clear selection">
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
            
            {/* Notes textarea */}
            <textarea 
              className={`${styles.notesTextarea} ${!hasRange ? styles.disabledTextarea : ''}`}
              style={{ minHeight: '140px' }}
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              placeholder={hasRange 
                ? "Write your notes for this date range..." 
                : "Select a start and end date on the calendar first..."
              }
              disabled={!hasRange}
            />
            
            {/* Action Buttons - ONLY SHOW WHEN RANGE SELECTED */}
            {hasRange && (
              <div className={styles.noteActions}>
                {!isEditing && !savedNotesIndicator && localNote.trim() && (
                  <button className={styles.saveBtn} onClick={handleSave}>
                    💾 Save Note
                  </button>
                )}
                
                {!isEditing && savedNotesIndicator && (
                  <>
                    <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                      ✏️ Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => setShowDeleteConfirm(true)}>
                      🗑️ Delete
                    </button>
                  </>
                )}
                
                {isEditing && (
                  <>
                    <button className={styles.saveBtn} onClick={handleSave}>
                      💾 Save Changes
                    </button>
                    <button className={styles.cancelBtn} onClick={handleCancel}>
                      ❌ Cancel
                    </button>
                  </>
                )}
                
                {!isEditing && !savedNotesIndicator && !localNote.trim() && (
                  <button 
                    className={styles.saveBtn} 
                    onClick={handleSave}
                    disabled={!localNote.trim()}
                  >
                    ➕ Add Note
                  </button>
                )}
              </div>
            )}
            
            {/* Delete confirmation dialog */}
            {showDeleteConfirm && (
              <div className={styles.confirmDialog}>
                <p>Delete this note permanently?</p>
                <div className={styles.confirmActions}>
                  <button className={styles.confirmYes} onClick={handleDelete}>Yes, Delete</button>
                  <button className={styles.confirmNo} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                </div>
              </div>
            )}
            
            {/* Helpful tip */}
            {hasRange && (
              <div className={styles.rangeTip}>
                💡 Tip: Notes are saved per date range. Select the same range again later and your note will reappear!
              </div>
            )}
          </div>
          
          {/* Recent Ranges with Notes - NEW FEATURE */}
          <div className={styles.recentRanges}>
            <div className={styles.recentHeader}>
              <span>🕐 Recent Ranges with Notes</span>
            </div>
            <div className={styles.recentList} id="recent-list">
              {/* This will be populated from parent */}
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
