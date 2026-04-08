import { useState, useEffect, useRef } from 'react'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1))
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [monthlyNote, setMonthlyNote] = useState('')
  const [rangeNotes, setRangeNotes] = useState({})
  const [currentNote, setCurrentNote] = useState('')
  const [editing, setEditing] = useState(false)
  const [showQuickAccess, setShowQuickAccess] = useState(true)
  const [monthImages, setMonthImages] = useState({})
  const [showImageUpload, setShowImageUpload] = useState(false)
  
  const fileInputRef = useRef(null)
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthKey = `${year}-${month}`
  
  // Load all saved data
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
    
    const savedImages = localStorage.getItem('month_images')
    if (savedImages) {
      try {
        setMonthImages(JSON.parse(savedImages))
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
  
  // Save month images
  useEffect(() => {
    localStorage.setItem('month_images', JSON.stringify(monthImages))
  }, [monthImages])
  
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
  
  // Handle image upload for current month
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setMonthImages(prev => ({
          ...prev,
          [monthKey]: event.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Remove current month's image
  const removeImage = () => {
    const newImages = { ...monthImages }
    delete newImages[monthKey]
    setMonthImages(newImages)
  }
  
  // Get current month's image
  const currentMonthImage = monthImages[monthKey]
  
  // Default images for months without custom image
  const defaultImages = {
    '0': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', // Jan - Winter
    '1': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Feb 
    '2': 'https://plus.unsplash.com/premium_photo-1663090593977-9923cc536f3b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mar - Spring
    '3': 'https://images.unsplash.com/photo-1513608827986-eb374a75fa5e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Apr - Cherry blossom
    '4': 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // May - Beach
    '5': 'https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Jun - Summer
    '6': 'https://plus.unsplash.com/premium_photo-1670596563059-26e43dbae29f?q=80&w=1563&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Jul - Fireworks
    '7': 'https://images.unsplash.com/photo-1584831748175-357027100c43?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Aug - Sunflowers
    '8': 'https://images.unsplash.com/photo-1615028427098-f2185474eeb3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Sep - Autumn
    '9': 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1503&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Oct - Halloween
    '10': 'https://plus.unsplash.com/premium_photo-1674487959493-8894cc9473ea?q=80&w=1536&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Nov - Thanksgiving
    '11': 'https://images.unsplash.com/photo-1531959870249-9f9b729efcf4?q=80&w=842&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  // Dec - Christmas
  }
  
  const currentDefaultImage = defaultImages[month] || defaultImages['0']
  const displayImage = currentMonthImage || currentDefaultImage
  
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
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
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
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
            {showQuickAccess ? 'Hide' : 'Show'} Saved Notes ({savedRanges.length})
          </button>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          
          {/* LEFT SIDE - CALENDAR */}
          <div style={{ flex: '2', minWidth: '280px' }}>
            {/* Hero Image with Upload Button */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <div style={{
                borderRadius: '24px',
                overflow: 'hidden',
                height: '220px',
                background: '#c2b28b',
                position: 'relative'
              }}>
                <img 
                  src={displayImage}
                  alt={`${monthNames[month]} ${year}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Image overlay with month name */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                  padding: '20px 16px 12px',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>Current Month</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
                    {monthNames[month]} {year}
                  </div>
                </div>
              </div>
              
              {/* Image Controls */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🖼️ 
                </button>
                
                {currentMonthImage && (
                  <button
                    onClick={removeImage}
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      color: '#ffaaaa',
                      padding: '8px 12px',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕ 
                  </button>
                )}
              </div>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              
              {/* Upload Panel */}
              {showImageUpload && (
                <div style={{
                  position: 'absolute',
                  top: '60px',
                  right: '12px',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  zIndex: 10,
                  minWidth: '220px'
                }}>
                  <p style={{ fontSize: '13px', marginBottom: '12px', color: '#4a3727' }}>
                    Upload custom image for {monthNames[month]}
                  </p>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      width: '100%',
                      background: '#c68b5e',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      marginBottom: '8px'
                    }}
                  >
                    Choose from PC
                  </button>
                  <button
                    onClick={() => setShowImageUpload(false)}
                    style={{
                      width: '100%',
                      background: '#e8dccc',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Cancel
                  </button>
                  <p style={{ fontSize: '10px', color: '#a0825a', marginTop: '8px', textAlign: 'center' }}>
                    Images are saved in your browser
                  </p>
                </div>
              )}
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
              <span>{getRangeText()}</span>
              {(startDate || endDate) && (
                <button onClick={clearRange} style={{ background: 'none', border: 'none', color: '#c68b5e', cursor: 'pointer', textDecoration: 'underline' }}>
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* RIGHT SIDE - NOTES (same as before) */}
          <div style={{
            flex: '1',
            minWidth: '300px',
            background: '#fff5e8',
            borderRadius: '24px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '22px', fontFamily: 'Georgia, serif', marginBottom: '20px', color: '#4a3727' }}>
              Notes
            </h3>
            
            {/* Monthly Note */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#a0825a', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
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
                Current Range Note
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
                        Save
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
                  <span style={{ fontSize: '18px' }}></span>
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
                     No saved notes yet<br/>
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
                          <span>🔍 Click to load</span>
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
               Notes & Images auto-save to your browser
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
