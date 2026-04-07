import { useState, useEffect } from 'react'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1))
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [monthlyNote, setMonthlyNote] = useState('')
  const [rangeNotes, setRangeNotes] = useState({})
  const [currentNote, setCurrentNote] = useState('')
  const [editing, setEditing] = useState(false)
  const [showQuickAccess, setShowQuickAccess] = useState(true)
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  // Load saved notes
  useEffect(() => {
    const savedMonthly = localStorage.getItem('monthly_note')
    if (savedMonthly) setMonthlyNote(savedMonthly)
    
    const savedRanges = localStorage.getItem('range_notes')
    if (savedRanges) {
      try {
        const parsed = JSON.parse(savedRanges)
        setRangeNotes(parsed)
      } catch(e) {}
    }
  }, [])
  
  // Save monthly note
  useEffect(() => {
    localStorage.setItem('monthly_note', monthlyNote)
  }, [monthlyNote])
  
  // Save range notes
  useEffect(() => {
    localStorage.setItem('range_notes', JSON.stringify(rangeNotes))
  }, [rangeNotes])
  
  // Update current note when range changes
  useEffect(() => {
    if (startDate && endDate) {
      const key = `${startDate.getTime()}_${endDate.getTime()}`
      setCurrentNote(rangeNotes[key] || '')
      setEditing(false)
    } else {
      setCurrentNote('')
    }
  }, [startDate, endDate, rangeNotes])
  
  // Get all saved ranges for quick access
  const getSavedRanges = () => {
    return Object.entries(rangeNotes)
      .map(([key, note]) => {
        const [startTime, endTime] = key.split('_').map(Number)
        return {
          key,
          startDate: new Date(startTime),
          endDate: new Date(endTime),
          note: note,
          display: `${new Date(startTime).toLocaleDateString()} – ${new Date(endTime).toLocaleDateString()}`,
          days: Math.round((endTime - startTime) / 86400000) + 1
        }
      })
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime()) // Most recent first
  }
  
  // Jump to a saved range
  const jumpToRange = (savedRange) => {
    setStartDate(savedRange.startDate)
    setEndDate(savedRange.endDate)
    setCurrentDate(new Date(savedRange.startDate.getFullYear(), savedRange.startDate.getMonth(), 1))
    setCurrentNote(savedRange.note)
  }
  
  // Get days in month
  const getDaysInMonth = (y, m) => {
    return new Date(y, m + 1, 0).getDate()
  }
  
  const getFirstDay = (y, m) => {
    return new Date(y, m, 1).getDay()
  }
  
  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
  }
  
  const handleDateClick = (clickedDate) => {
    if (!startDate) {
      setStartDate(clickedDate)
      setEndDate(null)
    } else if (startDate && !endDate) {
      if (isSameDay(clickedDate, startDate)) {
        setStartDate(null)
        setEndDate(null)
      } else if (clickedDate > startDate) {
        setEndDate(clickedDate)
      } else {
        setStartDate(clickedDate)
        setEndDate(null)
      }
    } else {
      setStartDate(clickedDate)
      setEndDate(null)
    }
  }
  
  const saveRangeNote = () => {
    if (startDate && endDate && currentNote.trim()) {
      const key = `${startDate.getTime()}_${endDate.getTime()}`
      setRangeNotes(prev => ({ ...prev, [key]: currentNote }))
      setEditing(false)
    }
  }
  
  const deleteRangeNote = () => {
    if (startDate && endDate) {
      const key = `${startDate.getTime()}_${endDate.getTime()}`
      const newNotes = { ...rangeNotes }
      delete newNotes[key]
      setRangeNotes(newNotes)
      setCurrentNote('')
      setEditing(false)
    }
  }
  
  const clearRange = () => {
    setStartDate(null)
    setEndDate(null)
    setEditing(false)
  }
  
  const isInRange = (date) => {
    if (!startDate || !endDate) return false
    return date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime()
  }
  
  const isStart = (date) => {
    if (!startDate) return false
    return isSameDay(date, startDate)
  }
  
  const isEnd = (date) => {
    if (!endDate) return false
    return isSameDay(date, endDate)
  }
  
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDay(year, month)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const calendarDays = []
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d))
  }
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setStartDate(null)
    setEndDate(null)
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setStartDate(null)
    setEndDate(null)
  }
  
  const getRangeText = () => {
    if (startDate && endDate) {
      const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const days = Math.round((endDate - startDate) / 86400000) + 1
      return `${startStr} – ${endStr} (${days} days)`
    }
    if (startDate) {
      return `Start: ${startDate.toLocaleDateString()} → select end date`
    }
    return 'Select a date range'
  }
  
  const hasSavedNote = startDate && endDate && rangeNotes[`${startDate.getTime()}_${endDate.getTime()}`]
  const savedRanges = getSavedRanges()
  
  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      background: '#fffaf0',
      borderRadius: '32px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ padding: '24px' }}>
        
        {/* Quick Access Toggle Button */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => setShowQuickAccess(!showQuickAccess)}
            style={{
              background: '#c68b5e',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📋 {showQuickAccess ? 'Hide' : 'Show'} Saved Notes ({savedRanges.length})
          </button>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          
          {/* LEFT SIDE - CALENDAR */}
          <div style={{ flex: '2', minWidth: '280px' }}>
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              marginBottom: '24px',
              height: '200px',
              background: '#c2b28b'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format"
                alt="Mountain lake"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', fontFamily: 'Georgia, serif', color: '#4a3727' }}>
                {monthNames[month]} {year}
              </h2>
              <div>
                <button onClick={prevMonth} style={{ background: '#e8dccc', border: 'none', padding: '8px 16px', borderRadius: '30px', marginRight: '8px', cursor: 'pointer' }}>←</button>
                <button onClick={nextMonth} style={{ background: '#e8dccc', border: 'none', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer' }}>→</button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} style={{ padding: '8px', fontWeight: 'bold', color: '#8b7355' }}>{day}</div>
              ))}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {calendarDays.map((date, idx) => {
                if (!date) {
                  return <div key={idx} style={{ aspectRatio: '1', background: '#f5efe3', borderRadius: '12px' }} />
                }
                
                let dayStyle = {
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  background: '#ffffff',
                  border: '1px solid #e8dccc'
                }
                
                if (isStart(date)) {
                  dayStyle = { ...dayStyle, background: '#c68b5e', color: 'white', border: 'none' }
                } else if (isEnd(date)) {
                  dayStyle = { ...dayStyle, background: '#c68b5e', color: 'white', border: 'none' }
                } else if (isInRange(date)) {
                  dayStyle = { ...dayStyle, background: '#f0e4d0', border: '1px solid #dcc8a8' }
                }
                
                return (
                  <div key={idx} style={dayStyle} onClick={() => handleDateClick(date)}>
                    {date.getDate()}
                  </div>
                )
              })}
            </div>
            
            <div style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: '#f0e8d8',
              borderRadius: '40px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span>📅 {getRangeText()}</span>
              {(startDate || endDate) && (
                <button onClick={clearRange} style={{ background: 'none', border: 'none', color: '#c68b5e', cursor: 'pointer', textDecoration: 'underline' }}>
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* RIGHT SIDE - NOTES */}
          <div style={{
            flex: '1',
            minWidth: '300px',
            background: '#fff5e8',
            borderRadius: '24px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '22px', fontFamily: 'Georgia, serif', marginBottom: '20px', color: '#4a3727' }}>
              📔 Notes
            </h3>
            
            {/* Monthly Note */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#a0825a', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                📌 Monthly Memo
              </label>
              <textarea
                value={monthlyNote}
                onChange={(e) => setMonthlyNote(e.target.value)}
                placeholder="General notes for the month..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  border: '1px solid #e8dccc',
                  borderRadius: '16px',
                  background: 'white',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            
            {/* Range Note */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#a0825a', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                ✍️ Current Range Note
                {hasSavedNote && <span style={{ marginLeft: '8px', fontSize: '10px', background: '#c68b5e20', padding: '2px 8px', borderRadius: '20px' }}>Saved</span>}
              </label>
              
              <div style={{
                background: '#f0e8d8',
                padding: '10px 12px',
                borderRadius: '30px',
                marginBottom: '12px',
                fontSize: '13px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{startDate && endDate ? getRangeText() : 'No range selected'}</span>
                {(startDate || endDate) && (
                  <button onClick={clearRange} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c68b5e' }}>✕</button>
                )}
              </div>
              
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder={startDate && endDate ? "Write notes for this date range..." : "Select dates on calendar first"}
                disabled={!startDate || !endDate}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: '1px solid #e8dccc',
                  borderRadius: '16px',
                  background: !startDate || !endDate ? '#f5efe3' : 'white',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              
              {startDate && endDate && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  {!hasSavedNote && currentNote.trim() && (
                    <button onClick={saveRangeNote} style={{ background: '#c68b5e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer' }}>
                      💾 Save Note
                    </button>
                  )}
                  {hasSavedNote && (
                    <>
                      <button onClick={() => setEditing(true)} style={{ background: '#e8dccc', border: 'none', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer' }}>
                        ✏️ Edit
                      </button>
                      <button onClick={deleteRangeNote} style={{ background: '#e8dccc', border: 'none', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer' }}>
                        🗑️ Delete
                      </button>
                    </>
                  )}
                  {editing && (
                    <>
                      <button onClick={saveRangeNote} style={{ background: '#c68b5e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer' }}>
                        💾 Save
                      </button>
                      <button onClick={() => setEditing(false)} style={{ background: '#e8dccc', border: 'none', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* QUICK ACCESS - SAVED NOTES SECTION */}
            {showQuickAccess && (
              <div style={{
                borderTop: '2px solid #e8dccc',
                paddingTop: '20px',
                marginTop: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '18px' }}>📋</span>
                  <h4 style={{ fontSize: '16px', fontFamily: 'Georgia, serif', color: '#4a3727', margin: 0 }}>
                    Saved Range Notes
                  </h4>
                  <span style={{
                    background: '#c68b5e',
                    color: 'white',
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '20px'
                  }}>
                    {savedRanges.length}
                  </span>
                </div>
                
                {savedRanges.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '30px 20px',
                    background: '#f0e8d8',
                    borderRadius: '20px',
                    color: '#a0825a',
                    fontSize: '13px'
                  }}>
                    📭 No saved notes yet<br/>
                    Select a date range and save a note!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                    {savedRanges.map((range, idx) => (
                      <div
                        key={idx}
                        onClick={() => jumpToRange(range)}
                        style={{
                          background: 'white',
                          borderRadius: '16px',
                          padding: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: startDate && endDate && 
                                  startDate.getTime() === range.startDate.getTime() && 
                                  endDate.getTime() === range.endDate.getTime()
                                  ? '2px solid #c68b5e'
                                  : '1px solid #e8dccc',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>📅</span>
                            <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#4a3727' }}>
                              {range.display}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '10px',
                            background: '#f0e8d8',
                            padding: '2px 6px',
                            borderRadius: '20px',
                            color: '#8b7355'
                          }}>
                            {range.days} days
                          </span>
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#a0825a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginBottom: '8px'
                        }}>
                          {range.note.length > 80 ? range.note.substring(0, 80) + '...' : range.note}
                        </div>
                        <div style={{ fontSize: '10px', color: '#c68b5e', display: 'flex', gap: '12px' }}>
                          <span>🔍 Click to load this range</span>
                          <span>💾 Saved</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {savedRanges.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Delete ALL saved range notes?')) {
                        setRangeNotes({})
                      }
                    }}
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      padding: '8px',
                      background: 'none',
                      border: '1px solid #e8dccc',
                      borderRadius: '30px',
                      color: '#c68b5e',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️ Clear All Saved Notes
                  </button>
                )}
              </div>
            )}
            
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e8dccc', fontSize: '11px', color: '#a0825a', textAlign: 'center' }}>
              💾 Notes auto-save to your browser
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
