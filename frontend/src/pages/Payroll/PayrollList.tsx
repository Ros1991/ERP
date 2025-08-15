import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, DollarSign, Calendar, Users, Download, Filter } from 'lucide-react';
import { payrollService } from '../../services/payrollService';
import { employeeService } from '../../services/employeeService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PayrollEntry {
  id: string;
  employee_id: string;
  employee_name?: string;
  month: number;
  year: number;
  base_salary: number;
  total_earnings: number;
  total_deductions: number;
  net_salary: number;
  status: 'draft' | 'approved' | 'paid';
  payment_date?: string;
}

const PayrollList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState<PayrollEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadPayrolls();
  }, [filterMonth, filterYear, filterStatus]);

  const loadPayrolls = async () => {
    try {
      setLoading(true);
      const response = await payrollService.getPayrolls(user.company.id);
      
      // Get employees to map names
      const employeesResponse = await employeeService.getEmployees(user.company.id);
      const employeesMap = new Map(employeesResponse.data.map((emp: any) => [emp.id, emp.name]));
      
      // Map employee names and filter
      let filteredData = response.data.map((payroll: any) => ({
        ...payroll,
        employee_name: employeesMap.get(payroll.employee_id) || 'Unknown'
      }));

      // Apply filters
      if (filterStatus !== 'all') {
        filteredData = filteredData.filter((p: any) => p.status === filterStatus);
      }
      
      filteredData = filteredData.filter((p: any) => 
        p.month === filterMonth && p.year === filterYear
      );

      setPayrolls(filteredData);
    } catch (error) {
      toast.error('Erro ao carregar folhas de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async () => {
    try {
      setLoading(true);
      await payrollService.processPayroll(user.company.id, filterMonth, filterYear);
      toast.success('Folha de pagamento processada com sucesso');
      loadPayrolls();
    } catch (error) {
      toast.error('Erro ao processar folha de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayroll = async (payrollId: string) => {
    try {
      await payrollService.updatePayroll(payrollId, { status: 'approved' });
      toast.success('Folha aprovada com sucesso');
      loadPayrolls();
    } catch (error) {
      toast.error('Erro ao aprovar folha');
    }
  };

  const handlePayPayroll = async (payrollId: string) => {
    try {
      await payrollService.updatePayroll(payrollId, { 
        status: 'paid',
        payment_date: new Date().toISOString()
      });
      toast.success('Pagamento registrado com sucesso');
      loadPayrolls();
    } catch (error) {
      toast.error('Erro ao registrar pagamento');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
      approved: { label: 'Aprovada', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      paid: { label: 'Paga', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${config?.color || ''}`}>
        {config?.label || status}
      </span>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredPayrolls = payrolls.filter(payroll =>
    payroll.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalaries = filteredPayrolls.reduce((acc, p) => acc + p.net_salary, 0);
  const totalDeductions = filteredPayrolls.reduce((acc, p) => acc + p.total_deductions, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/10 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-6 bg-white/10 rounded w-1/2"></div>
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Folha de Pagamento</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleProcessPayroll}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Processar Folha</span>
          </button>
          <button
            onClick={() => navigate('/folha-pagamento/nova')}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Manual</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Funcionários</p>
              <p className="text-2xl font-bold text-white">{filteredPayrolls.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Líquido</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalSalaries)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Descontos</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalDeductions)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-red-400 opacity-50" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Período</p>
              <p className="text-xl font-bold text-white">{`${filterMonth}/${filterYear}`}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(Number(e.target.value))}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          >
            {[2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">Todos Status</option>
            <option value="draft">Rascunho</option>
            <option value="approved">Aprovada</option>
            <option value="paid">Paga</option>
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Salário Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Proventos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Descontos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Líquido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredPayrolls.map((payroll) => (
                <tr key={payroll.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{payroll.employee_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{formatCurrency(payroll.base_salary)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-400">{formatCurrency(payroll.total_earnings)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-400">{formatCurrency(payroll.total_deductions)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-white">{formatCurrency(payroll.net_salary)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payroll.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/folha-pagamento/${payroll.id}`)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Detalhes
                      </button>
                      {payroll.status === 'draft' && (
                        <button
                          onClick={() => handleApprovePayroll(payroll.id)}
                          className="text-green-400 hover:text-green-300"
                        >
                          Aprovar
                        </button>
                      )}
                      {payroll.status === 'approved' && (
                        <button
                          onClick={() => handlePayPayroll(payroll.id)}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          Pagar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayrolls.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Nenhuma folha encontrada</h3>
            <p className="text-gray-400 mb-4">
              Processe a folha de pagamento para este período.
            </p>
            <button 
              onClick={handleProcessPayroll}
              className="btn btn-primary"
            >
              Processar Folha
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollList;
