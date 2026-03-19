const express = require('express');
const router = express.Router();
const { getAllProjects, createProject, updateProjectInfo, getProjectNames } = require('../controllers/projectController.js');

router.get('/', getAllProjects);
router.post('/new-project', createProject);
router.put('/:id', updateProjectInfo);
router.get('/project-names', getProjectNames);

module.exports = router;