# Adaptive Web Interaction

## Overview

"Adaptive Web Interaction" is a Final Year Project (FYP) focused on creating an intelligent, AI-powered Chrome Extension that lets users interact with websites using NLP. The core objective is to improve web accessibility and boost productivity by enabling natural language-based control and automation of web tasks.

---

## Project Structure

This repository is organized into two main folders:

* **`frontend/`**: Contains all the code for the Chrome Web Extension.
* **`backend/`**: Houses the Node.js server responsible for handling API calls.
---

## Getting Started

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* A web browser

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/adaptive-web-interaction.git](https://github.com/your-username/adaptive-web-interaction.git)
    cd adaptive-web-interaction
    ```

2.  **Backend Setup:**
    Navigate to the `backend` folder and install dependencies:
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add your Google API Key:
    ```
    GOOGLE_API_KEY=your_google_api_key_here
    ```
    Replace `your_google_api_key_here` with your actual Google API Key.


### Running the Project

1.  **Start the Backend Server:**
    From the `backend` directory:
    ```bash
    node server.js
    ```
    This will typically start the server on `http://localhost:3000`

2.  **Load the Chrome Extension:**
    * Open Google Chrome and go to `chrome://extensions`.
    * Enable **Developer mode** using the toggle in the top right corner.
    * Click on **Load unpacked**.
    * Navigate to the `frontend` folder in your cloned repository and select it.
    * The "Web Navigator" extension should now appear in your list of extensions.

---

## Usage

Once the extension is loaded, you can click on its icon in your Chrome toolbar to open the popup. From there, you can begin interacting with the web pages using natural language commands. 