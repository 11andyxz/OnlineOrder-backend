you guys can run the code and check the eruka to see microservice and the APIS are belows:
 - User service (`/api/users/**`)
    - POST `/api/users/register`
        - Request: `{ email, password, name }`
        - Response: `ApiResponse<{ id, email, name, token }>`
    - POST `/api/users/login`
        - Request: `{ email, password }`
        - Response: `ApiResponse<{ id, email, name, token }>`
- Menu service (`/api/menu/**`)
    - GET `/api/menu`
        - Response: `ApiResponse<[ { id, name, description, price, available } ]>`
    - POST `/api/menu`
        - Request: `{ name, description, price, available }`
        - Response: `ApiResponse<{ id, name, description, price, available }>`
    - PUT `/api/menu/{id}`
        - Request: `{ name, description, price, available }`
        - Response: `ApiResponse<{ id, name, description, price, available }>`
- Cart service (`/api/cart/**`)
    - POST `/api/cart/{userId}/add`
        - Request: `{ menuItemId, quantity }`
        - Response: `ApiResponse<{ items:[{ menuItemId, name, price, quantity }], total }>`
    - POST `/api/cart/{userId}/remove/{menuItemId}`
        - Response: `ApiResponse<{ items:[{ menuItemId, name, price, quantity }], total }>`
    - GET `/api/cart/{userId}`
        - Response: `ApiResponse<{ items:[{ menuItemId, name, price, quantity }], total }>`
- Order service (`/api/orders/**`)
    - POST `/api/orders/create/{userId}`
        - Request: `{ items:[{ menuItemId, quantity }], paymentMethod }`
        - Response: `ApiResponse<{ id, userId, amount, status }>` where `status ∈ { CREATED, PAID, CANCELLED }`



We may use swaggar API to add more details about the above APIs                                      
                                             Andy--2025/8/09