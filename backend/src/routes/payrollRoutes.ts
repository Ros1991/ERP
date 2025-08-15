import { Router } from 'express';
import { PayrollController } from '../controllers/PayrollController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();
const payrollController = new PayrollController();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Payroll Period Routes
router.post('/periods', payrollController.createPayrollPeriod.bind(payrollController));
router.get('/periods', payrollController.getPayrollPeriods.bind(payrollController));
router.get('/periods/stats', payrollController.getPayrollPeriodStats.bind(payrollController));
router.get('/periods/active', payrollController.getActivePayrollPeriods.bind(payrollController));
router.get('/periods/recent', payrollController.getRecentPayrollPeriods.bind(payrollController));
router.get('/periods/search', payrollController.searchPayrollPeriods.bind(payrollController));
router.get('/periods/date-range', payrollController.getPayrollPeriodsByDateRange.bind(payrollController));
router.get('/periods/summary-by-month', payrollController.getPayrollSummaryByMonth.bind(payrollController));

// Payroll Period Status Routes
router.get('/periods/status/:status', payrollController.getPayrollPeriodsByStatus.bind(payrollController));
router.get('/periods/type/:type', payrollController.getPayrollPeriodsByType.bind(payrollController));

// Individual Payroll Period Routes
router.get('/periods/:id', payrollController.getPayrollPeriodById.bind(payrollController));
router.put('/periods/:id', payrollController.updatePayrollPeriod.bind(payrollController));
router.delete('/periods/:id', adminMiddleware, payrollController.deletePayrollPeriod.bind(payrollController));

// Payroll Processing Routes
router.post('/periods/:id/process', payrollController.processPayroll.bind(payrollController));
router.put('/periods/:id/mark-paid', adminMiddleware, payrollController.markPayrollAsPaid.bind(payrollController));
router.post('/periods/:id/duplicate-from-previous', payrollController.duplicateFromPreviousPeriod.bind(payrollController));

// Payroll Reports Routes
router.get('/periods/:id/employee-summary', payrollController.getEmployeePayrollSummary.bind(payrollController));
router.get('/periods/:id/item-stats', payrollController.getPayrollItemStats.bind(payrollController));

export default router;

