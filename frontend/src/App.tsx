import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomToaster } from './components/ui/CustomToaster';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Main Pages
import { Dashboard } from './pages/Dashboard';
import { CompanyManagement } from './pages/empresas/CompanyManagement';

// Financeiro
import ContaList from './pages/financeiro/contas/ContaList';
import ContaForm from './pages/financeiro/contas/ContaForm';
import ContaView from './pages/financeiro/contas/ContaView';
import TerceiroList from './pages/financeiro/terceiros/TerceiroList';
import TerceiroForm from './pages/financeiro/terceiros/TerceiroForm';
import TerceiroView from './pages/financeiro/terceiros/TerceiroView';
import TransacaoFinanceiraList from './pages/financeiro/transacoes/TransacaoFinanceiraList';
import TransacaoFinanceiraForm from './pages/financeiro/transacoes/TransacaoFinanceiraForm';
import TransacaoFinanceiraView from './pages/financeiro/transacoes/TransacaoFinanceiraView';
import CentroCustoList from './pages/financeiro/centros-custo/CentroCustoList';
import CentroCustoForm from './pages/financeiro/centros-custo/CentroCustoForm';
import CentroCustoView from './pages/financeiro/centros-custo/CentroCustoView';

// Layout & Auth
import { Layout } from './components/layout/Layout';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { AutoLogin } from './components/auth/AutoLogin';

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
        <AutoLogin />
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

          {/* Private Routes with Layout - Multi-tenancy */}
          <Route
            path="/empresas/:empresaId"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Financeiro Routes */}
            <Route path="contas">
              <Route index element={<ContaList />} />
              <Route path="nova" element={<ContaForm />} />
              <Route path=":contaId" element={<ContaView />} />
              <Route path=":contaId/editar" element={<ContaForm />} />
            </Route>
            
            <Route path="terceiros">
              <Route index element={<TerceiroList />} />
              <Route path="novo" element={<TerceiroForm />} />
              <Route path=":terceiroId" element={<TerceiroView />} />
              <Route path=":terceiroId/editar" element={<TerceiroForm />} />
            </Route>
            
            <Route path="transacoes">
              <Route index element={<TransacaoFinanceiraList />} />
              <Route path="nova" element={<TransacaoFinanceiraForm />} />
              <Route path=":transacaoId" element={<TransacaoFinanceiraView />} />
              <Route path=":transacaoId/editar" element={<TransacaoFinanceiraForm />} />
            </Route>
            
            <Route path="centros-custo">
              <Route index element={<CentroCustoList />} />
              <Route path="novo" element={<CentroCustoForm />} />
              <Route path=":centroCustoId" element={<CentroCustoView />} />
              <Route path=":centroCustoId/editar" element={<CentroCustoForm />} />
            </Route>
            
            {/* Placeholder routes for other modules */}
            <Route path="funcionarios" element={<div>Funcionários - Em desenvolvimento</div>} />
            <Route path="contratos" element={<div>Contratos - Em desenvolvimento</div>} />
            <Route path="beneficios-descontos" element={<div>Benefícios/Descontos - Em desenvolvimento</div>} />
            <Route path="tarefas" element={<div>Tarefas - Em desenvolvimento</div>} />
            <Route path="tipos-tarefa" element={<div>Tipos de Tarefa - Em desenvolvimento</div>} />
            <Route path="status-tarefas" element={<div>Status de Tarefas - Em desenvolvimento</div>} />
            <Route path="pedidos-compra" element={<div>Pedidos de Compra - Em desenvolvimento</div>} />
          </Route>

          {/* Empresas Management Routes - Admin Only */}
          <Route
            path="/empresas"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/companies" replace />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/companies" replace />} />
        </Routes>
      </BrowserRouter>

      <CustomToaster />
      
    </QueryClientProvider>
  );
}

export default App
