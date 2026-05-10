const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  let projects;
  if (req.user.role === 'Admin') {
    projects = await Project.find({}).populate('admin members', 'name email avatar');
  } else {
    projects = await Project.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }],
    }).populate('admin members', 'name email avatar');
  }
  res.json(projects);
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const { title, description, deadline, priority, members } = req.body;

  const project = new Project({
    title,
    description,
    deadline,
    priority,
    admin: req.user._id,
    members: members || [],
  });

  const createdProject = await project.save();

  await ActivityLog.create({
    user: req.user._id,
    action: 'Create Project',
    module: 'Project',
    details: `Created project: ${title}`,
    targetId: createdProject._id,
  });

  res.status(201).json(createdProject);
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    'admin members',
    'name email avatar'
  );

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  const { title, description, deadline, priority, status, members } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.title = title || project.title;
    project.description = description || project.description;
    project.deadline = deadline || project.deadline;
    project.priority = priority || project.priority;
    project.status = status || project.status;
    project.members = members || project.members;

    const updatedProject = await project.save();

    await ActivityLog.create({
      user: req.user._id,
      action: 'Update Project',
      module: 'Project',
      details: `Updated project: ${project.title}`,
      targetId: project._id,
    });

    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();

    await ActivityLog.create({
      user: req.user._id,
      action: 'Delete Project',
      module: 'Project',
      details: `Deleted project: ${project.title}`,
    });

    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
