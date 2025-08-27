# 🧵 E-Commerce Platform for Handmade Products (Kalakaari)

A full-featured MERN stack platform where artisans showcase handmade products, and customers can browse, buy, and track orders — tailored for a culturally rooted shopping experience.

---

## 🛠 Tech Stack

- **Frontend:** React.js, React Router, Tailwind css 
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT-based login & registration
- **Payment Integration:** Razorpay (Test Mode)
- **State Management:** React Context (Cart)
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## ✨ Key Features

### 👤 Customer Features
- Browse handmade products by **category**
- **Search and view** product details
- Add items to **cart**, update quantity, and remove items
- Place orders using:
  - Razorpay online payments
  - Cash on Delivery (COD)
- Track all purchases in **My Orders**
- Cancel orders if pending

### 🎨 Artisan Features
- Register/login as an artisan
- Add, view, and manage products (title, description, price, image, category)

### 🛡 Admin Features
- Secure login for admin
- View and approve/reject artisan registration requests
- Future scope: manage users and orders

---

## 🔐 Authentication & Role Management

- Role-based login: `customer`, `artisan`, `admin`
- JWT token saved in localStorage
- Session persists even on reload
- Admin manually approves artisan accounts before access

---

## 🔗 API Routes Overview

### 📦 Products
- `GET /api/products`
- `POST /api/products` _(artisan only)_
- `GET /api/products/:id`

### 🧾 Orders
- `POST /api/orders`
- `GET /api/orders/user/:id`
- `PUT /api/orders/:id/cancel`

### 💳 Payments (Razorpay)
- `POST /api/payment/order`

---


