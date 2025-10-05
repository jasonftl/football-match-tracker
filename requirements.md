# Football Match Tracker - Requirements Document

**Version:** 1.0  
**Date:** 2025-10-05  
**Target Platform:** Progressive Web App (PWA) - iPhone optimised

---

## 1. Overview

A football match tracking application for association football (soccer) matches from U7 to Adult level. The app must work completely offline after initial installation and be installable on iPhone home screens as a PWA.

---

## 2. Design Requirements

### 2.1 Visual Design
- **Dark mode throughout** for battery saving on OLED screens
- **Colour scheme:**
  - Primary background: Dark grey (#1F2937, #111827)
  - Card/section backgrounds: Medium grey (#374151)
  - Primary accent: Royal Blue (#2563EB) for main actions
  - Secondary accent: Dark Orange (#F97316) for highlights and branding
  - Text: White and light grey for readability
- **Typography:** Clear, readable fonts with high contrast
- **Touch targets:** Large enough for easy tapping on mobile (minimum 44px)

### 2.2 Technical Requirements
- Single-page React application
- Babel standalone for JSX compilation
- Tailwind CSS for styling
- Lucide React for icons
- Local storage for data persistence
- Service worker for offline functionality
- Responsive design (mobile-first, max-width 2xl)

---

## 3. Application Flow

### 3.1 Screen 1: Match Setup
**Purpose:** Configure match details

**Fields:**
1. **Home/Away Toggle**
   - Two buttons: "Home" and "Away"
   - Default: Home (green/blue highlight)
   - When Home selected: Home Team = "Caterham Pumas", Away Team = "Opposition"
   - When Away selected: Home Team = "Opposition", Away Team = "Caterham Pumas"

2. **Age Group Dropdown**
   - Options: U7, U8, U9, U10, U11, U12, U13, U14, U15, U16, U17, U18, Adult
   - Display format: "U12 - 60 min (2 × 30 min halves)"
   - Default configurations:
     - U7-U8: 40 min, 4 × 10 min quarters, 5 players
     - U9-U10: 50 min, 4 × 12.5 min quarters, 7 players
     - U11-U12: 60 min, 2 × 30 min halves, 9 players (quarters optional)
     - U13-U14: 70 min, 2 × 35 min halves, 11 players
     - U15-U16: 80 min, 2 × 40 min halves, 11 players
     - U17-Adult: 90 min, 2 × 45 min halves, 11 players

3. **Match Format Override**
   - Dropdown: "Quarters (4 periods)" or "Halves (2 periods)"
   - Automatically adjusts based on age group selection
   - User can override

4. **Period Length**
   - Number input with 0.5 increments
   - Range: 1-90 minutes
   - Shows calculated total match time below

5. **Home Team Name**
   - Text input
   - Default: "Caterham Pumas" or "Opposition" (based on Home/Away toggle)

6. **Away Team Name**
   - Text input
   - Default: "Opposition" or "Caterham Pumas" (based on Home/Away toggle)

**Action Button:** "Continue to Player Setup"

### 3.2 Screen 2: Player Setup
**Purpose:** Configure team players (for the Caterham Pumas team only)

**Header:** Shows selected team name (e.g., "Caterham Pumas Players")

**Features:**
1. **Show Player Numbers Toggle**
   - Switch to show/hide number fields
   - Default: ON
   - For teams that don't use numbers

2. **Player List**
   - Auto-populated with default number of players based on age group
   - Each row contains:
     - Number input (if numbers shown) - editable
     - Name input - editable, starts empty
     - Delete button (trash icon)
   - Scrollable if more than fits on screen

3. **Add Player Button**
   - Adds new row with next available number
   - For substitutes

4. **Data Persistence**
   - Players saved to localStorage separately
   - Reused across matches
   - User can edit names/numbers each time

**Action Button:** "Proceed to Match Tracker"

### 3.3 Screen 3: Match Tracker
**Purpose:** Track live match events

#### 3.3.1 Match Summary (Top)
**Display format:**
```
Caterham Pumas 4–3 Opposition
(1, 5 (pen), 12, 31)     (10, 20, 45)
```

**Rules:**
- Score in centre with team names on either side
- Team names: right-aligned (home), left-aligned (away)
- Goal times below in parentheses
- Times are cumulative match minutes (1-indexed)
- Penalty goals marked with "(pen)" after the minute
- Times update immediately when goals edited

#### 3.3.2 Period Timer (When Active)
**Displays:**
- Period name: "Quarter 1 (10 minutes)" or "Half 1 (45 minutes)"
- **Cumulative time:** Shows total match time, not period time
  - Q1: 00:00 to 10:00
  - Q2: 10:00 to 20:00
  - Q3: 20:00 to 30:00
  - Q4: 30:00 to 40:00
  - H1: 00:00 to 45:00
  - H2: 45:00 to 90:00

**Debug Buttons** (for testing, purple):
- +10 sec
- +1 min
- +5 min

**Control Buttons:**
- **Start/Restart:** Green, shows "Start" initially, "Restart" after pause
- **Pause:** Yellow, appears while running
- **End [Period Name]:** Red, ends current period

**Behaviour:**
- Timer auto-starts when period begins
- Timer auto-ends when period length reached
- Period end event recorded automatically

#### 3.3.3 Period Start Button (Between Periods)
**When no period active:**
- Large blue button: "Start Q2" (or next period name)
- Starts timer immediately when clicked

**When all periods complete:**
- Orange banner: "FULL TIME"

#### 3.3.4 Goal Buttons
**Visibility:**
- Only shown during active period (after first period started)
- Two buttons: "Goal [Home Team]" and "Goal [Away Team]"
- Blue background, side-by-side

**Behaviour:**
- Records goal at current timer value
- Assigns to current period
- Goal can be edited later to add player/penalty

#### 3.3.5 Missed Goal Buttons (Between Periods)
**When between periods and at least one period completed:**
- Label: "Add missed goal from previous period:"
- Two orange buttons: "Goal [Home Team]" and "Goal [Away Team]"
- Confirmation dialogue before adding:
  - "Add a goal for [Team] to [Period]?"
  - "(Will be recorded at end of period)"
  - Cancel / Add Goal buttons

#### 3.3.6 Match Events List
**Display:**
- Scrollable list (max height ~96)
- Most recent at bottom
- Each event shows:
  - Description (e.g., "Goal - Caterham Pumas")
  - Player name if assigned: "(#7 John Smith)" or "(John Smith)" if numbers hidden
  - Penalty indicator if applicable: "(Penalty)" in yellow
  - Real clock time: "14:32:15"
  - Elapsed/cumulative time in brackets: "[05:23]"

**Event Types:**
1. **Period Start:** "Q1 Start" - shows period start time [00:00]
2. **Period End:** "Q1 End" - shows cumulative time at period end [10:00]
3. **Goal:** "Goal - [Team Name]" - editable and deletable
4. **Match End:** "Match End" - shows total match time

**Goal Events - Edit Mode:**
When pencil icon clicked:
- Description: Read-only, shows as text
- Elapsed Time: Editable MM:SS input
  - Real time auto-updates based on period start + elapsed time
- Player Dropdown: Select from configured players
  - Shows "#7 John Smith" or "John Smith" based on number visibility
  - "None" option available
- Penalty Checkbox: Check to mark as penalty
- Save button (green) / Cancel button (grey)

**Goal Events - Actions:**
- Edit icon (pencil, blue) - only on goals
- Delete icon (trash, red) - only on goals
  - Shows confirmation modal before deleting

**Non-goal Events:**
- No edit or delete buttons
- Display only

#### 3.3.7 Action Buttons (Bottom)
1. **Summary to Clipboard**
   - Blue button with download icon
   - Changes to "Copied!" for 3 seconds after click
   - Exports format:
     ```
     Caterham Pumas 5 - 1 Opposition
     Caterham Pumas: 1', 5' (pen), 12', 31'
     Opposition: 10'
     ```

2. **Reset Match**
   - Red button
   - Shows confirmation modal:
     - "Are you sure you want to reset the match? All data will be lost."
     - Cancel / Reset buttons
   - Clears all match data
   - Returns to setup screen
   - Resets team names to defaults
   - Preserves player data

---

## 4. Data Models

### 4.1 Match Configuration
```javascript
{
  ageGroup: 'U12',
  homeTeam: 'Caterham Pumas',
  awayTeam: 'Opposition',
  useQuarters: false,
  periodLength: 30,
  isHome: true,
  setupComplete: false,
  playersConfigured: false,
  matchStarted: false,
  showNumbers: true
}
```

### 4.2 Players (Stored separately)
```javascript
[
  { number: 1, name: 'John Smith' },
  { number: 7, name: 'Jane Doe' },
  ...
]
```

### 4.3 Events
```javascript
{
  id: 1633024800000, // timestamp
  type: 'goal', // 'period_start', 'period_end', 'match_end', 'goal'
  team: 'Caterham Pumas', // for goals only
  period: 'Q1', // 'Q1', 'Q2', 'Q3', 'Q4', 'H1', 'H2'
  timestamp: '14:32:15', // real clock time HH:MM:SS
  timerValue: '05:23', // elapsed time in period MM:SS
  description: 'Goal - Caterham Pumas',
  playerNumber: 7, // null if not assigned
  playerName: 'John Smith', // null if not assigned
  isPenalty: false // true if penalty
}
```

---

## 5. Calculations

### 5.1 Match Minute Calculation
Goal times shown in summary are cumulative match minutes (1-indexed):

```
matchMinute = previousPeriodMinutes + currentPeriodMinute

Where:
- Q1: previousPeriodMinutes = 0
- Q2: previousPeriodMinutes = periodLength
- Q3: previousPeriodMinutes = periodLength × 2
- Q4: previousPeriodMinutes = periodLength × 3
- H1: previousPeriodMinutes = 0
- H2: previousPeriodMinutes = periodLength

currentPeriodMinute = floor(elapsedSeconds / 60) + 1

Cap at: previousPeriodMinutes + periodLength
```

Example for U7 (10-minute quarters):
- Goal at 0:30 in Q1 → Minute 1
- Goal at 5:00 in Q2 → Minute 16 (10 + 6)
- Goal at 12:00 in Q3 (overtime) → Minute 30 (capped)

### 5.2 Cumulative Timer Display
Timer shows total match time, not period time:

```
displayTime = (previousPeriodMinutes × 60) + elapsedSeconds

Format as MM:SS
```

---

## 6. Local Storage

### 6.1 Storage Keys
- `footballMatchData`: All match state
- `footballPlayers`: Player roster (persists across matches)

### 6.2 Behaviour
- Auto-save on any state change
- Load on app start
- Clear match data on reset (preserves players)

---

## 7. PWA Requirements

### 7.1 Offline Functionality
- Service worker caches all resources
- App works completely offline after first load
- LocalStorage persists across sessions

### 7.2 Installation
- Manifest file for "Add to Home Screen"
- App name: "Football Match Tracker"
- Short name: "Match Tracker"
- Display: standalone
- Theme colour: #1F2937 (dark grey)
- Background colour: #111827
- Icon: Football/boot emoji or similar

### 7.3 iOS Optimisation
- Meta tags for iOS web app
- Prevent text selection where not needed
- Disable tap highlight
- Prevent over-scroll
- Viewport locked (no zoom)

---

## 8. Key User Interactions

### 8.1 Goal Recording Workflow
1. Match in progress (period active)
2. Click "Goal [Team]" button
3. Goal instantly recorded with current time
4. Appears in events list
5. Summary updates
6. Later: Click edit icon
7. Assign player from dropdown (optional)
8. Check penalty if applicable
9. Adjust time if needed
10. Click save
11. Summary and event list update

### 8.2 Missed Goal Workflow
1. Between periods
2. Realize goal was missed
3. Click orange "Goal [Team]" button
4. Confirm in modal
5. Goal added to previous period at period end time
6. Inserted before period end event in list

### 8.3 Export Workflow
1. Match complete or in progress
2. Click "Summary to Clipboard"
3. Button changes to "Copied!" for 3 seconds
4. Text copied to clipboard in format shown above
5. User pastes into WhatsApp or other app

---

## 9. Edge Cases & Rules

### 9.1 Timer Behaviour
- Timer continues past period length if not ended
- Goals can be recorded after period length (injury time)
- Auto-end stops timer at exact period length
- Manual end can happen at any time

### 9.2 Goal Times
- Goals in injury time capped at period length minute
- Example: Goal at 11:30 in 10-min quarter → shows as minute 10

### 9.3 Editing
- Can only edit goal events, not period events
- Can only delete goal events
- Editing time recalculates real timestamp
- Cannot edit description text

### 9.4 Data Validation
- Must enter both team names to proceed
- Age group always has valid defaults
- Period length must be 1-90
- Player numbers must be positive integers

---

## 10. Known Limitations

1. **No localStorage = No persistence:** If localStorage is unavailable, data lost on refresh
2. **Browser dependency:** Requires modern browser with ES6+ support
3. **No server sync:** All data local only, no backup
4. **Single match:** Only one match tracked at a time (can export before reset)
5. **No match history:** Previous matches not saved (by design)

---

## 11. Future Enhancements (Out of Scope for V1)

- Match history / archive
- Statistics and analytics
- Multiple team rosters
- Cloud backup/sync
- Share match link
- Cards (yellow/red)
- Substitutions tracking
- Formation/position tracking
- Photo/video notes
- Weather conditions
- Referee/venue details

---

## 12. Testing Checklist

- [ ] Install as PWA on iPhone
- [ ] Works completely offline
- [ ] All age groups calculate times correctly
- [ ] Quarter/half toggle works
- [ ] Player numbers show/hide correctly
- [ ] Goals record with correct times
- [ ] Penalty checkbox updates summary
- [ ] Player assignment shows in events
- [ ] Edit goal updates summary immediately
- [ ] Delete goal works
- [ ] Missed goal confirmation and insertion correct
- [ ] Timer auto-ends at period length
- [ ] Cumulative time displays correctly
- [ ] Export copies correct format
- [ ] Reset clears match but preserves players
- [ ] Dark mode colours correct
- [ ] Touch targets large enough
- [ ] No horizontal scroll
- [ ] LocalStorage persists across sessions

---

## 13. Technical Stack Summary

- **React 18** (via CDN)
- **ReactDOM 18** (via CDN)
- **Babel Standalone** (for JSX)
- **Tailwind CSS** (via CDN)
- **Lucide Icons** (via CDN)
- **Service Worker** (inline, for caching)
- **LocalStorage API** (for persistence)
- **Clipboard API** (for export)

---

## 14. File Structure (for deployment)

```
/
├── index.html (complete standalone file)
└── (Service worker embedded inline)
```

Single HTML file contains everything - no separate JS/CSS files needed.

---

**End of Requirements Document**