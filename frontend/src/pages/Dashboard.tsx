import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Building2, 
  Users, 
  ClipboardList, 
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/auth.store';
import { empresaService } from '../services/empresa/empresa.service';
import type { Empresa } from '../models/empresa/Empresa.model';

const statsCards = [
  {
    title: 'Empresas Ativas',
    value: '12',
    change: '+2 este mês',
    icon: Building2,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
  },
  {
    title: 'Funcionários',
    value: '248',
    change: '+18 este mês',
    icon: Users,
    color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
  },
  {
    title: 'Tarefas Pendentes',
    value: '47',
    change: '12 vencendo hoje',
    icon: ClipboardList,
    color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
  },
  {
    title: 'Receita Mensal',
    value: 'R$ 125.420',
    change: '+15% vs mês anterior',
    icon: DollarSign,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
  },
];

const quickActions = [
  { label: 'Nova Empresa', icon: Building2, path: '/empresas/nova', color: 'primary' },
  { label: 'Novo Funcionário', icon: Users, path: '/funcionarios/novo', color: 'secondary' },
  { label: 'Nova Tarefa', icon: ClipboardList, path: '/tarefas/nova', color: 'primary' },
  { label: 'Lançamento Financeiro', icon: DollarSign, path: '/financeiro/novo', color: 'secondary' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { empresaId } = useParams<{ empresaId: string }>();
  const [currentCompany, setCurrentCompany] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyData = async () => {
      if (!empresaId) {
        navigate('/companies');
        return;
      }

      try {
        const empresa = await empresaService.getById(empresaId);
        setCurrentCompany(empresa);
      } catch (error) {
        console.error('Error loading company:', error);
        navigate('/companies');
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [empresaId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentCompany) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo de volta, {user?.nome}!
        </h1>
        <p className="text-primary-100">
          Dashboard da empresa: <span className="font-semibold">{currentCompany.nome}</span>
        </p>
        <p className="text-primary-200 text-sm mt-1">
          Aqui está um resumo das atividades da empresa hoje
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(
                stat.title.includes('Empresas') ? '/empresas' :
                stat.title.includes('Funcionários') ? '/funcionarios' :
                stat.title.includes('Tarefas') ? '/tarefas' :
                '/financeiro'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stat.title}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={() => navigate(action.path)}
                variant={action.color as any}
                className="flex-col h-auto py-4"
                icon={<Icon className="h-6 w-6 mb-2" />}
              >
                <span className="text-sm">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atividade Recente
            </h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[
              { action: 'Nova empresa cadastrada', time: 'há 2 horas', user: 'João Silva' },
              { action: 'Tarefa #123 concluída', time: 'há 3 horas', user: 'Maria Santos' },
              { action: 'Pagamento recebido', time: 'há 5 horas', user: 'Sistema' },
              { action: 'Funcionário atualizado', time: 'há 1 dia', user: 'Pedro Costa' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{item.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.user}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => navigate('/atividades')}
          >
            Ver todas
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Próximas Tarefas
            </h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[
              { task: 'Revisar relatório mensal', due: 'Hoje', priority: 'high' },
              { task: 'Reunião com fornecedores', due: 'Amanhã', priority: 'medium' },
              { task: 'Atualizar documentação', due: 'Sexta', priority: 'low' },
              { task: 'Fechar folha de pagamento', due: '30/11', priority: 'high' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <p className="text-sm text-gray-900 dark:text-white">{item.task}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.due}</span>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => navigate('/tarefas')}
          >
            Ver todas
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
