# Football Match Tracker

A Progressive Web App (PWA) for tracking football matches from U7 to Adult level. Optimised for mobile devices and works completely offline.

## Features

- **Referee/Manager Modes**: Choose between simplified Referee mode or full Manager mode with player tracking
- **Match Setup**: Configure age group, match format (quarters/halves/custom), and team names
- **Custom Formats**: Create custom match formats with 1, 2, or 4 periods of any length
- **Player Management**: Add and manage your team squad list with optional player numbers (Manager mode)
- **Substitute Tracking**: Mark players as starting or substitutes with green/red toggles
- **Real-Time Timer**: Continuous timer based on wall-clock time that runs even when screen locks
- **Goal Tracking**: Record goals in real-time with timestamps
- **Goal Scorer Modal**: Instantly assign players and mark penalties when goals are scored (Manager mode)
- **Goal Details**: Assign players to goals and mark penalties
- **Missed Goals**: Add goals to previous periods that were missed during play
- **Substitution Management**: Manage player substitutions during the match with visual three-column interface
- **Power Play Support**: Automatic extra player allowance for U7-U10 when trailing
- **Match Events**: View complete chronological list of all match events (goals, substitutions, periods)
- **Match Data View**: Dedicated screen for viewing and exporting match data
- **Export**: Copy detailed match data to clipboard for sharing
- **AI Match Reports**: Generate narrative match reports using AI (requires internet, enable in About)
- **Debug Mode**: Simulate complete matches and advance timer for testing (enable in About)
- **Offline Support**: Core features work completely offline once installed
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

1. **Choose Referee or Manager Mode**:
   - **Referee**: Track match only - no player management or goal scorer details
   - **Manager**: Full functionality with player setup, goal scorer selection, and substitution tracking
2. **Choose Home or Away**: Select whether Caterham Pumas is playing at home or away
3. **Select Age Group and Format** (displayed on same line):
   - **Age Group** (left): Choose from U7 to Adult - simple labels only
   - **Match Format** (right): Shows time details like "4 × 10 min" or "2 × 45 min"
     - Standard formats based on age group
     - "Custom" option available for all ages
4. **Custom Format** (if selected):
   - **Periods**: Choose 1, 2, or 4 periods
   - **Period Length**: Set custom duration (auto-calculates initially, then editable)
5. **Team Names**: Edit team names if needed (auto-populated based on Home/Away selection)
6. **Continue**:
   - Manager mode: Click "Continue to Player Setup"
   - Referee mode: Click "Start Match Tracker" (skips player setup)

### 2. Player Setup (Manager Mode Only)

**Note:** This screen is skipped in Referee mode.

1. **Header Controls** (same row):
   - **Left**: Toggle explanation - "Green = Starting (X) | Red = Sub (Y)"
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
- **Referee Mode**: Click "Goal [Team Name]" - goal is recorded immediately
- **Manager Mode**:
  - Click "Goal [Your Team]" - opens player selection modal to assign scorer and mark penalties
  - Click "Goal [Opposition]" - goal is recorded immediately
- Goals are recorded with current match time

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

#### Managing Substitutions (Manager Mode Only)

**Note:** Substitution tracking is not available in Referee mode.

**During Match (Even Between Periods):**
- Click purple "Make a Sub" button
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

- **End [Period]**: Manually end the current period (shows short code like "End Q1")
  - Requires confirmation before ending
- Timer auto-ends when period length is reached
- **Real-Time Operation**: Timer is based on actual wall-clock time
  - Continues running even if phone screen locks or device goes to sleep
  - Cannot be paused (real time cannot be paused)
  - Always accurate to actual match time

**Debug Buttons** (for testing, enable in About modal):
- +10 sec, +1 min, +5 min: Quickly advance timer for testing purposes

#### Match Summary

The top of the screen shows:
- Current score (e.g., "Caterham Pumas 4–3 Opposition")
- Goal scorers grouped by player name below the score
- Each scorer on their own line with times: "Oliver (58', 60')"
- Penalties marked as: "Eddie (65'(pen))"
- Goals without assigned scorer show only times: "(29', 50')"
- Home team scorers right-aligned, away team scorers left-aligned
- Updates automatically when goals are edited or deleted

#### Match Events

- Chronological list of all events (period starts/ends, goals, substitutions, match end)
- Shows real clock time and elapsed match time
- Goal events show player first names (no numbers in events list)
- Penalty goals marked with "(Penalty)" in yellow
- Substitutions show as "SUB ON: John" or "SUB OFF: Jane" (first names only)
- Scroll to view all events

### 4. After the Match

#### View and Export Match Data

1. Click "View/Copy Match Data" button (blue)
2. Match Data View screen opens showing formatted match data
3. Click "Copy to Clipboard" to copy match data
4. Button shows "Copied!" for 3 seconds
5. Paste into WhatsApp, notes, or any other app
6. Click "Back" button to return to Match Tracker

**Manager Mode Export Format:**
```
Caterham Pumas 4–3 Opposition
John (5')          (12')
Bob (12', 22'(pen))
Emma (32')

Starting Lineup:
#1 John Smith (played 40') (1 goal @ 5')
#2 Jane Doe (played 30')
#3 Bob Jones (played 40') (2 goals @ 12', 22'(pen))
#4 Alice Brown (played 40')
#5 Charlie Davis (played 40')

Substitutes:
#6 Emma Wilson (played 10') (1 goal @ 32')
#7 Frank Taylor (played 10')

Q1 Start - 14:30:00 [00:00]
Goal - Caterham Pumas - John - 14:31:23 [01:23]
Goal - Opposition - 14:35:15 [05:15]
SUB OFF: Jane - 14:38:00 [08:00]
SUB ON: Emma - 14:38:00 [08:00]
Q1 End - 14:40:00 [10:00]
...
Match End - 15:10:00 [40:00]
```

