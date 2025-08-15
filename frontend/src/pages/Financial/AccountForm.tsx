import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { financialService } from '@/services/financialService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface AccountFormData {
  name: string;
  type: 'Receita' | 'Despesa' | 'Ativo' | 'Passivo' | 'Patrimônio';
  parent_account_id?: string;
  code?: string;
  description?: string;
  is_active: boolean;
}

const AccountForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [parentAccounts, setParentAccounts] = useState<any[]>([]);
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    type: 'Receita',
    parent_account_id: '',
    code: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    loadParentAccounts();
    if (isEditing) {
      loadAccount();
    }
  }, [id]);

  const loadParentAccounts = async () => {
    if (!user?.company?.id) return;
    
    try {
      const accounts = await financialService.getAccounts(user.company.id);
      setParentAccounts(accounts);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    }
  };

  const loadAccount = async () => {
    if (!id) return;
    
    try {
      const account = await financialService.getAccountById(id);
      setFormData({
        name: account.name,
        type: account.type,
        parent_account_id: account.parent_account_id || '',
        code: account.code || '',
        description: account.description || '',
        is_active: account.is_active
      });
    } catch (error) {
      toast.error('Erro ao carregar conta');
      navigate('/financeiro');
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
      
      const data = {
        ...formData,
        company_id: user.company.id,
        parent_account_id: formData.parent_account_id || undefined
      };

      if (isEditing) {
        await financialService.updateAccount(id, data);
        toast.success('Conta atualizada com sucesso');
      } else {
        await financialService.createAccount(data);
        toast.success('Conta criada com sucesso');
      }
      
      navigate('/financeiro');
    } catch (error) {
      toast.error('Erro ao salvar conta');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/financeiro')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Conta' : 'Nova Conta'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 1.1.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Conta *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Vendas de Produtos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Conta *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Receita">Receita</option>
                <option value="Despesa">Despesa</option>
                <option value="Ativo">Ativo</option>
                <option value="Passivo">Passivo</option>
                <option value="Patrimônio">Patrimônio Líquido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conta Pai
              </label>
              <select
                name="parent_account_id"
                value={formData.parent_account_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sem conta pai</option>
                {parentAccounts
                  .filter(acc => acc.id !== id && acc.type === formData.type)
                  .map(account => (
                    <option key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descrição detalhada da conta..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Conta Ativa
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Conta'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/financeiro')}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
