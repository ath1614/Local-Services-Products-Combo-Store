# Class Diagram

The following diagram represents the core TypeScript classes/entities and their relationships in the LocalLink application.

```mermaid
classDiagram
    class UserRole {
        <<enumeration>>
        CUSTOMER
        VENDOR
        SERVICE_PROVIDER
        ADMIN
    }

    class OrderStatus {
        <<enumeration>>
        PENDING
        PAID
        SHIPPED
        ARRIVED
        COMPLETED
        CANCELLED
    }

    class User {
        +String id
        +String name
        +String email
        +UserRole role
        +login()
        +register()
        +updateProfile()
    }

    class Customer {
        +Address[] addresses
        +Cart cart
        +viewOrders()
        +addReview(item)
    }

    class Vendor {
        +String shopName
        +String shopAddress
        +Product[] products
        +manageInventory()
        +updateOrderStatus(orderId)
    }

    class ServiceProvider {
        +String specialty
        +Availability[] schedule
        +updateBookingStatus(bookingId)
        +setAvailability(slots)
    }

    class Product {
        +String id
        +String name
        +Number price
        +Number stockQuantity
        +Vendor vendor
        +decrementStock(amt)
    }

    class Service {
        +String id
        +String title
        +Number hourlyRate
        +ServiceProvider provider
        +checkAvailability(date)
    }

    class Order {
        +String id
        +Date createdAt
        +OrderStatus status
        +OrderItem[] items
        +Number totalAmount
        +calculateTotal()
        +processRefund()
    }

    class OrderItem {
        +String id
        +Number quantity
        +Product product?
        +Service service?
        +Number unitPrice
    }

    User <|-- Customer
    User <|-- Vendor
    User <|-- ServiceProvider

    Vendor "1" *-- "0..*" Product
    ServiceProvider "1" *-- "0..*" Service
    Customer "1" -- "0..*" Order
    Order "1" *-- "1..*" OrderItem
    OrderItem "0..*" -- "0..1" Product
    OrderItem "0..*" -- "0..1" Service
```

## TypeScript Implementation Details

- **Type Safety**: The system utilizes TypeScript's `Discriminated Unions` for handling different types of `OrderItem` (Product vs. Service).
- **Architecture**: Follows the **SOLID Principles**, particularly the *Interface Segregation Principle*, by splitting `Vendor` and `ServiceProvider` specific logic while inheriting shared `User` properties.
- **Methods**: All business logic (like `calculateTotal` and `decrementStock`) is encapsulated within the domain entities to maintain high cohesion.
- **Enumerations**: Explicit enums for `UserRole` and `OrderStatus` ensure that the application state remains predictable and type-safe across the stack.
