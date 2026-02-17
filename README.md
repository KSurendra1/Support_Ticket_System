# Support Ticket System (Tech Intern Assessment)

A production-ready, full-stack Support Ticket System built with Django (DRF), React, PostgreSQL, and Docker. Features AI-powered ticket classification using OpenAI.

## 🚀 Features

- **Create Tickets**: Submit support requests with title and description.
- **AI Classification**: Automatically suggests category and priority using OpenAI GPT-3.5 on ticket submission.
- **Dashboard**: Real-time statistics on ticket volume, status breakdown, and average processing.
- **Filtering & Search**: Advanced filtering by status, priority, category, and text search.
- **Production Infrastructure**: Fully containerized with Docker and Docker Compose.

## 🛠 Tech Stack

- **Backend**: Django 5 + Django REST Framework
- **Frontend**: React 18 + Vite (Premium Dark Mode UI)
- **Database**: PostgreSQL 15
- **AI/LLM**: OpenAI API integration
- **DevOps**: Docker + Docker Compose

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running)
- An [OpenAI API Key](https://platform.openai.com/api-keys)

## ⚡ Quick Start (How to Run)

The entire application runs with a single Docker Compose command.

### 1. Clone the Repository
```bash
git clone <repository_url>
cd "Support Ticket System"
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory by copying the example file:

**Windows PowerShell:**
```powershell
cp .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

**Edit the `.env` file** and paste your OpenAI API Key:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```
> **Note:** The API key is required for the auto-classification feature.

### 3. Run with Docker
Build and start all services (Frontend, Backend, Database):

```bash
docker-compose up --build
```

Wait a few moments for the database to initialize and migrations to run. You should see logs indicating the server is running at `0.0.0.0:8000`.

## 🌐 Accessing the Application

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
  - Go here to create and view tickets.
- **Backend API Root**: [http://localhost:8000/api/](http://localhost:8000/api/)
  - Direct access to the Django REST Framework browsable API.
- **Admin Panel**: [http://localhost:8000/admin/](http://localhost:8000/admin/)
  - (Create a superuser via `docker-compose exec backend python manage.py createsuperuser` if access is needed).

## 🧪 AI Integration Details

The system uses the OpenAI API (`gpt-3.5-turbo`) to analyze ticket descriptions.
- **Trigger**: Happens automatically when the Description field loses focus (onBlur) in the "Create Ticket" form.
- **Output**: The specialized prompt returns a JSON object suggesting the most appropriate **Category** (Billing, Technical, Account, General) and **Priority** (Low, Medium, High, Critical).
- **Fallback**: If the API fails or is unconfigured, the system defaults to "General" / "Medium" and allows manual override.

## 📂 Project Structure

```
├── backend/                # Django Project
│   ├── ticket_system/      # Project settings
│   ├── tickets/            # Main app (Models, Views, Serializers)
│   ├── Dockerfile          # Backend container config
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Project
│   ├── src/components/     # React Components (Form, List, Dashboard)
│   ├── src/services/       # API integration
│   └── Dockerfile          # Frontend container config
├── docker-compose.yml      # Orchestration for DB, Backend, Frontend
├── .env.example            # Example environment variables
└── llm_prompt.txt          # System prompt used for AI classification
```

## 🐛 Troubleshooting

- **Port Conflicts**: Ensure ports `5173` (Frontend), `8000` (Backend), and `5432` (Postgres) are free.
- **Database Connection**: If the backend fails to connect to the DB initially, Docker healthchecks configured in `docker-compose.yml` should handle retries.
- **LLM Errors**: Check the backend logs (`docker-compose logs backend`) if classification fails. ensure your API key has quota.
