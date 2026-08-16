# Uniform Inventory Management System

A comprehensive web application designed to manage, track, and streamline the distribution of employee uniforms and protective gear across multiple branches and departments.

## 🚀 Key Features

- **Stock Tracking**: Monitor uniform inventory levels by sizes, categories, and locations.
- **Assignment Tracking**: Record and manage uniform assignments to individual employees.
- **Role-Based Dashboards**: Customized views and functionalities for Administrators, Storekeepers, and Standard Users.
- **Reporting & Analytics**: Generate detailed reports on uniform usage, stock alerts, and historical data.
- **Responsive Design**: Accessible from any device, ensuring warehouse staff can update records on the go.

## 🛠 Tech Stack

- **Frontend**: React.js, React Router
- **Styling**: Modern CSS with CSS Variables for theming
- **Database**: Firebase (Firestore)
- **Authentication**: Firebase Auth

## 📂 Project Structure

- `src/components/`: Reusable interface components (Sidebars, Modals, Data Tables).
- `src/pages/`: Main application routes and views.
- `src/styles/`: Global stylesheets and CSS modules.
- `src/utils/`: Helper functions for PDF generation, CSV exports, and data validation.

## ⚙️ Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ChemaMtz/Uniform-Inventory-System.git
   cd Uniform-Inventory-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

## 📄 License
This project is available under the [MIT License](LICENSE).
