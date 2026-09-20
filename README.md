

---

```markdown
# Self Learners · CSS 2027 Hub

A Progressive Web App (PWA) for CSS 2027 aspirants — MCQ practice, solved papers, facts, syllabus, schedule, and eligibility tracking — all in one installable app.

**Live URL:** https://sangi.github.io/self-learners/

---

## 📱 Features

### Study Tools (after login)
| Feature | Description |
|---|---|
| **📝 MCQs** | Timed quiz with instant feedback, grid overview, filter by job/subject |
| **📖 Solved** | Read-mode list of all MCQs with correct answers highlighted |
| **💡 Facts** | One-tap fact cards with verify status (✔/✘/?) and read progress |
| **📄 Papers** | FPSC past papers with AI-solved links, searchable and filterable |

### Reference Pages (available before login)
| Page | Description |
|---|---|
| **📅 Schedule** | Live CSS 2027 study timetable with countdown to MPT & Written |
| **🛡️ Eligibility** | Age/attempts calculator per CSS CE Rules 2019 |
| **📋 Syllabus** | Complete FPSC syllabus with subtopics + recommended books |
| **🔐 Login** | Email/password OR guest mode (limited to 15 MCQs) |

### PWA Capabilities
- Installable on Android, iOS, and desktop
- Offline shell caching via service worker
- Sky-blue theme color (`#0ea5e9`) matches Android status bar
- Install banner appears on every visit (dismissible, re-shows after 24h)

---

## 🏗️ Architecture

### Two-stage navigation

**Stage 1 — Before login (outer menu):**
```

🔐 Login  |  📅 Schedule  |  🛡️ Eligibility  |  📋 Syllabus

```

**Stage 2 — After login (menu swaps):**
```

📝 MCQs  |  📖 Solved  |  💡 Facts  |  📄 Papers

```

- **Desktop:** Menu 1 = top toggle bar. Post-login, outer bar hides and Edu's own compact **mode pill dropdown** takes over (no duplicate nav).
- **Mobile:** Menu 1 = bottom nav. Post-login, bottom nav swaps to Menu 2.
- **Login state** persists in `localStorage` — refreshing after login keeps you in Menu 2.

### Cross-iframe communication

`index.html` is a shell that loads each page inside an `<iframe>`. Inner pages talk to the shell via `postMessage`:

| Message | Direction | Purpose |
|---|---|---|
| `SL_LOGIN` | page-login → index | User logged in successfully |
| `SL_LOGOUT` | page-edu → index | User logged out |
| `SL_USER` | index → page-edu | Pass user info to Edu |
| `SL_SET_MODE` | index → page-edu | Switch mode (mcq/read/facts/papers) |
| `SL_SET_MODE_FROM_EDU` | page-edu → index | Edu reports internal mode change |
| `SL_FORCE_CLOSE_OVERLAYS` | index → page-edu | Force-close drawer/modal on logout |
| `SL_THEME` | index → all | Pass color theme variables |

---

## 📂 File Structure

```

self-learners/
├── index.html              ← Shell + router + dual navigation
├── page-login.html         ← Login form (email/password/guest)
├── page-edu.html           ← Quiz UI with 4-mode pill dropdown
├── page-schedule.html      ← Study timetable (live from Google Sheets)
├── page-syllabus.html      ← FPSC syllabus browser
├── page-eligibility.html   ← Age/attempt calculator
├── page-papers.html        ← FPSC past papers grid
├── manifest.json           ← PWA manifest
├── service-worker.js       ← Offline cache strategy
├── icon-192.png            ← App icon (small)
├── icon-512.png            ← App icon (large)
└── README.md               ← This file

```

---

## 🚀 Deployment (GitHub Pages)

### First-time setup
1. Create repo `self-learners` under your GitHub account
2. Upload all files to the `main` branch
3. Go to **Settings → Pages** → Source: `main` / `root` → Save
4. Wait ~60 seconds → visit `https://<username>.github.io/self-learners/`

