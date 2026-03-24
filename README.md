#  Grover: Enterprise-Grade Agricultural Management Platform

Grover is a robust, full-stack Farm Management System (FMS) designed to optimize crop lifecycles, resource allocation, and workforce orchestration. It bridges the gap between high-level strategic planning and granular field execution through a sophisticated role-based ecosystem.

---

##  1. Project Description
**Grover** solves the coordination challenges faced by modern large-scale farms. By providing specialized interfaces for Admins, Agronomists, and Operators, it ensures that data flows seamlessly from the office to the field and back. 

### Real-World Use Cases:
- **Precision Task Delegation:** Admins assign irrigation tasks based on agronomist reports.
- **Scientific Field Monitoring:** Agronomists log pest sightings tied to specific crop batches for immediate intervention.
- **Inventory Predictive Maintenance:** Systems alert admins when fertilizer levels drop below the threshold required for the next planting season.

---

##  2. Features
- **Strict Role-Based Access Control (RBAC):** Improved dynamic sidebar that only displays sections reachable by the authenticated role.
- **Modern UI Suite:** Integrated **Lucide Icons** and ultra-modern glassmorphism design.
- **Crop Lifecycle Management:** Complete tracking from planting to harvest.
- **Dynamic Task Orchestration:** Real-time task assignment with status tracking and completion audits.
- **Inventory & Resource Guard:** Automated low-stock alerts and categorization.
- **Field Scouting Logs:** Rich observation reports with categorical filtering.
- **Geospatial Weather Insight:** Live weather mapping for strategic activity windows.
- **High-Polished UI:** Glassmorphism, modern typography (Outfit), and a professional Deep Forest theme.

---

##  3. Tech Stack

###  Critical for AI & Developer Understanding
- **Frontend:** Angular 16+ (Standalone Architecture, RxJS, Reactive Forms)
- **Backend:** Node.js v18+, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Security:** JSON Web Tokens (JWT), Bcrypt password hashing
- **Styling:** Vanilla CSS3 with Custom Properties (CSS Variables)
- **APIs:** OpenWeatherMap API integration

---

##  4. Installation

### Prerequisites
- **Node.js:** v18.16.0 or higher
- **npm:** v9.x or higher
- **Angular CLI:** `npm install -g @angular/cli`
- **MongoDB:** A running instance (local or Atlas)

### Setup Steps
1. **Clone the Project:**
   ```bash
   git clone https://github.com/dharanesh-vn/grover.git
   cd grover
   ```
2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

---

##  5. Usage

### Launching the Application
1. **Start the Backend:**
   In the `backend` folder:
   ```bash
   npm start
   ```
   *The server runs on `http://localhost:5000`.*

2. **Start the Frontend:**
   In a new terminal, in the `frontend` folder:
   ```bash
   ng serve
   ```
   *The UI is available at `http://localhost:4200`.*

### Example Workflow
1. **Register** as a Farm Admin.
2. **Create a Crop** (e.g., "Paddy Field A").
3. **Assign a Task** to an Operator (e.g., "Harvest Field B").
4. **Log an Observation** as an Agronomist regarding soil moisture.

---

##  6. Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_unique_key
WEATHER_API_KEY=your_openweathermap_32_char_key
```

---

##  7. Project Structure

###  Critical for AI Comprehension
```text
grover/
├── backend/
│   ├── controllers/    # Business logic (Task, Crop, User, Weather)
│   ├── models/         # Mongoose Schemas (User, Crop, Task, Inventory, FieldLog)
│   ├── routes/         # API Endpoint definitions
│   ├── middleware/     # Auth and Permission guards
│   └── server.js       # Entry point
├── frontend/
│   └── src/app/
│       ├── pages/      # Dashboards and management views
│       ├── services/   # API communication logic
│       ├── guards/     # Frontend RBAC (Admin, Agronomist, Operator)
│       └── layouts/    # Structural app shells
└── README.md
```

---

##  8. Architecture Overview

### High-Level Design
Grover follows a **Stateless Decoupled Architecture**. The Angular frontend communicates with the Node.js backend solely through a secure REST API.

### Data Flow Breakdown
1. **Auth:** User logs in → Backend issues JWT → Frontend stores JWT in LocalStorage.
2. **Requests:** Frontend includes JWT in `Authorization` header for all protected routes.
3. **Validation:** Backend `protect` middleware verifies JWT → `isRole` middleware checks permissions → Controller handles logic.
4. **Persistence:** Mongoose interacts with MongoDB to save/retrieve state.

---

##  9. Core Concepts / Domain Logic

###  The "Business Rules"
- **User Hierarchy:** Admins can see/do everything. Agronomists focus on scouting and data. Operators focus on task execution.
- **Task Lifecycle:** `Pending` → `In Progress` → `Completed`. Completion requires an optional audit note from the operator.
- **Inventory Thresholds:** Items highlight in the UI when `quantity <= lowStockThreshold`.
- **Field Logs:** Observations are linked to specific User IDs and Crop IDs to create a historical timeline of a field's health.

---

##  10. API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate and get token

### Core Management (Admin Only)
- `GET /api/users` - List project workforce
- `POST /api/crops` - Initialize new crop cycle
- `POST /api/tasks` - Dispatch work to field

### Field Interactions
- `GET /api/weather?city=Chennai` - Fetch live locational data
- `POST /api/fieldlogs` - Submit agricultural observations

---

##  11. Data Models / Schema

### User Object
```javascript
{
  name: String,
  email: String (unique),
  role: Enum['Admin', 'Agronomist', 'Operator'],
  phone: String
}
```

### Task Object
```javascript
{
  taskDescription: String,
  assignedTo: ObjectId(User),
  cropId: ObjectId(Crop),
  status: Enum['Pending', 'In Progress', 'Completed'],
  dueDate: Date,
  completionNote: String
}
```

---

##  12. Dependencies & External Services
- **OpenWeatherMap API:** Used for real-time field weather condition tracking.
- **Axios:** Backend HTTP client for API communication.
- **Express-CORS:** Cross-origin resource sharing for frontend integration.
- **BcryptJS:** Industrial-standard password encryption.

---

##  13. Known Limitations / Assumptions
- **Weather API:** Requires a valid 32-character OpenWeatherMap key. If the key is invalid, the system falls back to professional mock data to maintain dashboard integrity during demos.
- **Concurrency:** Designed for standard farm operations; not optimized for sub-millisecond high-frequency trading of commodities.
- **Storage:** Images for crops or inventory are currently handled as text/links; direct binary upload is planned for the v2 roadmap.



