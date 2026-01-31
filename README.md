# MyFinance – Personal Wealth Tracker

## 📌 Project Overview
**MyFinance** is a Single Page Application (SPA) designed as a prototype for tracking personal income and expenses. This Phase 1 build focuses on establishing core UI/UX patterns, state management architecture, and basic data persistence.

Developed as a university project for the **Bachelor in Software Engineering (Honours)** program at **Wawasan Open University**.

## 🚀 Current Implementation Status (Phase 1)
The following modules are currently implemented as functional prototypes:

* **Authentication (Logic Only)**: Provides a gateway with **Regex-based** validation for strict password complexity (Upper/Lower/Special/6+ chars).
* **Dashboard (Mock Data + Reactive)**: Displays balance and spending summaries. While the budget alert logic is implemented in the code, visual budget management is currently handled via default values.
* **Transaction Entry (CRUD WIP)**: Basic Add/Edit functionality is established. The form uses **TypeScript** to ensure numerical data integrity.
* **Category Manager**: A dedicated interface for customizing the list of expense categories, supporting persistent storage across refreshes.
* **Visual Reports**: Integration of **Chart.js** to visualize current transaction datasets via Pie and Bar charts.
* **Local Persistence**: All data currently resides in **Browser LocalStorage**, providing a serverless experience for testing.

## 🛠️ Tech Stack
* **Framework**: Vue 3 (Vite)
* **State Management**: Pinia
* **Language**: TypeScript
* **Visualization**: Chart.js / vue-chartjs
* **Persistence**: LocalStorage (Prototype storage)

## 📦 Local Setup
1. **Clone the repository**:
   ```bash
   git clone [https://github.com/your-username/my-finance-app.git](https://github.com/your-username/my-finance-app.git](https://github.com/TJHong28/personal-finance-tracker.git)

2. **Install dependencies**:
   ```bash
   npm install

3. **Run in development mode**:
    ```bash
    npm run dev

## 🏗️ Technical Architecture
The system utilizes the MVVM pattern to decouple the logic from the interface, specifically to allow for an easy transition to a cloud backend (like Firebase) in future phases without rewriting UI components.
    