### Updating a file
1. Click the file on GitHub → pencil icon (edit)
2. Paste new content → **Commit changes**
3. Wait ~60s for GitHub Pages to redeploy
4. On mobile: hard-refresh (clear cache) to bypass browser cache

### Cache-buster URL (for testing)
Append `?v=XYZ` to force a fresh load:
```

https://sangi.github.io/self-learners/index.html?v=sky2

```

---

## 🔧 Data Sources (Google Sheets)

All content is fetched live from published Google Sheets as CSV.

| Data | Sheet |
|---|---|
| **Users** | `17yY_LUiqMsABz7tbtAXFpZIYpHN2TJTZSxo7oJWzckI` · GID `2076597807` |
| **Questions** | Published CSV (2PACX-1vQyB_I39...) |
| **Facts** | Published CSV (2PACX-1vTRO-FPem...) |
| **Job Sites** | `108C9USSy1WysOwKThC1JFsL5OfjSC3HAX5EysDMw4gM` · GID `614189291` |
| **Syllabus** | Published CSV (2PACX-1vSficiiXO39...) |
| **Schedule** | Published CSV (2PACX-1vTX16x-Eeh1m...) |
| **Papers** | Published CSV (2PACX-1vTarve67hHynj...) |

### Questions sheet columns
| Col | Field | Notes |
|---|---|---|
| A | (unused) | |
| B | Question text | Required |
| C–F | Options A–D | 4 options |
| G | Correct answer | Text or letter (A/B/C/D) or number (1–4) |
| H | Topic | |
| I | Subject | |
| J | (unused) | |
| K | Job | |
| L | (unused) | |
| M | M-Column | `true` / `false` / blank |
| N | Show flag | `0` / `false` / `no` to hide |

### Facts sheet columns
`SrNo | Question | Answer | Question Topic | Subject | Verify | Created`

`Verify` values: `true` / `false` / blank → renders ✔ / ✘ / ? corner badge.

### Syllabus sheet columns
`srno | subjectPaper | Module | Topic Number | Topic Name / Detail | Given in FPSC CSS Syllabus? | Recommended Book / Source | date_read | Possible Subtopics`

### Schedule sheet columns
`Activity | From | To | Duration | Type | MPT | Written`
- `Type`: core / compulsory / optional / mpt / review / break / sleep
- Times in 24-hour format (e.g. `06:30`)

---

## 👤 Login & Guest Mode

### Real login
- Users stored in a Google Sheet (col A = username, col B = password)
- Case-insensitive username match
- Persisted in `localStorage` under key `slUser`

### Guest mode
- No credentials required
- Limited to first **15 MCQs**
- Locked questions appear with 🔒 on grid dots
- Cannot save quiz progress
- Prompted to login when trying to unlock

### Session keys (localStorage)
| Key | Stores |
|---|---|
| `slUser` | `{user, pass}` JSON |
| `slPostLogin` | `"1"` when logged in (survives refresh) |
| `slQuizV4` | Full quiz state (non-guest only) |
| `slMode` | Last selected mode: `mcq`/`read`/`facts`/`papers` |
| `slFactsRead` | Array of read fact keys |
| `slInstallDismissed` | Timestamp of last install banner dismissal |

---

## 🎨 Theme Colors

Defined in CSS `:root` across all files:

| Variable | Hex | Usage |
|---|---|---|
| `--navy` | `#0a1e3f` | Brand, headings |
| `--sky` | `#0ea5e9` | **Primary / theme-color** |
| `--sky-dark` | `#0284c7` | Gradient end |
| `--sky-soft` | `#e0f2fe` | Backgrounds, pills |
| `--yellow` | `#f5b800` | Accent, timer progress |
| `--success` | `#059669` | Correct answers |
| `--danger` | `#dc2626` | Wrong answers |
| `--bg` | `#f4f6fa` | Page background |

`<meta name="theme-color" content="#0ea5e9">` on every page.

---

## 🔒 Manual Install (if native prompt doesn't appear)

**Android (Chrome):**
1. Open the site
2. Tap ⋮ (3 dots menu)
3. Tap **Install app** or **Add to Home Screen**
4. Confirm

