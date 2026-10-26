# 🌱 AgriTech — Smart Farm OS & Agricultural Management System

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**AgriTech** is a full-stack MERN application engineered to provide farmers and agricultural cooperatives with an intuitive, unified digital platform. It combines GPS plot tracking, crop lifecycle logging, rule-based soil health scoring, 7-day hyperlocal weather forecasting, an agricultural supplies marketplace, and a community advisory forum.

---

## 🌟 Key Features

### 🚜 1. Farm & Plot Management
- **GPS Coordinates & Geolocation:** Automatic browser location detection or manual coordinate input with precision latitude and longitude.
- **Acreage & Soil Profiling:** Track individual plot boundaries, land sizes in acres, and primary soil types (*alluvial, black, red, laterite, sandy, loamy*).
- **Multi-Farm Organization:** Manage multiple plots and fields under a unified account.

### 🌾 2. Crop Tracking & Automated Soil Health Analysis
- **Lifecycle Monitoring:** Record planting cycles with sowing dates and mark stages (*growing, harvested, failed*).
- **Rule-Based Soil Diagnostics:** Input laboratory or sensor test parameters (pH, Nitrogen, Phosphorus, Potassium, Organic Carbon %, Moisture %) to compute automated soil ratings (*Good / Fair / Poor*) and receive customized fertilizer recommendations.
- **Field Activity Timeline:** Chronological timeline log for daily field interventions (irrigation, spraying, fertilizing, weeding).

### ☀️ 3. Hyperlocal Weather & Environmental Risk Forecast
- **Open-Meteo Integration:** Free, real-time agrometeorological projections requiring **no third-party API keys**.
- **Interactive Data Visualizations:** Recharts temperature trend lines (highs & lows) and daily precipitation bar charts.
- **Automated Weather & Pest Warnings:** Real-time threshold alerts for frost risk, extreme heat waves, continuous heavy downpours, and high-humidity pest incubation conditions.

### 🛒 4. Agricultural Inputs Marketplace
- **Resource Catalog:** Browse certified seeds, bio-fertilizers, crop protection chemicals, and equipment with stock indicators.
- **Smart Cart & Checkout:** Quantity stepper controls, itemized order summaries, address verification, and automated order total calculation.
- **Order Lifecycle Tracking:** Real-time status badges for orders (*placed → approved → shipped → delivered → cancelled*).

### 💬 5. Farmer Community & Agronomy Advisory
- **Peer Discussion Forum:** Exchange field experiences, harvest updates, and local agronomic tips.
- **Ask an Expert:** Direct consultation channel for crop disease diagnoses and remediation advice from certified experts.
- **Official Pest Advisories:** High-visibility bulletins broadcasted by verified administrators and agricultural specialists.

### 🛡️ 6. Administrator Control Center
- **Operational Metrics:** Real-time summary tiles for total users, active farms, recorded crops, fulfilled orders, and revenue generated.
- **Order Fulfillment Pipeline:** Approve, ship, and update order statuses across all customers.
- **Catalog & User Management:** Add new agricultural inputs with stock quantities, manage farmer profiles, and safeguard role-based access.

### 🌐 7. Multilingual Support
- Seamless client-side language switching between **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)** with fallback handling.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Bootstrap 5.3, Recharts, Custom SVG Icon System |
| **Backend** | Node.js, Express.js 4, Mongoose 8, JSON Web Tokens (JWT), Bcrypt.js |
| **Database** | MongoDB (Local or MongoDB Atlas) |
| **Weather API** | Open-Meteo API (Open Agrometeorology, No API Key Required) |
| **Security** | Helmet, CORS, Express Rate Limit, Parameter Sanitization |
| **DevOps** | Docker, Docker Compose, Render (`render.yaml`) |

---

## 📂 Project Architecture

```
AgriTech/
├── client/                     # React Frontend Application
│   ├── public/                 # HTML shell and public static assets
│   └── src/
│       ├── components/         # Reusable SVG Icons and UI primitives
│       ├── pages/              # Application views
│       │   ├── Admin.js        # Admin operations and fulfillment
│       │   ├── Auth.js         # Sign-in and registration
│       │   ├── Community.js    # Forum, Ask Expert, & Pest alerts
│       │   ├── Crops.js        # Crop tracking & soil evaluation
│       │   ├── Dashboard.js    # Metric overview & quick actions
│       │   ├── Farms.js        # Farm properties & GPS mapping
│       │   ├── Market.js       # Inputs marketplace & cart
│       │   └── Weather.js      # 7-day forecast & weather charts
│       ├── api.js              # Axios instance & token interceptor
│       ├── auth.js             # React Context for authentication
│       ├── i18n.js             # Internationalization dictionaries
│       ├── styles.css          # Modern agricultural design system
│       └── App.js              # Main layout, shell, & route switch
│
├── server/                     # Express.js REST API
│   ├── middleware/             # Auth JWT verification & role authorization
│   ├── models/                 # Mongoose schemas (User, Farm, Crop, etc.)
│   ├── routes/                 # REST endpoints (auth, farms, crops, etc.)
│   ├── utils/                  # Soil health rules & weather processors
│   └── server.js               # Express application entry & seed logic
│
├── docker-compose.yml          # Container configuration for App + Mongo
├── Dockerfile                  # Multi-stage production container build
├── package.json                # Root workspace orchestration scripts
└── render.yaml                 # Infrastructure-as-code blueprint for Render
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Locally installed instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI

---

### Step-by-Step Local Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/agritech.git
cd agritech
```

