import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FinancialOverviewProps {
  data: {
    totalRevenue: number;
    monthlyExpenses: number;
    overdueInvoices: number;
  };
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ data }) => {
  const navigate = useNavigate();
  
  const profit = data.totalRevenue - data.monthlyExpenses;
  const profitMargin = Math.round((profit / data.totalRevenue) * 100);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="glass-card p-6 hover-lift transition-all duration-300 group cursor-pointer" onClick={() => navigate('/financeiro')}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Financeiro</h3>
        <p className="text-gray-400 text-sm">Resumo mensal</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Receita</span>
          <span className="text-emerald-400 font-semibold">{formatCurrency(data.totalRevenue)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Despesas</span>
          <span className="text-red-400 font-semibold">{formatCurrency(data.monthlyExpenses)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Lucro</span>
          <div className="flex items-center space-x-2">
            <span className={`font-semibold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(profit)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${profit >= 0 ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'}`}>
              {profitMargin}%
            </span>
          </div>
        </div>
      </div>

      {/* Profit Margin Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Margem de Lucro</span>
          <span className="text-xs text-gray-400">{profitMargin}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              profitMargin >= 20 ? 'bg-gradient-to-r from-green-500 to-green-400' :
              profitMargin >= 10 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
              'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Alerts */}
      {data.overdueInvoices > 0 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-400 text-xs">
              {data.overdueInvoices} fatura{data.overdueInvoices > 1 ? 's' : ''} vencida{data.overdueInvoices > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
            Nova Transação
          </button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            Ver Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;

