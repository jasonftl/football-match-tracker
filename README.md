# Football Match Tracker

A Progressive Web App (PWA) for tracking football (soccer) matches from U7 to Adult level. Optimised for mobile devices and works completely offline.

## Features

- **Match Setup**: Configure age group, match format (quarters/halves), and team names
- **Player Management**: Add and manage your team roster with optional player numbers
- **Live Timer**: Track match time with cumulative display across periods
- **Goal Tracking**: Record goals in real-time with timestamps
- **Goal Details**: Assign players to goals and mark penalties
- **Missed Goals**: Add goals to previous periods that were missed during play
- **Match Events**: View complete chronological list of all match events
- **Export**: Copy detailed match data to clipboard for sharing
- **Offline Support**: Works completely offline once installed
- **Data Persistence**: Match settings and player rosters saved automatically

## Installation

### Install as PWA on iOS Devices

1. Open the app URL in Safari
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm
5. The app will now appear on your home screen like a native app

### Install as PWA on Android Devices

1. Open the app URL in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen" or "Install app"
4. Tap "Add" or "Install" to confirm

## How to Use

### 1. Match Setup

1. **Choose Home or Away**: Select whether Caterham Pumas is playing at home or away
2. **Select Age Group**: Choose from U7 to Adult - this automatically sets appropriate match duration
3. **Match Format**: Choose between Quarters (4 periods) or Halves (2 periods)
   - U7-U12: Can use either format
   - U13+: Halves only
4. **Adjust Period Length**: Fine-tune the length of each period if needed (supports 0.5 minute increments)
5. **Team Names**: Edit team names if needed (auto-populated based on Home/Away selection)
6. **Continue**: Click "Continue to Player Setup"

### 2. Player Setup

1. **Player Numbers Toggle**: Turn on/off player number display if your team doesn't use numbers
2. **Add Players**:
   - Default players are pre-populated based on age group
   - Edit player numbers and names
   - Delete players by clicking the trash icon
   - Add more players (for substitutes) using "Add Player" button
3. **Proceed**: Click "Proceed to Match Tracker" when ready

### 3. Match Tracking

#### Starting a Period

- Click the blue "Start Q1" (or "Start H1") button to begin
- Timer starts automatically
- Timer displays cumulative match time (not period time)

#### Recording Goals

**During Active Period:**
- Click "Goal [Team Name]" button immediately when a goal is scored
- Goal is recorded with current match time

**Between Periods (Missed Goals):**
- Click the orange "Goal [Team Name]" button
- Confirm in the modal popup
- Goal will be added to the previous period at the end-of-period time

#### Editing Goals

1. Click the pencil (edit) icon on any goal event
2. Adjust the time if needed (MM:SS format)
3. Assign a player from the dropdown (optional)
4. Check "Penalty" if it was a penalty kick
5. Click save (checkmark icon) or cancel (X icon)

#### Deleting Goals

1. Click the trash (delete) icon on any goal event
2. Confirm deletion in the popup

#### Timer Controls

- **Pause**: Temporarily stop the timer
- **Start/Restart**: Resume the timer
- **End [Period]**: Manually end the current period
- Timer auto-ends when period length is reached

**Debug Buttons** (for testing):
- +10 sec, +1 min, +5 min: Quickly advance timer

#### Match Summary

The top of the screen shows:
- Current score (e.g., "Caterham Pumas 4–3 Opposition")
- Goal times with penalty indicators (e.g., "1', 5'(pen), 12', 31'")
- Updates automatically when goals are edited or deleted

#### Match Events

- Chronological list of all events (period starts/ends, goals, match end)
- Shows real clock time and elapsed match time
- Scroll to view all events

### 4. After the Match

#### Export Match Data

1. Click "Match Data to Clipboard" button
2. Button shows "Copied!" for 3 seconds
3. Paste into WhatsApp, notes, or any other app

**Export Format:**
```
Caterham Pumas 4–3 Opposition

Q1 Start - 14:30:00 [00:00]
Goal - Caterham Pumas (#7 John Smith) - 14:31:23 [01:23]
Goal - Opposition - 14:35:15 [05:15]
Q1 End - 14:40:00 [10:00]
...
Match End - 15:10:00 [40:00]
```

#### Reset Match

1. Click "Reset Match" button (red)
2. Confirm in the popup
3. Match data is cleared
4. Match configuration (age group, format, team names) is preserved
5. Player roster is preserved
6. Returns to Match Setup screen for the next match

## Tips & Best Practices

### Before the Match

- Set up your player roster before arriving at the field
- Player names and numbers are saved for future matches
- Check that the age group and format are correct

### During the Match

- Record goals immediately when they happen
- Don't worry about assigning players during play - add them during breaks
- Use the pause button during breaks or injuries
- The timer continues into injury time if not manually ended

### After Each Period

- Review the events list to ensure all goals are recorded
- Add any missed goals using the orange buttons
- Assign players to goals during the break

### After the Match

- Export match data before resetting
- Review and edit any incorrect times or player assignments
- Share the exported data with parents/coaches

## Age Group Defaults

| Age Group | Format | Period Length | Total Time | Players |
|-----------|--------|---------------|------------|---------|
| U7-U8 | 4 Quarters | 10 min | 40 min | 5 |
| U9-U10 | 4 Quarters | 12.5 min | 50 min | 7 |
| U11-U12 | 2 Halves* | 30 min | 60 min | 9 |
| U13-U14 | 2 Halves | 35 min | 70 min | 11 |
| U15-U16 | 2 Halves | 40 min | 80 min | 11 |
| U17-Adult | 2 Halves | 45 min | 90 min | 11 |

*U11-U12 can also use 4 quarters (15 min each)

## Data Storage

- **Match Data**: Stored in browser localStorage, cleared on reset
- **Player Roster**: Stored in browser localStorage, persists across all matches
- **Match Settings**: Preserved when resetting (age group, format, team names)
- **Offline**: All data stored locally, no internet required after installation

## Troubleshooting

### App won't install on smartphone
- **iOS**: Make sure you're using Safari (not Chrome or other browsers)
- **Android**: Make sure you're using Chrome or another supported browser
- Check that you have enough storage space
- Try restarting the browser and trying again

### Data disappeared after closing browser
- Ensure you haven't cleared browser data/cache
- Check that localStorage is enabled in browser settings

### Timer not working
- Make sure you clicked "Start" on the period
- Check browser console for any errors
- Try refreshing the page

### Export not copying to clipboard
- Some browsers require HTTPS for clipboard access
- Try manually selecting and copying the events list
- Check browser clipboard permissions

## Development

### Prerequisites
- Node.js 16+ and npm

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Browser Support

- **iOS Safari**: 14+
- **Chrome**: 90+
- **Firefox**: 88+
- **Edge**: 90+

## Privacy

- No data is sent to any server
- All data stored locally on your device
- No tracking or analytics
- No account or login required

## License

© 2025 - All rights reserved

## Support

For issues or questions, please check the requirements document in `dev/requirements.md` or contact the development team.

---

**Made for Caterham Pumas FC** ⚽
