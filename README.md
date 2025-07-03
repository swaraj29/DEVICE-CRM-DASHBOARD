# Device CRM + Inventory Management Dashboard

A full-featured admin dashboard to manage medical device inventories, track installations, service visits, AMC/CMC contract lifecycles, and maintain facility-specific CRM histories—including training, feedback, and photo documentation.

**Live Demo:**  
Frontend: [https://device-crm-dashboard.vercel.app/](https://device-crm-dashboard.vercel.app/)  
Backend: [https://device-crm-api.onrender.com](https://device-crm-api.onrender.com)

**GitHub Repositories:**  
- Frontend: [https://github.com/swaraj29/DEVICE-CRM-DASHBOARD](https://github.com/swaraj29/DEVICE-CRM-DASHBOARD)  
- Backend: [https://github.com/swaraj29/device-crm-api](https://github.com/swaraj29/device-crm-api)

---

## Screenshots

| Dashboard (Light) | Dashboard (Dark) |
|:----------------:|:----------------:|
| ![Dashboard Light](./public/screenshot-light.png) | ![Dashboard Dark](./public/screenshot-dark.png) |

> _Add your own screenshots to the `public/` folder and update the filenames above if needed._

---

## Features

- **Device Inventory Dashboard:**  
  View all devices with type, ID, facility, status (Online/Offline/Maintenance), battery %, last service/installation date, and AMC/CMC status.
- **Installation & Training Module:**  
  Log new installations, upload unboxing photos, complete checklists, submit training forms, and track completion status.
- **Service Visit Logs:**  
  Log field visits with notes, date, responsible engineer, purpose (Preventive/Breakdown), and attachments (photos, PDFs).
- **AMC/CMC Tracker:**  
  Track devices with AMC/CMC contract details, view upcoming expiries, and export reports to CSV.
- **Alerts & Photo Logs:**  
  Upload photos of device condition and handle alerts for issues during installation or maintenance.
- **Theme Switcher:**  
  Seamless light/dark mode with smooth transitions and accessible color schemes.
- **Export Reports:**  
  Export AMC/CMC and device data to CSV.

---

## Tech Stack

- **Frontend:** ReactJS, Redux, Material UI, SCSS Modules
- **State Management:** Redux Toolkit
- **Styling:** Material UI + CSS Variables for theme support, SCSS modules
- **Mock API:** json-server or localStorage (for demo/testing)
- **Build Tool:** Vite

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
git clone https://github.com/yourusername/device-crm-dashboard.git
cd device-crm-dashboard
npm install
```

### Running Locally
```bash
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

### Build for Production
```bash
npm run build
```

---

## Project Structure

```
/ (root)
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── alerts.js
│   │   ├── apiConfig.js
│   │   ├── contracts.js
│   │   ├── devices.js
│   │   ├── installations.js
│   │   └── services.js
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── AMCContracts/
│   │   │   ├── AMCContracts.jsx
│   │   │   └── AMCContracts.scss
│   │   ├── Alerts/
│   │   │   ├── Alerts.jsx
│   │   │   └── Alerts.scss
│   │   ├── Dashboard/
│   │   │   └── DeviceTable.jsx
│   │   ├── Installations/
│   │   │   └── InstallationForm.jsx
│   │   ├── Services/
│   │   │   └── ServiceVisitForm.jsx
│   │   └── Shared/
│   │       ├── Sidebar.jsx
│   │       ├── Topbar.jsx
│   │       └── Topbar.module.scss
│   ├── containers/
│   │   ├── AMCContracts.jsx
│   │   ├── Alerts.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Installations.jsx
│   │   └── Services.jsx
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── redux/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── alertSlice.js
│   │       ├── contractSlice.js
│   │       ├── deviceSlice.js
│   │       ├── installationSlice.js
│   │       └── serviceSlice.js
│   ├── utils/
│   │   └── exportToCSV.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vercel.json
├── vite.config.js
```

- `src/components/` — Modular, reusable UI components (forms, tables, cards, etc.)
- `src/containers/` — Page-level containers for each module
- `src/redux/` — Redux store and slices for device, facility, service, contract, and alert data
- `src/api/` — API utilities for CRUD operations (can be swapped for real or mock backend)
- `src/utils/` — Utility functions (CSV export, validation, etc.)
- `src/context/` — React context for theming
- `src/assets/` — Static assets (SVGs, images)

---

## Key Modules
1. **Device Inventory Dashboard**
2. **Installation & Training**
3. **Service Visit Logs**
4. **AMC/CMC Tracker**
5. **Alerts & Photo Logs**

Each module supports full CRUD operations, file uploads, and is fully responsive.

---

## Theming
- Uses CSS variables, SCSS modules, and Material UI theme palette for seamless light/dark switching.
- All major UI elements are accessible and visually consistent in both themes.
- Fully mobile responsive: works great on phones, tablets, and desktops.

---

## Deployment
- **Frontend:** Deployed on Vercel — [https://device-crm-dashboard.vercel.app/](https://device-crm-dashboard.vercel.app/)
- **Backend:** [https://device-crm-api.onrender.com](https://device-crm-api.onrender.com)

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE)

---
