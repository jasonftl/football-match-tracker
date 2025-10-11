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
- **Goal Details**: Assign players to goals and mark penalties
- **Missed Goals**: Add goals to previous periods that were missed during play
- **Substitution Management**: Manage player substitutions during the match
- **Power Play Support**: Automatic extra player allowance for U7-U10 when trailing
- **Match Events**: View complete chronological list of all match events (goals, substitutions, periods)
- **Export**: Copy detailed match data to clipboard for sharing
- **AI Match Reports**: Generate narrative match reports using AI (requires internet, debug mode)
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

**Manager Mode Export Format:**
```
Caterham Pumas 4–3 Opposition

Starting Lineup:
#1 John Smith (played 40') (1 goal @ 5')
#2 Jane Doe (played 30')
#3 Bob Jones (played 40') (2 goals @ 12', 22'(pen))
#4 Alice Brown (played 40')
#5 Charlie Davis (played 40')

Substitutes:
#6 Emma Wilson (played 10')
#7 Frank Taylor (played 10')

Q1 Start - 14:30:00 [00:00]
Goal - Caterham Pumas (#3 Bob Jones) - 14:31:23 [01:23]
Goal - Opposition - 14:35:15 [05:15]
SUB OFF: #2 Jane Doe - 14:38:00 [08:00]
SUB ON: #6 Emma Wilson - 14:38:00 [08:00]
Q1 End - 14:40:00 [10:00]
...
Match End - 15:10:00 [40:00]
```

**Referee Mode Export Format:**
```
Caterham Pumas 4–3 Opposition

Q1 Start - 14:30:00 [00:00]
Goal - Caterham Pumas - 14:31:23 [01:23]
Goal - Opposition - 14:35:15 [05:15]
Q1 End - 14:40:00 [10:00]
...
Match End - 15:10:00 [40:00]
```

#### Generate AI Match Report

**Note:** This feature requires internet connection and must be enabled in debug mode (via About modal).

1. Complete the match (reach full time)
2. Enable debug mode in the About modal (Info button)
3. Purple "AI Report to Clipboard" button appears
4. Click button to generate narrative match report
5. AI-generated report automatically copied to clipboard
6. Paste into WhatsApp, notes, or any other app

**How it works:**
- Sends your match data to AI service for processing
- Generates a professional-style grassroots football match report
- Written in British English with warm, fair tone
- Highlights teamwork, effort, and key moments
- Takes 5-15 seconds to generate

**Important Privacy Note:**
- **Match data including player names is sent to AI service**
- Data may be used by AI provider for model training
- **You must have permission from players' parents/guardians before using this feature**
- **Strongly recommended: Use first names only, not full names**
- Consider data sensitivity before generating AI reports
- Feature is optional - traditional export still available

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
- If using AI reports: ensure you have parental permission and used first names only
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

## Privacy & Data Collection

### Local Data Storage

- **All core match data is stored locally** on your device in browser localStorage
- Player names, numbers, match events, and scores remain on your device
- **No data is sent to any server** for offline functionality
- No account or login required
- Data persists until you clear browser data or reset the match

### Online Features & Data Collection

#### Vercel Hosting & Analytics

This app is hosted on Vercel, which may collect anonymous usage analytics:
- **Page views** and **performance metrics**
- **Geographic region** (country/region level only, no precise location)
- **Device type** (mobile/desktop/tablet)
- **No personally identifiable information is collected**
- No tracking of player names, match data, or specific content
- Analytics help improve app performance and user experience

#### AI Match Report Generation

**When you use the "AI Report to Clipboard" feature:**
- Complete match data is sent from your device to our Vercel serverless function
- Data is then forwarded to OpenRouter AI API for processing
- **Data sent includes:**
  - Team names
  - Player names (as you entered them)
  - Goals, substitutions, and all match events
  - Timestamps and match details
- **Important:**
  - **Data may be used by the AI provider (OpenRouter/model provider) for training AI models**
  - This data is sent over the internet and processed by third-party AI services
  - Once sent, we cannot control how the AI provider uses the data

#### Your Responsibilities

**Before using AI features, you MUST:**
1. ✅ Obtain written permission from players' parents/guardians
2. ✅ Inform parents that data will be sent to AI service
3. ✅ Explain that data may be used for AI training
4. ✅ **Use first names only - DO NOT use full names**
5. ✅ Consider whether the data is appropriate to share

**Best Practices:**
- Use "John" not "John Smith"
- Use initials if preferred: "J.S."
- Avoid any sensitive or identifying information
- Remember: Once data is sent, it cannot be recalled
- When in doubt, use the standard "Match Data to Clipboard" feature instead

### Data Protection

- Clear old match data regularly
- Be mindful when copying data to clipboard (can be accidentally shared)
- Do not enter sensitive or confidential information
- Remember that exported/clipboard data can be shared anywhere
- You are responsible for obtaining necessary permissions before sharing player data

## User Agreement

**By using this application, you agree to the following terms:**

### 1. Data Storage and Responsibility

- You understand that match data is stored locally on your device
- You are responsible for the data you enter into the app
- You understand that clearing browser data will delete all match information
- You accept responsibility for backing up important match data

### 2. Online Features and Data Transmission

- You understand that the AI Match Report feature sends data to third-party services
- You acknowledge that data sent to AI services may be used for AI model training
- You agree to obtain necessary permissions before using AI features with players' data
- You understand that Vercel may collect anonymous usage analytics

### 3. Parental Permission and Player Privacy

- You agree to obtain written permission from parents/guardians before:
  - Recording player names in the app
  - Using the AI Report feature with player data
  - Sharing any match data that includes player information
- You agree to use first names only (not full names) when using AI features
- You understand that you are solely responsible for compliance with data protection laws

### 4. No Warranty

- This app is provided "as is" without warranty of any kind
- We do not guarantee accuracy, reliability, or fitness for any purpose
- We are not responsible for any data loss, errors, or issues arising from use
- You use this app entirely at your own risk

### 5. Liability

- We are not liable for any damages arising from use of this app
- We are not responsible for how third-party services (AI providers, Vercel) handle data
- You are responsible for ensuring your use complies with applicable laws and regulations

### 6. Changes to Terms

- These terms may be updated at any time
- Continued use of the app constitutes acceptance of updated terms
- You can review these terms anytime in the About section (Info button)

### 7. Age and Capacity

- By using this app, you confirm you are old enough to enter into this agreement
- If using for youth sports, you confirm you have authority to collect and process player data

**If you do not agree to these terms, do not use this application.**

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

© 2025 - All rights reserved

## Support

For questions or feedback, please open an issue in the repo:
https://github.com/jasonftl/football-match-tracker
