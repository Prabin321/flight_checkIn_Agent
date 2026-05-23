# ✈ Flight Check-in Agent

An AI-powered browser app that watches the clock and automatically triggers the check-in process the moment your airline's check-in window opens — complete with alarm sounds, browser notifications, tab flashing, and a one-click deep-link launch.

![Flight Check-in Agent](https://img.shields.io/badge/status-live-brightgreen) ![HTML](https://img.shields.io/badge/built%20with-HTML%20%2F%20CSS%20%2F%20JS-blue) ![AI](https://img.shields.io/badge/AI-Claude%20API-orange)

---

## 🚀 Live Demo

**[Try it on GitHub Pages →](https://YOUR-USERNAME.github.io/flight-checkin-agent)**

> Replace `YOUR-USERNAME` with your GitHub username after deploying.

---

## 📸 Features

| Feature | Description |
|---|---|
| ⏱ Live countdown | Ticks down to the exact second check-in opens |
| 🔔 Browser notification | Pop-up alert the moment the window opens |
| 🔊 Alarm chime | Audio alert using the Web Audio API |
| 🖥 Tab title flash | Tab blinks "CHECK IN NOW!" so you never miss it |
| 🚀 One-click launch | Opens the airline's check-in page with PNR pre-filled |
| 🤖 AI assistant | Ask anything about your flight via Claude AI |
| 20+ airlines | Built-in support with correct check-in window times |
| 🌙 Dark mode | Automatically adapts to your system preference |

---

## 🗂 Project Structure

```
flight-checkin-agent/
├── index.html          # Main app — all UI tabs and markup
├── src/
│   ├── style.css       # All styles (light + dark mode)
│   ├── agent.js        # Core agent logic (countdown, alarms, AI chat)
│   └── airlines.js     # Airline data (URLs, check-in windows)
├── .github/
│   └── ISSUE_TEMPLATE.md
├── .gitignore
└── README.md
```

---

## 🛫 Supported Airlines

| Airline | Check-in Window | Deep-link Pre-fill |
|---|---|---|
| American Airlines | 24h | ✅ PNR + Last name |
| Delta Air Lines | 24h | ✅ PNR + Last name |
| United Airlines | 24h | ✅ PNR + Last name |
| Southwest Airlines | 24h | ✅ PNR + Last name |
| Alaska Airlines | 24h | Direct launch |
| JetBlue | 24h | Direct launch |
| Spirit Airlines | 24h | Direct launch |
| Frontier Airlines | 24h | Direct launch |
| British Airways | 24h | Direct launch |
| Emirates | 48h | Direct launch |
| Lufthansa | 23h | Direct launch |
| Air France | 30h | Direct launch |
| Singapore Airlines | 48h | Direct launch |
| Qatar Airways | 24h | Direct launch |
| Turkish Airlines | 24h | Direct launch |
| KLM | 24h | Direct launch |
| Ryanair | 24h | Direct launch |
| EasyJet | 24h | Direct launch |
| IndiGo | 48h | Direct launch |
| Air India | 48h | Direct launch |
| Other (any airline) | 24h | Google search fallback |

---

## 🏃 How to Use

### Option 1 — Open directly in browser
Just open `index.html` in any modern browser. No build step needed.

### Option 2 — GitHub Pages (free hosting)
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your app is live at `https://YOUR-USERNAME.github.io/flight-checkin-agent`

### Option 3 — Local dev server
```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## 🤖 AI Assistant Setup

The AI chat tab uses the [Anthropic Claude API](https://www.anthropic.com). To use it:

1. Get a free API key at [console.anthropic.com](https://console.anthropic.com)
2. Open `src/agent.js` and find this line:
   ```js
   headers: { 'Content-Type': 'application/json' },
   ```
3. Add your key:
   ```js
   headers: {
     'Content-Type': 'application/json',
     'x-api-key': 'YOUR_API_KEY_HERE',
     'anthropic-version': '2023-06-01',
   },
   ```

> ⚠️ **Never commit your API key to GitHub.** Use environment variables or a backend proxy for production use.

---

## ➕ Adding a New Airline

1. Open `src/airlines.js` and add an entry:
```js
"WestJet": {
  windowHrs: 24,
  baseUrl: "https://www.westjet.com/en-ca/check-in",
  deepUrl: "https://www.westjet.com/en-ca/check-in",
  note: "Optional tip shown in the UI",
},
```

2. Add a matching `<option>` in `index.html`:
```html
<option value="WestJet|https://www.westjet.com/en-ca/check-in|24|https://www.westjet.com/en-ca/check-in">
  WestJet
</option>
```

---

## 💡 Why Can't It Check In Fully Automatically?

Airlines intentionally block automated check-in from third-party apps:
- Their sites use CAPTCHAs and bot detection
- Login requires your airline account password (which this app does not store)
- Their APIs are private and not publicly accessible

This app gets you to the finish line in **one click** at exactly the right moment — which is the maximum possible without violating airline terms of service.

---

## 🛠 Tech Stack

- **Vanilla HTML/CSS/JS** — zero build tools, zero dependencies
- **Web Audio API** — for the alarm chime
- **Notifications API** — for browser pop-ups
- **Anthropic Claude API** — for the AI flight assistant
- **Tabler Icons** — icon font via CDN

---

## 🤝 Contributing

Pull requests welcome! Ideas for contributions:
- Add more airlines with correct check-in windows
- Add email reminder support (e.g. via a small serverless function)
- Persist flight data in `localStorage`
- Add a PWA manifest so it installs on mobile

---

## 📄 License

MIT — free to use, modify, and share.

---

Built with ❤️ and the [Anthropic Claude API](https://www.anthropic.com).
