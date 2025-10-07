# Football Match Tracker

A Progressive Web App (PWA) for tracking football matches from U7 to Adult level. Optimised for mobile devices and works completely offline.

## Features

- **Match Setup**: Configure age group, match format (quarters/halves/custom), and team names
- **Custom Formats**: Create custom match formats with 1, 2, or 4 periods of any length
- **Player Management**: Add and manage your team squad list with optional player numbers
- **Substitute Tracking**: Mark players as starting or substitutes with green/red toggles
- **Live Timer**: Track match time with cumulative display across periods
- **Goal Tracking**: Record goals in real-time with timestamps
- **Goal Details**: Assign players to goals and mark penalties
- **Missed Goals**: Add goals to previous periods that were missed during play
- **Substitution Management**: Manage player substitutions during the match
- **Power Play Support**: Automatic extra player allowance for U7-U10 when trailing
- **Match Events**: View complete chronological list of all match events (goals, substitutions, periods)
- **Export**: Copy detailed match data to clipboard for sharing
- **Offline Support**: Works completely offline once installed
- **Data Persistence**: Match settings, player squad lists, and substitute status saved automatically

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
2. **Select Age Group and Format** (displayed on same line):
   - **Age Group** (left): Choose from U7 to Adult - simple labels only
   - **Match Format** (right): Shows time details like "4 × 10 min" or "2 × 45 min"
     - Standard formats based on age group
     - "Custom" option available for all ages
3. **Custom Format** (if selected):
   - **Periods**: Choose 1, 2, or 4 periods
   - **Period Length**: Set custom duration (auto-calculates initially, then editable)
4. **Team Names**: Edit team names if needed (auto-populated based on Home/Away selection)
5. **Continue**: Click "Continue to Player Setup"

### 2. Player Setup

1. **Header Controls** (same row):
   - **Left**: Toggle explanation - "Toggle: Green = Starting | Red = Sub"
   - **Right**: "Show Player Numbers" toggle - turn on/off number display
2. **Player List**:
   - Minimum players pre-populated based on age group
   - Each player row has:
     - **Green/Red Toggle** (left): Green = starting player, Red = substitute
     - **Number Field** (if numbers shown): Can be blank, no spinners
     - **Name Field**: Enter player name
     - **Delete Button** (trash icon): Remove player
   - List auto-scrolls when new players added
3. **Add Player**:
   - Click to add new player
   - Automatically assigned as starting (green) if under team size
   - Automatically assigned as substitute (red) if team is full
4. **Reset Players**:
   - Orange button below "Add Player"
   - Clears all names, resets to exact age group count, marks all as starting
   - Requires confirmation
5. **Proceed**: Click "Proceed to Match Tracker" when ready

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

#### Managing Substitutions

**During Active Period:**
- Click purple "Substitutes" button below goal buttons
- Modal shows three columns with one player per row:
  - **Playing** (left): Current starting players
  - **Toggles** (center): Green/red switches
  - **Substitutes bench** (right): Current substitutes
- Click any toggle to move player between starting and bench
- Playing count shows as "X/Y" (e.g., "5/5")
- **Power Play (U7-U10 only)**:
  - If 4+ goals down: Shows "5/5 + 1 power play" (allows 1 extra player)
  - If 6+ goals down: Shows "5/5 + 2 power play" (allows 2 extra players)
- **Caution symbol** (⚠️) appears if player count is incorrect
- Click "Cancel" to close without changes
- Click "Complete Substitutes" to review changes

**Confirmation:**
- Shows list of all changes (SUB ON / SUB OFF)
- Shows player count summary
- Three options:
  - **Confirm**: Apply changes and create match events
  - **Edit**: Go back to adjust
  - **Cancel**: Return without changes

#### Timer Controls

- **Pause**: Temporarily stop the timer
- **Start/Restart**: Resume the timer
- **End [Period]**: Manually end the current period (shows short code like "End Q1")
  - Requires confirmation before ending
- Timer auto-ends when period length is reached

**Debug Buttons** (for testing):
- +10 sec, +1 min, +5 min: Quickly advance timer

#### Match Summary

The top of the screen shows:
- Current score (e.g., "Caterham Pumas 4–3 Opposition")
- Goal times with penalty indicators (e.g., "1', 5'(pen), 12', 31'")
- Updates automatically when goals are edited or deleted

#### Match Events

- Chronological list of all events (period starts/ends, goals, substitutions, match end)
- Shows real clock time and elapsed match time
- Scroll to view all events
- Substitutions show as "SUB ON" or "SUB OFF" with player details

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
SUB OFF: #3 Jane Doe - 14:38:00 [08:00]
SUB ON: #12 Bob Jones - 14:38:00 [08:00]
Q1 End - 14:40:00 [10:00]
...
Match End - 15:10:00 [40:00]
```

#### Reset Match

1. Click "Reset Match" button (red)
2. Confirm in the popup
3. Match data is cleared
4. Match configuration (age group, format, team names) is preserved
5. Player squad list is preserved (including substitute status)
6. Returns to Match Setup screen for the next match

## Tips & Best Practices

### Before the Match

- Set up your player squad list before arriving at the pitch
- Mark starting players (green) and substitutes (red)
- Player names, numbers, and substitute status are saved for future matches
- Check that the age group and format are correct

### During the Match

- Record goals immediately when they happen
- Don't worry about assigning players during play - add them during breaks
- Use the Substitutes button to manage player changes
- Power play automatically calculated for U7-U10 teams when trailing
- Use the pause button during breaks or injuries
- The timer continues into injury time if not manually ended

### After Each Period

- Review the events list to ensure all goals and substitutions are recorded
- Add any missed goals using the orange buttons
- Assign players to goals during the break
- Update substitutions if needed

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

- **Match Data**: Stored in browser localStorage, cleared on reset (includes all events: goals, substitutions, periods)
- **Player Squad List**: Stored in browser localStorage, persists across all matches
  - Includes player numbers, names, and substitute status (green/red)
- **Match Settings**: Preserved when resetting (age group, format, team names, custom periods)
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

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

© 2025 - All rights reserved

## Support

For questions or feedback, please open an issue in the repo:
https://github.com/jasonftl/football-match-tracker
