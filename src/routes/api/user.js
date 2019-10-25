import User from '../../controllers/User';
import Validation from './validation/user';

const router = require('express').Router();

router.post('/create', Validation.createUser, User.createUser);

router.get('/email/check', Validation.checkEmail, User.checkEmailExist);

export default router;
