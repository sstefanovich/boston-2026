# France & Belgium 2026 — Travel App

Vacation-themed Android companion for your trip guide. Sideload the APK on your phone (no Play Store required).

## Features

- **Itinerary** — day-by-day timeline with photos
- **Don't Miss** — free-time picks from your crash course
- **Maps** — Google Maps search & directions for hotels, tour meetups, stations
- **Calendar** — one-tap add booked events to Google Calendar
- **Phrases** — French (Lyon) and Dutch/Flemish (Belgium)
- **Before You Go** — apps checklist with Play Store links
- **Quick reference** — emergency phrases & hotel addresses
- **Emergency** — 112, embassies, tap-to-call

## Quick start (preview in browser)

```bash
cd france-belgium-travel-app
npm install
npm run dev
```

Open the URL shown (usually http://localhost:5173).

## Build APK for sideloading

### Prerequisites

1. **Node.js** 18+ (you have this)
2. **Android Studio** with Android SDK — [download](https://developer.android.com/studio)
3. Set `ANDROID_HOME` (Studio → SDK Manager shows path, often `%LOCALAPPDATA%\Android\Sdk`)

### Steps

```powershell
cd c:\Temp\france-belgium-travel-app
npm install
npm run build
npx cap add android
npx cap sync android
```

Open in Android Studio (optional):

```powershell
npm run android:open
```

Build debug APK from command line:

```powershell
cd android
.\gradlew.bat assembleDebug
```

APK location:

```
android\app\build\outputs\apk\debug\app-debug.apk
```

Copy `app-debug.apk` to your phone (USB, Google Drive, email).

### Install on your Android phone

1. **Settings → Security** (or Apps) → enable **Install unknown apps** for Files/Drive/Chrome (varies by manufacturer).
2. Open the APK file on the phone → **Install**.
3. Launch **France Belgium 2026**.

### Release build (smaller, signed — optional)

In Android Studio: **Build → Generate Signed Bundle / APK**. For personal sideloading, the debug APK is fine.

## Permissions

The app opens Google Maps, Calendar, Play Store, and phone dialer in the browser/system — it needs **internet** for map images (Unsplash) and links. Core guide text works offline after first load.

## Project structure

```
france-belgium-travel-app/
  src/data/content.ts   — trip content from crash course
  src/utils/links.ts    — Maps, Calendar, tel, Play Store URLs
  src/pages/            — screens
  android/              — Capacitor Android project (after cap add)
```

## Sync after editing content

```powershell
npm run cap:sync
```

Then rebuild the APK.

---

*Bon voyage / Goede reis!*
