# Needs Assessment Tool

This project is a web-based survey tool designed for humanitarian aid organizations to assess needs across multiple sites. It leverages **Next.js** for the frontend and **PostgreSQL** for data management, with everything containerized using **Docker** for easy setup.

---

## 🚀 Getting Started

### **1. Prerequisites**

Ensure you have the following installed on your machine:

- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (includes Docker Compose)
- **Node.js (v18+)** and **npm** (if running without Docker)

---

### **2. Cloning the Repository**

```bash
git clone https://github.com/your-repo/needs-assessment.git
cd needs-assessment
```

---

### **3. Running the App with Docker**

To make setup seamless, both the **Next.js** app and **PostgreSQL** database are managed with **Docker Compose**.

#### **Start the App and Database:**

```bash
docker compose up
```

This will:
- Start the **PostgreSQL** database on `localhost:5432`.
- Start the **Next.js** app on `http://localhost:3000`.

#### **Stop the App and Database:**

```bash
docker compose down
```

---

### **4. Running Without Docker (Optional)**

If you prefer to run the app without Docker:

#### **Install Dependencies:**

```bash
npm install
```

#### **Set Up PostgreSQL:**
1. Start a local **PostgreSQL** server.
2. Create a database named `needs_assessment`.
3. Update the **`.env`** file with your PostgreSQL credentials:

```
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/needs_assessment
```

#### **Run Database Migrations:**

```bash
npx prisma migrate dev --name init
```

#### **Start the Development Server:**

```bash
npm run dev
```

The app will be running at `http://localhost:3000`.

---

## 📂 Project Structure

```
needs-assessment/
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma
├── src/
│   ├── app/              # Next.js app structure
│   ├── mock/             # Mock data for development
│   └── api/              # API routes for interacting with PostgreSQL
├── docker-compose.yml    # Docker setup for Postgres and Next.js
├── Dockerfile            # Dockerfile for Next.js app
├── .env                  # Environment variables
└── package.json          # Project dependencies and scripts
```

---

## 🔐 Authentication

The app uses **NextAuth.js** for authentication with credentials stored in the PostgreSQL database.

- Default admin credentials:
  - **Email:** `admin@example.com`
  - **Password:** `admin123`

---

## 📒 Database Schema Overview

### **Core Survey Structure:**
- **Survey**: Represents each season’s survey.
  - **Page**: Sections within the survey (e.g., Basic Info, Hygiene).
    - **Question**: Standardized questions.

### **Site-Specific Responses:**
- **SiteSurvey**: A site’s responses to a specific survey.
  - **SitePage**: Mirrors the core survey pages but holds site-specific data.
    - **QuestionResponse**: Individual responses for each question.

---

## 🚜 Deployment

The app is ready for deployment on **Vercel**. To deploy:

1. Push the repository to **GitHub**.
2. Connect the repository to **Vercel**.
3. Set environment variables in **Vercel**:
   - `DATABASE_URL`

For the database in production, you can use **Supabase** or a managed **PostgreSQL** service.

---

## 📊 Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push your branch and create a pull request.

---

## 🛠️ Troubleshooting

- **`docker-compose: command not found`**:
  - Ensure Docker Desktop is installed and running.
  - Use `docker compose up` (without the hyphen) for newer versions.

- **Database connection errors**:
  - Confirm your `.env` file has the correct `DATABASE_URL`.
  - Make sure Docker is running if using Docker Compose.

---

## 🌟 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgments

- Built with **Next.js**, **Prisma**, and **PostgreSQL**.
- Dockerized for easy deployment and development.

---

Happy Coding! 🚀🚀🚀

