import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  bank: string;
  balance: number;
  status: 'active' | 'inactive';
}

const AccountsList: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAccounts([
        {
          id: '1',
          name: 'Conta Corrente Principal',
          type: 'checking',
          bank: 'Banco do Brasil',
          balance: 1250000,
          status: 'active'
        },
        {
          id: '2',
          name: 'Conta Poupança',
          type: 'savings',
          bank: 'Itaú',
          balance: 850000,
          status: 'active'
        },
        {
          id: '3',
          name: 'Conta Investimentos',
          type: 'investment',
          bank: 'Bradesco',
          balance: 747500,
          status: 'active'
        },
        {
          id: '4',
          name: 'Cartão Corporativo',
          type: 'credit',
          bank: 'Santander',
          balance: -125000,
          status: 'active'
        }
      ]);
      
      setLoading(false);
    };

    loadAccounts();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getAccountTypeLabel = (type: string) => {
    const types = {
      checking: 'Conta Corrente',
      savings: 'Poupança',
      investment: 'Investimento',
      credit: 'Cartão de Crédito'
    };
    return types[type as keyof typeof types];
  };

  const getAccountIcon = (type: string) => {
    const iconProps = "w-6 h-6";
    
    switch (type) {
      case 'checking':
        return (
          <svg className={`${iconProps} text-blue-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'savings':
        return (
          <svg className={`${iconProps} text-green-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'investment':
        return (
          <svg className={`${iconProps} text-purple-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'credit':
        return (
          <svg className={`${iconProps} text-red-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-white/10 rounded animate-pulse"></div>
          <div className="h-8 bg-white/10 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="h-3 bg-white/5 rounded w-1/3"></div>
                </div>
                <div className="h-6 bg-white/10 rounded w-20"></div>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/financeiro')}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Contas Bancárias</h1>
            <p className="text-gray-400">Gerencie suas contas e saldos</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/financeiro/contas/nova')}
          className="btn btn-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nova Conta
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Saldo Total</h3>
          <p className="text-2xl font-bold text-green-400">
            {formatCurrency(accounts.reduce((sum, acc) => sum + (acc.balance > 0 ? acc.balance : 0), 0))}
          </p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Contas Ativas</h3>
          <p className="text-2xl font-bold text-blue-400">
            {accounts.filter(acc => acc.status === 'active').length}
          </p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Débitos</h3>
          <p className="text-2xl font-bold text-red-400">
            {formatCurrency(Math.abs(accounts.reduce((sum, acc) => sum + (acc.balance < 0 ? acc.balance : 0), 0)))}
          </p>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="glass-card p-6 hover-lift transition-all duration-300 cursor-pointer group"
            onClick={() => navigate(`/financeiro/contas/editar/${account.id}`)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gray-500/20 flex items-center justify-center">
                  {getAccountIcon(account.type)}
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                    {account.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{getAccountTypeLabel(account.type)}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full border ${
                account.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {account.status === 'active' ? 'Ativa' : 'Inativa'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Banco</span>
                <span className="text-white font-medium">{account.bank}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Saldo</span>
                <span className={`text-lg font-bold ${account.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(account.balance)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/financeiro/contas/editar/${account.id}`);
                  }}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/financeiro/transacoes/nova?conta=${account.id}`);
                  }}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Nova Transação
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-2">Nenhuma conta cadastrada</h3>
          <p className="text-gray-400 mb-4">
            Adicione suas contas bancárias para começar a gerenciar suas finanças.
          </p>
          <button
            onClick={() => navigate('/financeiro/contas/nova')}
            className="btn btn-primary"
          >
            Adicionar Conta
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountsList;

