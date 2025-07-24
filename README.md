# Tenant Onboarding Admin

This is a Next.js application for managing tenant onboarding. It provides a comprehensive dashboard for administrators to handle tenants, users, and roles efficiently.

## Features

- **Dashboard:** A modern, intuitive dashboard built with Next.js and Tailwind CSS.
- **Tenant Management:** Onboard new tenants, view existing ones, and manage their details.
- **User and Role Management:** Assign roles to users and manage their permissions.
- **Responsive Design:** A fully responsive layout that works on all devices.
- **Extensible:** Built with a modular architecture, making it easy to add new features.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) and [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the project directory:**
   ```bash
   cd tenant-onboarding-admin
   ```
3. **Install the dependencies:**
   ```bash
   npm install
   ```

### Running the Application

To start the development server, run the following command:

```bash
npm run dev
```

The application will be available at [http://localhost:5001](http://localhost:5001).

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```bash
PORT=5001
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=master
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=bighammer-admin
NEXT_PUBLIC_UI_REDIRECT_URL=http://localhost:5001
NEXT_PUBLIC_UI_APP_URL=http://localhost:5000
NEXT_PUBLIC_API_PREFIX=/api/v1/
NEXT_PUBLIC_KEYCLOAK_API_REMOTE_URL=http://localhost:8005
NODE_ENV=development```

### Docker Setup

To run the application using Docker, follow these steps:
docker-compose up -d --build
The application will be available at [http://localhost:5001](http://localhost:5001).


## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for errors.

## Project Structure

- **`/app`:** Contains the main pages of the application, with subdirectories for `roles`, `tenants`, and `users`.
- **`/components`:** Includes reusable React components, such as the admin layout, sidebar, and UI elements.
- **`/lib`:** Contains utility functions and helper scripts.
- **`/public`:** Stores static assets like images and fonts.
- **`/styles`:** Includes global CSS styles.

