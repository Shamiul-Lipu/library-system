# 📚 Library Management System

A modular, secure, and fully functional system for managing users, books, and borrow operations. Includes authentication, authorization, validation, and business logic.

---

## 🚀 Goal

Build a complete library system with:

- User authentication (JWT)
- Role-based authorization (USER, ADMIN)
- CRUD operations for books
- Borrowing system with validation and stock handling
- Modular architecture with clean separation of concerns

---

## 1️⃣ Users Module (Authentication & Authorization)

### **Users Table**

| Column     | Type         | Constraints                     | Description              |
| ---------- | ------------ | ------------------------------- | ------------------------ |
| id         | UUID         | PK, default `gen_random_uuid()` | Unique user identifier   |
| name       | VARCHAR(255) | NOT NULL                        | Full name                |
| email      | VARCHAR(255) | NOT NULL, UNIQUE                | User email               |
| password   | VARCHAR(255) | NOT NULL                        | Hashed password          |
| role       | VARCHAR(50)  | NOT NULL, default `'USER'`      | Role (`USER` or `ADMIN`) |
| created_at | TIMESTAMP    | DEFAULT now()                   | Created timestamp        |
| updated_at | TIMESTAMP    | DEFAULT now()                   | Last update timestamp    |

### **Business Logic**

- Passwords hashed using **bcrypt**
- **JWT tokens** issued on login
- Role-based access:

  - **USER** → borrow books, see own history
  - **ADMIN** → manage books, view all borrows

### **API Endpoints**

| Method | Endpoint              | Description                | Auth |
| ------ | --------------------- | -------------------------- | ---- |
| POST   | `/api/users/register` | Register a new user        | No   |
| POST   | `/api/users/login`    | Login & receive JWT        | No   |
| GET    | `/api/users/me`       | Get logged-in user profile | Yes  |

---

## 2️⃣ Books Module

### **Books Table**

| Column      | Type         | Constraints                                                                                       | Description            |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------- | ---------------------- |
| id          | UUID         | PK, default `gen_random_uuid()`                                                                   | Unique book ID         |
| title       | VARCHAR(255) | NOT NULL                                                                                          | Book title             |
| author      | VARCHAR(255) | NOT NULL                                                                                          | Book author            |
| genre       | VARCHAR(50)  | CHECK in predefined list (`FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY`) | Book genre             |
| isbn        | VARCHAR(100) | NOT NULL, UNIQUE                                                                                  | ISBN                   |
| description | TEXT         | Optional                                                                                          | Description            |
| copies      | INT          | NOT NULL, CHECK `copies >= 0`                                                                     | Total available copies |
| available   | BOOLEAN      | DEFAULT true                                                                                      | Availability status    |
| created_at  | TIMESTAMP    | DEFAULT now()                                                                                     | Created timestamp      |
| updated_at  | TIMESTAMP    | DEFAULT now()                                                                                     | Updated timestamp      |

### **Business Logic**

- `available = false` automatically when `copies = 0`
- Only **ADMIN** can create/update/delete books
- Prevent deletion if active borrow records exist

### **API Endpoints**

| Method | Endpoint         | Description                       | Auth   |
| ------ | ---------------- | --------------------------------- | ------ |
| POST   | `/api/books`     | Create a new book                 | ADMIN  |
| GET    | `/api/books`     | Get all books (filter/sort/limit) | PUBLIC |
| GET    | `/api/books/:id` | Get book by ID                    | PUBLIC |
| PUT    | `/api/books/:id` | Update a book                     | ADMIN  |
| DELETE | `/api/books/:id` | Delete a book                     | ADMIN  |

---

## 3️⃣ Borrows Module

### **Borrows Table**

| Column     | Type      | Constraints                     | Description       |
| ---------- | --------- | ------------------------------- | ----------------- |
| id         | UUID      | PK, default `gen_random_uuid()` | Borrow ID         |
| book       | UUID      | FK → books(id)                  | Book borrowed     |
| user       | UUID      | FK → users(id)                  | Borrowing user    |
| quantity   | INT       | NOT NULL, CHECK `quantity > 0`  | Quantity borrowed |
| due_date   | DATE      | NOT NULL                        | Return deadline   |
| created_at | TIMESTAMP | DEFAULT now()                   | Created timestamp |
| updated_at | TIMESTAMP | DEFAULT now()                   | Updated timestamp |

### **Business Logic**

- Check available copies before borrowing
- Deduct borrowed quantity from `books.copies`
- If `copies = 0` → set `available = false`
- Only logged-in users can borrow
- _(Optional)_ limit max borrows per user
- _(Optional)_ overdue handling

### **API Endpoints**

| Method | Endpoint       | Description          | Auth  |
| ------ | -------------- | -------------------- | ----- |
| POST   | `/api/borrows` | Borrow a book        | USER  |
| GET    | `/api/borrows` | All borrowed summary | ADMIN |

### **Reports / Aggregations**

- Total borrowed quantity per book
- Active borrows per user
- Overdue borrows _(optional)_

---

## 4️⃣ Error Handling

### **Standard Error Response**

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {}
}
```

### Rules

- Validate all input in services/middleware
- Return proper HTTP codes:

  - **404** → Not found
  - **401** → Unauthorized
  - **403** → Forbidden

---

## 5️⃣ Modular Architecture

### **Suggested Structure**

```
src/
├─ config/
│   ├─ db.ts               # Database connection
|   └─ index.ts
├─ modules/
│   ├─ users/
│   │   ├─ user.model.ts
│   │   ├─ user.service.ts
│   │   ├─ user.controller.ts
│   │   └─ user.routes.ts
│   ├─ books/
│   │   ├─ book.model.ts
│   │   ├─ book.service.ts
│   │   ├─ book.controller.ts
│   │   └─ book.routes.ts
│   └─ borrows/
│       ├─ borrow.model.ts
│       ├─ borrow.service.ts
│       ├─ borrow.controller.ts
│       └─ borrow.routes.ts
├─ middlewares/
│   ├─ auth.middleware.ts
│   └─ error.middleware.ts
└─ server.ts
```

- Each module has **model**, **service**, **controller**, **routes**
- `server.ts` sets up Express, middleware, routing
- Auth middleware enforces role-based access

---

## 6️⃣ Bonus / Extra Features

- Soft deletes for books (`deleted_at`)
- Transactions for multi-book borrow
- Refresh token support
- Logging & metrics
- Unit + integration tests

---
