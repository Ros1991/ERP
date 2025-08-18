import api from '../../lib/axios';
import type { 
  TarefaFuncionarioStatus, 
  CreateTarefaFuncionarioStatusDTO, 
  UpdateTarefaFuncionarioStatusDTO 
} from '../../models/tarefa/TarefaFuncionarioStatus.model';

class TarefaFuncionarioStatusService {
  async getAllByTarefa(empresaId: number, tarefaId: number): Promise<TarefaFuncionarioStatus[]> {
    const response = await api.get(
      `/empresas/${empresaId}/tarefa-funcionario-status`,
      { params: { tarefaId } }
    );
    return response.data.data; // Extract data from backend response
  }

  async getAllByFuncionario(empresaId: number, funcionarioId: number): Promise<TarefaFuncionarioStatus[]> {
    const response = await api.get(
      `/empresas/${empresaId}/tarefa-funcionario-status`,
      { params: { funcionarioId } }
    );
    return response.data.data; // Extract data from backend response
  }

  async getById(empresaId: number, statusId: number): Promise<TarefaFuncionarioStatus> {
    const response = await api.get(
      `/empresas/${empresaId}/tarefa-funcionario-status/${statusId}`
    );
    return response.data.data; // Extract data from backend response
  }

  async create(empresaId: number, dto: CreateTarefaFuncionarioStatusDTO): Promise<TarefaFuncionarioStatus> {
    const response = await api.post(
      `/empresas/${empresaId}/tarefa-funcionario-status`,
      dto
    );
    return response.data.data; // Extract data from backend response
  }

  async update(
    empresaId: number, 
    statusId: number, 
    dto: UpdateTarefaFuncionarioStatusDTO
  ): Promise<TarefaFuncionarioStatus> {
    const response = await api.put(
      `/empresas/${empresaId}/tarefa-funcionario-status/${statusId}`,
      dto
    );
    return response.data.data; // Extract data from backend response
  }

  async delete(empresaId: number, statusId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/tarefa-funcionario-status/${statusId}`);
  }

  async updateStatus(
    empresaId: number,
    statusId: number,
    status: 'ATRIBUIDA' | 'EM_ANDAMENTO' | 'PAUSADA' | 'CONCLUIDA' | 'CANCELADA'
  ): Promise<TarefaFuncionarioStatus> {
    const response = await api.patch(
      `/empresas/${empresaId}/tarefa-funcionario-status/${statusId}/status`,
      { status }
    );
    return response.data.data; // Extract data from backend response
  }
}

export default new TarefaFuncionarioStatusService();
