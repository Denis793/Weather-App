# 🌦️ Weather App

<p align="center">
  <a href="weather-app-lovat-eight-46.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/View%20Project-Click%20Here-blue?style=for-the-badge" alt="View Project">
  </a>
</p>

---

## 🖼️ Screenshot

<div align="center">
  <img src="https://github.com/Denis793/Store/blob/main/src/img/screens/screen-1.png" alt="View click" height="auto" width="100%">
  <img src="https://github.com/Denis793/Store/blob/main/src/img/screens/screen-2.png" alt="View click" height="auto" width="100%">
  <img src="https://github.com/Denis793/Store/blob/main/src/img/screens/screen-3.png" alt="View click" height="auto" width="100%">
  <img src="https://github.com/Denis793/Store/blob/main/src/img/screens/screen-4.png" alt="View click" height="auto" width="100%">
  <img src="https://github.com/Denis793/Store/blob/main/src/img/screens/screen-5.png" alt="View click" height="auto" width="100%">
</div>
---

## 📖 Description

This project --- **Weather App**, is a responsive web application for
displaying current weather and forecasts.\
It provides detailed weather insights such as:

- 🌡️ Current temperature, min/max, feels like
- 🌤️ Dynamic weather icons & backgrounds (day/night)
- 💨 Wind speed & direction
- 💧 Humidity, pressure, visibility
- 🌧️ Precipitation probability & amount
- 📅 5-day forecast with detailed daily stats

---

## 🚀 Technologies

- **React** --- UI building
- **TypeScript** --- type safety
- **Vite** --- project bundling
- **Tailwind CSS + Shadcn UI** --- styling & UI components
- **Radix UI** --- accessibility & primitives
- **OpenWeather API** --- weather data
- **Context API / Hooks** --- state management
- **Node.js + npm** --- runtime & package manager

---

## 📂 Structure

    src/
    │── app/               # App entry, global providers
    │── entities/          # Business logic (weather model, queries)
    │── features/          # Reusable features (search-city, etc.)
    │── widgets/           # UI widgets (NowCard, ForecastCard, Backdrop)
    │── pages/             # Pages (Now, Forecast)
    │── shared/            # Shared libs, utils, assets (icons, backdrops)
    │── styles/            # Global styles & Tailwind config

---

## ⚙️ Features

- 🌦️ Real-time weather data
- 🌞 Dynamic day/night backgrounds & icons
- 📊 Daily aggregated statistics (min/max temp, humidity, wind,
  clouds, precipitation)
- 📅 Weekly forecast (selectable days)
- 🔎 City search (OpenWeather geolocation API)
- 📱 Responsive design (mobile-first)

---

## ▶️ Getting Started

```bash
git clone https://github.com/Denis793/weather-fsd.git
cd weather-fsd
npm install
npm run dev
```

---

## 📜 License

This project is available under the **MIT** license.
