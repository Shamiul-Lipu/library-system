📚 Library Management System – Final Requirement
Goal

Build a modular, secure, and fully functional library management system with users, books, and borrowing functionality. Include authentication, role-based authorization, validation, and business logic.

1️⃣ Users Module (Authentication & Authorization)

Table: users
Fields:

Column Type Constraints Description
id UUID PK, default gen_random_uuid() Unique user identifier
name VARCHAR(255) NOT NULL Full name of user
email VARCHAR(255) NOT NULL, UNIQUE User’s email
password VARCHAR(255) NOT NULL Hashed password
role VARCHAR(50) NOT NULL, DEFAULT 'USER' Role of the user (USER or ADMIN)
created_at TIMESTAMP DEFAULT now() Account creation time
updated_at TIMESTAMP DEFAULT now() Last account update

Business Logic:

Passwords are hashed with bcrypt.

JWT tokens are issued on login for authentication.

Role-based authorization:

USER → can borrow books and see own borrow history

ADMIN → can manage books and view all borrows

API Endpoints:

Method Endpoint Description Auth
POST /api/users/register Register a new user No
POST /api/users/login Login user & return JWT No
GET /api/users/me Get logged-in user profile Yes
2️⃣ Books Module

Table: books
Fields:

Column Type Constraints Description
id UUID PK, default gen_random_uuid() Unique book identifier
title VARCHAR(255) NOT NULL Book title
author VARCHAR(255) NOT NULL Book author
genre VARCHAR(50) CHECK genre IN ('FICTION','NON_FICTION','SCIENCE','HISTORY','BIOGRAPHY','FANTASY') Book genre
isbn VARCHAR(100) NOT NULL, UNIQUE International Standard Book Number
description TEXT Optional description
copies INT NOT NULL, CHECK copies >= 0 Total copies available
available BOOLEAN DEFAULT true If the book is available for borrow
created_at TIMESTAMP DEFAULT now() Book creation timestamp
updated_at TIMESTAMP DEFAULT now() Last book update

Business Logic:

Automatically update available field: if copies = 0 → available = false.

Only ADMIN can create, update, or delete books.

Prevent deletion if the book has active borrow records.

API Endpoints:

Method Endpoint Description Auth
POST /api/books Create a new book ADMIN
GET /api/books Get all books (filter, sort, limit) PUBLIC
GET /api/books/:id Get book by ID PUBLIC
PUT /api/books/:id Update book details ADMIN
DELETE /api/books/:id Delete book ADMIN
3️⃣ Borrows Module

Table: borrows
Fields:

Column Type Constraints Description
id UUID PK, default gen_random_uuid() Unique borrow identifier
book UUID FK references books(id) Book being borrowed
user UUID FK references users(id) User borrowing the book
quantity INT NOT NULL, CHECK quantity > 0 Number of copies borrowed
due_date DATE NOT NULL Date the book must be returned
created_at TIMESTAMP DEFAULT now() Borrow record creation timestamp
updated_at TIMESTAMP DEFAULT now() Last update timestamp

Business Logic:

Check available copies before borrowing.

Deduct borrowed quantity from books.copies.

If copies = 0 → available = false.

Only logged-in users can borrow books.

Optional: limit max books per user, handle overdue books.

API Endpoints:

Method Endpoint Description Auth
POST /api/borrows Borrow a book USER
GET /api/borrows Get summary of borrowed books ADMIN

Aggregation / Reports:

Total borrowed quantity per book.

Active borrows per user.

Overdue borrows (optional).

4️⃣ Error Handling

All endpoints return a consistent error format:

{
"success": false,
"message": "Validation failed",
"error": { ...details }
}

Validate request data at service or middleware level.

Return 404 for missing resources, 401 for unauthorized, 403 for forbidden.

5️⃣ Modular Architecture

Project Structure (example):

src/
├─ config/
│ └─ db.ts # DB connection
├─ modules/
│ ├─ users/
│ │ ├─ user.model.ts
│ │ ├─ user.service.ts
│ │ ├─ user.controller.ts
│ │ └─ user.routes.ts
│ ├─ books/
│ │ ├─ book.model.ts
│ │ ├─ book.service.ts
│ │ ├─ book.controller.ts
│ │ └─ book.routes.ts
│ └─ borrows/
│ ├─ borrow.model.ts
│ ├─ borrow.service.ts
│ ├─ borrow.controller.ts
│ └─ borrow.routes.ts
├─ middlewares/
│ ├─ auth.middleware.ts
│ └─ error.middleware.ts
└─ server.ts

Each module contains model, service, controller, routes.

server.ts sets up Express, middlewares, and routes.

Auth middleware protects routes and enforces role-based access.

6️⃣ Bonus / Extra Features

Soft deletes for books (deleted_at).

Transactions for multi-book borrow.

Optional refresh tokens.

Request logging and metrics.

Unit & integration tests.
