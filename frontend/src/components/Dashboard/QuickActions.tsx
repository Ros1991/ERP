import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const actions = [
    {
      id: 'add-employee',
      title: 'Adicionar Funcionário',
      description: 'Cadastrar novo funcionário',
      icon: 'user-plus',
      color: 'blue',
      action: () => navigate('/funcionarios/novo')
    },
    {
      id: 'create-task',
      title: 'Nova Tarefa',
      description: 'Criar nova tarefa',
      icon: 'plus-circle',
      color: 'green',
      action: () => navigate('/tarefas/nova')
    },
    {
      id: 'add-transaction',
      title: 'Nova Transação',
      description: 'Registrar transação financeira',
      icon: 'credit-card',
      color: 'emerald',
      action: () => navigate('/financeiro/transacoes/nova')
    },
    {
      id: 'process-payroll',
      title: 'Processar Folha',
      description: 'Processar folha de pagamento',
      icon: 'calculator',
      color: 'purple',
      action: () => navigate('/folha/processar')
    }
  ];

  const getIcon = (iconName: string) => {
    const iconProps = "w-5 h-5";
    
    switch (iconName) {
      case 'user-plus':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'plus-circle':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'credit-card':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'calculator':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  };

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="btn btn-primary flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Ações Rápidas</span>
        <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 glass-card border border-white/10 rounded-xl shadow-xl z-50 animate-scale-in">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.action();
                      setShowDropdown(false);
                    }}
                    className={`p-4 rounded-lg bg-gradient-to-br ${colorClasses[action.color as keyof typeof colorClasses]} text-white transition-all duration-200 hover:scale-105 hover:shadow-lg group`}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {getIcon(action.icon)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs opacity-80">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuickActions;

