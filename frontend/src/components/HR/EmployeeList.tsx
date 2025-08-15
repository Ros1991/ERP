import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  avatar?: string;
  salary: number;
  hireDate: string;
  phone: string;
}

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Simular carregamento de dados
    const loadEmployees = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mock
      setEmployees([
        {
          id: '1',
          name: 'Ana Silva',
          email: 'ana.silva@empresa.com',
          position: 'Desenvolvedora Senior',
          department: 'Tecnologia',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          salary: 8500,
          hireDate: '2022-03-15',
          phone: '(11) 99999-1234'
        },
        {
          id: '2',
          name: 'Carlos Santos',
          email: 'carlos.santos@empresa.com',
          position: 'Gerente de Vendas',
          department: 'Vendas',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          salary: 12000,
          hireDate: '2021-08-20',
          phone: '(11) 99999-5678'
        },
        {
          id: '3',
          name: 'Maria Oliveira',
          email: 'maria.oliveira@empresa.com',
          position: 'Analista de Marketing',
          department: 'Marketing',
          status: 'vacation',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          salary: 6500,
          hireDate: '2023-01-10',
          phone: '(11) 99999-9012'
        },
        {
          id: '4',
          name: 'João Pereira',
          email: 'joao.pereira@empresa.com',
          position: 'Analista Financeiro',
          department: 'Financeiro',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          salary: 7200,
          hireDate: '2022-11-05',
          phone: '(11) 99999-3456'
        },
        {
          id: '5',
          name: 'Fernanda Costa',
          email: 'fernanda.costa@empresa.com',
          position: 'Coordenadora de RH',
          department: 'RH',
          status: 'active',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          salary: 9500,
          hireDate: '2020-05-18',
          phone: '(11) 99999-7890'
        },
        {
          id: '6',
          name: 'Roberto Lima',
          email: 'roberto.lima@empresa.com',
          position: 'Designer UX/UI',
          department: 'Tecnologia',
          status: 'inactive',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          salary: 7800,
          hireDate: '2021-12-03',
          phone: '(11) 99999-2468'
        }
      ]);
      
      setLoading(false);
    };

    loadEmployees();
  }, []);

  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Employee];
      let bValue = b[sortBy as keyof Employee];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue !== undefined && bValue !== undefined && aValue < bValue ? -1 : aValue !== undefined && bValue !== undefined && aValue > bValue ? 1 : 0;
      } else {
        return aValue !== undefined && bValue !== undefined && aValue > bValue ? -1 : aValue !== undefined && bValue !== undefined && aValue < bValue ? 1 : 0;
      }
    });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      inactive: { label: 'Inativo', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      vacation: { label: 'Férias', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Filters Skeleton */}
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-white/10 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="glass-card p-6">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-1/4"></div>
                  <div className="h-3 bg-white/5 rounded w-1/3"></div>
                </div>
                <div className="h-6 bg-white/10 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nome, email ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="vacation">Férias</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Departamento
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="input"
            >
              <option value="all">Todos</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Vendas">Vendas</option>
              <option value="Marketing">Marketing</option>
              <option value="Financeiro">Financeiro</option>
              <option value="RH">RH</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ordenar por
            </label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input flex-1"
              >
                <option value="name">Nome</option>
                <option value="position">Cargo</option>
                <option value="department">Departamento</option>
                <option value="salary">Salário</option>
                <option value="hireDate">Data de Contratação</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="btn btn-secondary px-3"
              >
                {sortOrder === 'asc' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          Mostrando {filteredEmployees.length} de {employees.length} funcionários
        </p>
        <div className="flex items-center space-x-2">
          <button className="btn btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="glass-card p-6 hover-lift transition-all duration-300 cursor-pointer group"
            onClick={() => navigate(`/funcionarios/${employee.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={employee.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                  alt={employee.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                    {employee.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{employee.position}</p>
                </div>
              </div>
              {getStatusBadge(employee.status)}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
                <span className="text-gray-300">{employee.department}</span>
              </div>
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span className="text-gray-300">{employee.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">{employee.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <p className="text-gray-400 text-xs">Salário</p>
                <p className="text-white font-semibold">{formatCurrency(employee.salary)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Contratado em</p>
                <p className="text-white font-semibold">{formatDate(employee.hireDate)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/funcionarios/editar/${employee.id}`);
                }}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/funcionarios/${employee.id}/documentos`);
                }}
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Documentos
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-2">Nenhum funcionário encontrado</h3>
          <p className="text-gray-400 mb-4">
            Tente ajustar os filtros ou adicionar um novo funcionário.
          </p>
          <button
            onClick={() => navigate('/funcionarios/novo')}
            className="btn btn-primary"
          >
            Adicionar Funcionário
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;

