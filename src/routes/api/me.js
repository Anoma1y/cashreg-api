import Me from '../../controllers/Me';
import { checkToken } from '../../middlewares/jwt';
import Validation from './validation/me'

const router = require('express').Router();

router.get('/', checkToken, Me.getMe);
router.patch('/', checkToken, Validation.changeMe, Me.changeMe);

export default router;
