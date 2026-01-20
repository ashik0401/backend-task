# Backend Developer Technical Assignment – REST API & Payment Integration

This project is a RESTful backend application built as part of a Backend Developer technical assignment.  
It demonstrates authentication, product/order management, Stripe payment integration, webhook handling, API testing with Postman, and deployment on Vercel.

---

## 🚀 Live Deployment

- **Base API URL:**  
  https://backend-assignment-orcin.vercel.app/

- **Stripe Webhook Endpoint:**  
  https://backend-assignment-orcin.vercel.app/api/orders/webhook

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **Payment Gateway:** Stripe (Test Mode)
- **API Testing:** Postman
- **Deployment:** Vercel

---

## 📁 Project Structure

BACKEND-ASSIGNMENT/
│
├── api/
│   └── index.js        
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── product.route.js
│   │   ├── order.route.js
│   │   └── route.js      
│   │
│   ├── app.js            
│   └── server.js         
│
├── .env
├── .env.example
├── package.json
├── vercel.json
└── README.md


---

## 🔐 Authentication Flow (JWT)

1. User registers or logs in
2. Server generates a JWT token
3. Token is sent in response
4. Client sends token in header for protected routes



## 🧪 Postman Testing

All APIs are tested using Postman

JWT token is stored as environment variable

Sample requests & responses included



## 📦 Postman Collection:
(Exported JSON file included in repository)


## 🌍 Environment Variables 
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=sk_test_********
STRIPE_WEBHOOK_SECRET=whsec_********

BASE_URL=https://backend-assignment-orcin.vercel.app/


## 💰 Stripe Test Mode (Fake Payment)

Stripe is used in test mode

Example test card:
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits



## 🚀 Deployment (Vercel)

Push project to GitHub

Import repository into Vercel

Add environment variables in Vercel dashboard

Deploy

Use deployed URL as BASE_URL


## 🧹 Code Quality Features

Clean and modular folder structure

Centralized error handling middleware

Secure JWT authentication

Environment-based configuration

Readable and maintainable code


## 📄 Deliverables

✅ GitHub Repository

✅ Live API URL (Vercel)

✅ Stripe Webhook Endpoint

✅ Postman Collection

✅ .env.example

✅ README Documentation


## ✅ Assignment Status 
✔ REST API Development
✔ Authentication (JWT)
✔ Stripe Payment Integration
✔ Webhook Handling 
✔ Postman Documentation
✔ Deployment


## 👤 Author

Name: Ashik Mahmud
Role: Backend Developer
Stack: Node.js | Express | MongoDB | Stripe

