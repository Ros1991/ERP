import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import FinancialDashboard from '../../components/Financial/FinancialDashboard';
import TransactionList from '../../components/Financial/TransactionList';
import TransactionForm from '../../components/Financial/TransactionForm';
import AccountsList from '../../components/Financial/AccountsList';
import AccountForm from '../../components/Financial/AccountForm';
import CostCentersList from '../../components/Financial/CostCentersList';
import CostCenterForm from '../../components/Financial/CostCenterForm';
import FinancialReports from '../../components/Financial/FinancialReports';

const Financial: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMainView = location.pathname === '/financeiro' || location.pathname === '/financeiro/';

  return (
    <div className="space-y-6">
      {/* Header */}
      {isMainView && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Financeiro</h1>
            <p className="text-gray-400">
              Gerencie contas, transações e centros de custo
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/financeiro/relatorios')}
              className="btn btn-secondary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h-2a2 2 0 00-2-2z" />
              </svg>
              Relatórios
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/financeiro/contas/nova')}
                className="btn btn-secondary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
                Nova Conta
              </button>
              <button
                onClick={() => navigate('/financeiro/transacoes/nova')}
                className="btn btn-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nova Transação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routes */}
      <Routes>
        <Route index element={<FinancialDashboard />} />
        
        {/* Transactions */}
        <Route path="transacoes" element={<TransactionList />} />
        <Route path="transacoes/nova" element={<TransactionForm />} />
        <Route path="transacoes/editar/:id" element={<TransactionForm />} />
        
        {/* Accounts */}
        <Route path="contas" element={<AccountsList />} />
        <Route path="contas/nova" element={<AccountForm />} />
        <Route path="contas/editar/:id" element={<AccountForm />} />
        
        {/* Cost Centers */}
        <Route path="centros-custo" element={<CostCentersList />} />
        <Route path="centros-custo/novo" element={<CostCenterForm />} />
        <Route path="centros-custo/editar/:id" element={<CostCenterForm />} />
        
        {/* Reports */}
        <Route path="relatorios" element={<FinancialReports />} />
      </Routes>
    </div>
  );
};

export default Financial;

