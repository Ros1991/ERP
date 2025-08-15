import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChartCard from '../Dashboard/ChartCard';

const FinancialReports: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportData = {
    overview: {
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
      ]
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    // Simular exportação
    console.log(`Exportando relatório em ${format.toUpperCase()}`);
  };

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
            <h1 className="text-2xl font-bold text-white">Relatórios Financeiros</h1>
            <p className="text-gray-400">Análises e insights financeiros detalhados</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportReport('excel')}
            className="btn btn-secondary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="btn btn-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="input"
            >
              <option value="overview">Visão Geral</option>
              <option value="cash-flow">Fluxo de Caixa</option>
              <option value="expenses">Análise de Despesas</option>
              <option value="accounts">Relatório de Contas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input"
            >
              <option value="current-month">Mês Atual</option>
              <option value="last-month">Mês Anterior</option>
              <option value="quarter">Trimestre</option>
              <option value="year">Ano</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Centro de Custo
            </label>
            <select className="input">
              <option value="">Todos</option>
              <option value="tech">Tecnologia</option>
              <option value="marketing">Marketing</option>
              <option value="hr">Recursos Humanos</option>
              <option value="finance">Financeiro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-green-400 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(3200000)}
          </h3>
          <p className="text-gray-400 text-sm">Receita Total</p>
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
            {formatCurrency(1234500)}
          </h3>
          <p className="text-gray-400 text-sm">Despesas Total</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h-2a2 2 0 00-2-2z" />
              </svg>
            </div>
            <span className="text-blue-400 text-sm font-medium">+18%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {formatCurrency(1965500)}
          </h3>
          <p className="text-gray-400 text-sm">Lucro Líquido</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-purple-400 text-sm font-medium">61.4%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">61.4%</h3>
          <p className="text-gray-400 text-sm">Margem de Lucro</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Fluxo de Caixa Mensal"
          subtitle="Receitas vs Despesas (últimos 6 meses)"
          type="bar"
          data={reportData.overview.cashFlow}
          dataKey={['income', 'expenses']}
          colors={['#10b981', '#ef4444']}
        />
        
        <ChartCard
          title="Despesas por Categoria"
          subtitle="Distribuição no período selecionado"
          type="pie"
          data={reportData.overview.expensesByCategory}
        />
      </div>

      {/* Detailed Tables */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Análise Detalhada por Centro de Custo</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 font-medium py-3">Centro de Custo</th>
                <th className="text-right text-gray-400 font-medium py-3">Orçamento</th>
                <th className="text-right text-gray-400 font-medium py-3">Realizado</th>
                <th className="text-right text-gray-400 font-medium py-3">Variação</th>
                <th className="text-right text-gray-400 font-medium py-3">% Uso</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Tecnologia', budget: 500000, actual: 450000, variation: -50000, usage: 90 },
                { name: 'Marketing', budget: 350000, actual: 280000, variation: -70000, usage: 80 },
                { name: 'Recursos Humanos', budget: 200000, actual: 180000, variation: -20000, usage: 90 },
                { name: 'Financeiro', budget: 150000, actual: 120000, variation: -30000, usage: 80 }
              ].map((item, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 text-white font-medium">{item.name}</td>
                  <td className="py-4 text-right text-gray-300">{formatCurrency(item.budget)}</td>
                  <td className="py-4 text-right text-white">{formatCurrency(item.actual)}</td>
                  <td className={`py-4 text-right font-medium ${item.variation < 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(item.variation)}
                  </td>
                  <td className="py-4 text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.usage >= 90 ? 'bg-red-500/20 text-red-400' :
                      item.usage >= 70 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {item.usage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => navigate('/financeiro/transacoes')}
          className="btn btn-secondary"
        >
          Ver Transações
        </button>
        <button
          onClick={() => navigate('/financeiro/centros-custo')}
          className="btn btn-secondary"
        >
          Gerenciar Centros
        </button>
        <button
          onClick={() => exportReport('pdf')}
          className="btn btn-primary"
        >
          Gerar Relatório Completo
        </button>
      </div>
    </div>
  );
};

export default FinancialReports;

