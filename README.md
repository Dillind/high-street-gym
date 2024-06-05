# High Street Gym Web Application

**High Street Gym Web Application** is a project comprising of both frontend and backend components that work together to create a seamless user experience for gym members to book and manage their classes at High Street Gym, as well as interact with other members via the site's built-in blog system. Below, you will find an overview of the project, its purpose, technologies used, and instructions on how to get started.

## Project Overview and Purpose

The **High Street Gym Web Application** is a full-stack mobile web application developed for High Street Gym, providing a dynamic website and database to manage class bookings for a variety of activities offered by the gym.

## Technologies Used

In this project, there are many technologies and libraries used in both the frontend and backend components.

### Frontend

- [React](https://www.npmjs.com/package/react): A JavaScript library for building component based user interfaces.

- [React Router DOM](https://www.npmjs.com/package/react-router-dom): A library for adding routing functionality to React applications.

- [DaisyUI](https://www.npmjs.com/package/daisyui): A UI component library for tailwindcss.

- [vite](https://www.npmjs.com/package/vite): A build tool that serves your code via native ES modules with dynamic imports.

- [tailwindcss](https://www.npmjs.com/package/tailwindcss): A utility-first CSS framework for rapidly building custom designs.

### Backend

- [Express](https://www.npmjs.com/package/express): A fast and minimalist web framework for Node.js, used for handling routing, middleware, and HTTP request/response management.

- [bcryptjs](https://www.npmjs.com/package/bcryptjs): A library for secure password hashing.

- [cors](https://www.npmjs.com/package/cors): Middleware for enabling cross-origin resource sharing.

- [express-fileupload](https://www.npmjs.com/package/express-fileupload): Middleware for handling file uploads.

- [mysql2](https://www.npmjs.com/package/mysql2): A Node.js-based MySQL client library.

- [uuid](https://www.npmjs.com/package/uuid): A library for generating UUIDs.

- [xml2js](https://www.npmjs.com/package/xml2js): A library for parsing XML data.

### Database

- [MySQL](https://www.mysql.com/): A robust relational database management system used for storing and managing application data.

## Getting Started

To get started with the **High Street Gym Web Application**, follow the steps outlined below:

1. Clone the repository or download a ZIP file to your local machine.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your database (there is a sample DB in `mysql-dump/high-street-gym-dump.sql`) and
   configure the connection in the `backend/src/database.js`

4. Start the backend API server:

   ```bash
   npm run backend
   ```

5. Start the frontend vite development server:

   ```bash
   # In a separate terminal
   npm run frontend
   ```

**Note**: To create/update gym classes or members, use the two xml files located in the repository.
