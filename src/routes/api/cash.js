import Cash from '../../controllers/Cash';
import { checkToken } from '../../middlewares/jwt';
import Validation from './validation/cash';

const router = require('express').Router();

router.get('/', checkToken, Validation.getCash, Cash.getCash);

export default router;
