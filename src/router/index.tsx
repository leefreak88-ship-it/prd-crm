import { Navigate, createBrowserRouter } from 'react-router-dom';
import { isLoggedIn } from '@/services/auth';
import { AdminLayout } from '@/layouts/AdminLayout';
import { LoginPage } from '@/pages/login/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { StaffPage } from '@/pages/staff/StaffPage';
import { BillsPage } from '@/pages/bills/BillsPage';
import { OrdersPage } from '@/pages/orders/OrdersPage';
import { ProductsPage } from '@/pages/products/ProductsPage';
import { SharePage } from '@/pages/share/SharePage';

// 路由守卫：未登录时统一跳转登录页
function AuthGuard({ children }: { children: JSX.Element }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 路由系统：包含登录页与后台管理页
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin/dashboard" replace />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/admin',
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'chatter',
        element: <StaffPage />
      },
      {
        path: 'staff',
        element: <Navigate to="/admin/chatter" replace />
      },
      {
        path: 'bills',
        element: <BillsPage />
      },
      {
        path: 'leads',
        element: <Navigate to="/admin/bills" replace />
      },
      {
        path: 'orders',
        element: <OrdersPage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'share',
        element: <SharePage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/admin/dashboard" replace />
  }
]);
