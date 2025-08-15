import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Check, X, DollarSign, Plus, Minus } from 'lucide-react';
import { payrollService } from '../../services/payrollService';
import { employeeService } from '../../services/employeeService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PayrollDetail {
  id: string;
  employee_id: string;
  employee?: any;
  month: number;
  year: number;
  base_salary: number;
  earnings: {
    overtime?: number;
    bonus?: number;
    commission?: number;
    other?: number;
  };
  deductions: {
    inss?: number;
    irrf?: number;
    health_insurance?: number;
    other?: number;
  };
  total_earnings: number;
  total_deductions: number;
  net_salary: number;
  status: 'draft' | 'approved' | 'paid';
  payment_date?: string;
  notes?: string;
}

const PayrollDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payroll, setPayroll] = useState<PayrollDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [earnings, setEarnings] = useState<any>({});
  const [deductions, setDeductions] = useState<any>({});

  useEffect(() => {
    if (id) {
      loadPayrollDetails();
    }
  }, [id]);

  const loadPayrollDetails = async () => {
    try {
      setLoading(true);
      const response = await payrollService.getPayroll(id!);
      const payrollData = response.data;
      
      // Load employee details
      const employeeResponse = await employeeService.getEmployee(payrollData.employee_id);
      payrollData.employee = employeeResponse.data;
      
      setPayroll(payrollData);
      setEarnings(payrollData.earnings || {});
      setDeductions(payrollData.deductions || {});
    } catch (error) {
      toast.error('Erro ao carregar detalhes da folha');
      navigate('/folha-pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const totalEarnings = Object.values(earnings).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
      const totalDeductions = Object.values(deductions).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
      const netSalary = (payroll?.base_salary || 0) + totalEarnings - totalDeductions;

      await payrollService.updatePayroll(id!, {
        earnings,
        deductions,
        total_earnings: totalEarnings,
        total_deductions: totalDeductions,
        net_salary: netSalary
      });

      toast.success('Folha atualizada com sucesso');
      setEditMode(false);
      loadPayrollDetails();
    } catch (error) {
      toast.error('Erro ao atualizar folha');
    }
  };

  const handleApprove = async () => {
    try {
      await payrollService.updatePayroll(id!, { status: 'approved' });
      toast.success('Folha aprovada com sucesso');
      loadPayrollDetails();
    } catch (error) {
      toast.error('Erro ao aprovar folha');
    }
  };

  const handlePay = async () => {
    try {
      await payrollService.updatePayroll(id!, { 
        status: 'paid',
        payment_date: new Date().toISOString()
      });
      toast.success('Pagamento registrado com sucesso');
      loadPayrollDetails();
    } catch (error) {
      toast.error('Erro ao registrar pagamento');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast('Exportação em desenvolvimento', { icon: '🚧' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
      approved: { label: 'Aprovada', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      paid: { label: 'Paga', color: 'bg-green-500/20 text-green-400 border-green-500/30' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 text-sm rounded-full border ${config?.color || ''}`}>
        {config?.label || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/10 rounded w-64 animate-pulse"></div>
        <div className="glass-card p-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-white/10 rounded w-1/3"></div>
            <div className="h-4 bg-white/5 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-white/5 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!payroll) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/folha-pagamento')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Detalhes da Folha</h1>
            <p className="text-gray-400">
              {`${payroll.month}/${payroll.year} - ${payroll.employee?.name || 'Funcionário'}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {payroll.status === 'draft' && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="btn btn-secondary"
            >
              Editar
            </button>
          )}
          {editMode && (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </>
          )}
          {payroll.status === 'draft' && !editMode && (
            <button
              onClick={handleApprove}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Aprovar</span>
            </button>
          )}
          {payroll.status === 'approved' && (
            <button
              onClick={handlePay}
              className="btn btn-success flex items-center space-x-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Registrar Pagamento</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Printer className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Employee Info */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Informações do Funcionário</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Nome</p>
                <p className="text-white font-medium">{payroll.employee?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">CPF</p>
                <p className="text-white font-medium">{payroll.employee?.cpf}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Cargo</p>
                <p className="text-white font-medium">{payroll.employee?.position || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Departamento</p>
                <p className="text-white font-medium">{payroll.employee?.department || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div>{getStatusBadge(payroll.status)}</div>
        </div>
      </div>

      {/* Payroll Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-green-400" />
            Proventos
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Salário Base</span>
              <span className="text-white font-medium">{formatCurrency(payroll.base_salary)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Horas Extras</span>
              {editMode ? (
                <input
                  type="number"
                  value={earnings.overtime || 0}
                  onChange={(e) => setEarnings({...earnings, overtime: Number(e.target.value)})}
                  className="w-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(earnings.overtime || 0)}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Bônus</span>
              {editMode ? (
                <input
                  type="number"
                  value={earnings.bonus || 0}
                  onChange={(e) => setEarnings({...earnings, bonus: Number(e.target.value)})}
                  className="w-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(earnings.bonus || 0)}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Comissões</span>
              {editMode ? (
                <input
                  type="number"
                  value={earnings.commission || 0}
                  onChange={(e) => setEarnings({...earnings, commission: Number(e.target.value)})}
                  className="w-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(earnings.commission || 0)}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Outros</span>
              {editMode ? (
                <input
                  type="number"
                  value={earnings.other || 0}
                  onChange={(e) => setEarnings({...earnings, other: Number(e.target.value)})}
                  className="w-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(earnings.other || 0)}</span>
              )}
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-semibold">Total Proventos</span>
                <span className="text-green-400 font-bold text-lg">
                  {formatCurrency(payroll.base_salary + payroll.total_earnings)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Minus className="w-5 h-5 mr-2 text-red-400" />
            Descontos
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">INSS</span>
              {editMode ? (
                <input
                  type="number"
                  value={deductions.inss || 0}
                  onChange={(e) => setDeductions({...deductions, inss: Number(e.target.value)})}
                  className="w-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(deductions.inss || 0)}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">IRRF</span>
              {editMode ? (
                <input
                  type="number"
                  value={deductions.irrf || 0}
                  onChange={(e) => setDeductions({...deductions, irrf: Number(e.target.value)})}
                  className="w-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(deductions.irrf || 0)}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Plano de Saúde</span>
              {editMode ? (
                <input
                  type="number"
                  value={deductions.health_insurance || 0}
                  onChange={(e) => setDeductions({...deductions, health_insurance: Number(e.target.value)})}
                  className="w-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(deductions.health_insurance || 0)}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Vale Transporte</span>
              {editMode ? (
                <input
                  type="number"
                  value={deductions.transport || 0}
                  onChange={(e) => setDeductions({...deductions, transport: Number(e.target.value)})}
                  className="w-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(deductions.transport || 0)}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Outros</span>
              {editMode ? (
                <input
                  type="number"
                  value={deductions.other || 0}
                  onChange={(e) => setDeductions({...deductions, other: Number(e.target.value)})}
                  className="w-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-right"
                />
              ) : (
                <span className="text-white font-medium">{formatCurrency(deductions.other || 0)}</span>
              )}
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-red-400 font-semibold">Total Descontos</span>
                <span className="text-red-400 font-bold text-lg">
                  {formatCurrency(payroll.total_deductions)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net Salary */}
      <div className="glass-card p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Salário Líquido</h2>
            <p className="text-gray-400 text-sm">
              Total Proventos - Total Descontos
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">
              {formatCurrency(payroll.net_salary)}
            </p>
            {payroll.payment_date && (
              <p className="text-sm text-green-400 mt-2">
                Pago em {new Date(payroll.payment_date).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {payroll.notes && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Observações</h2>
          <p className="text-gray-300">{payroll.notes}</p>
        </div>
      )}
    </div>
  );
};

export default PayrollDetails;