**iOS (Safari):**
1. Open the site
2. Tap the Share button (⬆️)
3. Scroll → **Add to Home Screen**
4. Tap **Add**

**Desktop (Chrome/Edge):**
1. Look for the install icon 📥 in the address bar
2. Or menu → **Install Self Learners**

### If native install prompt never appears
Chrome suppresses the prompt for 90 days if you ever dismissed it. To reset:
1. **Chrome → Settings → Privacy and security → Site settings → All sites → sangi.github.io**
2. Tap → **Delete**
3. Also: **Site settings → Add to Home screen** → remove `sangi.github.io` if listed
4. Clear Chrome cache (History → Clear browsing data → Cached images)
5. Force-close Chrome completely
6. Reopen and visit the site

---

## 🐛 Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Top bar shows navy blue instead of sky blue | Browser cached old HTML | Hard-refresh: clear cache |
| Menu 2 (MCQs/Solved/Facts/Papers) shows at top AND inside Edu | Old `index.html` | Ensure `#topToggleBarPostLogin { display: none !important; }` is in `<style>` |
| Drawer stays open after logout | Stale iframe state | Deploy current `page-edu.html` (includes `SL_FORCE_CLOSE_OVERLAYS` handler) |
| Install banner never appears | Chrome 90-day suppression | See "If native install prompt never appears" above |
| Questions don't load | Google Sheet unpublished | Re-publish via File → Share → Publish to web |
| Facts fail to load | Same as above | Same fix |
| Refresh after login lands on Login screen | `slPostLogin` key cleared | Check browser isn't in incognito mode |
| Papers iframe blank | `page-papers.html` 404 | Verify file exists in repo |

### Debug checklist (Desktop Chrome)
1. F12 → **Console** tab → look for red errors
2. F12 → **Application → Manifest** → should show name + icons, no red
3. F12 → **Application → Service Workers** → should say "activated and running"
4. F12 → **Application → Storage** → check `slUser` / `slPostLogin` keys exist

---

## 🧪 Testing Checklist

After deploying, verify:

- [ ] Pre-login shows Menu 1 (Login / Schedule / Eligibility / Syllabus)
- [ ] Login with real credentials swaps to Menu 2
- [ ] Guest login works (shows 15-MCQ limit notice)
- [ ] Mode pill in Edu opens dropdown with 4 options
- [ ] Switching to Papers loads `page-papers.html` in iframe
- [ ] Switching back to MCQs restores question view
- [ ] Filter drawer opens with ☰ button
- [ ] Refresh after login stays on Menu 2
- [ ] Logout returns to Login screen with all overlays closed
- [ ] Log back in — no ghost drawer, no ghost modal
- [ ] Desktop: no duplicate nav bar at top
- [ ] Mobile: bottom nav visible, no top bars
- [ ] PWA install prompt appears (or manual install works)
- [ ] Timer counts down, turns red under 1 minute
- [ ] Grid dots reflect correct/wrong/pending status

---

## 📝 Version History

### v2.7 (current)
- Sky-blue theme (`#0ea5e9`) across all pages
- 4-mode pill dropdown inside Edu (MCQs/Solved/Facts/Papers)
- Menu 2 top bar hidden on desktop (fixes duplicate nav)
- Drawer auto-closes on logout AND on re-login
- `SL_FORCE_CLOSE_OVERLAYS` postMessage handler
- Papers iframe lazy-loads on first tap
- Install banner re-shows every 24h

### v2.6
- Split login into `page-login.html`
- Dual navigation (pre-login vs post-login)
- PWA manifest + service worker
- 3-row top bar in Edu

### v2.5 and earlier
- Initial quiz engine
- Read mode, Facts mode
- Eligibility calculator
- Syllabus browser
- Schedule timeline
- Papers grid

---

## 📄 License

Private project — all rights reserved by the author.

---

## 🙋 Support

If something breaks:
1. Check the **Troubleshooting** table above
2. Hard-refresh (clear cache)
3. Check browser console (F12 → Console)
4. Verify files are actually deployed (visit each URL directly)

---

**Built with ❤️ for CSS 2027 aspirants.**
```

---

