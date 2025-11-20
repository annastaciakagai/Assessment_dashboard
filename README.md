
# CRM Opportunity Dashboard
A full-stack dashboard assessment application that authenticates with a backend API to visualize opportunity data through heatmaps, bar charts, and KPI metrics.

## 🚀 Features

  * **Authentication:** Secure login using JWT (Bearer Token).
  * **Visualizations:**
      * **Heatmap:** Breakdown of opportunities by Day vs. Hour.
      * **Bar Charts:** Aggregated metrics by Source and Stage.
      * **KPI Cards:** Summary of Total Opportunities, Average Score, and Conversion Rates.
  * **Robust Error Handling:** Includes a **Mock Data Fallback** system to ensure the dashboard remains functional even if the backend enters "Cold Start" (503) mode.
  * **Responsive UI:** Built with a mobile-first approach using Tailwind CSS.

## 🛠️ Tech Stack

  * **Framework:** React (Vite)
  * **Styling:** Tailwind CSS
  * **UI Components:** shadcn/ui
  * **Charts:** Recharts
  * **Data Fetching:** Axios
  * **Package Manager:** pnpm

## ⚙️ Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd client
    ```

2.  **Install dependencies**

    ```bash
    pnpm install
    ```

3.  **Start the development server**

    ```bash
    pnpm run dev
    ```

4.  **Open the app**
    Visit `http://localhost:5173` in your browser.

## 🔑 Login Credentials

Use your own credentials to test the application:

  * **Email:** ``
  * **Password:** ``

## 📝 Developer Notes

### 1\. CORS & Proxy Configuration

To handle CORS issues during local development, a proxy is configured in `vite.config.js`. API requests directed to `/api` are forwarded to the backend server.

### 2\. Mock Data Fallback

The backend is hosted on a free-tier service that may sleep (return 503) after inactivity.

  * **Logic:** If the login or data fetch fails due to a 503 error, the application automatically switches to **Dev Mode**, loading data from `mockdata.json`.
  * This ensures the UI can always be reviewed, regardless of server status.

### 3\. Data Assumptions

  * **Source Field:** The provided API data was missing a `source` field. The application falls back to using `type` or grouping by `Unknown` to ensure the "Opportunities by Source" chart renders without crashing.
  * **Score:** Defaulted to 0 if missing in the API response.