import User from '../../controllers/User';
import { checkToken } from '../../middlewares/jwt';
import Validation from './validation/user';

const router = require('express').Router();

router.post('/create', Validation.createUser, User.createUser);
router.post('/:user_id/resend_mail', Validation.createUser, User.resendMail);
router.post('/:user_id/verify', Validation.verifyUser, User.userVerify);

router.patch('/password', checkToken, Validation.changePassword, User.changePassword);
router.delete('/password/reset', User.resetPasswordStepOne);
router.put('/password/:user_id/reset', Validation.resetPasswordStepTwo, User.resetPasswordStepTwo);

router.get('/email/check', Validation.checkEmail, User.checkEmailExist);

export default router;
