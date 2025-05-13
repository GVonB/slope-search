# Slope Search
A web application allowing users to search, filter, and favorite ski resorts around the world. Using data from openskimap.org.

Visit the live deployment at [slope-search.gvonb.dev](https://slope-search.gvonb.dev/)

## Prerequisites

Before proceeding, you will need to have the following installed:
- [Python (Any Version Not EOL)](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)
- Either:
    - [Docker](https://www.docker.com/) (Recommended)
    - OR a local MySQL setup such as [MySQL Workbench](https://www.mysql.com/products/workbench/)

## Local Installation Instructions

Local installation is best with **Docker** or you can also run the frontend and backend servers separately using Node.

---

### 1. Download and Prepare Data Directory

To save size on the repository and support data updates, no data is stored in the repo.

- Download these two datasets from the about page on [https://www.openskimap.org](https://openskimap.org/?about#)
    - `ski_areas.csv`
    - `runs.csv`
- Create a new folder at: `notebook/data/`
- Move both `.csv` files into `notebook/data/`

---

### 2. Clean and Process Data
- (Optional) Create a Python virtual environment:
  ```bash
  cd notebook
  python3 -m venv venv
  source venv/bin/activate
  ```
- Install Python requirements:
  ```bash
  pip install -r requirements.txt
  ```
- Open `notebook/clean_data.ipynb` and run all cells to generate cleaned CSVs.
- Cleaned data will be saved automatically into `notebook/data/`.

---

### 3. Environment Setup

Create .env files:
- In the root directory (.env):
  ```bash
  MYSQL_ROOT_PASSWORD=password
  MYSQL_DATABASE=slope_search
  ```
- In the /server directory (server/.env):
  ```bash
  DB_HOST=mysql
  DB_USER=root
  DB_PASS=password
  DB_NAME=slope_search
  PORT=3000
  ```

---

### 4. Initialize the Database

- Make the initialization script executable and run it:
  ```bash
  chmod +x scripts/init-db.sh
  ```
This loads the schema and cleaned data into the MySQL container.

---

### 5. Run the App

Option 1: Using Docker (Recommended)
```bash
docker compose up --build
```
- Access the app at [http://localhost:4173](http://localhost:4173)

Option 2: Run Manually

In separate terminal tabs:
```bash
# Terminal 1 - Start Backend
cd server
npm install
npm run dev
```
```bash
# Terminal 2 - Start Frontend
cd client
npm install
npm run dev
```
Make sure your local MySQL instance is running and matches the .env configuration.

If you're using a local MySQL setup (e.g. MySQL Workbench), ensure the following:

1. Your MySQL server is running and accessible.
2. The `server/.env` file **must** be configured with **your** local MySQL details. For example:
  ```bash
  DB_HOST=localhost
  DB_USER=your_user
  DB_PASS=your_password
  DB_NAME=slope_search
  PORT=3000
  ```
3. Make sure to manually run the schema and data load scripts in order:

  First, create the tables:
  ```bash
  mysql -u your_user -p slope_search < sql/createTables.sql
  ```
  *You will be prompted to enter your MySQL password.*

  Then, load the cleaned data:
  ```bash
  mysql -u your_user -p slope_search < sql/loadData.sql
  ```
  *You will be prompted again for the password.*
