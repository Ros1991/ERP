import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, User, Flag } from 'lucide-react';
import { taskService } from '@/services/taskService';
import { employeeService } from '@/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const TaskForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
    assigned_to_id: '',
    tags: '',
    estimated_hours: '',
    actual_hours: ''
  });

  useEffect(() => {
    fetchEmployees();
    if (isEditing) {
      fetchTask();
    }
  }, [id]);

  const fetchEmployees = async () => {
    if (!user?.company?.id) return;
    
    try {
      const response = await employeeService.getEmployees(user.company.id);
      setEmployees(response.employees || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  const fetchTask = async () => {
    try {
      const task = await taskService.getTask(id!);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'A_Fazer',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        assigned_to_id: (task as any).assigned_to_id || '',
        tags: (task as any).tags?.join(', ') || '',
        estimated_hours: (task as any).estimated_hours || undefined,
        actual_hours: (task as any).actual_hours || undefined
      });
    } catch (error) {
      toast.error('Erro ao carregar tarefa');
      navigate('/tarefas');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Título é obrigatório');
      return;
    }

    if (!user?.company?.id) {
      toast.error('Empresa não identificada');
      return;
    }

    try {
      setLoading(true);
      
      const taskData: any = {
        ...formData,
        company_id: user.company.id,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        estimated_hours: formData.estimated_hours || undefined,
        actual_hours: formData.actual_hours || undefined,
        assigned_to_id: formData.assigned_to_id || undefined,
        // Additional required fields for CreateTaskData
        cost_center_id: null,
        estimated_start_date: formData.due_date,
        frequency_type: 'once'
      };

      if (isEditing) {
        await taskService.updateTask(id!, taskData);
        toast.success('Tarefa atualizada com sucesso');
      } else {
        await taskService.createTask(user.company.id, taskData);
        toast.success('Tarefa criada com sucesso');
      }

      navigate('/tarefas');
    } catch (error) {
      toast.error('Erro ao salvar tarefa');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/tarefas')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para Tarefas
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h1>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Informações da Tarefa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Flag className="w-4 h-4 inline mr-1" />
                  Prioridade
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva os detalhes da tarefa..."
                />
              </div>
            </div>
          </div>

          {/* Atribuição e Tempo */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Atribuição e Tempo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Responsável
                </label>
                <select
                  name="assigned_to_id"
                  value={formData.assigned_to_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um responsável</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.personal_data?.full_name || emp.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: importante, cliente, urgente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas Estimadas
                </label>
                <input
                  type="number"
                  name="estimated_hours"
                  value={formData.estimated_hours}
                  onChange={handleChange}
                  step="0.5"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas Reais
                </label>
                <input
                  type="number"
                  name="actual_hours"
                  value={formData.actual_hours}
                  onChange={handleChange}
                  step="0.5"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/tarefas')}
            className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
