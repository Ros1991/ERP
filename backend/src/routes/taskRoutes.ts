import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();
const taskController = new TaskController();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Task Type Routes
router.post('/types', taskController.createTaskType.bind(taskController));
router.get('/types', taskController.getTaskTypes.bind(taskController));
router.get('/types/active', taskController.getActiveTaskTypes.bind(taskController));
router.get('/types/stats', taskController.getTaskTypeStats.bind(taskController));
router.get('/types/search', taskController.searchTaskTypes.bind(taskController));
router.post('/types/default', adminMiddleware, taskController.createDefaultTaskTypes.bind(taskController));
router.put('/types/bulk-status', adminMiddleware, taskController.bulkUpdateTaskTypeStatus.bind(taskController));
router.get('/types/:id', taskController.getTaskTypeById.bind(taskController));
router.put('/types/:id', taskController.updateTaskType.bind(taskController));
router.delete('/types/:id', adminMiddleware, taskController.deleteTaskType.bind(taskController));

// Task Routes
router.post('/', taskController.createTask.bind(taskController));
router.get('/', taskController.getTasks.bind(taskController));
router.get('/stats', taskController.getTaskStats.bind(taskController));
router.get('/overdue', taskController.getOverdueTasks.bind(taskController));
router.get('/due-soon', taskController.getTasksDueSoon.bind(taskController));
router.get('/recent', taskController.getRecentTasks.bind(taskController));
router.get('/search', taskController.searchTasks.bind(taskController));
router.get('/date-range', taskController.getTasksByDateRange.bind(taskController));
router.get('/completed-in-period', taskController.getTasksCompletedInPeriod.bind(taskController));
router.get('/productivity-report', taskController.getProductivityReport.bind(taskController));
router.put('/bulk-status', taskController.bulkUpdateTaskStatus.bind(taskController));
router.put('/bulk-assign', taskController.bulkAssignTasks.bind(taskController));

// Task Status Routes
router.get('/status/:status', taskController.getTasksByStatus.bind(taskController));
router.get('/priority/:priority', taskController.getTasksByPriority.bind(taskController));
router.get('/task-type/:taskTypeId', taskController.getTasksByTaskType.bind(taskController));
router.get('/assigned-user/:userId', taskController.getTasksByAssignedUser.bind(taskController));

// Individual Task Routes
router.get('/:id', taskController.getTaskById.bind(taskController));
router.put('/:id', taskController.updateTask.bind(taskController));
router.delete('/:id', taskController.deleteTask.bind(taskController));

// Task Action Routes
router.put('/:id/complete', taskController.completeTask.bind(taskController));
router.put('/:id/cancel', taskController.cancelTask.bind(taskController));
router.put('/:id/start', taskController.startTask.bind(taskController));
router.put('/:id/pause', taskController.pauseTask.bind(taskController));
router.put('/:id/progress', taskController.updateTaskProgress.bind(taskController));

export default router;

