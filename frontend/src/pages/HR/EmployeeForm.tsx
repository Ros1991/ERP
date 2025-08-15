import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, User, FileText, CreditCard, Users } from 'lucide-react';
import { employeeService, CreateEmployeeData } from '@/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  const [formData, setFormData] = useState({
    full_name: '',
    cpf: '',
    job_title: '',
    contract_type: 'CLT' as 'CLT' | 'Diarista' | 'Empreita',
    salary_base: 0,
    hire_date: '',
    termination_date: '',
    status: 'Ativo' as 'Ativo' | 'Inativo' | 'Afastado' | 'Demitido',
    config_tracks_time: false,
    config_is_in_payroll: true,
    legal_data: {
      address: '',
      phone: '',
      emergency_contact: '',
      pis: '',
      bank_details: {
        bank: '',
        agency: '',
        account: ''
      },
      dependents: [] as any[]
    }
  });

  const [accessData, setAccessData] = useState({
    grant_access: false,
    email: '',
    role_id: ''
  });

  useEffect(() => {
    if (isEditing) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const employee = await employeeService.getEmployee(id);
      setFormData({
        full_name: employee.full_name,
        cpf: employee.cpf,
        job_title: employee.job_title,
        contract_type: employee.contract_type as any,
        salary_base: employee.salary_base,
        hire_date: employee.hire_date.split('T')[0],
        termination_date: employee.termination_date?.split('T')[0] || '',
        status: employee.status as any,
        config_tracks_time: employee.config_tracks_time,
        config_is_in_payroll: employee.config_is_in_payroll,
        legal_data: {
          address: employee.legal_data?.address || '',
          phone: employee.legal_data?.phone || '',
          emergency_contact: employee.legal_data?.emergency_contact || '',
          pis: employee.legal_data?.pis || '',
          bank_details: {
            bank: employee.legal_data?.bank_details?.bank || '',
            agency: employee.legal_data?.bank_details?.agency || '',
            account: employee.legal_data?.bank_details?.account || ''
          },
          dependents: employee.legal_data?.dependents || []
        }
      });
      
      if (employee.user_email) {
        setAccessData({
          grant_access: true,
          email: employee.user_email,
          role_id: ''
        });
      }
    } catch (error) {
      toast.error('Erro ao carregar funcionário');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.company?.id) {
      toast.error('Empresa não identificada');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditing) {
        await employeeService.updateEmployee(id!, formData as any);
        toast.success('Funcionário atualizado com sucesso');
      } else {
        const data: CreateEmployeeData = {
          employee_data: {
            ...formData,
            legal_data: formData.legal_data
          },
          access_data: accessData.grant_access ? accessData : undefined
        };
        
        await employeeService.createEmployee(user.company.id, data);
        toast.success('Funcionário criado com sucesso');
      }
      
      navigate('/funcionarios');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao salvar funcionário';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('legal_data.')) {
      const field = name.replace('legal_data.', '');
      
      if (field.startsWith('bank_details.')) {
        const bankField = field.replace('bank_details.', '');
        setFormData(prev => ({
          ...prev,
          legal_data: {
            ...prev.legal_data,
            bank_details: {
              ...prev.legal_data.bank_details,
              [bankField]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          legal_data: {
            ...prev.legal_data,
            [field]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleAccessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAccessData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };



  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/funcionarios')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'personal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Dados Pessoais
            </button>
            <button
              onClick={() => setActiveTab('legal')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'legal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Dados Legais
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bank'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Dados Bancários
            </button>
            {!isEditing && (
              <button
                onClick={() => setActiveTab('access')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'access'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Acesso ao Sistema
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        {/* Personal Data Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formatCPF(formData.cpf)}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '');
                    handleInputChange(e);
                  }}
                  required
                  maxLength={14}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo *
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Contrato *
                </label>
                <select
                  name="contract_type"
                  value={formData.contract_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CLT">CLT</option>
                  <option value="Diarista">Diarista</option>
                  <option value="Empreita">Empreita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salário Base *
                </label>
                <input
                  type="number"
                  name="salary_base"
                  value={formData.salary_base}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Admissão *
                </label>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Demissão
                    </label>
                    <input
                      type="date"
                      name="termination_date"
                      value={formData.termination_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                      <option value="Afastado">Afastado</option>
                      <option value="Demitido">Demitido</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="config_tracks_time"
                  checked={formData.config_tracks_time}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Controla ponto eletrônico
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="config_is_in_payroll"
                  checked={formData.config_is_in_payroll}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Incluir na folha de pagamento
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Legal Data Tab */}
        {activeTab === 'legal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  name="legal_data.address"
                  value={formData.legal_data.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  name="legal_data.phone"
                  value={formatPhone(formData.legal_data.phone)}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '');
                    handleInputChange(e);
                  }}
                  maxLength={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contato de Emergência
                </label>
                <input
                  type="text"
                  name="legal_data.emergency_contact"
                  value={formData.legal_data.emergency_contact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIS
                </label>
                <input
                  type="text"
                  name="legal_data.pis"
                  value={formData.legal_data.pis}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank Data Tab */}
        {activeTab === 'bank' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banco
                </label>
                <input
                  type="text"
                  name="legal_data.bank_details.bank"
                  value={formData.legal_data.bank_details.bank}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agência
                </label>
                <input
                  type="text"
                  name="legal_data.bank_details.agency"
                  value={formData.legal_data.bank_details.agency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conta
                </label>
                <input
                  type="text"
                  name="legal_data.bank_details.account"
                  value={formData.legal_data.bank_details.account}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Access Tab */}
        {activeTab === 'access' && !isEditing && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="grant_access"
                  checked={accessData.grant_access}
                  onChange={handleAccessChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Conceder acesso ao sistema
                </span>
              </label>

              {accessData.grant_access && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Acesso *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={accessData.email}
                      onChange={handleAccessChange}
                      required={accessData.grant_access}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo/Perfil *
                    </label>
                    <input
                      type="text"
                      name="role_id"
                      value={accessData.role_id}
                      onChange={handleAccessChange}
                      required={accessData.grant_access}
                      placeholder="ID do cargo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/funcionarios')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
