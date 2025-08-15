import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChartCard from '../Dashboard/ChartCard';

const FinancialDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const loadFinancialData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData({
        summary: {
          totalBalance: 2847500,
          monthlyRevenue: 3200000,
          monthlyExpenses: 1234500,
          pendingReceivables: 450000,
          pendingPayables: 280000,
          cashFlow: 1965500
        },
        accounts: [
          { id: 1, name: 'Conta Corrente Principal', type: 'checking', balance: 1250000, bank: 'Banco do Brasil' },
          { id: 2, name: 'Conta Poupança', type: 'savings', balance: 850000, bank: 'Itaú' },
          { id: 3, name: 'Conta Investimentos', type: 'investment', balance: 747500, bank: 'Bradesco' },
          { id: 4, name: 'Cartão Corporativo', type: 'credit', balance: -125000, bank: 'Santander' }
        ],
        recentTransactions: [
          {
            id: 1,
            description: 'Pagamento de Fornecedor - TechCorp',
            amount: -45000,
            type: 'expense',
            account: 'Conta Corrente Principal',
            date: '2024-01-15',
            category: 'Fornecedores'
          },
          {
            id: 2,
            description: 'Recebimento Cliente - Projeto Alpha',
            amount: 125000,
            type: 'income',
            account: 'Conta Corrente Principal',
            date: '2024-01-14',
            category: 'Vendas'
          },
          {
            id: 3,
            description: 'Pagamento Salários Janeiro',
            amount: -280000,
            type: 'expense',
            account: 'Conta Corrente Principal',
            date: '2024-01-10',
            category: 'Folha de Pagamento'
          },
          {
            id: 4,
            description: 'Transferência para Investimentos',
            amount: -100000,
            type: 'transfer',
            account: 'Conta Corrente Principal',
            date: '2024-01-08',
            category: 'Transferência'
          },
          {
            id: 5,
            description: 'Recebimento Cliente - Projeto Beta',
            amount: 85000,
            type: 'income',
            account: 'Conta Corrente Principal',
            date: '2024-01-05',
            category: 'Vendas'
          }
        ],
        charts: {
          cashFlow: [
            { month: 'Jul', income: 2800000, expenses: 1100000 },
            { month: 'Ago', income: 3100000, expenses: 1200000 },
            { month: 'Set', income: 2900000, expenses: 1150000 },
            { month: 'Out', income: 3300000, expenses: 1300000 },
            { month: 'Nov', income: 3000000, expenses: 1180000 },
            { month: 'Dez', income: 3200000, expenses: 1234500 }
          ],
          expensesByCategory: [
            { name: 'Folha de Pagamento', value: 580000, color: '#ef4444' },
            { name: 'Fornecedores', value: 320000, color: '#f59e0b' },
            { name: 'Marketing', value: 180000, color: '#8b5cf6' },
            { name: 'Infraestrutura', value: 154500, color: '#06b6d4' },
            { name: 'Outros', value: 98000, color: '#6b7280' }
          ],
          accountsBalance: [
            { name: 'Conta Corrente', value: 1250000, color: '#10b981' },
            { name: 'Poupança', value: 850000, color: '#3b82f6' },
            { name: 'Investimentos', value: 747500, color: '#8b5cf6' },
            { name: 'Cartão Corporativo', value: 125000, color: '#ef4444' }
          ]
        }
      });
      
      setLoading(false);
    };

    loadFinancialData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'expense':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      case 'transfer':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
              <div className="h-8 bg-white/10 rounded w-32 mb-2"></div>
              <div className="h-3 bg-white/5 rounded w-20"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="h-6 bg-white/10 rounded w-32 mb-4"></div>
              <div className="h-64 bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/financeiro/transacoes')}
          className="glass-card p-4 hover-lift transition-all duration-300 text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium group-hover:text-blue-400 transition-colors">Transações</p>
              <p className="text-gray-400 text-sm">Gerenciar movimentações</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/financeiro/contas')}
          className="glass-card p-4 hover-lift transition-all duration-300 text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium group-hover:text-green-400 transition-colors">Contas</p>
              <p className="text-gray-400 text-sm">Gerenciar contas bancárias</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/financeiro/centros-custo')}
          className="glass-card p-4 hover-lift transition-all duration-300 text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium group-hover:text-purple-400 transition-colors">Centros de Custo</p>
              <p className="text-gray-400 text-sm">Organizar despesas</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/financeiro/relatorios')}
          className="glass-card p-4 hover-lift transition-all duration-300 text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h-2a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium group-hover:text-orange-400 transition-colors">Relatórios</p>
              <p className="text-gray-400 text-sm">Análises financeiras</p>
            </div>
          </div>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-green-400 text-sm font-medium">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(dashboardData.summary.totalBalance)}
          </h3>
          <p className="text-gray-400 text-sm">Saldo Total</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-blue-400 text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(dashboardData.summary.monthlyRevenue)}
          </h3>
          <p className="text-gray-400 text-sm">Receita Mensal</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <span className="text-red-400 text-sm font-medium">-3%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(dashboardData.summary.monthlyExpenses)}
          </h3>
          <p className="text-gray-400 text-sm">Despesas Mensais</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(dashboardData.summary.pendingReceivables)}
          </h3>
          <p className="text-gray-400 text-sm">A Receber</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(dashboardData.summary.pendingPayables)}
          </h3>
          <p className="text-gray-400 text-sm">A Pagar</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h-2a2 2 0 00-2-2z" />
              </svg>
            </div>
            <span className="text-emerald-400 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(dashboardData.summary.cashFlow)}
          </h3>
          <p className="text-gray-400 text-sm">Fluxo de Caixa</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Fluxo de Caixa"
          subtitle="Receitas vs Despesas (últimos 6 meses)"
          type="bar"
          data={dashboardData.charts.cashFlow}
          dataKey={['income', 'expenses']}
          colors={['#10b981', '#ef4444']}
        />
        
        <ChartCard
          title="Despesas por Categoria"
          subtitle="Distribuição mensal"
          type="pie"
          data={dashboardData.charts.expensesByCategory}
        />
        
        <div className="lg:col-span-2">
          <ChartCard
            title="Saldo das Contas"
            subtitle="Distribuição atual"
            type="doughnut"
            data={dashboardData.charts.accountsBalance}
            height={350}
          />
        </div>
      </div>

      {/* Accounts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accounts Summary */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Contas Bancárias</h3>
            <button
              onClick={() => navigate('/financeiro/contas')}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Ver todas
            </button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.accounts.map((account: any) => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    account.type === 'checking' ? 'bg-blue-500/20 text-blue-400' :
                    account.type === 'savings' ? 'bg-green-500/20 text-green-400' :
                    account.type === 'investment' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">{account.name}</p>
                    <p className="text-gray-400 text-sm">{account.bank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${account.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(Math.abs(account.balance))}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {account.type === 'checking' ? 'Conta Corrente' :
                     account.type === 'savings' ? 'Poupança' :
                     account.type === 'investment' ? 'Investimento' : 'Cartão'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Transações Recentes</h3>
            <button
              onClick={() => navigate('/financeiro/transacoes')}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Ver todas
            </button>
          </div>
          
          <div className="space-y-4">
            {dashboardData.recentTransactions.map((transaction: any) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{transaction.description}</p>
                    <p className="text-gray-400 text-xs">{transaction.category} • {formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-gray-400 text-xs">{transaction.account}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;

