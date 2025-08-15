import { Router } from 'express';
import { FinancialController } from '../controllers/FinancialController';
import { authMiddleware, requireCompanyPermission } from '../middleware/auth';

const router = Router();
const financialController = new FinancialController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// ===== ROTAS DE CONTAS FINANCEIRAS =====

router.post('/companies/:companyId/financial-accounts', 
  requireCompanyPermission('financial.manage'), 
  financialController.createAccount
);

router.get('/companies/:companyId/financial-accounts', 
  requireCompanyPermission('financial.view'), 
  financialController.findAllAccounts
);

router.get('/companies/:companyId/financial-accounts/stats', 
  requireCompanyPermission('financial.view'), 
  financialController.getAccountStats
);

router.get('/companies/:companyId/financial-accounts/search', 
  requireCompanyPermission('financial.view'), 
  financialController.searchAccounts
);

router.get('/companies/:companyId/financial-accounts/type/:type', 
  requireCompanyPermission('financial.view'), 
  financialController.getAccountsByType
);

router.get('/companies/:companyId/financial-accounts/status/:status', 
  requireCompanyPermission('financial.view'), 
  financialController.getAccountsByStatus
);

router.get('/companies/:companyId/financial-accounts/:accountId', 
  requireCompanyPermission('financial.view'), 
  financialController.findAccountById
);

router.put('/companies/:companyId/financial-accounts/:accountId', 
  requireCompanyPermission('financial.manage'), 
  financialController.updateAccount
);

router.delete('/companies/:companyId/financial-accounts/:accountId', 
  requireCompanyPermission('financial.manage'), 
  financialController.deleteAccount
);

router.patch('/companies/:companyId/financial-accounts/:accountId/balance', 
  requireCompanyPermission('financial.manage'), 
  financialController.updateAccountBalance
);

router.patch('/companies/:companyId/financial-accounts/:accountId/adjust-balance', 
  requireCompanyPermission('financial.manage'), 
  financialController.adjustAccountBalance
);

// ===== ROTAS DE CENTROS DE CUSTO =====

router.post('/companies/:companyId/cost-centers', 
  requireCompanyPermission('financial.manage'), 
  financialController.createCostCenter
);

router.get('/companies/:companyId/cost-centers', 
  requireCompanyPermission('financial.view'), 
  financialController.findAllCostCenters
);

router.get('/companies/:companyId/cost-centers/hierarchy', 
  requireCompanyPermission('financial.view'), 
  financialController.findCostCenterHierarchy
);

router.get('/companies/:companyId/cost-centers/stats', 
  requireCompanyPermission('financial.view'), 
  financialController.getCostCenterStats
);

router.get('/companies/:companyId/cost-centers/search', 
  requireCompanyPermission('financial.view'), 
  financialController.searchCostCenters
);

router.get('/companies/:companyId/cost-centers/:costCenterId', 
  requireCompanyPermission('financial.view'), 
  financialController.findCostCenterById
);

router.put('/companies/:companyId/cost-centers/:costCenterId', 
  requireCompanyPermission('financial.manage'), 
  financialController.updateCostCenter
);

router.delete('/companies/:companyId/cost-centers/:costCenterId', 
  requireCompanyPermission('financial.manage'), 
  financialController.deleteCostCenter
);

router.patch('/companies/:companyId/cost-centers/:costCenterId/move', 
  requireCompanyPermission('financial.manage'), 
  financialController.moveCostCenter
);

// ===== ROTAS DE TRANSAÇÕES =====

router.post('/companies/:companyId/transactions', 
  requireCompanyPermission('financial.manage'), 
  financialController.createTransaction
);

router.get('/companies/:companyId/transactions', 
  requireCompanyPermission('financial.view'), 
  financialController.findAllTransactions
);

router.get('/companies/:companyId/transactions/stats', 
  requireCompanyPermission('financial.view'), 
  financialController.getTransactionStats
);

router.get('/companies/:companyId/transactions/search', 
  requireCompanyPermission('financial.view'), 
  financialController.searchTransactions
);

router.get('/companies/:companyId/transactions/pending', 
  requireCompanyPermission('financial.view'), 
  financialController.getPendingTransactions
);

router.get('/companies/:companyId/transactions/recent', 
  requireCompanyPermission('financial.view'), 
  financialController.getRecentTransactions
);

router.get('/companies/:companyId/transactions/type/:type', 
  requireCompanyPermission('financial.view'), 
  financialController.getTransactionsByType
);

router.get('/companies/:companyId/transactions/status/:status', 
  requireCompanyPermission('financial.view'), 
  financialController.getTransactionsByStatus
);

router.get('/companies/:companyId/transactions/account/:accountId', 
  requireCompanyPermission('financial.view'), 
  financialController.getTransactionsByAccount
);

router.get('/companies/:companyId/transactions/cost-center/:costCenterId', 
  requireCompanyPermission('financial.view'), 
  financialController.getTransactionsByCostCenter
);

router.get('/companies/:companyId/transactions/:transactionId', 
  requireCompanyPermission('financial.view'), 
  financialController.findTransactionById
);

router.put('/companies/:companyId/transactions/:transactionId', 
  requireCompanyPermission('financial.manage'), 
  financialController.updateTransaction
);

router.delete('/companies/:companyId/transactions/:transactionId', 
  requireCompanyPermission('financial.manage'), 
  financialController.deleteTransaction
);

// Operações especiais de transações
router.post('/companies/:companyId/transactions/transfer', 
  requireCompanyPermission('financial.manage'), 
  financialController.transferBetweenAccounts
);

router.patch('/companies/:companyId/transactions/bulk-status', 
  requireCompanyPermission('financial.manage'), 
  financialController.bulkUpdateTransactionStatus
);

// ===== ROTAS DE RELATÓRIOS =====

router.get('/companies/:companyId/reports/monthly/:year/:month', 
  requireCompanyPermission('financial.view'), 
  financialController.getMonthlyReport
);

router.get('/companies/:companyId/reports/cost-center', 
  requireCompanyPermission('financial.view'), 
  financialController.getCostCenterReport
);

export default router;

