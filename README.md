Hello, World!
This is... *drumroll*

## EventPulse API!
EventPulse API mainly boils down to event management and registration. This projects includes the ability for users and admins to register and to manage events! Whether the capacity is full, your login is invalid, or the whole thing just hates you! It also supports the creation of multiple accounts/users. Rejoice!

## Tech Stack:
- Node.js
- Mongoose
- MongoDB (Atlas)
- Express.js
- Express Validator
- Express Mongo Sanitize
- Jest
- Supertest
- Nodemon
- jsonwebtoken
- bcrypt/bcryptjs
- express-mongo-sanitize
- Swagger/swagger-ui-express
- Postman
- Morgan
- Dotenv
- My best buddies Git and Github

## Installation Setup:
Wait, you don't know how to do this?
Just kidding!

1. git clone
2. 1. npm install express mongoose dotenv jsonwebtoken bcryptjs express-validator express-mongo-sanitize swagger-ui-express morgan
2. 2. npm install --save-dev jest supertest nodemon
3. Find .env.example, configure a .env file of your own and add the necessary strings, including YOUR personal MongoDB Atlas connection string and JWT token.
4. npm run seed
5. npm run dev

## API Endpoints:
Firstly, don't forget to enable the provided environment: **"EventPulse Dev"**. Additionally: the base URL is: http://localhost:3000

### AUTHENTICATION:
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `{{baseUrl}}/api/auth/register` | Register user |
| POST | `{{baseUrl}}/api/auth/register` | Register admin user (Uses `{{adminToken}}`) |
| POST | `{{baseUrl}}/api/auth/login` | Login registered user |
| POST | `{{baseUrl}}/api/auth/register` | Login admin user (Uses `{{adminToken}}`) |

### EVENTS:
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `{{baseUrl}}/api/events` | Get all events |
| POST | `{{baseUrl}}/api/events` | Create events while logged in and as admin (Uses `{{adminToken}}`) |
| POST | `{{baseUrl}}/api/events` | Create event with a specific capacity (Example provides ONE capacity) |

### REGISTRATIONS:
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `{{baseUrl}}/api/registrations` | Register event |
| GET | `{{baseUrl}}/api/registrations/my` | Get user's registered event(s) |
| DELETE | `{{baseUrl}}/api/registrations/:id` | Cancel event registration |

### ANNOUNCEMENTS:
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `{{baseUrl}}/api/announcements/:eventId` | Get all announcements in specific event |
| POST | `{{baseUrl}}/api/announcements` | Create announcement (Uses `{{adminToken}}`) |
| POST | `{{baseUrl}}/api/auth/login` | Login registered user |
| POST | `{{baseUrl}}/api/auth/register` | Login admin user (Uses `{{adminToken}}`) |

Raw Vercel URL: https://enjy-eslam-31006118800466-event-pulse.vercel.app/