# Use Case Diagram

The following diagram illustrates the primary interactions between the different actors (Customer, Vendor, Service Provider, and Admin) and the LocalLink platform.

```mermaid
useCaseDiagram
    actor "Customer" as C
    actor "Vendor (Product Seller)" as V
    actor "Service Provider" as SP
    actor "System Administrator" as A

    package "LocalLink Platform" {
        usecase "Browse Products & Services" as UC1
        usecase "Search by Location" as UC2
        usecase "Add to Unified Cart" as UC3
        usecase "Checkout & Pay" as UC4
        usecase "Track Order/Booking" as UC5
        usecase "Manage Inventory" as UC6
        usecase "Manage Service Schedule" as UC7
        usecase "Fulfill Order" as UC8
        usecase "Complete Service" as UC9
        usecase "Manage Users & Content" as UC10
        usecase "Generate Reports" as UC11
    }

    C --> UC1
    C --> UC2
    C --> UC3
    C --> UC4
    C --> UC5

    V --> UC6
    V --> UC8

    SP --> UC7
    SP --> UC9

    A --> UC10
    A --> UC11
```

## Use Case Descriptions

| ID | Use Case | Actor(s) | Description |
|:---|:---|:---|:---|
| **UC1** | Browse Products & Services | Customer | Users can explore various categories of physical goods and professional services. |
| **UC2** | Search by Location | Customer | Filter results based on proximity to the user's current or selected address. |
| **UC3** | Add to Unified Cart | Customer | Allows adding both physical items and service bookings into a single transaction. |
| **UC4** | Checkout & Pay | Customer | Securely process payments for the entire cart using integrated gateways. |
| **UC5** | Track Order/Booking | Customer | Provide real-time status updates on product delivery and service provider arrival. |
| **UC6** | Manage Inventory | Vendor | Add, update, or remove product listings and manage stock levels. |
| **UC7** | Manage Service Schedule | Service Provider | Set availability hours and manage specific time-slots for bookings. |
| **UC8** | Fulfill Order | Vendor | Process and ship physical product orders purchased by customers. |
| **UC9** | Complete Service | Service Provider | Perform the requested service and mark it as finished in the system. |
| **UC10** | Manage Users & Content | Admin | Moderate reviews, manage user accounts, and update platform-wide content. |
| **UC11** | Generate Reports | Admin | Access analytics on sales, service performance, and platform growth. |

