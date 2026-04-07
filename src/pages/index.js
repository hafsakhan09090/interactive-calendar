import { useState, useEffect } from 'react'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)) // April 2026
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [monthlyNote, setMonthlyNote] = useState('')
  const [rangeNotes, setRangeNotes] = useState({})
  const [currentNote, setCurrentNote] = useState('')
  const [editing, setEditing] = useState(false)
  
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
  
  // Get days in month
  const getDaysInMonth = (y, m) => {
    return new Date(y, m + 1, 0).getDate()
  }
  
  // Get first day of month (0 = Sunday)
  const getFirstDay = (y, m) => {
    return new Date(y, m, 1).getDay()
  }
  
  // Check if same day
  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
  }
  
  // Handle date click
  const handleDateClick = (clickedDate) => {
    if (!startDate) {
      // No start date -> set as start
      setStartDate(clickedDate)
      setEndDate(null)
    } else if (startDate && !endDate) {
      // Start exists, no end
      if (isSameDay(clickedDate, startDate)) {
        // Same day -> clear
        setStartDate(null)
        setEndDate(null)
      } else if (clickedDate > startDate) {
        // Valid end date
        setEndDate(clickedDate)
      } else {
        // Clicked before start -> new start
        setStartDate(clickedDate)
        setEndDate(null)
      }
    } else {
      // Both exist -> new selection
      setStartDate(clickedDate)
      setEndDate(null)
    }
  }
  
  // Save range note
  const saveRangeNote = () => {
    if (startDate && endDate && currentNote.trim()) {
      const key = `${startDate.getTime()}_${endDate.getTime()}`
      setRangeNotes(prev => ({ ...prev, [key]: currentNote }))
      setEditing(false)
    }
  }
  
  // Delete range note
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
  
  // Clear range
  const clearRange = () => {
    setStartDate(null)
    setEndDate(null)
    setEditing(false)
  }
  
  // Check if date is in range
  const isInRange = (date) => {
    if (!startDate || !endDate) return false
    return date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime()
  }
  
  // Check if date is start
  const isStart = (date) => {
    if (!startDate) return false
    return isSameDay(date, startDate)
  }
  
  // Check if date is end
  const isEnd = (date) => {
    if (!endDate) return false
    return isSameDay(date, endDate)
  }
  
  // Build calendar
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
  
  // Navigation
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
  
  // Get range text
  const getRangeText = () => {
    if (startDate && endDate) {
      const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const days = Math.round((endDate - startDate) / (86400000)) + 1
      return `${startStr} – ${endStr} (${days} days)`
    }
    if (startDate) {
      return `Start: ${startDate.toLocaleDateString()} → select end date`
    }
    return 'Select a date range'
  }
  
  const hasSavedNote = startDate && endDate && rangeNotes[`${startDate.getTime()}_${endDate.getTime()}`]
  
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      background: '#fffaf0',
      borderRadius: '32px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          
          {/* LEFT SIDE - CALENDAR */}
          <div style={{ flex: '2', minWidth: '280px' }}>
            {/* Hero Image */}
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
            
            {/* Month Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', fontFamily: 'Georgia, serif', color: '#4a3727' }}>
                {monthNames[month]} {year}
              </h2>
              <div>
                <button onClick={prevMonth} style={{ background: '#e8dccc', border: 'none', padding: '8px 16px', borderRadius: '30px', marginRight: '8px', cursor: 'pointer' }}>←</button>
                <button onClick={nextMonth} style={{ background: '#e8dccc', border: 'none', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer' }}>→</button>
              </div>
            </div>
            
            {/* Weekdays */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} style={{ padding: '8px', fontWeight: 'bold', color: '#8b7355' }}>{day}</div>
              ))}
            </div>
            
            {/* Calendar Grid */}
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
            
            {/* Selection Info */}
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
            minWidth: '260px',
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
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#a0825a', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                ✍️ Range Note
                {hasSavedNote && <span style={{ marginLeft: '8px', fontSize: '10px', background: '#c68b5e20', padding: '2px 8px', borderRadius: '20px' }}>Saved</span>}
              </label>
              
              {/* Range Display */}
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
              
              {/* Action Buttons */}
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
            
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e8dccc', fontSize: '11px', color: '#a0825a', textAlign: 'center' }}>
              Notes auto-save to your browser
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
