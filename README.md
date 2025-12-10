# Evaluation of CSU SSD Charts

A web application for evaluating the impact of visual design elements on user comprehension within the California State University Student Success Dashboard (CSU SSD). This study investigates how visual artifacts, such as the use of icons (e.g., student figures or graduation caps) in place of simple geometric shapes, affect the readability and interpretation of institutional data.

## Research Overview

This study investigates the impact of visual design elements on user comprehension within the California State University Student Success Dashboard (CSU SSD). Specifically, it examines how visual artifacts, such as the use of icons (e.g., student figures or graduation caps) in place of simple geometric shapes, affect the readability and interpretation of institutional data. 

The research incorporates user studies and eye-tracking analysis to evaluate how different visualization techniques influence the extraction of meaningful insights. By comparing standard charts with those used on the CSU SSD website, which displays data from 23 campuses and over 450,000 students annually, the study aims to offer practical recommendations for designing more effective and efficient dashboards that support strategic decision-making across the CSU system. 

In addition, the study evaluates the effect of user expertise on task performance, including speed, accuracy, and chart understanding.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MySQL** (v5.7 or higher)
- **Git** (for cloning the repository)

## Installation

### macOS Setup

1. Install Homebrew (if not already installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install MySQL and Node.js:
```bash
brew install mysql
brew install node
```

3. Start MySQL service:
```bash
brew services start mysql
```

4. Secure MySQL installation (set a password):
```bash
mysql_secure_installation
```
Follow the prompts to set a root password and configure security settings.

5. Install additional MySQL package (if needed):
```bash
npm install mysql
```

### Windows Setup

#### Option 1: Using XAMPP (Recommended for Easy Setup)

1. Install XAMPP:
   - Download XAMPP from: https://www.apachefriends.org/download.html
   - Choose the Windows version
   - Run the installer and follow the prompts
   - Install **Apache** and **MySQL** components (you can skip PHP if not needed)

2. Start MySQL via XAMPP:
   - Open **XAMPP Control Panel**
   - Click **Start** next to MySQL
   - MySQL will run on the default port (3306)
   - **Note:** XAMPP MySQL typically has no password by default for the root user

3. Install Node.js:
   - Download from: https://nodejs.org/en/
   - Choose the "Recommended For Most Users" version
   - Follow the installation wizard

#### Option 2: Using Standalone MySQL

1. Install MySQL:
   - Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
   - Follow the installation prompts
   - Install both **MySQL Server** and **MySQL Workbench**
   - Set a root password during installation

2. Install Node.js:
   - Download from: https://nodejs.org/en/
   - Choose the "Recommended For Most Users" version
   - Follow the installation wizard

### Project Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd evaluation-of-csu-ssd-charts
```

2. Install dependencies:
```bash
npm install
```

This will install all required packages including:
- Express.js (web framework)
- Sequelize (ORM)
- MySQL2 (MySQL driver)
- Chart.js (graph visualization)
- Bootstrap (UI framework)
- dotenv (environment variables)
- And other dependencies listed in `package.json`

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=

# Local Database ID (required for multi-database setups)
LOCAL_DB_ID=L1

# Server Configuration (optional)
PORT=3000
```

**Important:** 
- Make sure your MySQL server is running (via XAMPP Control Panel or standalone MySQL service)
- The database specified in `DB_NAME` doesn't need to exist - it will be created automatically
- **For XAMPP users:** Leave `DB_PASSWORD` empty (XAMPP MySQL root user typically has no password by default)
- **For standalone MySQL:** Set `DB_PASSWORD` to the password you configured during installation
- Keep your `.env` file secure and never commit it to version control

## Database Setup

The application requires setting up the database with tables and initial data. Follow these steps:

### Step 1: Setup Database Schema and Seed Data

**Important:** Make sure MySQL is running before proceeding:
- **XAMPP users:** Ensure MySQL is started in XAMPP Control Panel
- **Standalone MySQL:** Ensure MySQL service is running

Run the database setup script to connect to MySQL and create the database:

**macOS/Linux:**
```bash
node setupDatabase.js
```

**Windows (PowerShell):**
```powershell
node setupDatabase.js
```

This script will:
- Connect to MySQL using credentials from your `.env` file
- Create the database if it doesn't exist
- Create all required tables (Users, Graphs, Questions, GraphQuestionMap, PrestudyResponse, MainstudyResponse, UserInteraction)
- Insert initial graph data (10 graphs: 5 standard + 5 alternative)
- Insert questions from `questions.json`
- Create graph-question mappings

### Step 2: Generate Presentation Orders

Generate the graph and question presentation orders:

```bash
node setupPresentationOrder.js
```

This script will:
- Create `graphPresentationOrder.json` with 50 different random graph orders
- Create `questionPresentationOrder.json` with question orders for each graph
- These files determine the order in which graphs and questions are presented to participants

**Note:** If these files already exist, the script will not overwrite them to prevent data loss.

### Troubleshooting MySQL Authentication

If you encounter the error:
```
Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
```

**macOS/Linux:**
Run this command in your terminal (replace `yourpassword` with your MySQL root password):
```bash
mysql -u root -p -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword'; FLUSH PRIVILEGES;"
```

**Windows (XAMPP):**
1. Open **phpMyAdmin** (via XAMPP Control Panel → Admin button next to MySQL)
2. Or use **MySQL Workbench** or command line
3. Execute the following SQL commands (if you have a password, replace `yourpassword`; if no password, use empty string):
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

**Windows (Standalone MySQL):**
1. Open **MySQL Workbench**
2. Connect to your local MySQL server
3. Execute the following SQL commands (replace `yourpassword` with your MySQL root password):
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';
FLUSH PRIVILEGES;
```

After running these commands, try running `node setupDatabase.js` again.

## Running the Application

1. Start the server:

**macOS/Linux:**
```bash
node server.js
```

**Windows (PowerShell):**
```powershell
node server.js
```

Or use npm:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

The server will start on port 3000 by default (or the port specified in your `.env` file).

**Note:** Make sure you have completed the Database Setup steps before running the server.

## Project Structure

```
evaluation-of-csu-ssd-charts/
├── src/
│   ├── app.js                          # Express app configuration
│   ├── config/
│   │   └── db.js                       # Database connection configuration
│   ├── controllers/
│   │   └── standardAndNonStandardGraphComparisonConrollers/
│   │       └── standardAndNonStandardGraphComparisonController.js
│   ├── models/
│   │   └── standardAndNonStandardGraphComparisonModels/
│   │       ├── Graph.js                # Graph model
│   │       ├── Question.js             # Question model
│   │       ├── User.js                 # User model
│   │       ├── GraphQuestionMap.js     # Graph-Question mapping model
│   │       ├── PrestudyResponse.js     # Prestudy response model
│   │       ├── MainstudyResponse.js    # Mainstudy response model
│   │       ├── UserInteraction.js      # User interaction model
│   │       └── index.js                # Model initialization
│   ├── routes/
│   │   └── standardAndNonStandardGraphComparisonRoutes/
│   │       ├── apiRoutes/
│   │       │   └── api.js              # API endpoints
│   │       └── htmlRoutes/
│   │           └── web.js              # HTML routes
│   ├── services/
│   │   └── standardAndNonStandardGraphComparisonServices/
│   │       ├── questionService.js      # Question retrieval logic
│   │       ├── standardAndNonStandardGraphComparisonService.js
│   │       └── userService.js          # User management logic
│   └── views/
│       ├── index.html                  # Main HTML file
│       ├── css/
│       │   └── style.css               # Styles
│       ├── img/                        # Images
│       └── js/
│           └── standardAndNonStandardGraphComparisonJS/
│               ├── index.js            # Main application logic
│               ├── prestudy.js         # Prestudy functionality
│               ├── mainstudy.js        # Main study functionality
│               └── charts.js           # Chart rendering logic
├── server.js                           # Server entry point
├── setupDatabase.js                    # Database setup script
├── setupPresentationOrder.js           # Presentation order generator
├── questions.json                      # Question definitions
├── graphPresentationOrder.json         # Generated graph orders
├── questionPresentationOrder.json      # Generated question orders
├── package.json                        # Project dependencies
└── README.md                           # This file
```

## Features

### Study Flow

1. **Home Screen**: Users claim a User ID to begin
2. **Prestudy Phase**: 
   - Demographic questions (age, major)
   - Graph comprehension questions with different chart types (pie, bar, dots, line)
3. **Main Study Phase**:
   - Randomized graph presentation based on `testOrderId`
   - Questions about each graph (graph questions, data questions, subjective questions)
   - Standard and alternative graph presentations

### Graph Types

The application supports 5 types of graphs from the CSU SSD:
1. Equity Gaps (my-equity-gaps)
2. Student Progress Units (student-progress-units)
3. Goal Trajectories (goal-trajectories)
4. Path Analysis (what-paths-do-they-follow)
5. Enrollment and Graduation (enrollingand-graduating)

Each graph type has both a **standard version** (simple geometric shapes) and an **alternative version** (with visual artifacts like icons, student figures, or graduation caps) to evaluate the impact of visual design elements on comprehension.

### Question Types

- **Graph Questions (GQ)**: Questions about graph interpretation
- **Data Questions (DQ)**: Questions about specific data points
- **Subjective Questions (SQ)**: Opinion-based questions
- **Answer Types**: Multiple choice, free response, and numeric input

### Data Collection

The application collects comprehensive data for analysis:
- User demographics (age, major) for expertise evaluation
- Prestudy responses with correctness scoring
- Main study responses with correctness scoring for (DQ, GQ)
- User interactions (button clicks, navigation) for behavioral analysis
- Response timestamps for performance speed analysis

## Troubleshooting

### Database Connection Issues

**macOS/Linux:**
- Verify MySQL is running: `mysql -u root -p`
- Check MySQL service status: `brew services list` (macOS) or `sudo systemctl status mysql` (Linux)
- Start MySQL if stopped: `brew services start mysql` (macOS) or `sudo systemctl start mysql` (Linux)

**Windows (XAMPP):**
- Verify MySQL is running: Open **XAMPP Control Panel** and check that MySQL shows "Running" status
- Start MySQL if stopped: Click **Start** button next to MySQL in XAMPP Control Panel
- Check MySQL port: Default is 3306 (shown in XAMPP Control Panel)

**Windows (Standalone MySQL):**
- Verify MySQL is running: Open Services (services.msc) and check MySQL service status
- Start MySQL service if stopped: Right-click MySQL service → Start

**General:**
- Check that `.env` file has correct credentials
- For XAMPP: Ensure `DB_PASSWORD` is empty if you haven't set a password
- Ensure database user has CREATE DATABASE privileges
- Verify MySQL is listening on the correct port (default: 3306)

### Port Already in Use

If port 3000 is already in use:
- Change `PORT` in `.env` file
- Or stop the process using port 3000

### Missing JSON Files

If `graphPresentationOrder.json` or `questionPresentationOrder.json` are missing:
- Run `node setupPresentationOrder.js`
- Ensure database setup completed successfully first

### Module Errors

If you encounter module import errors:
- Run `npm install` again
- Check Node.js version: `node --version` (should be v14+)

## Development Notes

- The application uses ES6 modules in frontend JavaScript files
- Backend uses CommonJS modules
- Database uses Sequelize ORM with MySQL
- Charts are rendered using Chart.js and custom chart functions
- Session management handled by express-session

## License

ISC

