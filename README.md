# ApnaManager- Frontend Application

This is the official frontend for the ApnaManager platform, a comprehensive guest management system. It's a modern React application built with Vite that provides a user-friendly interface for Admins, Hotel Staff, and Police Officials.

## Core Features

  * **Role-Based UI:** The application presents a completely different user interface and layout depending on the logged-in user's role (Admin, Hotel, or Police).
  * **Secure & Persistent Login:** Uses JWT for authentication and stores the session in `localStorage` to keep users logged in across browser sessions.
  * **Dynamic & Responsive:** Built with responsive design principles and enhanced with smooth page transitions and animations using `framer-motion`.
  * **Centralized API Client:** All API communication is handled through a centralized Axios instance, which automatically attaches the authentication token to requests.
  * **Rich User Feedback:** Provides clear, non-blocking notifications for all user actions (success, error, loading) using `react-hot-toast`.

## Technology Stack

\<div align="center"\>

\<img src="[https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge\&logo=react](https://www.google.com/search?q=https://img.shields.io/badge/React-18-61DAFB%3Fstyle%3Dfor-the-badge%26logo%3Dreact)" alt="React" /\>
\<img src="[https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge\&logo=vite](https://www.google.com/search?q=https://img.shields.io/badge/Vite-5.x-646CFF%3Fstyle%3Dfor-the-badge%26logo%3Dvite)" alt="Vite" /\>
\<img src="[https://img.shields.io/badge/React\_Router-6-CA4245?style=for-the-badge\&logo=reactrouter](https://www.google.com/search?q=https://img.shields.io/badge/React_Router-6-CA4245%3Fstyle%3Dfor-the-badge%26logo%3Dreactrouter)" alt="React Router" /\>
\<img src="[https://img.shields.io/badge/Axios-API\_Client-5A29E4?style=for-the-badge\&logo=axios](https://www.google.com/search?q=https://img.shields.io/badge/Axios-API_Client-5A29E4%3Fstyle%3Dfor-the-badge%26logo%3Daxios)" alt="Axios" /\>
\<img src="[https://img.shields.io/badge/CSS-Modules-000000?style=for-the-badge\&logo=css3](https://www.google.com/search?q=https://img.shields.io/badge/CSS-Modules-000000%3Fstyle%3Dfor-the-badge%26logo%3Dcss3)" alt="CSS Modules" /\>

\</div\>

-----

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

  * Node.js (v18.x or later)
  * A running instance of the [GuestGuard Backend API](https://www.google.com/search?q=https://github.com/uttkarshnjr10/guestguard-backend).

### Installation

1.  **Clone the repository:**

    ```sh
    git clone <https://github.com/uttkarshnjr10/Guest-Guard.git>
    cd <Guest-Guard>
    ```

2.  **Install NPM packages:**

    ```sh
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in the root of the project and add the URL for your running backend API.

    ```ini
    VITE_API_BASE_URL=http://localhost:5003
    ```

4.  **Run the Development Server:**

    ```sh
    npm run dev
    ```

The application will now be running and accessible at `http://localhost:5173` (or another port if 5173 is in use).