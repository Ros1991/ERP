import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PayrollOverviewProps {
  data: {
    pendingPayroll: number;
    totalEmployees: number;
    activeEmployees: number;
  };
}

const PayrollOverview: React.FC<PayrollOverviewProps> = ({ data }) => {
  const navigate = useNavigate();
  
  const processedPayroll = data.activeEmployees - data.pendingPayroll;
  const completionPercentage = Math.round((processedPayroll / data.activeEmployees) * 100);

  return (
    <div className="glass-card p-6 hover-lift transition-all duration-300 group cursor-pointer" onClick={() => navigate('/folha')}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Folha de Pagamento</h3>
        <p className="text-gray-400 text-sm">Status do processamento</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Funcionários Ativos</span>
          <span className="text-white font-semibold">{data.activeEmployees}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Processadas</span>
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-semibold">{processedPayroll}</span>
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
              {completionPercentage}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Pendentes</span>
          <span className={`font-semibold ${data.pendingPayroll > 0 ? 'text-orange-400' : 'text-green-400'}`}>
            {data.pendingPayroll}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Progresso</span>
          <span className="text-xs text-gray-400">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Status Alert */}
      {data.pendingPayroll > 0 && (
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-orange-400 text-xs">
              {data.pendingPayroll} folha{data.pendingPayroll > 1 ? 's' : ''} pendente{data.pendingPayroll > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {data.pendingPayroll === 0 && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-400 text-xs">
              Todas as folhas processadas
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <button className="text-purple-400 hover:text-purple-300 transition-colors">
            Processar Folha
          </button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            Ver Histórico
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollOverview;

