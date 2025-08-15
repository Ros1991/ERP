import { Router } from 'express';
import { EmployeeController } from '../controllers/EmployeeController';
import { authMiddleware, requireCompanyPermission } from '../middleware/auth';

const router = Router();
const employeeController = new EmployeeController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas de funcionários (CRUD básico)
router.post('/companies/:companyId/employees', 
  requireCompanyPermission('employees.manage'), 
  employeeController.create
);

router.get('/companies/:companyId/employees', 
  requireCompanyPermission('employees.view'), 
  employeeController.findAll
);

router.get('/companies/:companyId/employees/stats', 
  requireCompanyPermission('employees.view'), 
  employeeController.getStats
);

router.get('/companies/:companyId/employees/search', 
  requireCompanyPermission('employees.view'), 
  employeeController.search
);

router.get('/companies/:companyId/employees/status/:status', 
  requireCompanyPermission('employees.view'), 
  employeeController.getByStatus
);

router.get('/companies/:companyId/employees/payroll', 
  requireCompanyPermission('payroll.view'), 
  employeeController.getInPayroll
);

router.get('/companies/:companyId/employees/birthdays', 
  requireCompanyPermission('employees.view'), 
  employeeController.getUpcomingBirthdays
);

router.get('/companies/:companyId/employees/role/:roleId', 
  requireCompanyPermission('employees.view'), 
  employeeController.getByRole
);

router.get('/companies/:companyId/employees/:employeeId', 
  requireCompanyPermission('employees.view'), 
  employeeController.findById
);

router.put('/companies/:companyId/employees/:employeeId', 
  requireCompanyPermission('employees.manage'), 
  employeeController.update
);

router.delete('/companies/:companyId/employees/:employeeId', 
  requireCompanyPermission('employees.manage'), 
  employeeController.delete
);

// Operações em lote
router.patch('/companies/:companyId/employees/bulk-status', 
  requireCompanyPermission('employees.manage'), 
  employeeController.bulkUpdateStatus
);

router.patch('/companies/:companyId/employees/:employeeId/payroll', 
  requireCompanyPermission('payroll.manage'), 
  employeeController.togglePayrollStatus
);

// Rotas de documentos de funcionários
router.post('/companies/:companyId/employees/:employeeId/documents', 
  requireCompanyPermission('employees.manage'), 
  employeeController.createDocument
);

router.get('/companies/:companyId/employees/:employeeId/documents', 
  requireCompanyPermission('employees.view'), 
  employeeController.getDocuments
);

router.get('/companies/:companyId/employees/:employeeId/documents/stats', 
  requireCompanyPermission('employees.view'), 
  employeeController.getDocumentStats
);

router.get('/companies/:companyId/employees/:employeeId/documents/type/:documentType', 
  requireCompanyPermission('employees.view'), 
  employeeController.getDocumentsByType
);

router.get('/companies/:companyId/employees/:employeeId/documents/:documentId', 
  requireCompanyPermission('employees.view'), 
  employeeController.getDocumentById
);

router.put('/companies/:companyId/employees/:employeeId/documents/:documentId', 
  requireCompanyPermission('employees.manage'), 
  employeeController.updateDocument
);

router.delete('/companies/:companyId/employees/:employeeId/documents/:documentId', 
  requireCompanyPermission('employees.manage'), 
  employeeController.deleteDocument
);

// Rotas de documentos da empresa (todos os funcionários)
router.get('/companies/:companyId/documents', 
  requireCompanyPermission('employees.view'), 
  employeeController.getAllDocuments
);

router.get('/companies/:companyId/documents/search', 
  requireCompanyPermission('employees.view'), 
  employeeController.searchDocuments
);

router.get('/companies/:companyId/documents/stats', 
  requireCompanyPermission('employees.view'), 
  employeeController.getCompanyDocumentStats
);

export default router;

