import Cash from '../../../controllers/Cash';
import { checkToken } from '../../../middlewares/jwt';
import Validation from '../validation/cash';

const router = require('express').Router({ mergeParams: true });

router.get('/', checkToken, Validation.getCash, Cash.getCash);

export default router;