**Referee Mode Export Format:**
```
Caterham Pumas 4–3 Opposition
(1', 5', 12')      (3', 8')

Q1 Start - 14:30:00 [00:00]
Goal - Caterham Pumas - 14:31:23 [01:23]
Goal - Opposition - 14:35:15 [05:15]
Q1 End - 14:40:00 [10:00]
...
Match End - 15:10:00 [40:00]
```

#### Generate AI Match Report

**Note:** This optional feature requires internet connection and must be enabled in the About modal (Info button).

1. Complete the match (reach full time)
2. Enable "AI Features" toggle in the About modal (Info button)
3. Click "View/Copy Match Data" button (blue)
4. Click "Generate AI Report" button (purple, in Match Data View)
5. Wait for AI to generate report (5-15 seconds)
6. Modal appears with the generated report
7. Tap "Copy to Clipboard" button to copy
8. Paste into WhatsApp, notes, or any other app
9. Click "Back" button to return to Match Tracker

**How it works:**
- Sends your match data to AI service for processing
- Generates a professional-style grassroots football match report
- Written in British English with warm, fair tone
- Highlights teamwork, effort, and key moments
- Takes 5-15 seconds to generate
- **iOS-friendly:** Report shown in modal, tap to copy (preserves clipboard access)

**Privacy Note:**
- Match data (including first names) is sent to OpenRouter's AI service
- Data may be processed by the AI provider for improving their models
- Use first names only (not full names) to minimize identifiable data
- Traditional export is always available without using AI

#### End/Reset Match

1. Click "End/Reset Match" button (red)
2. Confirm in the popup
3. Match data is cleared
4. Match configuration (age group, format, team names, Referee/Manager mode) is preserved
5. Player squad list is preserved (including substitute status)
6. Returns to Match Setup screen for the next match

## Debug Mode (For Testing)

**Note:** Debug features are hidden by default. Enable "Debug Mode" in the About modal (Info button) to access them.

### Simulate Match

1. Enable "Debug Mode" in the About modal
2. On Match Setup screen, yellow "Simulate Match" button appears
3. Click button to run complete simulated match:
   - Automatically creates players with first names
   - Adds 2 substitutes (Manager mode)
   - Starts match and plays through all periods
   - Scores goals for both teams (including penalties)
   - Makes substitutions (quarters format, Manager mode)
   - Ends match with "FULL TIME" banner
4. Uses your current match settings (age group, format, team names, mode)
5. Useful for testing export, AI reports, and UI states

### Timer Debug Buttons

1. Enable "Debug Mode" in the About modal
2. During active period, purple timer buttons appear:
   - "+10 sec" - Advances timer by 10 seconds
   - "+1 min" - Advances timer by 1 minute
   - "+5 min" - Advances timer by 5 minutes
3. Useful for testing period transitions without waiting

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
- The timer continues into injury time if not manually ended
- Timer runs continuously based on real time - screen can be locked during play

### After Each Period

- Review the events list to ensure all goals and substitutions are recorded
- Add any missed goals using the orange buttons
- Assign players to goals during the break
- Update substitutions if needed

### After the Match

- Export match data before resetting
- Review and edit any incorrect times or player assignments
- Share the exported data with parents/coaches
- If using AI reports: use first names only to minimize identifiable data
- Consider clearing old match data you no longer need

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

## Data Use & Responsibility

**This is an independent volunteer hobby project.**

### Local Data Storage

- All core match data is stored locally on your device
- Player names, numbers, match events, and scores remain on your device
- The app's developer does not collect, view, or store any match data
- No account or login required
- Clearing browser data will delete all match information

### Online Features

#### Vercel Hosting & Analytics

This app is hosted on Vercel, which may collect anonymous usage analytics (page views, performance). No personally identifiable information is collected.

**Privacy Policy:** https://vercel.com/legal/privacy-policy

#### AI Match Report Generation (Optional Feature)

When you choose to use the "AI Report to Clipboard" feature:
- Match data (team names, first names, match events) is sent to OpenRouter's AI service
- Data may be processed by the AI provider for improving their models
- See OpenRouter's privacy policy: https://openrouter.ai/privacy

### Data Protection Tips

- Use first names only (e.g., "John" not "John Smith") to minimize identifiable data
- Clear old match data you no longer need
- Ensure your use complies with applicable laws and regulations

## User Agreement

**By using this application, you confirm that:**

### 1. Data Storage & Responsibility

- Match data is stored locally on your device
- You are responsible for any personal data you enter
- The app's developer does not collect, view, or store any match data
- Clearing browser data will delete all match information

### 2. Online Features

- App hosted on Vercel - may collect anonymous usage analytics
- No personally identifiable information collected via analytics
- Optional AI Match Report feature sends match data to OpenRouter's AI service
- Data sent to AI may be processed for improving their models

### 3. Data Protection Tips

- Use first names only (e.g., "John" not "John Smith") to minimize identifiable data
- Clear old match data you no longer need
- Ensure your use complies with applicable laws and regulations

### 4. No Warranty & Liability

- App provided "as is" without warranty of any kind
- We are not responsible for data loss, errors, or issues
- We are not liable for how third-party services handle data
- You use this app entirely at your own risk

### 5. Your Confirmation

By using this app, you confirm that:
- You have read and understood these terms
- You will use first names only to minimize identifiable data
- You understand the optional AI feature sends data to third-party services
- You accept the app "as is" with no warranty
- You are old enough to enter into this agreement

**If you do not agree to these terms, do not use this application.**

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

© 2025 - All rights reserved

## Support

For questions or feedback, please open an issue in the repo:
https://github.com/jasonftl/football-match-tracker