#### 2. Configure Environment Variables
Create a `.env` file in the `server` directory from the sample file:
```bash
cp server/.env.example server/.env
```
Update `server/.env` with your desired configuration:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/agritech
JWT_SECRET=super-secure-random-jwt-key-change-in-production
ADMIN_EMAIL=admin@agritech.local
ADMIN_PASSWORD=Admin@12345
CLIENT_URL=http://localhost:3000
```

> **Note:** The server automatically provisions an administrative user on its first launch using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in your environment variables.

#### 3. Install Dependencies
Install all packages across root, backend, and frontend with a single command:
```bash
npm run install:all
```

#### 4. Run Development Servers
Open two terminal windows:

- **Terminal 1 (Backend API):**
  ```bash
  npm run dev:server
  ```
  *Runs Express with Nodemon on [http://localhost:5000](http://localhost:5000)*

- **Terminal 2 (Frontend Client):**
  ```bash
  npm run dev:client
  ```
  *Runs React development server on [http://localhost:3000](http://localhost:3000)*

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

To spin up both the application and a dedicated MongoDB container simultaneously:

```bash
docker compose up --build
```

Access the application at [http://localhost:5000](http://localhost:5000). The container builds the React production bundle and serves it directly through Express.

To stop the containers:
```bash
docker compose down
```

---

## ☁️ Cloud Deployment (Render / Railway / PaaS)

This project is configured as a monolithic deployment where Express serves the static React build, eliminating CORS configuration in production:

1. **Build Command:**
   ```bash
   npm run install:all && npm run build
   ```
2. **Start Command:**
   ```bash
   node server/server.js
   ```
3. **Environment Variables:**
   - `NODE_ENV=production`
   - `MONGO_URI` (from MongoDB Atlas)
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

A pre-configured [`render.yaml`](render.yaml) is included in the root directory for automated blueprint deployments.

---

## 📡 REST API Reference

All API routes are served under `/api` and require an HTTP header for protected resources:
`Authorization: Bearer <JWT_TOKEN>`

### Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new farmer account | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |

### Farms & Crops
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/farms` | List user's farms | Private |
| `POST` | `/api/farms` | Create a new farm plot | Private |
| `PUT` | `/api/farms/:id` | Update farm details | Private |
| `DELETE` | `/api/farms/:id` | Remove farm and associated crops | Private |
| `GET` | `/api/crops` | List user's crops with soil scores | Private |
| `POST` | `/api/crops` | Record new crop & soil test | Private |
| `PUT` | `/api/crops/:id` | Update status (growing/harvested) | Private |
| `POST` | `/api/crops/:id/logs` | Append field activity log entry | Private |
| `DELETE` | `/api/crops/:id` | Delete crop record | Private |

### Weather & Intelligence
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/weather/:farmId` | 7-day forecast, metrics, & hazard alerts | Private |

### Marketplace & Orders
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/resources` | List all available farming inputs | Private |
| `POST` | `/api/resources` | Create an inventory resource | Admin |
| `DELETE` | `/api/resources/:id` | Delete resource from catalog | Admin |
| `GET` | `/api/orders` | List user orders (or all if admin) | Private |
| `POST` | `/api/orders` | Place a marketplace order | Private |
| `PATCH`| `/api/orders/:id/status`| Update order fulfillment status | Admin |

### Community & Expert Advisory
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts?type=` | List posts by channel (`forum`,`consult`,`pestAlert`) | Private |
| `POST` | `/api/posts` | Create new post (pest alerts restricted to Admin) | Private |
| `POST` | `/api/posts/:id/replies`| Post a reply in a discussion thread | Private |
| `DELETE` | `/api/posts/:id` | Delete post (author or admin) | Private |

### Administration
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Aggregated counts & revenue totals | Admin |
| `GET` | `/api/admin/users` | List all registered user accounts | Admin |
| `DELETE` | `/api/admin/users/:id` | Delete user and wipe their data | Admin |

---

## 🔒 Security & Architecture Notes

- **Password Hashing:** Passwords are salted and hashed using `bcryptjs` with an adaptive work factor.
- **Route Guarding:** Public registration exclusively creates standard farmer accounts; administrative access is restricted to verified roles server-side.
- **Rate Limiting:** Protects authentication and critical endpoints from brute-force attempts via `express-rate-limit`.
- **HTTP Header Hardening:** Integrates `helmet` for secure HTTP headers.
- **Accessible UI:** Contrast-tested colors, semantic HTML, full keyboard navigation support, and reduced-motion media query compliance.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
