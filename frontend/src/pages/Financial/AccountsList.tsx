import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { financialService } from '@/services/financialService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface FinancialAccount {
  id: string;
  name: string;
  type: 'Receita' | 'Despesa' | 'Ativo' | 'Passivo' | 'Patrimônio';
  parent_account_id?: string;
  code?: string;
  balance?: number;
  is_active: boolean;
  created_at: string;
}

const AccountsList: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [totalBalance, setTotalBalance] = useState({
    receitas: 0,
    despesas: 0,
    saldo: 0
  });

  useEffect(() => {
    loadAccounts();
  }, [typeFilter]);

  const loadAccounts = async () => {
    if (!user?.company?.id) return;
    
    try {
      setLoading(true);
      const response = await financialService.getAccounts(user.company.id, {
        type: typeFilter || undefined
      });
      
      setAccounts(response);
      calculateTotals(response);
    } catch (error) {
      toast.error('Erro ao carregar contas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (accounts: FinancialAccount[]) => {
    const totals = accounts.reduce((acc, account) => {
      if (account.type === 'Receita') {
        acc.receitas += account.balance || 0;
      } else if (account.type === 'Despesa') {
        acc.despesas += account.balance || 0;
      }
      return acc;
    }, { receitas: 0, despesas: 0, saldo: 0 });
    
    totals.saldo = totals.receitas - totals.despesas;
    setTotalBalance(totals);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
    
    try {
      await financialService.deleteAccount(id);
      toast.success('Conta excluída com sucesso');
      loadAccounts();
    } catch (error) {
      toast.error('Erro ao excluir conta');
    }
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (acc.code && acc.code.includes(searchTerm))
  );

  const getTypeBadge = (type: string) => {
    const colors = {
      'Receita': 'bg-green-100 text-green-800',
      'Despesa': 'bg-red-100 text-red-800',
      'Ativo': 'bg-blue-100 text-blue-800',
      'Passivo': 'bg-orange-100 text-orange-800',
      'Patrimônio': 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Contas Financeiras</h1>
          <div className="flex gap-3">
            <Link
              to="/financeiro/transacoes"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Transações
            </Link>
            <Link
              to="/financeiro/centros-custo"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <PieChart className="w-5 h-5" />
              Centros de Custo
            </Link>
            <Link
              to="/financeiro/nova-conta"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nova Conta
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalBalance.receitas)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalBalance.despesas)}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Total</p>
                <p className={`text-2xl font-bold ${totalBalance.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(totalBalance.saldo)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os Tipos</option>
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
              <option value="Ativo">Ativo</option>
              <option value="Passivo">Passivo</option>
              <option value="Patrimônio">Patrimônio</option>
            </select>
            
            <button
              onClick={loadAccounts}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando contas...</p>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Nenhuma conta encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {account.code || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {account.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadge(account.type)}`}>
                        {account.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${(account.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(account.balance || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {account.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(account.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/financeiro/conta/${account.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/financeiro/conta/${account.id}/editar`}
                          className="text-green-600 hover:text-green-900"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsList;
