const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const Task = require('../models/Task');

function isAdmin(user) {
  return user.role === 'ADMIN';
}

async function listTasksForUser(user) {
  const filter = isAdmin(user) ? {} : { userId: user.id };
  return Task.find(filter).sort({ updatedAt: -1 }).lean();
}

async function createTask(user, { title, description }) {
  const task = await Task.create({
    title: title.trim(),
    description: (description || '').trim(),
    userId: user.id,
  });
  return task.toObject();
}

async function getTaskById(user, taskId) {
  if (!mongoose.isValidObjectId(taskId)) {
    throw new AppError('Invalid task id', 400);
  }
  const task = await Task.findById(taskId).lean();
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  if (!isAdmin(user) && task.userId.toString() !== user.id) {
    throw new AppError('Forbidden', 403);
  }
  return task;
}

async function updateTask(user, taskId, { title, description }) {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  if (!isAdmin(user) && task.userId.toString() !== user.id) {
    throw new AppError('Forbidden', 403);
  }

  if (title === undefined && description === undefined) {
    throw new AppError('Provide title and/or description to update', 400);
  }

  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description.trim();

  await task.save();
  return task.toObject();
}

async function deleteTaskAdmin(taskId) {
  if (!mongoose.isValidObjectId(taskId)) {
    throw new AppError('Invalid task id', 400);
  }
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return { deleted: true, id: taskId };
}

module.exports = {
  listTasksForUser,
  createTask,
  getTaskById,
  updateTask,
  deleteTaskAdmin,
};
