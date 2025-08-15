import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { PedidoCompra } from '@/entities/PedidoCompra';

export class PedidoCompraRepository extends BaseRepository<PedidoCompra> {
  constructor() {
    super(PedidoCompra, 'pedidoId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<PedidoCompra>, search: any): void {
    if (search.empresaId) {
      qb.andWhere('entity.empresaId = :empresaId', { empresaId: search.empresaId });
    }
    
    if (search.terceiroId) {
      qb.andWhere('entity.terceiroId = :terceiroId', { terceiroId: search.terceiroId });
    }
    
    if (search.usuarioEmpresaSolicitanteId) {
      qb.andWhere('entity.usuarioEmpresaSolicitanteId = :usuarioEmpresaSolicitanteId', { usuarioEmpresaSolicitanteId: search.usuarioEmpresaSolicitanteId });
    }
    
    if (search.status) {
      qb.andWhere('entity.status ILIKE :status', { status: `%${search.status}%` });
    }
    
  }
}
