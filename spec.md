# App Showcase Manager

## Current State
- Static frontend with hardcoded app data (9 sample apps)
- Empty Motoko backend
- No admin panel
- No dynamic app management

## Requested Changes (Diff)

### Add
- Motoko backend: App data model (id, name, logoUrl, downloadLink, hot, stars, version)
- Backend CRUD: addApp, removeApp, getApps
- Admin panel at /admin route, password-protected (password: 7048919766@naviaxis)
- Admin can add apps: upload logo image, enter app name, enter download link
- Admin can remove apps
- Home screen: fetch apps from backend, clicking card redirects to downloadLink
- Blob storage for app logo images

### Modify
- Home screen AppCard: use real logo image from blob storage, redirect to download link on click
- App data sourced from backend instead of hardcoded

### Remove
- Hardcoded static app list

## Implementation Plan
1. Generate Motoko backend with App type and CRUD functions
2. Wire blob-storage for logo uploads
3. Build AdminPanel component with password gate, add/remove app forms
4. Update home page to fetch from backend and make cards clickable with download redirect
