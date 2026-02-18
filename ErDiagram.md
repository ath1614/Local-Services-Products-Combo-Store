# ER Diagram (Entity-Relationship)

This diagram details the relational database schema for the **LocalLink** platform (PostgreSQL).

```mermaid
erDiagram
    USERS ||--o{ CUSTOMERS : becomes
    USERS ||--o{ VENDORS : becomes
    USERS ||--o{ SERVICE_PROVIDERS : becomes

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        enum role
        timestamp created_at
        timestamp updated_at
    }

    VENDORS {
        uuid id PK
        uuid user_id FK
        string shop_name
        string business_license UK
        string address
        geometry location "GIS coordinates"
    }

    PRODUCTS {
        uuid id PK
        uuid vendor_id FK
        string name
        text description
        decimal price
        int stock_level
        string category
        boolean is_active
    }

    SERVICE_PROVIDERS {
        uuid id PK
        uuid user_id FK
        string expertise_area
        int years_experience
        enum verification_status "PENDING, VERIFIED, REJECTED"
        decimal average_rating
    }

    SERVICES {
        uuid id PK
        uuid provider_id FK
        string title
        decimal base_price
        string duration_est
        boolean allows_same_day
    }

    ORDERS {
        uuid id PK
        uuid customer_id FK
        decimal total_amount
        enum status
        string payment_intent_id UK
        timestamp ordered_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK "nullable"
        uuid service_id FK "nullable"
        int quantity
        decimal unit_price
        timestamp scheduled_time "nullable"
        text notes
    }

    REVIEWS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK "nullable"
        uuid service_id FK "nullable"
        int rating "1-5"
        text comment
    }

    VENDORS ||--o{ PRODUCTS : "stocks"
    SERVICE_PROVIDERS ||--o{ SERVICES : "offers"
    CUSTOMERS ||--o{ ORDERS : "places"
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    PRODUCTS ||--o{ ORDER_ITEMS : "included_in"
    SERVICES ||--o{ ORDER_ITEMS : "included_in"
    USERS ||--o{ REVIEWS : "writes"
```

## Constraints & Data Policies

1.  **Referential Integrity**: All deletions are handled via `ON DELETE CASCADE` or `SET NULL` depending on the entity (e.g., deleting a product preserves the order item but nullifies the reference).
2.  **GIS Capabilities**: The `location` field in `VENDORS` uses **PostGIS** to enable efficient "Find shops within X km" queries.
3.  **Auditing**: Every table includes `created_at` and `updated_at` timestamps for tracking and debugging.
4.  **Soft Deletes**: Active flags (`is_active`) are used for products and services to preserve historical order data.
5.  **Unique Constraints**: `email` and `business_license` are indexed and unique to prevent duplicate registrations.

## Tech Stack (Database Context)

- **Primary Database:** PostgreSQL 15+ (Relational with JSONB support).
- **Extensions:** PostGIS for location-based search.
- **ORM:** Prisma (for **TypeScript** type safety across the database layer).
- **Migration Strategy:** Version-controlled migrations using Prisma Migrate.
- **Indexing Strategy:** 
    - B-Tree index on `email`, `ordered_at`, and `category`.
    - GIST index on `location` for spatial queries.

