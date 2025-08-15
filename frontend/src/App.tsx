import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Main Pages
import { Dashboard } from './pages/Dashboard';
import { CompanyManagement } from './pages/empresas/CompanyManagement';
import { EmpresaList } from './pages/empresas/EmpresaList';
import { EmpresaForm } from './pages/empresas/EmpresaForm';
import { EmpresaView } from './pages/empresas/EmpresaView';

// Layout & Auth
import { Layout } from './components/layout/Layout';
import { PrivateRoute } from './components/auth/PrivateRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Company Management - No Layout */}
          <Route 
            path="/companies" 
            element={
              <PrivateRoute>
                <CompanyManagement />
              </PrivateRoute>
            } 
          />

          {/* Private Routes with Layout */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path=":companyId" element={<Dashboard />} />
          </Route>

          <Route
            path="/empresas"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<EmpresaList />} />
            <Route path="nova" element={<EmpresaForm />} />
            <Route path=":id" element={<EmpresaView />} />
            <Route path=":id/editar" element={<EmpresaForm />} />
          </Route>

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/companies" replace />} />
            {/* TODO: Adicionar outras rotas conforme necessário */}
            <Route path="funcionarios" element={<div>Funcionários - Em desenvolvimento</div>} />
            <Route path="tarefas" element={<div>Tarefas - Em desenvolvimento</div>} />
            <Route path="financeiro" element={<div>Financeiro - Em desenvolvimento</div>} />
            <Route path="compras" element={<div>Compras - Em desenvolvimento</div>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/companies" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
    </QueryClientProvider>
  );
}

export default App
