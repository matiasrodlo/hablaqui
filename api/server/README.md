# API

## Table of Contents

1. [Backend Structure](#backend)
2. [Libraries Used](#libraries)

### BACKEND

---

-   **routes**: Directory containing all API endpoints, organized by service.
-   **controllers**: Directory containing all API controllers, organized by service. Controllers are responsible for extracting information and sending it to the corresponding endpoint.
-   **services**: Directory containing the business logic and database connection services for the API.
-   **models**: Directory containing the database models (MongoDB).
-   **schemas**: Directory containing schemas used to validate data received in endpoints (using the Joi library and the validation middleware).
-   **middleware**: Directory containing the API's middleware functions.
-   **static**: Directory containing static files for the API.
-   **utils**: Directory containing utility functions for the API.

---

### LIBRARIES

---

-   **axios**: Library used for making HTTP requests (mainly from the frontend).
-   **analytics-node**: Library used for sending data to Segment analytics.
-   **bcrypt**: Library used for password encryption.
-   **body-parser**: Library used to parse incoming request bodies.
-   **cors**: Library used to enable Cross-Origin Resource Sharing.
-   **dayjs**: Library used for date and time manipulation.
-   **dotenv**: Library used to load environment variables.
-   **express**: Library used to create the server.
-   **jsonwebtoken**: Library used to create and verify JWT tokens.
-   **mercadopago**: Library used for payment processing with MercadoPago.
-   **mongoose**: Library used to connect to the MongoDB database.
-   **nodemon**: Library used to automatically restart the server on code changes.
-   **passport**: Library used for user authentication.
-   **passport-jwt**: Library used for JWT-based authentication with Passport.
-   **passport-local**: Library used for local authentication with Passport.
-   **pino**: Library used for logging.
-   **sendgrid**: Library used for sending emails.
-   **socket.io**: Library used for real-time communication (sockets).
-   **twilio**: Library used for video calls.

---
