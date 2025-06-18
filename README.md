# ⏱️ Timer Management App

A full-featured React Native app for creating, managing, and tracking categorized timers with persistent storage, progress visualization, and history logging.

## 📱 Features

### 🔧 Core Features
- **Add Timer**
  - Input: Name, Duration (in seconds), Category
  - Data is saved locally using AsyncStorage.

- **Timer List with Grouping**
  - Timers are grouped by category.
  - Expand/Collapse categories.
  - Displays name, remaining time, and status (Running, Paused, Completed).

- **Timer Management**
  - Start, Pause, Reset timers individually.
  - Automatically marked as Completed when time reaches zero.

- **Progress Visualization**
  - Progress bar or percentage indicator for each timer.

- **Bulk Actions**
  - Start/Pause/Reset all timers within a category at once.

- **User Feedback**
  - Modal pop-up on timer completion with a congratulatory message and timer name.

### 🌟 Enhanced Functionality
- **Timer History**
  - Log of completed timers with name and completion timestamp.
  - Separate **History Screen** to view past timer logs.

- **Customizable Alerts**
  - Optional halfway alert (e.g., at 50% of duration).
  - Notification/message when triggered.

### 💡 Bonus Features (Implemented If Any)
- Export history data as JSON.
- Light/Dark mode theme toggle.
- Category filter dropdown for focused viewing.

---

## 🛠 Tech Stack

- **React Native**
- **React Navigation** – for Home and History screens
- **AsyncStorage** – for local persistence
- **setInterval** – for timer logic
- **useState / useReducer** – for state management
- **StyleSheet** – for responsive styling

---

## 🚀 Setup Instructions

1. **Clone the repo install dependencies and finally run and create aok usinf expo**
   ```bash
   git clone https://github.com/prateek-fst/TimerApp.git
   cd timer-management-app
   npm install
   npx expo start
   npm install -g eas-cli
   eas build:configure
   eas build -p android
```

