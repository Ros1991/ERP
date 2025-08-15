import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'vacation';
  avatar: string;
}

const EmployeeDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployee = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setEmployee({
        id: id || '1',
        name: 'Ana Silva',
        email: 'ana.silva@empresa.com',
        phone: '(11) 99999-1234',
        position: 'Desenvolvedora Senior',
        department: 'Tecnologia',
        salary: 8500,
        hireDate: '2022-03-15',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      });
      
      setLoading(false);
    };

    loadEmployee();
  }, [id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      inactive: { label: 'Inativo', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      vacation: { label: 'Férias', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 text-sm rounded-full border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-white/10 rounded"></div>
          <div className="h-8 bg-white/10 rounded w-64"></div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-white/10 rounded w-48"></div>
              <div className="h-4 bg-white/5 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-24"></div>
                <div className="h-6 bg-white/5 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold mb-2">Funcionário não encontrado</h3>
        <p className="text-gray-400 mb-4">
          O funcionário solicitado não foi encontrado ou foi removido.
        </p>
        <button
          onClick={() => navigate('/funcionarios')}
          className="btn btn-primary"
        >
          Voltar para Lista
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/funcionarios')}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Detalhes do Funcionário</h1>
            <p className="text-gray-400">Informações completas do funcionário</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/funcionarios/documentos/${employee.id}`)}
            className="btn btn-secondary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Documentos
          </button>
          <button
            onClick={() => navigate(`/funcionarios/editar/${employee.id}`)}
            className="btn btn-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
        </div>
      </div>

      {/* Employee Info */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-6 mb-6">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
          />
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{employee.name}</h2>
            <p className="text-gray-400 mb-2">{employee.position} • {employee.department}</p>
            {getStatusBadge(employee.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <p className="text-white font-medium">{employee.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Telefone
            </label>
            <p className="text-white font-medium">{employee.phone}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Salário
            </label>
            <p className="text-white font-medium">{formatCurrency(employee.salary)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Data de Contratação
            </label>
            <p className="text-white font-medium">{formatDate(employee.hireDate)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Tempo na Empresa
            </label>
            <p className="text-white font-medium">
              {Math.floor((new Date().getTime() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} anos
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              ID do Funcionário
            </label>
            <p className="text-white font-medium">#{employee.id.padStart(4, '0')}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate(`/funcionarios/documentos/${employee.id}`)}
          className="glass-card p-6 hover-lift transition-all duration-300 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                Documentos
              </h3>
              <p className="text-gray-400 text-sm">Gerenciar documentos pessoais</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate(`/folha-pagamento/funcionario/${employee.id}`)}
          className="glass-card p-6 hover-lift transition-all duration-300 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-green-400 transition-colors">
                Folha de Pagamento
              </h3>
              <p className="text-gray-400 text-sm">Histórico de pagamentos</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate(`/tarefas?funcionario=${employee.id}`)}
          className="glass-card p-6 hover-lift transition-all duration-300 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
                Tarefas
              </h3>
              <p className="text-gray-400 text-sm">Tarefas atribuídas</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Atividade Recente</h3>
        
        <div className="space-y-4">
          {[
            {
              type: 'document',
              title: 'Documento adicionado',
              description: 'CPF atualizado no sistema',
              date: '2024-01-15',
              icon: 'document'
            },
            {
              type: 'salary',
              title: 'Salário processado',
              description: 'Folha de pagamento de Janeiro',
              date: '2024-01-10',
              icon: 'money'
            },
            {
              type: 'task',
              title: 'Tarefa concluída',
              description: 'Desenvolvimento do módulo de relatórios',
              date: '2024-01-08',
              icon: 'check'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                {activity.icon === 'document' && (
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {activity.icon === 'money' && (
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )}
                {activity.icon === 'check' && (
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{activity.title}</h4>
                <p className="text-gray-400 text-sm">{activity.description}</p>
              </div>
              <span className="text-gray-400 text-sm">{formatDate(activity.date)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;

