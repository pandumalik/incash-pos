# InCash API

Backend server for InCash POS application.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: 
    - **Current**: JSON File (`src/data/db.json`) via `lowdb`-like adapter.
    - **Future**: PostgreSQL (Schema provided in `database.sql`).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```

## Database Documentation

### Relational Schema (ER Diagram)

```mermaid
erDiagram
    USERS ||--o{ TRANSACTIONS : initiates
    TRANSACTIONS ||--|{ TRANSACTION_ITEMS : contains
    PRODUCTS ||--o{ TRANSACTION_ITEMS : included_in

    USERS {
        string id PK
        string username
        string password
        string role
    }

    PRODUCTS {
        string id PK
        string name
        string sku
        string category
        float price
        int stock
    }

    TRANSACTIONS {
        string id PK
        string user_id FK
        datetime date
        float total_amount
    }

    TRANSACTION_ITEMS {
        int id PK
        string transaction_id FK
        string product_id FK
        int quantity
        float price_at_sale
    }
```

## API Documentation

### Authentication
- `POST /auth/login`
    - Body: `{ "username": "admin", "password": "password" }`
    - Returns: User object (without password)

### Products
- `GET /products`
    - Query Params: `category` (optional), `search` (optional)
- `GET /products/:id`
- `POST /products`
    - Body: Product object
- `PUT /products/:id`
- `DELETE /products/:id`

### Transactions
- `GET /transactions`
- `POST /transactions`
    - Body: `{ "userId": "...", "items": [{ "id": "prod_id", "quantity": 1 }], "paymentMethod": "cash" }`
    - Logic: Creates a transaction record and deducts stock from products.

### Users
- `GET /users`
- `GET /users/current` (Returns random user for simulation)
