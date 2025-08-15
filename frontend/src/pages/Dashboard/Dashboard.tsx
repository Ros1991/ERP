import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../../components/Dashboard/StatsCard';
import ChartCard from '../../components/Dashboard/ChartCard';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import QuickActions from '../../components/Dashboard/QuickActions';
import TasksOverview from '../../components/Dashboard/TasksOverview';
import FinancialOverview from '../../components/Dashboard/FinancialOverview';
import EmployeesOverview from '../../components/Dashboard/EmployeesOverview';
import PayrollOverview from '../../components/Dashboard/PayrollOverview';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    // Simular carregamento de dados do dashboard
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dados mock para o dashboard
      setDashboardData({
        stats: {
          totalEmployees: 156,
          activeEmployees: 142,
          totalTasks: 89,
          completedTasks: 67,
          totalRevenue: 2847500,
          monthlyExpenses: 1234500,
          pendingPayroll: 8,
          overdueInvoices: 3
        },
        charts: {
          employeeGrowth: [
            { month: 'Jan', employees: 120 },
            { month: 'Fev', employees: 125 },
            { month: 'Mar', employees: 132 },
            { month: 'Abr', employees: 138 },
            { month: 'Mai', employees: 145 },
            { month: 'Jun', employees: 156 }
          ],
          taskCompletion: [
            { name: 'Concluídas', value: 67, color: '#10b981' },
            { name: 'Em Andamento', value: 15, color: '#f59e0b' },
            { name: 'Pendentes', value: 7, color: '#ef4444' }
          ],
          monthlyRevenue: [
            { month: 'Jan', revenue: 2100000, expenses: 1200000 },
            { month: 'Fev', revenue: 2300000, expenses: 1150000 },
            { month: 'Mar', revenue: 2500000, expenses: 1300000 },
            { month: 'Abr', revenue: 2200000, expenses: 1100000 },
            { month: 'Mai', revenue: 2600000, expenses: 1250000 },
            { month: 'Jun', revenue: 2847500, expenses: 1234500 }
          ],
          departmentDistribution: [
            { name: 'Tecnologia', value: 45, color: '#3b82f6' },
            { name: 'Vendas', value: 32, color: '#10b981' },
            { name: 'Marketing', value: 28, color: '#f59e0b' },
            { name: 'RH', value: 18, color: '#8b5cf6' },
            { name: 'Financeiro', value: 12, color: '#ef4444' },
            { name: 'Operações', value: 21, color: '#06b6d4' }
          ]
        },
        recentActivities: [
          {
            id: 1,
            type: 'employee',
            title: 'Novo funcionário cadastrado',
            description: 'Maria Silva foi adicionada ao departamento de Tecnologia',
            time: '2 horas atrás',
            icon: 'user-plus',
            color: 'blue'
          },
          {
            id: 2,
            type: 'task',
            title: 'Tarefa concluída',
            description: 'Implementação do módulo de relatórios foi finalizada',
            time: '4 horas atrás',
            icon: 'check-circle',
            color: 'green'
          },
          {
            id: 3,
            type: 'financial',
            title: 'Pagamento processado',
            description: 'Fatura #1234 no valor de R$ 15.000,00 foi paga',
            time: '6 horas atrás',
            icon: 'credit-card',
            color: 'emerald'
          },
          {
            id: 4,
            type: 'payroll',
            title: 'Folha de pagamento',
            description: 'Folha de junho foi processada para 142 funcionários',
            time: '1 dia atrás',
            icon: 'calculator',
            color: 'purple'
          },
          {
            id: 5,
            type: 'task',
            title: 'Nova tarefa atribuída',
            description: 'Revisão de código atribuída para João Santos',
            time: '1 dia atrás',
            icon: 'clipboard',
            color: 'orange'
          }
        ]
      });
      
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-white/10 rounded w-64 mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-48"></div>
          </div>
          <div className="h-10 bg-white/10 rounded w-32"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
              <div className="h-8 bg-white/10 rounded w-16 mb-2"></div>
              <div className="h-3 bg-white/5 rounded w-20"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-400">
            Aqui está um resumo das atividades da sua empresa hoje.
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Funcionários"
          value={dashboardData.stats.totalEmployees}
          change="+12%"
          changeType="positive"
          icon="users"
          color="blue"
        />
        <StatsCard
          title="Tarefas Concluídas"
          value={`${dashboardData.stats.completedTasks}/${dashboardData.stats.totalTasks}`}
          change="+8%"
          changeType="positive"
          icon="check-circle"
          color="green"
        />
        <StatsCard
          title="Receita Mensal"
          value={dashboardData.stats.totalRevenue}
          change="+15%"
          changeType="positive"
          icon="trending-up"
          color="emerald"
          format="currency"
        />
        <StatsCard
          title="Folhas Pendentes"
          value={dashboardData.stats.pendingPayroll}
          change="-3"
          changeType="negative"
          icon="calculator"
          color="purple"
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <EmployeesOverview data={dashboardData.stats} />
        <TasksOverview data={dashboardData.stats} />
        <FinancialOverview data={dashboardData.stats} />
        <PayrollOverview data={dashboardData.stats} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Crescimento de Funcionários"
          subtitle="Últimos 6 meses"
          type="line"
          data={dashboardData.charts.employeeGrowth}
          dataKey="employees"
          color="#3b82f6"
        />
        <ChartCard
          title="Status das Tarefas"
          subtitle="Distribuição atual"
          type="pie"
          data={dashboardData.charts.taskCompletion}
        />
        <ChartCard
          title="Receita vs Despesas"
          subtitle="Comparativo mensal"
          type="bar"
          data={dashboardData.charts.monthlyRevenue}
          dataKey={['revenue', 'expenses']}
          colors={['#10b981', '#ef4444']}
        />
        <ChartCard
          title="Funcionários por Departamento"
          subtitle="Distribuição atual"
          type="doughnut"
          data={dashboardData.charts.departmentDistribution}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={dashboardData.recentActivities} />
        </div>
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Estatísticas Rápidas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Funcionários Ativos</span>
                <span className="text-green-400 font-medium">{dashboardData.stats.activeEmployees}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Taxa de Conclusão</span>
                <span className="text-blue-400 font-medium">
                  {Math.round((dashboardData.stats.completedTasks / dashboardData.stats.totalTasks) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Margem de Lucro</span>
                <span className="text-emerald-400 font-medium">
                  {Math.round(((dashboardData.stats.totalRevenue - dashboardData.stats.monthlyExpenses) / dashboardData.stats.totalRevenue) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Faturas Vencidas</span>
                <span className="text-red-400 font-medium">{dashboardData.stats.overdueInvoices}</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status do Sistema</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Servidor</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Banco de Dados</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Conectado</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Backup</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-400 text-sm">Em Progresso</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Última Atualização</span>
                <span className="text-gray-400 text-sm">2 horas atrás</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

