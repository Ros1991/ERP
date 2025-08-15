import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CostCenter {
  id: string;
  name: string;
  code: string;
  description: string;
  parentId?: string;
  status: 'active' | 'inactive';
  totalExpenses: number;
  monthlyBudget: number;
}

const CostCentersList: React.FC = () => {
  const navigate = useNavigate();
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCostCenters = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCostCenters([
        {
          id: '1',
          name: 'Tecnologia',
          code: 'TEC',
          description: 'Departamento de Tecnologia da Informação',
          status: 'active',
          totalExpenses: 450000,
          monthlyBudget: 500000
        },
        {
          id: '2',
          name: 'Marketing',
          code: 'MKT',
          description: 'Departamento de Marketing e Vendas',
          status: 'active',
          totalExpenses: 280000,
          monthlyBudget: 350000
        },
        {
          id: '3',
          name: 'Recursos Humanos',
          code: 'RH',
          description: 'Departamento de Recursos Humanos',
          status: 'active',
          totalExpenses: 180000,
          monthlyBudget: 200000
        },
        {
          id: '4',
          name: 'Financeiro',
          code: 'FIN',
          description: 'Departamento Financeiro',
          status: 'active',
          totalExpenses: 120000,
          monthlyBudget: 150000
        }
      ]);
      
      setLoading(false);
    };

    loadCostCenters();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBudgetUsagePercentage = (expenses: number, budget: number) => {
    return budget > 0 ? (expenses / budget) * 100 : 0;
  };

  const getBudgetUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-400 bg-red-500/20';
    if (percentage >= 70) return 'text-orange-400 bg-orange-500/20';
    return 'text-green-400 bg-green-500/20';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-white/10 rounded animate-pulse"></div>
          <div className="h-8 bg-white/10 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                <div className="h-3 bg-white/5 rounded w-3/4"></div>
                <div className="h-2 bg-white/5 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/financeiro')}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Centros de Custo</h1>
            <p className="text-gray-400">Organize e controle suas despesas por departamento</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/financeiro/centros-custo/novo')}
          className="btn btn-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Novo Centro
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total de Centros</h3>
          <p className="text-2xl font-bold text-blue-400">
            {costCenters.filter(cc => cc.status === 'active').length}
          </p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Despesas Totais</h3>
          <p className="text-2xl font-bold text-red-400">
            {formatCurrency(costCenters.reduce((sum, cc) => sum + cc.totalExpenses, 0))}
          </p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Orçamento Total</h3>
          <p className="text-2xl font-bold text-green-400">
            {formatCurrency(costCenters.reduce((sum, cc) => sum + cc.monthlyBudget, 0))}
          </p>
        </div>
      </div>

      {/* Cost Centers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {costCenters.map((costCenter) => {
          const usagePercentage = getBudgetUsagePercentage(costCenter.totalExpenses, costCenter.monthlyBudget);
          const usageColor = getBudgetUsageColor(usagePercentage);
          
          return (
            <div
              key={costCenter.id}
              className="glass-card p-6 hover-lift transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/financeiro/centros-custo/editar/${costCenter.id}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                      {costCenter.name}
                    </h3>
                    <p className="text-gray-400 text-sm">Código: {costCenter.code}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full border ${
                  costCenter.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {costCenter.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4">{costCenter.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Despesas</span>
                  <span className="text-red-400 font-semibold">
                    {formatCurrency(costCenter.totalExpenses)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Orçamento</span>
                  <span className="text-green-400 font-semibold">
                    {formatCurrency(costCenter.monthlyBudget)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Uso do Orçamento</span>
                    <span className={`text-sm font-semibold px-2 py-1 rounded ${usageColor}`}>
                      {usagePercentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        usagePercentage >= 90 ? 'bg-red-500' :
                        usagePercentage >= 70 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/financeiro/centros-custo/editar/${costCenter.id}`);
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/financeiro/transacoes/nova?centro=${costCenter.id}`);
                    }}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Nova Despesa
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {costCenters.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-2">Nenhum centro de custo cadastrado</h3>
          <p className="text-gray-400 mb-4">
            Crie centros de custo para organizar e controlar suas despesas por departamento.
          </p>
          <button
            onClick={() => navigate('/financeiro/centros-custo/novo')}
            className="btn btn-primary"
          >
            Criar Centro de Custo
          </button>
        </div>
      )}
    </div>
  );
};

export default CostCentersList;

