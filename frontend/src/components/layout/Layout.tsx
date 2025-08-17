import React, { useState } from 'react';
import { useNavigate, Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  ClipboardList, 
  DollarSign, 
  ShoppingCart, 
  Menu, 
  X,
  LogOut,
  Settings,
  ChevronDown,
  Home,
  CheckSquare,
  Wallet,
  UserCog,
  TrendingUp,
  Package,
  IdCard,
  KeyRound,
  HandCoins
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { cn } from '../../utils/cn';

interface MenuItem {
  icon: any;
  label: string;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { 
    icon: Users, 
    label: 'Funcionários',
    children: [
      { icon: IdCard, label: 'Funcionários', path: '/funcionarios' },
      { icon: Users, label: 'Usuários', path: '/funcionario-contratos' },
      { icon: KeyRound, label: 'Cargos', path: '/funcionario-beneficios' },
    ]
  },
  { 
    icon: ClipboardList, 
    label: 'Tarefas',
    children: [
      { icon: ClipboardList, label: 'Tarefas', path: '/tarefas' },
      { icon: CheckSquare, label: 'Tipos de Tarefa', path: '/tarefa-tipos' },
    ]
  },
  { 
    icon: DollarSign, 
    label: 'Financeiro',
    children: [
      { icon: Wallet, label: 'Contas', path: '/contas' },
      { icon: UserCog, label: 'Terceiros', path: '/terceiros' },
      { icon: TrendingUp, label: 'Transações', path: '/transacoes-financeiras' },
      { icon: HandCoins, label: 'Emprestimos', path: '/emprestimos' },
      { icon: Building2, label: 'Centros de Custo', path: '/centros-custo' },
    ]
  },
  { 
    icon: ShoppingCart, 
    label: 'Compras',
    children: [
      { icon: Package, label: 'Pedidos de Compra', path: '/pedidos-compra' },
    ]
  },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { empresaId } = useParams<{ empresaId: string }>();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const renderMenuItem = (item: MenuItem, isNested = false) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.label);
    
    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={cn(
              'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors',
              'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronDown className={cn(
              'h-4 w-4 transition-transform',
              isExpanded ? 'rotate-180' : ''
            )} />
          </button>
          {isExpanded && item.children && (
            <div className="mt-1 ml-4 space-y-1">
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const fullPath = empresaId ? `/empresas/${empresaId}${child.path}` : child.path;
                const isActive = location.pathname === fullPath;
                
                return (
                  <Link
                    key={child.path}
                    to={fullPath || '#'}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <ChildIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{child.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    
    const fullPath = item.path && empresaId ? `/empresas/${empresaId}${item.path}` : item.path;
    const isActive = fullPath && location.pathname === fullPath;
    
    return (
      <Link
        key={item.path}
        to={fullPath || '#'}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
          isActive
            ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
          isNested && 'ml-4'
        )}
      >
        <Icon className={cn('h-5 w-5', isNested && 'h-4 w-4')} />
        <span className={cn('font-medium', isNested && 'text-sm')}>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen transition-transform',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ERP System
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => renderMenuItem(item))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn('transition-all', sidebarOpen ? 'lg:ml-64' : '')}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5 text-gray-500" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.nome}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <Link
                      to="/companies"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Building2 className="h-4 w-4" />
                      Selecionar Empresa
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      Configurações
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
