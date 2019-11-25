const router = require('express').Router({ mergeParams : true });
import Category from '../../../controllers/Category';
import { checkToken } from '../../../middlewares/jwt';
import Validation from '../validation/category'

import Permissions from '../../../middlewares/permissions';

router.get('/',
	checkToken,
	Permissions.can(),
	Category.getCategoryList
);

router.get('/:category_id',
	checkToken,
	Permissions.can(),
	Category.getCategorySingle
);

router.post('/',
	checkToken,
	Permissions.can('category_create'),
	Validation.createCategory,
	Category.createCategory
);

router.delete('/:category_id',
	checkToken,
	Permissions.can('category_delete'),
	Category.deleteCategory);

router.patch('/:category_id',
	checkToken,
	Permissions.can('category_edit'),
	Validation.editCategory,
	Category.editCategory
);

export default router;
