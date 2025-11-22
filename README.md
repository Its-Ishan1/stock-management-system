# StockManagement

Modern, real-time inventory management system built with React and Vite.

## Features

- 🔐 Secure authentication with JWT tokens
- 📊 Real-time dashboard with live statistics
- 🔔 Real-time notifications via WebSocket
- 📦 Complete inventory management (Products, Warehouses, Orders, Deliveries, Transfers)
- 🎨 Beautiful glassmorphism UI design
- 📱 Fully responsive design
- ⚡ Fast and optimized with Vite

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see stockmaster-backend)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

## Demo Credentials

- Email: `demo@stockmaster.com`
- Password: `Demo1234`

## Features Overview

### Authentication
- Secure login and registration
- Password validation (minimum 8 characters)
- Duplicate email detection
- JWT token-based authentication
- Automatic session management

### Dashboard
- Real-time KPI cards
- Live stock levels
- Pending orders count
- Active deliveries tracking
- Low stock alerts

### Products
- View all products with real-time stock levels
- Add, edit, and delete products
- Track product locations (warehouses)
- Low stock indicators
- Price and SKU management

### Warehouses
- Manage multiple warehouse locations
- Track capacity and utilization
- View products per warehouse
- Real-time location data

### Orders & Deliveries
- Create and track orders
- Real-time order status updates
- Delivery tracking with tracking numbers
- Automatic notifications

### Transfers
- Inter-warehouse stock transfers
- Real-time transfer status
- Automatic stock level updates
- Transfer history

### Notifications
- Real-time push notifications
- Low stock alerts
- Order confirmations
- Delivery updates
- Transfer completions
- Mark as read functionality

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Styling**: Vanilla CSS with CSS Variables
- **Animations**: React Transition Group

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.jsx
│   ├── TopBar.jsx
│   ├── Sidebar.jsx
│   └── ...
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Products.jsx
│   └── ...
├── context/            # React Context for state management
│   └── AppContext.jsx
├── services/           # API and WebSocket services
│   ├── api.js
│   └── socket.js
└── styles/             # Global styles
    └── index.css
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

Create a `.env` file if you need to customize the API URL:

```env
VITE_API_URL=http://localhost:5000
```

## Real-Time Features

The application uses WebSocket (Socket.io) for real-time updates:

- Product stock changes
- New orders and deliveries
- Transfer status updates
- Live notifications
- Dashboard statistics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC
