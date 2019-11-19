import Category from '../../controllers/Category';
import { checkToken } from '../../middlewares/jwt';
import Validation from './validation/category'
import Permissions from '../../middlewares/permissions';

const router = require('express').Router();

router.get(
	'/',
	checkToken,
	Permissions.can(),
	Category.getCategoryList
);
router.get('/:category_id', checkToken, Category.getCategorySingle);
router.post('/', checkToken, Validation.createCategory, Category.createCategory);
router.delete('/:category_id', checkToken, Category.deleteCategory);
router.patch('/:category_id', checkToken, Validation.editCategory, Category.editCategory);

export default router;
