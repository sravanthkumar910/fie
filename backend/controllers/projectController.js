const Project = require('../models/Project.js');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, platforms, budget, deadline, description, deliverables, creators } = req.body;
    const savedProject = await Project.create({ name, platforms, budget, deadline, description, deliverables, creators });
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProjectInfo = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProjectNames = async (req, res) => {
  try {
    const projects = await Project.find({}, 'name');
    const projectNames = projects.map(project => project.name);
    res.json(projectNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};