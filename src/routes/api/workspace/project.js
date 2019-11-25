const router = require('express').Router({ mergeParams : true });
import Project from '../../../controllers/Project';
import { checkToken } from '../../../middlewares/jwt';
import Validation from '../validation/project'

import Permissions from '../../../middlewares/permissions';

router.get('/',
	checkToken,
	Permissions.can(),
	Project.getProjectList
);

router.get('/:project_id',
	checkToken,
	Permissions.can(),
	Project.getProjectSingle
);

router.post('/',
	checkToken,
	Permissions.can('project_create'),
	Validation.createProject,
	Project.createProject
);

router.delete('/:project_id',
	checkToken,
	Permissions.can('project_delete'),
	Project.deleteProject
);

router.patch('/:project_id',
	checkToken,
	Permissions.can('project_edit'),
	Validation.editProject,
	Project.editProject
);

export default router;
