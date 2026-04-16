import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Products from './pages/Products/Products';
import Services from './pages/Services/Services';
import Cart from './pages/Orders/Cart';
import Orders from './pages/Orders/Orders';
import CustomerDashboard from './pages/Dashboard/CustomerDashboard';
import VendorDashboard from './pages/Dashboard/VendorDashboard';
import ProviderDashboard from './pages/Dashboard/ProviderDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';

const Protected = ({ children, roles }: { children: React.ReactElement; roles?: string[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const NoNavRoutes = ['/login', '/register'];

function AppInner() {
  const { user } = useAuth();
  const path = window.location.pathname;
  const showNav = !NoNavRoutes.includes(path);

  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cart" element={<Protected><Cart /></Protected>} />
        <Route path="/orders" element={<Protected roles={['customer']}><Orders /></Protected>} />
        <Route path="/dashboard" element={<Protected roles={['customer']}><CustomerDashboard /></Protected>} />
        <Route path="/vendor" element={<Protected roles={['vendor']}><VendorDashboard /></Protected>} />
        <Route path="/provider" element={<Protected roles={['service_provider']}><ProviderDashboard /></Protected>} />
        <Route path="/admin" element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
