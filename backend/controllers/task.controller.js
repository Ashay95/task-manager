const asyncHandler = require('../utils/asyncHandler');
const taskService = require('../services/task.service');

const listTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.listTasksForUser(req.user);
  res.json({
    success: true,
    data: { tasks },
  });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user, req.body);
  res.status(201).json({
    success: true,
    message: 'Task created',
    data: { task },
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user, req.params.id, req.body);
  res.json({
    success: true,
    message: 'Task updated',
    data: { task },
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTaskAdmin(req.params.id);
  res.json({
    success: true,
    message: 'Task deleted',
    data: result,
  });
});

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
};
