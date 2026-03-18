# Grover - A Smart Agricultural Management System

![Project Status](https://img.shields.io/badge/status-complete-success) ![License](https://img.shields.io/badge/license-MIT-blue.svg)

Grover is an intelligent, full-stack web application designed to streamline and modernize farm operations. In modern agriculture, efficient coordination between managers and field personnel is crucial for maximizing productivity. This project was built to solve that challenge by providing a centralized platform with distinct, role-based interfaces for every member of the farm team.

From a manager's high-level overview to a worker's specific daily tasks, Grover ensures that everyone has the right tools and information to do their job effectively.

---

## ✨ Key Features

The application is built around a secure, role-based access control (RBAC) system that provides a unique experience for each user type.

### For Managers (The Command Center)
The Manager has full administrative control and a data-driven dashboard to oversee all farm activities at a glance.
-   **📊 Data-Driven Dashboard:** View real-time statistics on total crops, active tasks, and low-stock inventory items.
-   **🌱 Full Crop Management (CRUD):** Add, view, edit, and delete all crop records, including planting and harvest dates.
-   **📋 Full Task Management (CRUD):** Create new tasks, delegate them to specific Farmers or Workers, link them to crops, and monitor their status.
-   **📦 Full Inventory Management (CRUD):** Track all farm supplies like seeds, fertilizers, and tools, with an automatic "Low Stock" indicator.
-   **📝 View Field Reports:** Review all Field Logs submitted by Farmers and Completion Notes left by Workers to get on-the-ground insights.

### For Farmers (The Proactive Field Operator)
The Farmer has a functional workspace to manage their responsibilities and act as the eyes and ears of the farm.
-   **📝 Personalized Task List:** View a clean list of tasks assigned specifically to them.
-   **🔄 Real-Time Status Updates:** Update the status of their tasks (`Pending`, `In Progress`, `Completed`) to provide live feedback to the manager.
-   **🔎 Submit Field Logs:** A dedicated form to report detailed observations about specific crops (e.g., pest sightings, growth updates, irrigation issues).
-   **👀 View-Only Inventory:** Check the availability of farm supplies and resources.

### For Workers (The Efficient Task Executor)
The Worker's interface is designed for maximum simplicity and efficiency, focusing purely on task execution.
-   **✅ Simplified Task View:** See a clear list of only their active (non-completed) tasks.
-   **▶️ "Start Task" Workflow:** A clear two-step process to officially start a task (changing its status to 'In Progress') and then mark it as complete.
-   **🗒️ Add Completion Notes:** An option to add a quick, simple note when finishing a task to report any issues or feedback.

### Core System Features
-   **☀️ Live Weather API:** A dedicated page that provides real-time weather data for any city, helping with daily planning.
-   **🔐 Secure Authentication:** Full user registration and login system using JWT (JSON Web Tokens) and hashed passwords (bcrypt).
-   **🛡️ Multi-Layered Security:** The system is protected at both the frontend (Route Guards) and backend (API Middleware) levels, ensuring users can only access data and perform actions appropriate for their role.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | Angular, Reactive Forms, TypeScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (with Mongoose & MongoDB Atlas) |
| **Authentication**| JWT (JSON Web Tokens), bcrypt |
| **Testing** | Jest, Supertest, MongoDB-Memory-Server |

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites
-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [Angular CLI](https://angular.io/cli) installed globally (`npm install -g @angular/cli`)
-   A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account

### Installation Guide

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dharanesh-vn/grover.git
    cd grover
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    npm install
    ```
    -   Create a `.env` file in the `backend` directory.
    -   Add your MongoDB Atlas connection string and create a JWT secret.

    **.env file structure:**
    ```
    MONGO_URI=mongodb+srv://<username>:<password>@yourcluster.mongodb.net/?appName=grover
    PORT=5000
    JWT_SECRET=your_super_secret_key_here
    WEATHER_API_KEY=your_openweathermap_api_key_here
    ```

3.  **Setup the Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

You will need two separate terminals to run both the frontend and backend servers.

1.  **Run the Backend Server:**
    ```bash
    cd backend
    npm start
    ```
    The server will be running on `http://localhost:5000`.

2.  **Run the Frontend Application:**
    ```bash
    cd frontend
    ng serve
    ```
    The application will be available at `http://localhost:4200`.

---

## 🧪 Automated Testing

This project includes a comprehensive automated test suite for the backend to ensure the reliability of all authentication and business logic.

### Running the Tests
To run the entire test suite, navigate to the backend directory and run:
```bash
npm test
