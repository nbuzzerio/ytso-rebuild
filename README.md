# 📺 YouTube Subscription Organizer (Rebuild)

A full-stack rebuild of the original YouTube Subscription Organizer, modernized using **Next.js**, **Express**, and **TypeScript**. This application helps users visually group, manage, and explore their YouTube subscriptions by organizing channels into customizable categories.

---

## 🚀 Why This Project Matters

This rebuild improves performance, structure, and code clarity over the original project. It demonstrates my ability to integrate full-stack technologies, validate user data securely, and implement clean UI/UX patterns in a scalable web app. 

Highlights include:

- Server-side validation and routing with Express
- Full testing coverage using **Jest** and **Cypress**
- Dynamic UI built with **Tailwind CSS**
- Environment variable templating for deployment flexibility

---

## 🧠 Features

- 📂 **Channel Grouping** – Sort your subscriptions into custom folders
- 📝 **Editable Titles & Descriptions** – Personalize each group
- 🔍 **Search & Filter** – Quickly find and organize channels
- 🧪 **Test Coverage** – Server and UI testing with separate scripts
- ⚡ **Next.js Optimization** – Fast client-side routing and SSR

---

## ⚙️ Tech Stack

| Layer      | Tools                                         |
|------------|-----------------------------------------------|
| Frontend   | Next.js, TypeScript, Tailwind CSS             |
| Backend    | Node.js, Express, TypeScript                  |
| Database   | MongoDB                                       |
| Testing    | Jest (server), Cypress (UI)                   |
| Validation | Custom schema validation                      |
| Deployment | Vercel-ready (includes Next.js configs)       |

---

## 🧪 Getting Started

Clone the project and install dependencies:

```bash
git clone https://github.com/nbuzzerio/ytso-rebuild.git
cd ytso-rebuild
npm install
```

### Start the Dev Server
```bash
npm run dev
```

## 🧪 Testing

This app separates backend and frontend tests:

### Run backend (Express) tests:
```bash
npm run testServer
```
### Run frontend (Cypress) tests:
```bash
npm run testUI
```

## 📂 Project Structure
```
ytso-rebuild/
├── components/         # Reusable UI components
├── pages/              # Next.js routes
├── server/             # Express backend logic
├── database/           # Placeholder for future DB integration
├── validations/        # Input validation schemas
├── __tests__/          # Unit tests (Jest)
├── cypress/            # E2E tests (Cypress)
├── public/             # Static assets
├── styles/             # Tailwind and global styles
├── .env.local_template # Sample local environment variables
└── ...
```

## 🧑‍💻 Developer Takeaways
This project demonstrates my ability to:

- 🧩 Build modern full-stack apps with **Next.js + Express**
- 🛡️ Implement **secure validation patterns**
- 🧪 Write **end-to-end and unit tests** across the stack
- 📦 Manage **clean project structure and configuration**
