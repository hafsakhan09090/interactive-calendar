# Interactive Wall Calendar

A beautifully designed **interactive wall-style calendar** built using **Next.js 14** and **React 18**.  
Combines a realistic paper calendar aesthetic with modern web features and smooth UX.

> ✨ Feels like a real wall calendar. Works like a smart app.

---

## 🌐 Live Links

| 🔗 Resource | URL |
|------------|-----|
| Live Demo | https://interactive-calendar-omega.vercel.app |
| GitHub | https://github.com/hafsakhan09090/interactive-calendar |
| Video Demo | https://www.youtube.com/watch?v=eLt-EPLfiSc |

---

## ✨ Features

### Core Features

- **Wall Calendar Look**  
  Vintage texture, warm beige tones, rounded corners, serif typography

- **Hero Image Section**  
  Month-based images + custom upload support

- **Date Range Selection**  
  - Click start → click end  
  - Highlighted range (brown + beige UI)

- **Clear Selection**  
  Button or double-click same date

- **Monthly Notes**  
  Auto-saved notes per month

- **Range Notes**  
  Attach notes to selected date ranges

- **Responsive Design**  
  Works perfectly on desktop, tablet, and mobile

---

### 🚀 Advanced Features

- **Quick Access Panel**  
  Jump to saved date ranges instantly

- **Custom Images Per Month**  
  Upload and persist images per month

- **Reset Image Option**  
  Restore default seasonal image

- **Full CRUD Notes**  
  Add, edit, delete notes with confirmation

- **localStorage Persistence**  
  No backend required — data stays after refresh

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|------|
| Next.js 14 | Framework |
| React 18 | UI |
| CSS-in-JS | Styling |
| localStorage | Data storage |
| Unsplash | Default images |

---

## 🚀 Run Locally

```bash
# Clone repository
git clone https://github.com/hafsakhan09090/interactive-calendar.git

# Enter project folder
cd interactive-calendar

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 🎮 How to Use

### 📅 Date Selection
- Click a date → sets **start date**
- Click another date → sets **end date**
- Selected range is automatically highlighted  
  - 🟤 Start/End → brown  
  - 🟫 In-between → beige  
- Click the same date twice → clears selection  
- Use **Clear** button → resets selection

---

### 📝 Monthly Notes
- Type in the **Monthly Memo** section  
- Notes are **auto-saved instantly**  
- Refresh the page → notes remain محفوظ (persist)

---

### 📌 Range Notes
1. Select a date range  
2. Enter text in **Range Note**  
3. Click **Add Note**  
4. To modify:
   - Click **Edit** → update → save  
   - Click **Delete** → confirm removal  
5. Re-select the same range → note loads again  

---

### ⚡ Quick Access Panel
- Displays all saved range notes  
- Click any note →  
  - Calendar jumps to correct month  
  - Exact range gets selected  
  - Note loads instantly  

---

### 🖼️ Custom Images
- Click **Change Image** on hero section  
- Choose image from your device (JPG/PNG)  
- Image is saved **per month**  
- Click **Reset** → restores default image  


---

## ⭐ Support

If you found this project helpful or interesting:

- ⭐ **Star the repository** to show your support  
- 🍴 **Fork it** and build your own version  
- 📢 **Share it** with others  

> Your support helps this project grow and reach more people 💛

