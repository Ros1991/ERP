import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, DollarSign } from 'lucide-react';
import { financialService } from '@/services/financialService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface TransactionFormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  due_date?: string;
  payment_date?: string;
  status: 'pending' | 'paid' | 'cancelled';
  account_id: string;
  cost_center_id?: string;
  payment_method?: string;
  document_number?: string;
  notes?: string;
  recurring?: boolean;
  recurring_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurring_times?: number;
}

const TransactionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [costCenters, setCostCenters] = useState<any[]>([]);
  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: 0,
    type: 'income',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    account_id: '',
    cost_center_id: '',
    payment_method: '',
    document_number: '',
    notes: '',
    recurring: false,
    recurring_frequency: 'monthly',
    recurring_times: 1
  });

  useEffect(() => {
    loadAccountsAndCostCenters();
    if (isEditing) {
      loadTransaction();
    }
  }, [id]);

  const loadAccountsAndCostCenters = async () => {
    if (!user?.company?.id) return;
    
    try {
      const [accountsRes, costCentersRes] = await Promise.all([
        financialService.getAccounts(user.company.id),
        financialService.getCostCenters(user.company.id)
      ]);
      
      setAccounts(accountsRes);
      setCostCenters(costCentersRes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const loadTransaction = async () => {
    if (!id) return;
    
    try {
      const transaction = await financialService.getTransaction(id);
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date.split('T')[0],
        due_date: transaction.due_date?.split('T')[0],
        payment_date: transaction.payment_date?.split('T')[0],
        status: transaction.status,
        account_id: transaction.account_id,
        cost_center_id: transaction.cost_center_id || '',
        payment_method: transaction.payment_method || '',
        document_number: transaction.document_number || '',
        notes: transaction.notes || '',
        recurring: false,
        recurring_frequency: 'monthly',
        recurring_times: 1
      });
    } catch (error) {
      toast.error('Erro ao carregar transação');
      navigate('/financeiro/transacoes');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.company?.id) {
      toast.error('Empresa não identificada');
      return;
    }

    if (!formData.account_id) {
      toast.error('Selecione uma conta');
      return;
    }

    try {
      setLoading(true);
      
      const data = {
        ...formData,
        company_id: user.company.id,
        amount: parseFloat(formData.amount.toString()),
        cost_center_id: formData.cost_center_id || undefined,
        payment_method: formData.payment_method || undefined,
        document_number: formData.document_number || undefined,
        notes: formData.notes || undefined
      };

      if (isEditing) {
        await financialService.updateTransaction(id, data as any);
        toast.success('Transação atualizada com sucesso');
      } else {
        if (formData.recurring && formData.recurring_times && formData.recurring_times > 1) {
          // Criar transações recorrentes
          const promises = [];
          for (let i = 0; i < formData.recurring_times; i++) {
            const recurringData = { ...data };
            const date = new Date(formData.date);
            
            switch (formData.recurring_frequency) {
              case 'daily':
                date.setDate(date.getDate() + i);
                break;
              case 'weekly':
                date.setDate(date.getDate() + (i * 7));
                break;
              case 'monthly':
                date.setMonth(date.getMonth() + i);
                break;
              case 'yearly':
                date.setFullYear(date.getFullYear() + i);
                break;
            }
            
            recurringData.date = date.toISOString().split('T')[0];
            if (recurringData.due_date) {
              const dueDate = new Date(recurringData.due_date);
              dueDate.setMonth(dueDate.getMonth() + i);
              recurringData.due_date = dueDate.toISOString().split('T')[0];
            }
            
            promises.push(financialService.createTransaction(user.company.id, recurringData as any));
          }
          
          await Promise.all(promises);
          toast.success(`${formData.recurring_times} transações criadas com sucesso`);
        } else {
          await financialService.createTransaction(user.company.id, data as any);
          toast.success('Transação criada com sucesso');
        }
      }
      
      navigate('/financeiro/transacoes');
    } catch (error) {
      toast.error('Erro ao salvar transação');
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/financeiro/transacoes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Transação' : 'Nova Transação'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Informações da Transação
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Pagamento de fornecedor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.amount > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(formData.amount)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conta *
              </label>
              <select
                name="account_id"
                value={formData.account_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione uma conta</option>
                {accounts
                  .filter(acc => 
                    (formData.type === 'income' && acc.type === 'Receita') ||
                    (formData.type === 'expense' && acc.type === 'Despesa')
                  )
                  .map(account => (
                    <option key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Centro de Custo
              </label>
              <select
                name="cost_center_id"
                value={formData.cost_center_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione um centro de custo</option>
                {costCenters.map(center => (
                  <option key={center.id} value={center.id}>
                    {center.code} - {center.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de Pagamento
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="boleto">Boleto</option>
                <option value="transferencia">Transferência</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número do Documento
              </label>
              <input
                type="text"
                name="document_number"
                value={formData.document_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: NF-123456"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Datas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data da Transação *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Vencimento
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Pagamento
              </label>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {!isEditing && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={formData.recurring}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Transação Recorrente
                </span>
              </label>
            </div>

            {formData.recurring && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequência
                  </label>
                  <select
                    name="recurring_frequency"
                    value={formData.recurring_frequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Parcelas
                  </label>
                  <input
                    type="number"
                    name="recurring_times"
                    value={formData.recurring_times}
                    onChange={handleChange}
                    min="1"
                    max="60"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações adicionais..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar Transação'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/financeiro/transacoes')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
