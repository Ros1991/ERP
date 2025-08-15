import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TasksOverviewProps {
  data: {
    totalTasks: number;
    completedTasks: number;
  };
}

const TasksOverview: React.FC<TasksOverviewProps> = ({ data }) => {
  const navigate = useNavigate();
  
  const completionPercentage = Math.round((data.completedTasks / data.totalTasks) * 100);
  const pendingTasks = data.totalTasks - data.completedTasks;

  return (
    <div className="glass-card p-6 hover-lift transition-all duration-300 group cursor-pointer" onClick={() => navigate('/tarefas')}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">Tarefas</h3>
        <p className="text-gray-400 text-sm">Progresso das atividades</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Total</span>
          <span className="text-white font-semibold">{data.totalTasks}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Concluídas</span>
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-semibold">{data.completedTasks}</span>
            <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
              {completionPercentage}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Pendentes</span>
          <span className="text-orange-400 font-semibold">{pendingTasks}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Taxa de Conclusão</span>
          <span className="text-xs text-gray-400">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
            <span className="text-gray-400">Concluídas</span>
          </div>
          <div className="text-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto mb-1"></div>
            <span className="text-gray-400">Em Progresso</span>
          </div>
          <div className="text-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mb-1"></div>
            <span className="text-gray-400">Atrasadas</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <button className="text-green-400 hover:text-green-300 transition-colors">
            Nova Tarefa
          </button>
          <button className="text-gray-400 hover:text-gray-300 transition-colors">
            Ver Kanban
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksOverview;

