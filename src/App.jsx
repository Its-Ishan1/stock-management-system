import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { AppProvider, useApp } from './context/AppContext';
import InteractiveBackground from './components/InteractiveBackground';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Toast from './components/Toast';
import Dashboard from './components/Dashboard';
import Products from './pages/Products';
import Receipts from './pages/Receipts';
import Deliveries from './pages/Deliveries';
import Transfers from './pages/Transfers';
import Adjustments from './pages/Adjustments';
import MoveHistory from './pages/MoveHistory';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';

import Signup from './pages/Signup';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user } = useApp();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function AnimatedRoutes() {
    const location = useLocation();
    const { user } = useApp();

    return (
        <TransitionGroup>
            <CSSTransition
                key={location.pathname}
                classNames="page"
                timeout={300}
            >
                <Routes location={location}>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                    <Route path="/receipts" element={<ProtectedRoute><Receipts /></ProtectedRoute>} />
                    <Route path="/deliveries" element={<ProtectedRoute><Deliveries /></ProtectedRoute>} />
                    <Route path="/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
                    <Route path="/adjustments" element={<ProtectedRoute><Adjustments /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><MoveHistory /></ProtectedRoute>} />
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
}

function AppContent() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user } = useApp();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <InteractiveBackground />
            <Toast />
            {user ? (
                <div className="container">
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                    <main className="main-content">
                        <TopBar onMenuClick={toggleSidebar} />
                        <AnimatedRoutes />
                    </main>
                </div>
            ) : (
                <AnimatedRoutes />
            )}
        </>
    );
}

function App() {
    return (
        <AppProvider>
            <Router>
                <AppContent />
            </Router>
        </AppProvider>
    );
}

export default App;
