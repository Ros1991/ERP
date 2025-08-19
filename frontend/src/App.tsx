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

// Funcionarios
import FuncionarioList from './pages/funcionarios/FuncionarioList';
import FuncionarioForm from './pages/funcionarios/FuncionarioForm';
import FuncionarioView from './pages/funcionarios/FuncionarioView';

// Usuarios
import UsuarioList from './pages/usuarios/UsuarioList';
import UsuarioForm from './pages/usuarios/UsuarioForm';
import UsuarioView from './pages/usuarios/UsuarioView';

// Cargos
import CargoList from './pages/cargos/CargoList';
import CargoForm from './pages/cargos/CargoForm';
import CargoView from './pages/cargos/CargoView';

// Tarefas
import TarefaList from './pages/tarefas/TarefaList';
import TarefaForm from './pages/tarefas/TarefaForm';
import TarefaView from './pages/tarefas/TarefaView';

// Tipos de Tarefa
import TarefaTipoList from './pages/tipos-tarefa/TarefaTipoList';
import TarefaTipoForm from './pages/tipos-tarefa/TarefaTipoForm';
import TarefaTipoView from './pages/tipos-tarefa/TarefaTipoView';

// Emprestimos
import EmprestimoList from './pages/financeiro/emprestimos/EmprestimoList';
import EmprestimoForm from './pages/financeiro/emprestimos/EmprestimoForm';
import EmprestimoView from './pages/financeiro/emprestimos/EmprestimoView';

// Pedidos de Compra
import PedidoCompraList from './pages/pedidos-compra/PedidoCompraList';
import PedidoCompraForm from './pages/pedidos-compra/PedidoCompraForm';
import PedidoCompraView from './pages/pedidos-compra/PedidoCompraView';

// Placeholder components for modules under development
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-600 mb-2">{title}</h2>
      <p className="text-gray-500">Em desenvolvimento</p>
    </div>
  </div>
);

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
            
            {/* Funcionarios Routes */}
            <Route path="funcionarios">
              <Route index element={<FuncionarioList />} />
              <Route path="novo" element={<FuncionarioForm />} />
              <Route path=":id" element={<FuncionarioView />} />
              <Route path=":id/editar" element={<FuncionarioForm />} />
            </Route>
            
            {/* Usuarios Routes */}
            <Route path="usuarios">
              <Route index element={<UsuarioList />} />
              <Route path="novo" element={<UsuarioForm />} />
              <Route path=":id" element={<UsuarioView />} />
              <Route path=":id/editar" element={<UsuarioForm />} />
            </Route>
            
            {/* Cargos Routes */}
            <Route path="cargos">
              <Route index element={<CargoList />} />
              <Route path="novo" element={<CargoForm />} />
              <Route path=":id" element={<CargoView />} />
              <Route path=":id/editar" element={<CargoForm />} />
            </Route>
            
            {/* Tarefas Routes */}
            <Route path="tarefas">
              <Route index element={<TarefaList />} />
              <Route path="nova" element={<TarefaForm />} />
              <Route path=":id" element={<TarefaView />} />
              <Route path=":id/editar" element={<TarefaForm />} />
            </Route>
            
            {/* Tipos de Tarefa Routes */}
            <Route path="tipos-tarefa">
              <Route index element={<TarefaTipoList />} />
              <Route path="novo" element={<TarefaTipoForm />} />
              <Route path=":id" element={<TarefaTipoView />} />
              <Route path=":id/editar" element={<TarefaTipoForm />} />
            </Route>
            
            {/* Emprestimos Routes */}
            <Route path="emprestimos">
              <Route index element={<EmprestimoList />} />
              <Route path="novo" element={<EmprestimoForm />} />
              <Route path=":id" element={<EmprestimoView />} />
              <Route path=":id/editar" element={<EmprestimoForm />} />
            </Route>
            
            {/* Pedidos de Compra Routes */}
            <Route path="pedidos-compra">
              <Route index element={<PedidoCompraList />} />
              <Route path="novo" element={<PedidoCompraForm />} />
              <Route path=":id" element={<PedidoCompraView />} />
              <Route path=":id/editar" element={<PedidoCompraForm />} />
            </Route>

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
