# Sequence Diagram: Unified Checkout Flow

This diagram tracks the end-to-end process of a customer purchasing a product and booking a service simultaneously.

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Frontend as Web/Mobile UI
    participant API as Backend API
    participant DB as Database
    participant Vendor as Product Vendor
    participant SP as Service Provider

    Customer->>Frontend: Search for 'DrillMachine' & 'Electrician'
    Frontend->>API: GET /search?q=...
    API->>DB: Query products & services
    DB-->>API: Result set
    API-->>Frontend: Display results
    
    Customer->>Frontend: Add DrillMachine to Cart
    Customer->>Frontend: Add Electrician (Slot: 10AM) to Cart
    
    Customer->>Frontend: Click Checkout
    Frontend->>API: POST /orders/create
    API->>DB: Create Order Record (Pending)
    DB-->>API: OrderCreated (ID: 101)
    
    API->>API: Process Payment
    API->>DB: Update Order Status (Paid/Confirmed)
    
    API->>Vendor: Notify: New Product Order
    API->>SP: Notify: New Service Booking
    
    Vendor->>API: Mark as 'Shipped'
    API->>Customer: SMS/Push: Product Out for Delivery
    
    SP->>API: Mark as 'Arrived'
    API->>Customer: SMS/Push: Professional at your doorstep
    
    SP->>Customer: Complete Service
    SP->>API: POST /bookings/101/complete
    API->>DB: Update Booking Status
    
    Customer->>Frontend: Submit Rating & Review
    Frontend->>API: POST /reviews
    API->>DB: Save Review
```

## Key Interaction Steps

1.  **Discovery**: Unified search results return both product and service entities from the database.
2.  **Transaction**: The API creates a single order record with multiple line items, ensuring atomicity.
3.  **Real-Time Notifications**: The system triggers parallel notifications to both the Product Vendor and the Service Provider upon successful payment.
4.  **Completion**: The Service Provider confirms completion via their portal, triggering the review flow for the customer.

## Alternative Flow: Booking Cancellation

This flow illustrates what happens when a customer cancels a service booking before it starts.

```mermaid
sequenceDiagram
    actor Customer
    participant API as Backend API
    participant DB as Database
    participant SP as Service Provider
    participant Payment as Payment Gateway

    Customer->>API: Request Cancellation (Booking ID: 202)
    API->>DB: Check Cancellation Policy
    DB-->>API: Within Grace Period (True)
    
    API->>Payment: Initiate Refund Process
    Payment-->>API: Refund Success
    
    API->>DB: Update Status: 'Cancelled & Refunded'
    API->>SP: Notify: Booking Cancelled
    
    API-->>Customer: Confirmation: "Refund processed successfully"
```

