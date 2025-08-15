import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { Building2, Plus, Edit, Trash2, LogOut, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { empresaService } from '../../services/empresa/empresa.service';
import { toast } from 'react-hot-toast';
import type { Empresa, CreateEmpresaDTO } from '../../models/empresa/Empresa.model';

export function CompanyManagement() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    razaoSocial: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await empresaService.getMyEmpresas();
      setCompanies(data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      toast.error('Erro ao carregar empresas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCompany = (companyId: number) => {
    // Store selected company in localStorage or state
    localStorage.setItem('selectedCompanyId', companyId.toString());
    navigate(`/dashboard/${companyId}`);
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createData: CreateEmpresaDTO = {
        nome: formData.nome,
        cnpj: formData.cnpj,
        razaoSocial: formData.razaoSocial,
        ativa: true
      };
      await empresaService.create(createData);
      toast.success('Empresa criada com sucesso!');
      setShowCreateModal(false);
      setFormData({ nome: '', cnpj: '', razaoSocial: '' });
      loadCompanies();
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      toast.error('Erro ao criar empresa');
    }
  };

  const handleEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;
    try {
      await empresaService.update(editingCompany.empresaId.toString(), formData);
      toast.success('Empresa atualizada com sucesso!');
      setShowEditModal(false);
      setEditingCompany(null);
      setFormData({ nome: '', cnpj: '', razaoSocial: '' });
      loadCompanies();
    } catch (error) {
      console.error('Erro ao editar empresa:', error);
      toast.error('Erro ao editar empresa');
    }
  };

  const handleDeleteCompany = async (company: Empresa) => {
    if (window.confirm(`Tem certeza que deseja excluir a empresa ${company.nome}?`)) {
      try {
        await empresaService.delete(company.empresaId.toString());
        toast.success('Empresa excluída com sucesso!');
        loadCompanies();
      } catch (error) {
        console.error('Erro ao excluir empresa:', error);
        toast.error('Erro ao excluir empresa');
      }
    }
  };

  const openEditModal = (company: Empresa) => {
    setEditingCompany(company);
    setFormData({
      nome: company.nome,
      cnpj: company.cnpj || '',
      razaoSocial: company.razaoSocial || ''
    });
    setShowEditModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema ERP</h1>
                <p className="text-sm text-gray-500">Gerenciamento de Empresas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user?.nome}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut className="h-4 w-4" />}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Suas Empresas</h2>
              <p className="text-gray-600">Gerencie suas empresas e acesse os dashboards</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              icon={<Plus className="h-5 w-5" />}
            >
              Nova Empresa
            </Button>
          </div>
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando empresas...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma empresa encontrada</h3>
            <p className="text-gray-600 mb-6">Crie sua primeira empresa para começar</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              icon={<Plus className="h-5 w-5" />}
            >
              Criar Primeira Empresa
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company.empresaId} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{company.nome}</h3>
                        <p className="text-sm text-gray-500">{company.cnpj || 'CNPJ não informado'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">🏢 {company.razaoSocial || 'Razão social não informada'}</p>
                    <p className="text-sm text-gray-600">📅 Criada em: {new Date(company.createdAt).toLocaleDateString('pt-BR')}</p>
                    <p className="text-sm text-gray-600">🟢 {company.ativa ? 'Ativa' : 'Inativa'}</p>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-100">
                    <Button
                      size="sm"
                      onClick={() => handleSelectCompany(company.empresaId)}
                      className="flex-1"
                      icon={<Eye className="h-4 w-4" />}
                    >
                      Acessar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(company)}
                      icon={<Edit className="h-4 w-4" />}
                    >
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCompany(company)}
                      icon={<Trash2 className="h-4 w-4" />}
                      className="text-red-600 hover:text-red-700"
                    >
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nova Empresa</h3>
            <form onSubmit={handleCreateCompany} className="space-y-4">
              <Input
                label="Nome da Empresa"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Minha Empresa Ltda"
                required
              />
              <Input
                label="CNPJ"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="12.345.678/0001-90"
              />
              <Input
                label="Razão Social"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                placeholder="Minha Empresa Ltda."
              />
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Criar Empresa
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Editar Empresa</h3>
            <form onSubmit={handleEditCompany} className="space-y-4">
              <Input
                label="Nome da Empresa"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Minha Empresa Ltda"
                required
              />
              <Input
                label="CNPJ"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="12.345.678/0001-90"
              />
              <Input
                label="Razão Social"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                placeholder="Minha Empresa Ltda."
              />
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
