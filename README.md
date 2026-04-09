# Reflekt App

The React Native mobile frontend for Reflekt, an AI-powered journaling app that analyzes your mood and provides insights using Claude AI.

Built with React Native and Expo.

---

## Features

- Clean, minimal dark UI designed for focused journaling
- User registration and login with persistent sessions
- Create journal entries with a title, body, and tags
- Automatic AI mood detection and insight generation powered by Claude
- Entry detail view showing full AI analysis
- Delete entries with a confirmation prompt
- Stays logged in between app sessions using AsyncStorage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native |
| Development Platform | Expo |
| Navigation | React Navigation |
| HTTP Client | Axios |
| Local Storage | AsyncStorage |
| State Management | React Context API |

---

## Project Structure

    reflekt-app/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js       # Global auth state and token management
    │   ├── screens/
    │   │   ├── LoginScreen.js       # Login form
    │   │   ├── RegisterScreen.js    # Registration form
    │   │   ├── HomeScreen.js        # Entry list with mood badges
    │   │   ├── NewEntryScreen.js    # Create a new journal entry
    │   │   └── EntryDetailScreen.js # Full entry view with AI insight
    │   └── services/
    │       └── api.js               # All API calls to the Go backend
    ├── App.js                       # Root component with navigation setup
    ├── app.json                     # Expo configuration
    └── package.json                 # Dependencies

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- The Reflekt API running locally ([reflekt-api](https://github.com/peekdylan/reflekt-api))
- Expo Go app on your phone (optional, for device testing)

### Setup

1. Clone the repository

        git clone https://github.com/peekdylan/reflekt-app
        cd reflekt-app

2. Install dependencies

        npm install

3. Update the API base URL in `src/services/api.js`

        // For web development
        const BASE_URL = 'http://localhost:8080';

        // For physical device testing, use your Mac's local IP address
        const BASE_URL = 'http://192.168.x.x:8080';

4. Start the app

        npx expo start

Then press `w` to open in browser, or scan the QR code with Expo Go on your phone.

---

## Screens

### Login & Register
Users can create an account or sign in. JWT tokens are stored locally so users stay logged in between sessions.

### Home
Displays all journal entries as cards showing the title, a preview of the body, mood badge, and tags. Entries show an "Analyzing..." state while Claude processes them in the background. Tap the + button to create a new entry.

### New Entry
A focused writing screen with fields for title, body, and comma-separated tags. After saving, the user is returned to the home screen and AI analysis begins automatically.

### Entry Detail
Shows the full entry content along with the AI-generated mood label and insight paragraph. If analysis is still in progress an indicator is shown instead.

---

## Related

- [Reflekt API](https://github.com/peekdylan/reflekt-api) — The Go backend that powers this app

---

## License

MIT