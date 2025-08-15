import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EmployeesOverviewProps {
  data: {
    totalEmployees: number;
    activeEmployees: number;
  };
}

const EmployeesOverview: React.FC<EmployeesOverviewProps> = ({ data }) => {
  const navigate = useNavigate();
  
  const activePercentage = Math.round((data.activeEmployees / data.totalEmployees) * 100);
  const inactiveEmployees = data.totalEmployees - data.activeEmployees;

  return (
    <div className="glass-card p-6 hover-lift transition-all duration-300 group cursor-pointer" onClick={() => navigate('/funcionarios')}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Funcionários</h3>
        <p className="text-gray-400 text-sm">Visão geral da equipe</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Total</span>
          <span className="text-white font-semibold">{data.totalEmployees}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Ativos</span>
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-semibold">{data.activeEmployees}</span>
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
              {activePercentage}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Inativos</span>
          <span className="text-red-400 font-semibold">{inactiveEmployees}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Taxa de Atividade</span>
          <span className="text-xs text-gray-400">{activePercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${activePercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <button className="text-blue-400 hover:text-blue-300 transition-colors">
            Adicionar Funcionário
          </button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            Ver Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesOverview;

