const Task = require('../models/Task');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

// @desc    Get all tasks for a project
// @route   GET /api/tasks?projectId=...
// @access  Private
const getTasks = async (req, res) => {
  const { projectId } = req.query;
  let query = {};
  
  if (projectId) {
    query.project = projectId;
  } else if (req.user.role !== 'Admin') {
    // If not admin and no projectId, only show tasks assigned to user
    query.assignedTo = req.user._id;
  }

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'title');
  res.json(tasks);
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, dueDate, priority, project, assignedTo } = req.body;

  const task = new Task({
    title,
    description,
    dueDate,
    priority,
    project,
    assignedTo,
  });

  const createdTask = await task.save();

  // Create notification for assigned user
  if (assignedTo) {
    await Notification.create({
      recipient: assignedTo,
      sender: req.user._id,
      message: `You have been assigned a new task: ${title}`,
      type: 'Task Assigned',
      link: `/tasks/${createdTask._id}`,
    });
  }

  await ActivityLog.create({
    user: req.user._id,
    action: 'Create Task',
    module: 'Task',
    details: `Created task: ${title}`,
    targetId: createdTask._id,
  });

  res.status(201).json(createdTask);
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'title')
    .populate('comments.user', 'name avatar');

  if (task) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    const oldStatus = task.status;
    const oldAssignedTo = task.assignedTo;

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;

    const updatedTask = await task.save();

    // Notify if status changed
    if (status && status !== oldStatus) {
      // Logic to notify project admin or assigned user
    }

    // Notify if assignment changed
    if (assignedTo && assignedTo.toString() !== (oldAssignedTo ? oldAssignedTo.toString() : '')) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        message: `You have been assigned a task: ${task.title}`,
        type: 'Task Assigned',
        link: `/tasks/${task._id}`,
      });
    }

    await ActivityLog.create({
      user: req.user._id,
      action: 'Update Task',
      module: 'Task',
      details: `Updated task: ${task.title}`,
      targetId: task._id,
    });

    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    // Only Admin or Task Creator or Assigned User can delete? 
    // Requirement says Admin can delete all, Member can update status.
    // Let's stick to RBAC.
    if (req.user.role !== 'Admin') {
      res.status(401);
      throw new Error('Not authorized to delete tasks');
    }

    await task.deleteOne();

    await ActivityLog.create({
      user: req.user._id,
      action: 'Delete Task',
      module: 'Task',
      details: `Deleted task: ${task.title}`,
    });

    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addTaskComment = async (req, res) => {
  const { text } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    const comment = {
      user: req.user._id,
      text,
    };

    task.comments.push(comment);
    await task.save();

    res.status(201).json({ message: 'Comment added' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  addTaskComment,
};
