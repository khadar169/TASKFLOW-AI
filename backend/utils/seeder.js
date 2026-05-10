const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await ActivityLog.deleteMany();

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@taskflow.ai',
      password: 'admin123',
      role: 'Admin',
      avatar: 'https://i.pravatar.cc/150?u=admin',
    });

    // Create Member
    const member = await User.create({
      name: 'Member User',
      email: 'member@taskflow.ai',
      password: 'member123',
      role: 'Member',
      avatar: 'https://i.pravatar.cc/150?u=member',
    });

    console.log('Users Seeded');

    // Create Sample Project
    const project = await Project.create({
      title: 'LLM Model Evaluation v1',
      description: 'Comprehensive evaluation of LLM performance on logic and reasoning tasks.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      priority: 'High',
      status: 'Active',
      admin: admin._id,
      members: [member._id],
    });

    console.log('Project Seeded');

    // Create Sample Tasks
    await Task.create([
      {
        title: 'Define Evaluation Framework',
        description: 'Set up the metrics and datasets for LLM evaluation.',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'Critical',
        status: 'Completed',
        project: project._id,
        assignedTo: admin._id,
      },
      {
        title: 'Run Baseline Benchmarks',
        description: 'Execute GPT-4 and Claude 3 benchmarks.',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        priority: 'High',
        status: 'In Progress',
        project: project._id,
        assignedTo: member._id,
      },
      {
        title: 'Analyze Error Patterns',
        description: 'Review logs to identify common failure modes in reasoning.',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        priority: 'Medium',
        status: 'Pending',
        project: project._id,
        assignedTo: member._id,
      },
    ]);

    console.log('Tasks Seeded');
    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
